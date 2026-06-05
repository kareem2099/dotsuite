"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { useTranslations } from "next-intl";

const ADMIN_EMAILS = (process.env.NEXT_PUBLIC_ADMIN_EMAILS ?? "")
  .split(",")
  .map((e) => e.trim());

// ── Types ─────────────────────────────────────────────────────────────────────

interface RefundAlert {
  alert_id: string;
  user_id: string;
  user_email: string;
  order_id: string;
  amount_usd: number;
  alert_level: string;
  reason: string;
  created_at: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function AlertBadge({ level }: { level: string }) {
  const colors: Record<string, { bg: string; text: string }> = {
    info:     { bg: "rgba(59,130,246,0.1)",  text: "#3b82f6" },
    warning:  { bg: "rgba(251,191,36,0.1)",  text: "#fbbf24" },
    critical: { bg: "rgba(239,68,68,0.1)",   text: "#ef4444" },
  };
  const c = colors[level] ?? { bg: "rgba(255,255,255,0.05)", text: "#9ca3af" };
  return (
    <span style={{ background: c.bg, color: c.text, padding: "0.125rem 0.5rem", borderRadius: "999px", fontSize: "0.6875rem", fontWeight: 600, textTransform: "uppercase" }}>
      {level}
    </span>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function AdminRefundsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const t = useTranslations("Dashboard");

  const [alerts, setAlerts] = useState<RefundAlert[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  const isAdmin = ADMIN_EMAILS.includes(session?.user?.email ?? "");

  // Auth guard
  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (status === "authenticated" && !isAdmin) router.push("/dashboard");
  }, [status, isAdmin, router]);

  // Fetch refund alerts
  const fetchAlerts = useCallback(async (p = 1) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/refunds?page=${p}&limit=50`);
      const data = await res.json();
      setAlerts(data.alerts ?? []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isAdmin) return;
    fetchAlerts(page);
  }, [page, isAdmin, fetchAlerts]);

  if (status === "loading" || !isAdmin) return null;

  return (
    <div style={{ minHeight: "100vh", background: "#080808", color: "#e5e7eb", fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <div style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "1.5rem 2rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <span style={{ fontSize: "1.25rem" }}>💸</span>
        <div>
          <h1 style={{ margin: 0, fontSize: "1.125rem", fontWeight: 700 }}>Refund Alerts</h1>
          <p style={{ margin: 0, color: "#6b7280", fontSize: "0.8125rem" }}>Monitor user refunds and detect potential fraud patterns.</p>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "1.5rem 2rem" }}>
        {loading && (
          <div style={{ textAlign: "center", padding: "3rem", color: "#4b5563" }}>Loading…</div>
        )}

        {/* Alerts Table */}
        {!loading && (
          <div style={{ overflowX: "auto" }}>
            {alerts.length === 0 ? (
              <div style={{ textAlign: "center", padding: "3rem", color: "#4b5563" }}>No refund alerts found.</div>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8125rem" }}>
                <thead>
                  <tr style={{ color: "#6b7280", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                    <th style={{ textAlign: "left", padding: "0.625rem 0.75rem", fontWeight: 600 }}>Date</th>
                    <th style={{ textAlign: "left", padding: "0.625rem 0.75rem", fontWeight: 600 }}>User Email</th>
                    <th style={{ textAlign: "left", padding: "0.625rem 0.75rem", fontWeight: 600 }}>Amount</th>
                    <th style={{ textAlign: "left", padding: "0.625rem 0.75rem", fontWeight: 600 }}>Severity</th>
                    <th style={{ textAlign: "left", padding: "0.625rem 0.75rem", fontWeight: 600 }}>Reason</th>
                    <th style={{ textAlign: "left", padding: "0.625rem 0.75rem", fontWeight: 600 }}>Order ID</th>
                  </tr>
                </thead>
                <tbody>
                  {alerts.map((alert) => (
                    <tr
                      key={alert.alert_id}
                      style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                    >
                      <td style={{ padding: "0.75rem", color: "#6b7280", whiteSpace: "nowrap" }}>
                        {new Date(alert.created_at).toLocaleString()}
                      </td>
                      <td style={{ padding: "0.75rem", color: "#9ca3af", whiteSpace: "nowrap" }}>
                        {alert.user_email}
                      </td>
                      <td style={{ padding: "0.75rem", color: "#d1d5db", fontWeight: 600 }}>
                        ${alert.amount_usd.toFixed(2)}
                      </td>
                      <td style={{ padding: "0.75rem" }}>
                        <AlertBadge level={alert.alert_level} />
                      </td>
                      <td style={{ padding: "0.75rem", maxWidth: "280px" }}>
                        <span style={{ color: "#9ca3af" }}>
                          {alert.reason}
                        </span>
                      </td>
                      <td style={{ padding: "0.75rem", color: "#6b7280", fontFamily: "monospace" }}>
                        {alert.order_id}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Pagination */}
        {!loading && alerts.length > 0 && (
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
        )}
      </div>
    </div>
  );
}
