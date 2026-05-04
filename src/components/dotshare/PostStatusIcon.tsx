"use client";

type PostStatus = "pending" | "dispatched" | "published" | "failed";

interface PostStatusIconProps {
  status: PostStatus;
  showLabel?: boolean;
}

const STATUS_CONFIG: Record<PostStatus, { icon: string; label: string; color: string }> = {
  pending:    { icon: "⏳", label: "Scheduled",  color: "text-amber-400" },
  dispatched: { icon: "🚀", label: "Dispatched", color: "text-blue-400"  },
  published:  { icon: "✅", label: "Published",  color: "text-green-400" },
  failed:     { icon: "❌", label: "Failed",     color: "text-red-400"   },
};

export default function PostStatusIcon({ status, showLabel = false }: PostStatusIconProps) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending;

  return (
    <span className={`inline-flex items-center gap-1.5 ${config.color}`}>
      <span>{config.icon}</span>
      {showLabel && <span className="text-xs font-medium">{config.label}</span>}
    </span>
  );
}
