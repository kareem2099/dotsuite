"use client";

import Link from "next/link";
import { formatQuota, UNLIMITED_QUOTA } from "@/lib/rust-api";

interface QuotaBarProps {
  used: number;
  total: number;
  label: string;
  tier: string;
  locale: string;
}

export default function QuotaBar({ used, total, label, tier, locale }: QuotaBarProps) {
  const safeUsed = used || 0;
  const safeTotal = total || 0;
  const isUnlimited = safeTotal >= UNLIMITED_QUOTA;
  const pct = isUnlimited || safeTotal === 0 ? 0 : Math.min(100, Math.round((safeUsed / safeTotal) * 100));
  const isWarning = !isUnlimited && pct >= 80;
  const isCritical = !isUnlimited && pct >= 90;

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm text-(--text-muted)">{label}</span>
        <span className="text-sm font-semibold">
          {safeUsed.toLocaleString()}{" "}
          <span className="text-(--text-muted) font-normal">/ {isUnlimited ? "∞" : formatQuota(safeTotal)}</span>
        </span>
      </div>

      {!isUnlimited && (
        <>
          <div className="w-full h-2 bg-(--card-border) rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isCritical
                  ? "bg-red-500"
                  : isWarning
                  ? "bg-amber-400"
                  : "bg-(--primary)"
              }`}
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="flex items-center justify-between mt-1">
            <span className={`text-xs ${isCritical ? "text-red-400" : isWarning ? "text-amber-400" : "text-(--text-muted)"}`}>
              {pct}%
            </span>
            {isCritical && tier === "free" && (
              <Link
                href={`/${locale}/dashboard/dotshare/upgrade`}
                className="text-xs text-(--primary) hover:underline"
              >
                Upgrade to remove limits →
              </Link>
            )}
            {isWarning && !isCritical && (
              <span className="text-xs text-amber-400">⚠ Approaching limit</span>
            )}
          </div>
        </>
      )}

      {isUnlimited && (
        <div className="h-2 w-full bg-gradient-to-r from-(--primary)/30 to-(--primary)/10 rounded-full" />
      )}
    </div>
  );
}
