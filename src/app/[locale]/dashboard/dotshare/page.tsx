"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import QuotaBar from "@/components/dotshare/QuotaBar";
import TierBadge from "@/components/dotshare/TierBadge";
import PlatformBadge from "@/components/dotshare/PlatformBadge";
import PostStatusIcon from "@/components/dotshare/PostStatusIcon";
import ConnectedAccounts from "@/components/dotshare/ConnectedAccounts";
import { formatQuota, UNLIMITED_QUOTA } from "@/lib/rust-api";

interface BillingStatus {
  tier: "free" | "basic" | "pro" | "max";
  is_paid: boolean;
  posts_used: number;
  posts_quota: number;
  images_used: number;
  images_quota: number;
  ls_subscription_id: string | null;
  subscription_ends_at: string | null;
}

interface Post {
  _id: string;
  text: string;
  platforms: string[];
  status: "pending" | "dispatched" | "published" | "failed";
  scheduled_at: string;
  last_error?: string;
}

export default function DotSharePage() {
  const params = useParams();
  const locale = (params.locale as string) || "en";
  const { status: authStatus } = useSession();

  const [billing, setBilling] = useState<BillingStatus | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [billingLoading, setBillingLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(true);
  const [portalLoading, setPortalLoading] = useState(false);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  useEffect(() => {
    if (authStatus !== "authenticated") return;

    // Fetch billing status
    fetch("/api/billing/status")
      .then((r) => r.json())
      .then((d) => setBilling(d))
      .catch(console.error)
      .finally(() => setBillingLoading(false));

    // Fetch recent posts
    fetch("/api/posts?limit=5")
      .then((r) => r.json())
      .then((d) => setPosts(Array.isArray(d.posts) ? d.posts : Array.isArray(d) ? d : []))
      .catch(console.error)
      .finally(() => setPostsLoading(false));
  }, [authStatus]);

  const handleManageBilling = async () => {
    setPortalLoading(true);
    try {
      const res = await fetch("/api/billing/portal");
      if (res.ok) {
        const { portal_url } = await res.json();
        window.location.href = portal_url;
      } else {
        const err = await res.json();
        alert(err.error || "Failed to open billing portal");
      }
    } finally {
      setPortalLoading(false);
    }
  };

  const handleCancelPost = async (postId: string) => {
    if (!confirm("Cancel this scheduled post?")) return;
    setCancellingId(postId);
    try {
      await fetch(`/api/posts/${postId}`, { method: "DELETE" });
      setPosts((prev) => prev.filter((p) => p._id !== postId));
    } finally {
      setCancellingId(null);
    }
  };

  const tierLabel = billing?.tier
    ? billing.tier.charAt(0).toUpperCase() + billing.tier.slice(1)
    : "Free";

  const endsAt = billing?.subscription_ends_at
    ? new Date(billing.subscription_ends_at).toLocaleDateString()
    : null;

  return (
    <div className="min-h-screen">
      <div className="max-w-5xl mx-auto px-6 py-12">

        {/* Back */}
        <Link
          href={`/${locale}/dashboard`}
          className="inline-flex items-center gap-2 text-sm text-(--text-muted) hover:text-(--primary) transition-colors mb-8"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </Link>

        {/* Title */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-(--primary)/10 flex items-center justify-center">
            <svg className="w-5 h-5 text-(--primary)" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold">DotShare</h1>
            <p className="text-sm text-(--text-muted)">Schedule & publish across 9 platforms</p>
          </div>
        </div>

        {/* Cancellation warning */}
        {endsAt && (
          <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center gap-3">
            <span className="text-amber-400">⚠</span>
            <p className="text-sm text-amber-300">
              Your subscription is cancelled. Access continues until <strong>{endsAt}</strong>.{" "}
              <button onClick={handleManageBilling} className="underline hover:no-underline">
                Reactivate
              </button>
            </p>
          </div>
        )}

        {/* ── Section A: Subscription Status ── */}
        <div className="p-6 bg-(--card-bg) border border-(--card-border) rounded-xl mb-6">
          {billingLoading ? (
            <div className="animate-pulse space-y-3">
              <div className="h-5 bg-(--card-border) rounded w-1/3" />
              <div className="h-3 bg-(--card-border) rounded w-1/4" />
              <div className="h-2 bg-(--card-border) rounded w-full mt-4" />
              <div className="h-2 bg-(--card-border) rounded w-full" />
            </div>
          ) : billing ? (
            <>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-lg font-bold">DotShare — {tierLabel} Plan</h2>
                    <TierBadge tier={billing.tier} />
                  </div>
                  <p className="text-sm text-(--text-muted)">
                    {billing.is_paid ? (
                      endsAt
                        ? `Cancels on ${endsAt}`
                        : "✅ Active subscription"
                    ) : (
                      "Free plan — upgrade to unlock more"
                    )}
                  </p>
                </div>
                <div className="flex gap-2">
                  {billing.is_paid && (
                    <button
                      onClick={handleManageBilling}
                      disabled={portalLoading}
                      className="px-4 py-2 border border-(--card-border) rounded-lg text-sm hover:border-(--primary) hover:text-(--primary) transition-colors disabled:opacity-50"
                    >
                      {portalLoading ? "Opening…" : "Manage Billing"}
                    </button>
                  )}
                  <Link
                    href={`/${locale}/dashboard/dotshare/upgrade`}
                    className="px-4 py-2 bg-(--primary) text-(--primary-text) rounded-lg text-sm font-semibold hover:bg-(--primary-hover) transition-colors"
                  >
                    {billing.is_paid ? "Change Plan" : "Upgrade"}
                  </Link>
                </div>
              </div>

              {/* Quota bars */}
              <div className="space-y-4">
                <QuotaBar
                  used={billing.posts_used}
                  total={billing.posts_quota}
                  label="Posts this month"
                  tier={billing.tier}
                  locale={locale}
                />
                <QuotaBar
                  used={billing.images_used ?? 0}
                  total={billing.images_quota ?? (billing.tier === "free" ? 10 : UNLIMITED_QUOTA)}
                  label="Image posts this month"
                  tier={billing.tier}
                  locale={locale}
                />
              </div>
            </>
          ) : (
            <p className="text-sm text-(--text-muted)">Could not load billing status. Is the Rust server running?</p>
          )}
        </div>

        {/* ── Section B: Connected Accounts ── */}
        <div className="mb-6">
          <ConnectedAccounts />
        </div>

        {/* ── Section C: API Keys ── */}
        <div className="p-6 bg-(--card-bg) border border-(--card-border) rounded-xl mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">API Keys</h2>
            <Link
              href={`/${locale}/dashboard/keys`}
              className="text-sm text-(--primary) hover:underline"
            >
              Manage keys →
            </Link>
          </div>
          <p className="text-sm text-(--text-muted)">
            Use your API key to connect the DotShare VS Code extension. Generate and manage keys from the keys dashboard.
          </p>
        </div>

        {/* ── Section D: Recent Posts ── */}
        <div className="bg-(--card-bg) border border-(--card-border) rounded-xl">
          <div className="flex items-center justify-between p-6 border-b border-(--card-border)">
            <h2 className="text-lg font-bold">Recent Posts</h2>
            <Link
              href={`/${locale}/dashboard/dotshare/posts`}
              className="text-sm text-(--primary) hover:underline"
            >
              View all →
            </Link>
          </div>

          {postsLoading ? (
            <div className="divide-y divide-(--card-border)">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="p-5 animate-pulse flex gap-4">
                  <div className="w-6 h-6 rounded-full bg-(--card-border)" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-(--card-border) rounded w-3/4" />
                    <div className="h-3 bg-(--card-border) rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="p-12 text-center text-(--text-muted)">
              <div className="w-14 h-14 rounded-full bg-(--card-border) mx-auto flex items-center justify-center mb-4">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <p className="text-sm mb-3">No posts yet.</p>
              <p className="text-xs">Install the DotShare VS Code extension to start scheduling.</p>
            </div>
          ) : (
            <ul className="divide-y divide-(--card-border)">
              {posts.map((post, index) => (
                <li key={post._id || `post-${index}`} className="p-5 flex gap-4 items-start hover:bg-(--card-border)/20 transition-colors">
                  <div className="mt-0.5">
                    <PostStatusIcon status={post.status} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate mb-1">{post.text}</p>
                    <div className="flex flex-wrap gap-1 mb-1.5">
                      {post.platforms.map((p) => (
                        <PlatformBadge key={p} platform={p as Parameters<typeof PlatformBadge>[0]["platform"]} />
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-(--text-muted)">
                        {new Date(post.scheduled_at).toLocaleString()}
                      </p>
                      {post.last_error && (
                        <p className="text-xs text-red-400 truncate max-w-xs">{post.last_error}</p>
                      )}
                    </div>
                  </div>
                  {post.status === "pending" && (
                    <button
                      onClick={() => handleCancelPost(post._id)}
                      disabled={cancellingId === post._id}
                      className="shrink-0 text-xs text-red-400 hover:text-red-300 transition-colors disabled:opacity-50"
                    >
                      {cancellingId === post._id ? "…" : "Cancel"}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

      </div>
    </div>
  );
}
