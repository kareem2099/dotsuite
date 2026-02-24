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
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();

  const realIP = headers.get("x-real-ip");
  if (realIP) return realIP;

  return "unknown";
}