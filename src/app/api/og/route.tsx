import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

// ─── Brand palette ────────────────────────────────────────────────────────────
const COLORS = {
  bg: "#0a0a0a",
  card: "#111111",
  border: "rgba(255,255,255,0.08)",
  primary: "#10b981",       // emerald-500
  primaryGlow: "rgba(16,185,129,0.15)",
  primaryDim: "rgba(16,185,129,0.6)",
  white: "#ffffff",
  muted: "#a1a1aa",
  mutedDark: "#52525b",
  vscode: "#007acc",
  python: "#f7c948",
  nextjs: "#ffffff",
};

// ─── Category badge config ────────────────────────────────────────────────────
const CATEGORY_CONFIG: Record<
  string,
  { label: string; color: string; bg: string; icon: string }
> = {
  vscode: {
    label: "VS Code Extension",
    color: "#60a5fa",
    bg: "rgba(96,165,250,0.12)",
    icon: "⚡",
  },
  python: {
    label: "Python Tool",
    color: "#fbbf24",
    bg: "rgba(251,191,36,0.12)",
    icon: "🐍",
  },
  nextjs: {
    label: "Next.js Solution",
    color: "#e2e8f0",
    bg: "rgba(226,232,240,0.10)",
    icon: "▲",
  },
  default: {
    label: "Developer Tool",
    color: COLORS.primary,
    bg: COLORS.primaryGlow,
    icon: "🛠",
  },
};

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const title    = searchParams.get("title")    || "dotsuite";
    const subtitle = searchParams.get("subtitle") || "Developer Productivity Tools";
    const category = searchParams.get("category") || "default";
    const brand    = searchParams.get("brand")    || "dotsuite.dev";

    const cat = CATEGORY_CONFIG[category] ?? CATEGORY_CONFIG.default;

    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            backgroundColor: COLORS.bg,
            position: "relative",
            overflow: "hidden",
            fontFamily: "sans-serif",
          }}
        >
          {/* ── Background grid pattern ── */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
              `,
              backgroundSize: "60px 60px",
              display: "flex",
            }}
          />

          {/* ── Primary glow top-left ── */}
          <div
            style={{
              position: "absolute",
              top: "-120px",
              left: "-80px",
              width: "500px",
              height: "500px",
              borderRadius: "50%",
              background: `radial-gradient(circle, ${COLORS.primaryGlow} 0%, transparent 70%)`,
              display: "flex",
            }}
          />

          {/* ── Secondary glow bottom-right ── */}
          <div
            style={{
              position: "absolute",
              bottom: "-100px",
              right: "-60px",
              width: "400px",
              height: "400px",
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)",
              display: "flex",
            }}
          />

          {/* ── Main card ── */}
          <div
            style={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              width: "100%",
              height: "100%",
              padding: "56px 72px",
            }}
          >
            {/* Top row: Brand logo + badge */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              {/* Brand */}
              <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                <div
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "10px",
                    background: COLORS.primary,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "22px",
                    fontWeight: "800",
                    color: "#000",
                  }}
                >
                  d
                </div>
                <span
                  style={{
                    fontSize: "26px",
                    fontWeight: "700",
                    color: COLORS.white,
                    letterSpacing: "-0.5px",
                  }}
                >
                  {brand}
                </span>
              </div>

              {/* Category badge */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "8px 18px",
                  borderRadius: "999px",
                  background: cat.bg,
                  border: `1px solid ${cat.color}30`,
                  fontSize: "18px",
                  color: cat.color,
                  fontWeight: "600",
                }}
              >
                <span style={{ fontSize: "16px" }}>{cat.icon}</span>
                {cat.label}
              </div>
            </div>

            {/* Center: Main title + subtitle */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "20px",
                flex: 1,
                justifyContent: "center",
                paddingTop: "20px",
              }}
            >
              {/* Title */}
              <div
                style={{
                  fontSize: title.length > 20 ? "64px" : "80px",
                  fontWeight: "800",
                  color: COLORS.white,
                  lineHeight: 1.05,
                  letterSpacing: "-2px",
                  maxWidth: "900px",
                }}
              >
                {title}
              </div>

              {/* Subtitle */}
              <div
                style={{
                  fontSize: "28px",
                  color: COLORS.muted,
                  fontWeight: "400",
                  lineHeight: 1.4,
                  maxWidth: "700px",
                }}
              >
                {subtitle}
              </div>
            </div>

            {/* Bottom row: Stats pills */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              {/* Left pills */}
              <div style={{ display: "flex", gap: "12px" }}>
                {[
                  { label: "13,000+ Downloads", color: COLORS.primary },
                  { label: "Open Source", color: "#818cf8" },
                  { label: "MIT License", color: COLORS.muted },
                ].map((pill) => (
                  <div
                    key={pill.label}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "6px 16px",
                      borderRadius: "999px",
                      border: `1px solid ${COLORS.border}`,
                      background: "rgba(255,255,255,0.04)",
                      fontSize: "16px",
                      color: pill.color,
                      fontWeight: "500",
                    }}
                  >
                    {pill.label}
                  </div>
                ))}
              </div>

              {/* Right: Primary accent line */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  fontSize: "18px",
                  color: COLORS.mutedDark,
                  fontWeight: "500",
                }}
              >
                <div
                  style={{
                    width: "32px",
                    height: "2px",
                    background: COLORS.primary,
                    display: "flex",
                  }}
                />
                Built for developers
              </div>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    console.error("OG image generation failed:", message);
    return new Response(`Failed to generate OG image: ${message}`, {
      status: 500,
    });
  }
}
