"use client";

type Tier = "free" | "pro" | "max";

interface TierBadgeProps {
  tier: Tier;
  size?: "sm" | "md";
}

const TIER_STYLES: Record<Tier, string> = {
  free:  "bg-zinc-500/15 text-zinc-400 border-zinc-500/20",
  pro:   "bg-purple-500/15 text-purple-400 border-purple-500/20",
  max:   "bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-500/30",
};

const TIER_LABELS: Record<Tier, string> = {
  free:  "Free",
  pro:   "Pro",
  max:   "Max ⚡",
};

export default function TierBadge({ tier, size = "sm" }: TierBadgeProps) {
  const sizeClass = size === "md" ? "px-3 py-1 text-sm" : "px-2 py-0.5 text-xs";

  return (
    <span
      className={`inline-flex items-center font-semibold rounded-full border ${sizeClass} ${TIER_STYLES[tier]}`}
    >
      {TIER_LABELS[tier]}
    </span>
  );
}
