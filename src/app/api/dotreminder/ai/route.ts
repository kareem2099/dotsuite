import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { checkRateLimit, getClientIP } from "@/lib/rateLimit";
import { verifyDotReminderUser } from "@/lib/dotreminder/auth";
import { AiHttpError, readAiRequest } from "@/lib/dotreminder/request";
import { generateReminderReply } from "@/lib/dotreminder/service";

export const runtime = "nodejs";
export const maxDuration = 40;
const headers = { "Cache-Control": "no-store" };

export async function POST(request: Request) {
  try {
    const uid = await verifyDotReminderUser(request.headers.get("authorization"));
    const input = await readAiRequest(request);
    const key = process.env.DOTREMINDER_GEMINI_API_KEY;
    if (!key) throw new AiHttpError(503, "ai_unavailable");
    const ipHash = createHash("sha256").update(getClientIP(request.headers)).digest("hex");
    const limits = await Promise.all([
      checkRateLimit(`dotreminder-ai:user:${uid}`, "ai-window", 24, 600),
      checkRateLimit(`dotreminder-ai:user:${uid}`, "ai-day", 200, 86400),
      checkRateLimit(`dotreminder-ai:ip:${ipHash}`, "ai-window", 60, 600),
    ]);
    const blocked = limits.filter(limit => !limit.success);
    if (blocked.length) throw new AiHttpError(429, "ai_limit_reached", Math.max(1, ...blocked.map(limit => limit.resetIn)));
    const signal = AbortSignal.any([request.signal, AbortSignal.timeout(30_000)]);
    const reply = await generateReminderReply(input, {
      key, model: process.env.DOTREMINDER_GEMINI_MODEL || "gemini-2.5-flash", signal,
    });
    return NextResponse.json({ reply }, { headers });
  } catch (error) {
    // Never log request content, Firebase bearer tokens, provider error bodies or the Gemini key.
    const failure = error instanceof AiHttpError ? error : new AiHttpError(503, "ai_unavailable");
    return NextResponse.json({ error: failure.code }, {
      status: failure.status,
      headers: { ...headers, ...(failure.retryAfter ? { "Retry-After": String(failure.retryAfter) } : {}) },
    });
  }
}
