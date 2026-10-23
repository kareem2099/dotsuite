export const UNLIMITED_QUOTA = 4294967295;

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
