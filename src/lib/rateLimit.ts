import { connectDB } from "@/lib/mongodb";
import RateLimit from "@/models/RateLimit";

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetIn: number;
}

export async function checkRateLimit(
  identifier: string,
  action: string,
  maxAttempts: number = 5,
  windowSeconds: number = 3600
): Promise<RateLimitResult> {
  await connectDB();

  const now = new Date();
  const expiresAt = new Date(now.getTime() + windowSeconds * 1000);

  // auto-expire records after windowSeconds using MongoDB TTL index
  let record = await RateLimit.findOneAndUpdate(
    { identifier, action, expiresAt: { $gt: now } },
    { $inc: { count: 1 } },
    { returnDocument: 'after' }
  );

  // create new record if none found 
  if (!record) {
    record = await RateLimit.findOneAndUpdate(
      { identifier, action },
      { $set: { count: 1, expiresAt } },
      { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
    );
  }

  const remaining = Math.max(0, maxAttempts - record.count);
  const resetIn = Math.max(0, Math.floor((record.expiresAt.getTime() - now.getTime()) / 1000));

  return {
    success: record.count <= maxAttempts,
    remaining,
    resetIn,
  };
}

export function getClientIP(headers: Headers): string {
  // ⚠️ Security: Never trust the first IP in x-forwarded-for — the client controls it.
  // We take the LAST IP added by a trusted proxy/server, which cannot be spoofed by the client.
  // If no trusted proxy is present (direct connection), use x-real-ip or fall back to "unknown".
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    const ips = forwarded.split(",").map((ip) => ip.trim());
    // The last entry is added by the closest trusted proxy (our server/CDN)
    return ips[ips.length - 1] || "unknown";
  }

  const realIP = headers.get("x-real-ip");
  if (realIP) return realIP.trim();

  return "unknown";
}