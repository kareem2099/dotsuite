/**
 * Shared helper for making server-to-server calls to the Rust core API.
 * Uses the internal route (X-Internal-Secret) — no Bearer token needed.
 */

const CORE_API_URL: string = (() => {
  const val = process.env.CORE_API_URL;
  if (!val) throw new Error("Missing CORE_API_URL environment variable");
  return val;
})();

const INTERNAL_SECRET: string = (() => {
  const val = process.env.INTERNAL_API_SECRET;
  if (!val) throw new Error("Missing INTERNAL_API_SECRET environment variable");
  return val;
})();

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
    ...((options.headers as Record<string, string>) || {}),
    "X-Internal-Secret": INTERNAL_SECRET,
  };
  if (userId) headers["X-User-Id"] = userId;

  return fetch(`${CORE_API_URL}${path}`, { ...options, headers });
}

/** Get active API keys for a user */
export async function getUserApiKeys(userId: string) {
  const res = await rustInternal("/internal/keys", { method: "GET" }, userId);
  if (!res.ok) return [];
  return res.json();
}

/** Proxy a Rust request on behalf of a user using internal trust headers */
export async function rustProxy(
  path: string,
  options: RequestInit = {},
  userId?: string
): Promise<Response> {
  return rustInternal(path, options, userId);
}

/** Convert u32::MAX quota to display string */
export function formatQuota(quota: number): string {
  return quota >= UNLIMITED_QUOTA ? "∞" : quota.toLocaleString();
}

/** Parse error message from Rust backend response JSON or text */
export function parseRustError(errorText: string, fallback: string): string {
  try {
    const parsed = JSON.parse(errorText);

    if (typeof parsed.error === "string") {
      return parsed.error;
    }

    if (typeof parsed.error?.message === "string") {
      return parsed.error.message;
    }

    if (typeof parsed.message === "string") {
      return parsed.message;
    }
  } catch {}

  return fallback;
}

/** Tier display config */
export const TIER_CONFIG = {
  free:  { label: "Free",  color: "gray",   posts: 100,          images: 10           },
  pro:   { label: "Pro",   color: "purple", posts: UNLIMITED_QUOTA, images: UNLIMITED_QUOTA },
  max:   { label: "Max",   color: "gold",   posts: UNLIMITED_QUOTA, images: UNLIMITED_QUOTA },
} as const;
