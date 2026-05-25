"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { BanModal } from "./components/BanModal";

const ADMIN_EMAILS = (process.env.NEXT_PUBLIC_ADMIN_EMAILS ?? "")
  .split(",")
  .map((e) => e.trim());

// ── Types ─────────────────────────────────────────────────────────────────────

interface Post {
  post_id: string;
  user_id: string;
  user_email?: string;
  content: string;
  platforms: string[];
  status: string;
  created_at: string;
}

interface BannedUser {
  user_id: string;
  email?: string;
  reason: string;
  ban_type?: string;
  banned_by: string;
  machine_ids_count: number;
  banned_at: string;
}

type Tab = "feed" | "banned";

// ── Helpers ───────────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, { bg: string; text: string }> = {
    pending:        { bg: "rgba(251,191,36,0.1)",  text: "#fbbf24" },
    published:      { bg: "rgba(34,197,94,0.1)",   text: "#22c55e" },
    failed:         { bg: "rgba(239,68,68,0.1)",   text: "#ef4444" },
    cancelled_ban:  { bg: "rgba(127,29,29,0.2)",   text: "#f87171" },
    dispatched:     { bg: "rgba(99,102,241,0.1)",  text: "#818cf8" },
  };
  const c = colors[status] ?? { bg: "rgba(255,255,255,0.05)", text: "#9ca3af" };
  return (
    <span style={{ background: c.bg, color: c.text, padding: "0.125rem 0.5rem", borderRadius: "999px", fontSize: "0.6875rem", fontWeight: 600 }}>
      {status.replace("_", " ")}
    </span>
  );
}

function PlatformBadges({ platforms }: { platforms: string[] }) {
  return (
    <div style={{ display: "flex", gap: "0.25rem", flexWrap: "wrap" }}>
      {platforms.map((p) => (
        <span
          key={p}
          style={{
            background: "rgba(99,102,241,0.08)",
            border: "1px solid rgba(99,102,241,0.15)",
            color: "#a5b4fc",
            borderRadius: "4px",
            padding: "0.1rem 0.375rem",
            fontSize: "0.6875rem",
          }}
        >
          {p}
        </span>
      ))}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [tab, setTab] = useState<Tab>("feed");
  const [posts, setPosts] = useState<Post[]>([]);
  const [banned, setBanned] = useState<BannedUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [banTarget, setBanTarget] = useState<Post | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const isAdmin = ADMIN_EMAILS.includes(session?.user?.email ?? "");

  // Auth guard
  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (status === "authenticated" && !isAdmin) router.push("/dashboard");
  }, [status, isAdmin, router]);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  }, []);

  // Fetch posts feed
  const fetchPosts = useCallback(async (p = 1) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/posts?page=${p}&limit=50`);
      const data = await res.json();
      setPosts(data.posts ?? []);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch banned users
  const fetchBanned = useCallback(async (p = 1) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/blacklist?page=${p}&limit=50`);
      const data = await res.json();
      setBanned(data.banned ?? []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isAdmin) return;
    if (tab === "feed") fetchPosts(page);
    else fetchBanned(page);
  }, [tab, page, isAdmin, fetchPosts, fetchBanned]);

  async function handleUnban(userId: string) {
    const res = await fetch(`/api/admin/blacklist?user_id=${userId}`, { method: "DELETE" });
    if (res.ok || res.status === 204) {
      setBanned((prev) => prev.filter((u) => u.user_id !== userId));
      showToast("✓ User unbanned successfully.");
    } else {
      showToast("❌ Unban failed. Please try again.");
    }
  }

  function handleBanned(userId: string) {
    setPosts((prev) => prev.filter((p) => p.user_id !== userId));
    showToast("⛔ User permanently banned.");
  }

  if (status === "loading" || !isAdmin) return null;

  return (
    <div style={{ minHeight: "100vh", background: "#080808", color: "#e5e7eb", fontFamily: "'Inter', sans-serif" }}>
      {/* Toast */}
      {toast && (
        <div
          style={{
            position: "fixed",
            top: "1.5rem",
            right: "1.5rem",
            background: "#1a1a1a",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "10px",
            padding: "0.75rem 1.25rem",
            color: "#e5e7eb",
            zIndex: 200,
            fontSize: "0.875rem",
            boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
          }}
        >
          {toast}
        </div>
      )}

      {/* Header */}
      <div style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "1.5rem 2rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <span style={{ fontSize: "1.25rem" }}>🛡️</span>
        <div>
          <h1 style={{ margin: 0, fontSize: "1.125rem", fontWeight: 700 }}>Audit System</h1>
          <p style={{ margin: 0, color: "#6b7280", fontSize: "0.8125rem" }}>DotSuite Platform Moderation</p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ padding: "0 2rem", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", gap: "0" }}>
        {(["feed", "banned"] as Tab[]).map((t) => (
          <button
            key={t}
            id={`admin-tab-${t}`}
            onClick={() => { setTab(t); setPage(1); }}
            style={{
              background: "none",
              border: "none",
              color: tab === t ? "#e5e7eb" : "#6b7280",
              fontSize: "0.875rem",
              fontWeight: tab === t ? 600 : 400,
              padding: "1rem 1.25rem",
              cursor: "pointer",
              borderBottom: tab === t ? "2px solid #ef4444" : "2px solid transparent",
              marginBottom: "-1px",
              transition: "color 0.15s",
            }}
          >
            {t === "feed" ? "📋 Post Feed" : "⛔ Banned Users"}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ padding: "1.5rem 2rem" }}>
        {loading && (
          <div style={{ textAlign: "center", padding: "3rem", color: "#4b5563" }}>Loading…</div>
        )}

        {/* Post Feed */}
        {!loading && tab === "feed" && (
          <div style={{ overflowX: "auto" }}>
            {posts.length === 0 ? (
              <div style={{ textAlign: "center", padding: "3rem", color: "#4b5563" }}>No posts found.</div>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8125rem" }}>
                <thead>
                  <tr style={{ color: "#6b7280", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                    <th style={{ textAlign: "left", padding: "0.625rem 0.75rem", fontWeight: 600 }}>User</th>
                    <th style={{ textAlign: "left", padding: "0.625rem 0.75rem", fontWeight: 600 }}>Content</th>
                    <th style={{ textAlign: "left", padding: "0.625rem 0.75rem", fontWeight: 600 }}>Platforms</th>
                    <th style={{ textAlign: "left", padding: "0.625rem 0.75rem", fontWeight: 600 }}>Status</th>
                    <th style={{ textAlign: "left", padding: "0.625rem 0.75rem", fontWeight: 600 }}>Posted</th>
                    <th style={{ textAlign: "left", padding: "0.625rem 0.75rem", fontWeight: 600 }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map((post) => (
                    <tr
                      key={post.post_id}
                      style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                    >
                      <td style={{ padding: "0.75rem", color: "#9ca3af", whiteSpace: "nowrap" }}>
                        {post.user_email ?? post.user_id.slice(0, 12) + "…"}
                      </td>
                      <td style={{ padding: "0.75rem", maxWidth: "280px" }}>
                        <span style={{ color: "#d1d5db" }}>
                          {post.content.slice(0, 100)}{post.content.length > 100 ? "…" : ""}
                        </span>
                      </td>
                      <td style={{ padding: "0.75rem" }}>
                        <PlatformBadges platforms={post.platforms} />
                      </td>
                      <td style={{ padding: "0.75rem" }}>
                        <StatusBadge status={post.status} />
                      </td>
                      <td style={{ padding: "0.75rem", color: "#6b7280", whiteSpace: "nowrap" }}>
                        {new Date(post.created_at).toLocaleDateString()}
                      </td>
                      <td style={{ padding: "0.75rem" }}>
                        <button
                          id={`ban-btn-${post.post_id}`}
                          onClick={() => setBanTarget(post)}
                          style={{
                            background: "rgba(220,38,38,0.08)",
                            border: "1px solid rgba(220,38,38,0.25)",
                            borderRadius: "6px",
                            color: "#f87171",
                            padding: "0.3rem 0.75rem",
                            cursor: "pointer",
                            fontSize: "0.75rem",
                            fontWeight: 600,
                            whiteSpace: "nowrap",
                          }}
                        >
                          Ban User
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Banned Users */}
        {!loading && tab === "banned" && (
          <div style={{ overflowX: "auto" }}>
            {banned.length === 0 ? (
              <div style={{ textAlign: "center", padding: "3rem", color: "#4b5563" }}>No banned users.</div>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8125rem" }}>
                <thead>
                  <tr style={{ color: "#6b7280", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                    <th style={{ textAlign: "left", padding: "0.625rem 0.75rem", fontWeight: 600 }}>Email / ID</th>
                    <th style={{ textAlign: "left", padding: "0.625rem 0.75rem", fontWeight: 600 }}>Reason</th>
                    <th style={{ textAlign: "left", padding: "0.625rem 0.75rem", fontWeight: 600 }}>Type</th>
                    <th style={{ textAlign: "left", padding: "0.625rem 0.75rem", fontWeight: 600 }}>By</th>
                    <th style={{ textAlign: "left", padding: "0.625rem 0.75rem", fontWeight: 600 }}>Devices</th>
                    <th style={{ textAlign: "left", padding: "0.625rem 0.75rem", fontWeight: 600 }}>Date</th>
                    <th style={{ textAlign: "left", padding: "0.625rem 0.75rem", fontWeight: 600 }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {banned.map((u) => (
                    <tr
                      key={u.user_id}
                      style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                    >
                      <td style={{ padding: "0.75rem", color: "#9ca3af" }}>
                        {u.email ?? u.user_id.slice(0, 16) + "…"}
                      </td>
                      <td style={{ padding: "0.75rem", color: "#d1d5db", maxWidth: "220px" }}>
                        {u.reason.slice(0, 80)}{u.reason.length > 80 ? "…" : ""}
                      </td>
                      <td style={{ padding: "0.75rem" }}>
                        <span style={{
                          background: "rgba(220,38,38,0.08)",
                          color: "#f87171",
                          padding: "0.1rem 0.4rem",
                          borderRadius: "4px",
                          fontSize: "0.6875rem",
                          fontWeight: 600,
                        }}>
                          {u.ban_type ?? "manual"}
                        </span>
                      </td>
                      <td style={{ padding: "0.75rem", color: "#6b7280" }}>{u.banned_by}</td>
                      <td style={{ padding: "0.75rem", color: "#6b7280", textAlign: "center" }}>{u.machine_ids_count}</td>
                      <td style={{ padding: "0.75rem", color: "#6b7280", whiteSpace: "nowrap" }}>
                        {new Date(u.banned_at).toLocaleDateString()}
                      </td>
                      <td style={{ padding: "0.75rem" }}>
                        <button
                          id={`unban-btn-${u.user_id}`}
                          onClick={() => handleUnban(u.user_id)}
                          style={{
                            background: "rgba(34,197,94,0.06)",
                            border: "1px solid rgba(34,197,94,0.2)",
                            borderRadius: "6px",
                            color: "#4ade80",
                            padding: "0.3rem 0.75rem",
                            cursor: "pointer",
                            fontSize: "0.75rem",
                            fontWeight: 600,
                          }}
                        >
                          Unban
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Pagination */}
        <div style={{ display: "flex", gap: "0.5rem", marginTop: "1.5rem", justifyContent: "center" }}>
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "6px",
              color: page === 1 ? "#4b5563" : "#9ca3af",
              padding: "0.375rem 0.875rem",
              cursor: page === 1 ? "not-allowed" : "pointer",
              fontSize: "0.8125rem",
            }}
          >
            ← Prev
          </button>
          <span style={{ color: "#6b7280", fontSize: "0.8125rem", display: "flex", alignItems: "center", padding: "0 0.5rem" }}>
            Page {page}
          </span>
          <button
            onClick={() => setPage((p) => p + 1)}
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "6px",
              color: "#9ca3af",
              padding: "0.375rem 0.875rem",
              cursor: "pointer",
              fontSize: "0.8125rem",
            }}
          >
            Next →
          </button>
        </div>
      </div>

      {/* Ban Modal */}
      {banTarget && (
        <BanModal
          post={banTarget}
          onClose={() => setBanTarget(null)}
          onBanned={handleBanned}
        />
      )}
    </div>
  );
}
