"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import PricingTiers from "@/components/pricing/PricingTiers";

// LemonSqueezy variant IDs — set these in .env.local
const VARIANT_IDS: Record<string, number> = {
  pro_monthly:  Number(process.env.NEXT_PUBLIC_LS_VARIANT_PRO_MONTHLY   || process.env.NEXT_PUBLIC_LS_VARIANT_PRO || 0),
  pro_annually: Number(process.env.NEXT_PUBLIC_LS_VARIANT_PRO_ANNUALLY  || 0),
  max_monthly:  Number(process.env.NEXT_PUBLIC_LS_VARIANT_MAX_MONTHLY   || process.env.NEXT_PUBLIC_LS_VARIANT_MAX || 0),
  max_annually: Number(process.env.NEXT_PUBLIC_LS_VARIANT_MAX_ANNUALLY  || 0),
};

export default function UpgradePage() {
  const params = useParams();
  const locale = (params.locale as string) || "en";
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [currentTier, setCurrentTier] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/billing/status")
      .then((r) => r.ok ? r.json() : null)
      .then((d) => { if (d?.tier) setCurrentTier(d.tier); })
      .catch(() => {});
  }, []);

  const handleUpgrade = async (tier: "pro" | "max", cycle: "monthly" | "annually") => {
    const variantKey = `${tier}_${cycle}`;
    const variantId = VARIANT_IDS[variantKey];
    if (!variantId) {
      setError(`Checkout not configured for ${tier} tier (${cycle}). Set NEXT_PUBLIC_LS_VARIANT_${tier.toUpperCase()}_${cycle.toUpperCase()} in .env.local`);
      return;
    }

    setLoading(tier);
    setError("");

    try {
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ variant_id: variantId }),
      });

      if (!res.ok) {
        const err = await res.json();
        setError(err.error || "Failed to start checkout");
        return;
      }

      const { checkout_url } = await res.json();
      window.location.href = checkout_url;
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-12">

        {/* Back */}
        <Link
          href={`/${locale}/dashboard/dotshare`}
          className="inline-flex items-center gap-2 text-sm text-(--text-muted) hover:text-(--primary) transition-colors mb-8"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to DotShare
        </Link>

        <div className="text-center mb-4">
          <h1 className="text-3xl font-bold mb-2">Upgrade DotShare</h1>
          <p className="text-(--text-muted)">Choose a plan and unlock more posts, images, and faster scheduling.</p>
        </div>

        {error && (
          <div className="max-w-xl mx-auto mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-sm text-red-400 text-center">
            {error}
          </div>
        )}

        {/* Loading overlay message */}
        {loading && (
          <div className="max-w-xl mx-auto mb-6 p-4 bg-(--primary)/10 border border-(--primary)/30 rounded-xl text-sm text-(--primary) text-center flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-(--primary) border-t-transparent rounded-full animate-spin" />
            Preparing {loading.charAt(0).toUpperCase() + loading.slice(1)} checkout…
          </div>
        )}

        {/* Pricing tiers — reuse existing component */}
        <PricingTiers onUpgrade={handleUpgrade} upgradingTier={loading} currentTier={currentTier} />

        <p className="text-center text-xs text-(--text-muted) mt-8">
          Payments are processed securely by LemonSqueezy. Cancel anytime from your billing portal.
        </p>

      </div>
    </div>
  );
}
