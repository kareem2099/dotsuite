"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function DotScramblePage() {
  const params = useParams();
  const locale = (params.locale as string) || "en";

  const [loading, setLoading] = useState(true);
  const [tier, setTier] = useState<string>("free");

  useEffect(() => {
    fetch("/api/billing/status")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.tier) setTier(data.tier);
      })
      .catch((err) => console.error("Failed to fetch billing status:", err))
      .finally(() => setLoading(false));
  }, []);

  const isMax = tier === "max";

  return (
    <div className="min-h-screen">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <Link
          href={`/${locale}/dashboard`}
          className="inline-flex items-center gap-2 text-sm text-(--text-muted) hover:text-(--primary) transition-colors mb-8"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-(--primary)/10 flex items-center justify-center">
            <svg className="w-5 h-5 text-(--primary)" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold">DotScramble</h1>
            <p className="text-sm text-(--text-muted)">Advanced image privacy protection tool</p>
          </div>
        </div>

        <div className={`p-6 border rounded-xl mb-6 ${isMax ? "bg-green-500/5 border-green-500/20" : "bg-(--card-bg) border-(--card-border)"}`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-lg font-bold">DotScramble Plan</h2>
                {loading ? (
                   <span className="px-2 py-0.5 rounded text-xs font-semibold bg-gray-500/10 text-gray-500 animate-pulse">LOADING</span>
                ) : isMax ? (
                   <span className="px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-wider bg-green-500/10 text-green-500 border border-green-500/20">Max Active</span>
                ) : (
                   <span className="px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-wider bg-gray-500/10 text-gray-500 border border-gray-500/20">{tier}</span>
                )}
              </div>
              <p className="text-sm text-(--text-muted)">
                {isMax ? "All premium privacy features are unlocked for your account." : "Free plan — upgrade to unlock max privacy features."}
              </p>
            </div>
            
            {!isMax && !loading && (
              <div className="flex gap-2">
                <Link
                  href={`/${locale}/dashboard/dotscramble/upgrade`}
                  className="px-4 py-2 bg-(--primary) text-(--primary-text) rounded-lg text-sm font-semibold hover:bg-(--primary-hover) transition-colors"
                >
                  Upgrade to Max
                </Link>
              </div>
            )}
          </div>

          <div className="space-y-4">
             <p className="text-sm text-(--text-muted)">Max plan includes: Deep EXIF Scrubbing, Unlimited Batch Processing, and AI Feature access.</p>
          </div>
        </div>

        {/* API Keys section */}
        <div className="p-6 bg-(--card-bg) border border-(--card-border) rounded-xl mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">How to activate Premium</h2>
            <Link
              href={`/${locale}/dashboard/keys`}
              className="text-sm text-(--primary) hover:underline"
            >
              Get your API Key →
            </Link>
          </div>
          <div className="text-sm text-(--text-muted) space-y-2">
            <p>DotScramble uses your standard DotSuite API Key for authentication.</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Open DotScramble on your computer.</li>
              <li>Go to <strong>Settings</strong> and paste your API Key.</li>
              <li>If you have the Max plan, your key will automatically unlock all Premium features!</li>
              <li>A single key can be activated on up to <strong>2 devices</strong> simultaneously.</li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}
