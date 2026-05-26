"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Check } from "lucide-react";

const VARIANT_ID_MAX = Number(process.env.NEXT_PUBLIC_LS_VARIANT_DOTSCRAMBLE_MAX_MONTHLY || 0);

export default function UpgradePage() {
  const params = useParams();
  const locale = (params.locale as string) || "en";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleUpgrade = async () => {
    if (!VARIANT_ID_MAX) {
      setError("Checkout not configured for Max tier. Set NEXT_PUBLIC_LS_VARIANT_DOTSCRAMBLE_MAX_MONTHLY in .env.local");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ variant_id: VARIANT_ID_MAX }),
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
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <Link
          href={`/${locale}/dashboard/dotscramble`}
          className="inline-flex items-center gap-2 text-sm text-(--text-muted) hover:text-(--primary) transition-colors mb-8"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to DotScramble
        </Link>

        <div className="text-center mb-4">
          <h1 className="text-3xl font-bold mb-2">Upgrade DotScramble</h1>
          <p className="text-(--text-muted)">Choose a plan and unlock deep EXIF scrubbing, AI blurring, and batch processing.</p>
        </div>

        {error && (
          <div className="max-w-xl mx-auto mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-sm text-red-400 text-center">
            {error}
          </div>
        )}

        {loading && (
          <div className="max-w-xl mx-auto mb-6 p-4 bg-(--primary)/10 border border-(--primary)/30 rounded-xl text-sm text-(--primary) text-center flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-(--primary) border-t-transparent rounded-full animate-spin" />
            Preparing checkout…
          </div>
        )}

        <div className="mt-12 flex justify-center">
            <div className="max-w-md w-full relative flex flex-col p-8 rounded-2xl border bg-card transition-all duration-300 hover:shadow-xl border-primary shadow-lg scale-105 z-10">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <span className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                  Max Power
                </span>
              </div>
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-foreground">Max Plan</h3>
                <p className="text-muted-foreground mt-2 text-sm">The ultimate privacy tier</p>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-extrabold text-foreground">$10</span>
                <span className="text-muted-foreground font-medium">/mo</span>
              </div>
              <ul className="flex-1 space-y-4 mb-8">
                <li className="flex items-start">
                   <div className="flex-shrink-0 mt-0.5"><Check className="h-5 w-5 text-green-500" /></div>
                   <span className="ml-3 text-sm text-foreground">Deep EXIF/Metadata Scrubbing</span>
                </li>
                <li className="flex items-start">
                   <div className="flex-shrink-0 mt-0.5"><Check className="h-5 w-5 text-green-500" /></div>
                   <span className="ml-3 text-sm text-foreground">AI Face & License Plate Blurring</span>
                </li>
                <li className="flex items-start">
                   <div className="flex-shrink-0 mt-0.5"><Check className="h-5 w-5 text-green-500" /></div>
                   <span className="ml-3 text-sm text-foreground">Unlimited Batch Processing</span>
                </li>
                <li className="flex items-start">
                   <div className="flex-shrink-0 mt-0.5"><Check className="h-5 w-5 text-green-500" /></div>
                   <span className="ml-3 text-sm text-foreground">AI Anti-Scraping & Watermarking</span>
                </li>
                <li className="flex items-start">
                   <div className="flex-shrink-0 mt-0.5"><Check className="h-5 w-5 text-green-500" /></div>
                   <span className="ml-3 text-sm text-foreground">Cryptographic Scrambling</span>
                </li>
              </ul>
              <button 
                onClick={handleUpgrade}
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl font-semibold transition-all duration-200 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
              >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      Loading…
                    </span>
                  ) : (
                    "Subscribe to Max"
                  )}
              </button>
            </div>
        </div>

        <p className="text-center text-xs text-(--text-muted) mt-8">
          Payments are processed securely by LemonSqueezy. Cancel anytime from your billing portal.
        </p>
      </div>
    </div>
  );
}
