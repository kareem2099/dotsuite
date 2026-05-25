"use client";

import { useState } from "react";

interface Post {
  post_id: string;
  user_id: string;
  user_email?: string;
  content: string;
  platforms: string[];
  status: string;
  created_at: string;
}

interface BanModalProps {
  post: Post;
  onClose: () => void;
  onBanned: (userId: string) => void;
}

const BAN_REASONS = [
  "TOS Violation: Prohibited Content",
  "TOS Violation: Spam",
  "TOS Violation: Impersonation",
  "TOS Violation: Malware / Phishing",
  "TOS Violation: Coordinated Inauthentic Behavior",
  "Other",
];

export function BanModal({ post, onClose, onBanned }: BanModalProps) {
  const [reason, setReason] = useState(BAN_REASONS[0]);
  const [customReason, setCustomReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const finalReason = reason === "Other" ? customReason : reason;

  async function handleBan() {
    if (!finalReason.trim()) {
      setError("Please enter a ban reason.");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/blacklist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: post.user_id,
          reason: finalReason,
          source_post_id: post.post_id || undefined,
        }),
      });

      if (res.ok) {
        onBanned(post.user_id);
        onClose();
      } else {
        const data = await res.json();
        setError(data.error?.message ?? data.message ?? "Ban failed.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.85)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
        padding: "1rem",
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          background: "#0f0f0f",
          border: "1px solid rgba(127,29,29,0.6)",
          borderRadius: "14px",
          padding: "2rem",
          width: "100%",
          maxWidth: "480px",
          boxShadow: "0 24px 64px rgba(0,0,0,0.8)",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
          <div>
            <h2 style={{ color: "#ef4444", fontWeight: 700, fontSize: "1.125rem", margin: 0 }}>
              ⛔ Permanently Ban User
            </h2>
            <p style={{ color: "#6b7280", fontSize: "0.8125rem", margin: "0.25rem 0 0" }}>
              {post.user_email ?? post.user_id}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", color: "#6b7280", cursor: "pointer", fontSize: "1.25rem", padding: "0 0.25rem" }}
          >
            ×
          </button>
        </div>

        {/* Post preview */}
        <div
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: "8px",
            padding: "0.875rem",
            marginBottom: "1.5rem",
          }}
        >
          <p style={{ color: "#9ca3af", fontSize: "0.8125rem", margin: "0 0 0.5rem", fontWeight: 600 }}>
            Post triggering ban:
          </p>
          <p style={{ color: "#d1d5db", fontSize: "0.875rem", margin: 0, lineHeight: 1.5, wordBreak: "break-word" }}>
            {post.content.slice(0, 200)}{post.content.length > 200 ? "…" : ""}
          </p>
          <div style={{ marginTop: "0.5rem", display: "flex", gap: "0.375rem", flexWrap: "wrap" }}>
            {post.platforms.map((p) => (
              <span
                key={p}
                style={{
                  background: "rgba(99,102,241,0.1)",
                  border: "1px solid rgba(99,102,241,0.2)",
                  color: "#818cf8",
                  borderRadius: "999px",
                  padding: "0.1rem 0.5rem",
                  fontSize: "0.6875rem",
                }}
              >
                {p}
              </span>
            ))}
          </div>
        </div>

        {/* Reason select */}
        <label style={{ color: "#9ca3af", fontSize: "0.8125rem", fontWeight: 600, display: "block", marginBottom: "0.5rem" }}>
          Ban Reason
        </label>
        <select
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          style={{
            width: "100%",
            background: "#1a1a1a",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "8px",
            color: "#e5e7eb",
            padding: "0.625rem 0.75rem",
            fontSize: "0.875rem",
            marginBottom: "0.75rem",
            outline: "none",
          }}
        >
          {BAN_REASONS.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>

        {reason === "Other" && (
          <textarea
            value={customReason}
            onChange={(e) => setCustomReason(e.target.value)}
            placeholder="Describe the specific violation..."
            rows={3}
            style={{
              width: "100%",
              background: "#1a1a1a",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "8px",
              color: "#e5e7eb",
              padding: "0.625rem 0.75rem",
              fontSize: "0.875rem",
              resize: "vertical",
              outline: "none",
              boxSizing: "border-box",
              marginBottom: "0.75rem",
            }}
          />
        )}

        {error && (
          <div
            style={{
              background: "rgba(220,38,38,0.08)",
              border: "1px solid rgba(220,38,38,0.3)",
              borderRadius: "8px",
              padding: "0.625rem 0.875rem",
              color: "#f87171",
              fontSize: "0.8125rem",
              marginBottom: "1rem",
            }}
          >
            {error}
          </div>
        )}

        {/* Actions */}
        <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.25rem" }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: "0.625rem",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "8px",
              color: "#9ca3af",
              cursor: "pointer",
              fontSize: "0.875rem",
            }}
          >
            Cancel
          </button>
          <button
            id="confirm-ban-btn"
            onClick={handleBan}
            disabled={loading}
            style={{
              flex: 1,
              padding: "0.625rem",
              background: loading ? "rgba(220,38,38,0.3)" : "#dc2626",
              border: "1px solid rgba(220,38,38,0.5)",
              borderRadius: "8px",
              color: "#fff",
              cursor: loading ? "not-allowed" : "pointer",
              fontSize: "0.875rem",
              fontWeight: 600,
              transition: "background 0.2s",
            }}
          >
            {loading ? "Banning…" : "⛔ Permanently Ban User"}
          </button>
        </div>
      </div>
    </div>
  );
}
