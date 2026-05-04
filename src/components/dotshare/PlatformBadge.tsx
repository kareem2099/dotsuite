"use client";

type Platform =
  | "x" | "linkedin" | "bluesky" | "reddit"
  | "devto" | "medium" | "telegram" | "facebook" | "discord";

interface PlatformBadgeProps {
  platform: Platform;
}

const PLATFORM_CONFIG: Record<Platform, { label: string; color: string; icon: string }> = {
  x:        { label: "X",        color: "bg-zinc-800 text-zinc-300 border-zinc-700",      icon: "✕" },
  linkedin: { label: "LinkedIn", color: "bg-blue-900/40 text-blue-300 border-blue-700/50", icon: "in" },
  bluesky:  { label: "Bluesky",  color: "bg-sky-900/40 text-sky-300 border-sky-700/50",    icon: "☁" },
  reddit:   { label: "Reddit",   color: "bg-orange-900/40 text-orange-300 border-orange-700/50", icon: "r/" },
  devto:    { label: "Dev.to",   color: "bg-zinc-900 text-zinc-200 border-zinc-700",        icon: "DEV" },
  medium:   { label: "Medium",   color: "bg-green-900/40 text-green-300 border-green-700/50", icon: "M" },
  telegram: { label: "Telegram", color: "bg-cyan-900/40 text-cyan-300 border-cyan-700/50",  icon: "✈" },
  facebook: { label: "Facebook", color: "bg-indigo-900/40 text-indigo-300 border-indigo-700/50", icon: "f" },
  discord:  { label: "Discord",  color: "bg-violet-900/40 text-violet-300 border-violet-700/50", icon: "◎" },
};

export default function PlatformBadge({ platform }: PlatformBadgeProps) {
  const config = PLATFORM_CONFIG[platform];
  if (!config) return null;

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-md border ${config.color}`}
    >
      <span className="font-mono text-[10px] opacity-70">{config.icon}</span>
      {config.label}
    </span>
  );
}
