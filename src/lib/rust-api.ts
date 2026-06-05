/**
 * Shared helper for making server-to-server calls to the Rust core API.
 * Uses the internal route (X-Internal-Secret) — no Bearer token needed.
 */

const CORE_API_URL = process.env.CORE_API_URL!;
const INTERNAL_SECRET = process.env.INTERNAL_API_SECRET!;

/** Numeric quota returned by Rust for "unlimited" tiers */
export const UNLIMITED_QUOTA = 4294967295; // u32::MAX

/** Call the Rust internal API on behalf of a user */
export async function rustInternal(
  path: string,
  options: RequestInit = {},
  userId?: string
): Promise<Response> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "X-Internal-Secret": INTERNAL_SECRET,
    ...((options.headers as Record<string, string>) || {}),
  };
  if (userId) headers["X-User-Id"] = userId;

  return fetch(`${CORE_API_URL}${path}`, { ...options, headers });
}

/** Get the first active API key prefix for a user (internal route) */
export async function getUserApiKeys(userId: string) {
  const res = await rustInternal(`/internal/keys/${userId}`, {}, userId);
  if (!res.ok) return [];
  return res.json();
}

/** Billing & Posts: proxy as user Bearer token via internal secret */
export async function rustProxy(
  path: string,
  options: RequestInit = {},
  userId?: string
): Promise<Response> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "X-Internal-Secret": INTERNAL_SECRET,
    ...((options.headers as Record<string, string>) || {}),
  };
  if (userId) headers["X-User-Id"] = userId;

  return fetch(`${CORE_API_URL}${path}`, { ...options, headers });
}

/** Convert u32::MAX quota to display string */
export function formatQuota(quota: number): string {
  return quota >= UNLIMITED_QUOTA ? "∞" : quota.toLocaleString();
}

/** Tier display config */
export const TIER_CONFIG = {
  free:  { label: "Free",  color: "gray",   posts: 100,          images: 10           },
  pro:   { label: "Pro",   color: "purple", posts: UNLIMITED_QUOTA, images: UNLIMITED_QUOTA },
  max:   { label: "Max",   color: "gold",   posts: UNLIMITED_QUOTA, images: UNLIMITED_QUOTA },
} as const;
