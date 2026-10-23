import { connectDB } from "@/lib/postgres";

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

  // One native upsert increments or resets the window under a PostgreSQL row
  // lock. Parallel requests cannot each reset an expired window to one.
  const { getPool, encode, decode, newId } = await import("./postgres");
  const result = await getPool().query(`
    INSERT INTO ds_documents(collection,id,data) VALUES('ratelimits',$1,$2::jsonb)
    ON CONFLICT ((data->>'identifier'),(data->>'action')) WHERE collection='ratelimits'
    DO UPDATE SET data = CASE
      WHEN ds_scalar(ds_documents.data->'expiresAt') > to_jsonb($3::bigint)
      THEN ds_patch(ds_documents.data,'{"$inc":{"count":1}}'::jsonb)
      ELSE ds_patch(ds_documents.data,jsonb_build_object('$set',jsonb_build_object('count',1,'expiresAt',EXCLUDED.data->'expiresAt')))
    END RETURNING data`,
    (() => { const id = newId(); return [id, JSON.stringify(encode({ _id: id, identifier, action, count: 1, expiresAt })), now.getTime()]; })()
  );
  const record = decode(result.rows[0].data) as { count: number; expiresAt: Date };

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