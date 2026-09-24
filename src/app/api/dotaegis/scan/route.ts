import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

const DOTAEGIS_URL = process.env.DOTAEGIS_SERVICE_URL || "https://dotaegis-production.up.railway.app";

// Shannon entropy calculation
function calculateEntropy(str: string): number {
  if (!str) return 0;
  const frequencies = new Map<string, number>();
  for (const char of str) {
    frequencies.set(char, (frequencies.get(char) || 0) + 1);
  }
  let entropy = 0;
  for (const count of frequencies.values()) {
    const p = count / str.length;
    entropy -= p * Math.log2(p);
  }
  return Math.round(entropy * 100) / 100;
}

// Mask secret for safe display (e.g. sk_live_•••••••abcd)
function maskSecret(val: string): string {
  if (val.length <= 8) return "••••••••";
  const start = val.slice(0, 4);
  const end = val.slice(-4);
  return `${start}${"•".repeat(Math.min(16, val.length - 8))}${end}`;
}

export interface DetectedFinding {
  line: number;
  variableName: string;
  maskedValue: string;
  entropy: number;
  confidence: "low" | "medium" | "high" | "critical";
  category: string;
  reasoning: string[];
}

export async function GET() {
  const start = Date.now();
  try {
    const res = await fetch(`${DOTAEGIS_URL}/health`, {
      method: "GET",
      cache: "no-store",
      signal: AbortSignal.timeout(3000),
    });
    const latencyMs = Date.now() - start;
    if (res.ok) {
      const data = await res.json().catch(() => ({}));
      return NextResponse.json({
        online: true,
        latencyMs,
        version: data.version || "2.1.3",
        serviceUrl: DOTAEGIS_URL,
      });
    }
    return NextResponse.json({
      online: false,
      latencyMs,
      error: `Service returned ${res.status}`,
      serviceUrl: DOTAEGIS_URL,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Service unreachable";
    return NextResponse.json({
      online: false,
      latencyMs: Date.now() - start,
      error: message,
      serviceUrl: DOTAEGIS_URL,
    });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { content } = await req.json();
    if (typeof content !== "string" || !content.trim()) {
      return NextResponse.json(
        { error: "Content must be a non-empty string" },
        { status: 400 }
      );
    }

    const lines = content.split(/\r?\n/);
    const findings: DetectedFinding[] = [];

    // Common secret patterns & signatures
    const KNOWN_PATTERNS = [
      { regex: /sk_(?:live|test)_[0-9a-zA-Z]{24,}/, category: "Stripe Secret Key", confidence: "critical" },
      { regex: /ghp_[0-9a-zA-Z]{36}/, category: "GitHub Personal Access Token", confidence: "critical" },
      { regex: /AKIA[0-9A-Z]{16}/, category: "AWS Access Key ID", confidence: "high" },
      { regex: /xox[baprs]-[0-9a-zA-Z-]{24,}/, category: "Slack API Token", confidence: "critical" },
      { regex: /ey[A-Za-z0-9_-]{10,}\.[A-Za-z0-9._-]{10,}\.[A-Za-z0-9._-]{10,}/, category: "JWT Token", confidence: "medium" },
      { regex: /-----BEGIN (?:RSA )?PRIVATE KEY-----/, category: "Private Key", confidence: "critical" },
    ] as const;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line || line.startsWith("#") || line.startsWith("//")) continue;

      let varName = "";
      let val = "";

      // Check key=value format (e.g. .env)
      const envMatch = line.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
      if (envMatch) {
        varName = envMatch[1];
        val = envMatch[2].replace(/^["\x27]|["\x27]$/g, "").trim();
      } else {
        // Code assignment e.g. const key = "..."
        const codeMatch = line.match(/(?:const|let|var|val)?\s*([A-Za-z0-9_]+)\s*[:=]\s*["\x27]([^"\x27]+)["\x27]/);
        if (codeMatch) {
          varName = codeMatch[1];
          val = codeMatch[2].trim();
        } else {
          val = line;
        }
      }

      if (!val || val.length < 6) continue;

      // Check against known signatures
      let matched = false;
      for (const pattern of KNOWN_PATTERNS) {
        if (pattern.regex.test(val) || (varName && pattern.regex.test(line))) {
          const entropy = calculateEntropy(val);
          findings.push({
            line: i + 1,
            variableName: varName || `Secret_Token_L${i+1}`,
            maskedValue: maskSecret(val),
            entropy,
            confidence: pattern.confidence,
            category: pattern.category,
            reasoning: [`Signature matched known format: ${pattern.category}`, `Entropy score: ${entropy}`],
          });
          matched = true;
          break;
        }
      }

      if (matched) continue;

      // Entropy & heuristic check
      const entropy = calculateEntropy(val);
      const isSensitiveName = /(?:secret|password|token|key|api|auth|cred|private)/i.test(varName);

      if (val.length >= 20 && entropy > 3.8) {
        findings.push({
          line: i + 1,
          variableName: varName || `High_Entropy_L${i+1}`,
          maskedValue: maskSecret(val),
          entropy,
          confidence: isSensitiveName ? "high" : "medium",
          category: isSensitiveName ? "Sensitive Credential" : "High Entropy Token",
          reasoning: [
            isSensitiveName ? "Variable name indicates sensitive credential" : "Unusually high random entropy",
            `Shannon entropy: ${entropy} (threshold: 3.8)`,
          ],
        });
      } else if (isSensitiveName && val.length >= 8 && !["true", "false", "development", "production", "test", "local"].includes(val.toLowerCase())) {
        findings.push({
          line: i + 1,
          variableName: varName,
          maskedValue: maskSecret(val),
          entropy,
          confidence: "medium",
          category: "Potential Credential",
          reasoning: [
            `Sensitive variable name  contains custom value`,
            `Entropy: ${entropy}`,
          ],
        });
      }
    }

    return NextResponse.json({
      status: "success",
      totalLines: lines.length,
      secretsDetected: findings.length,
      findings,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
