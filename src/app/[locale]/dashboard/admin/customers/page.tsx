"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import StatusPill from "@/components/admin/StatusPill";
import { day, money, useStaffRole } from "@/components/admin/useStaffRole";

type Customer = { id: string; email: string; username: string; created_at: string; is_active: boolean; dotscramble: { tier: string; payment_type: string | null } };
type RefundRequest = { id: string; user_id: string; user_email: string; payment_kind: string; payment_id: string; product: string | null; amount_cents: number; reason: string; status: string; created_by: string; created_at: string; provider_error: string | null };

/** Support & refunds: find a customer, see open refund requests. */
export default function CustomersPage() {
  const role = useStaffRole();
  const locale = (useParams().locale as string) || "en";
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Customer[] | null>(null);
  const [requests, setRequests] = useState<RefundRequest[]>([]);
  const [filter, setFilter] = useState("open");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!role) return;
    fetch(`/api/admin/refund-requests?status=${filter}`, { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => setRequests(data.requests ?? []))
      .catch(() => setRequests([]));
  }, [role, filter]);

  async function search(e: FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch(`/api/admin/customers?q=${encodeURIComponent(query.trim())}`, { cache: "no-store" });
    const data = await res.json();
    if (!res.ok) { setError(data.error ?? "Search failed"); setResults(null); return; }
    setResults(data.customers ?? []);
  }

  if (!role) return null;

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">Customers &amp; refunds</h1>
            <p className="text-sm text-(--text-muted)">Signed in as {role === "admin" ? "Admin" : "Support (view only)"}</p>
          </div>
          {role === "admin" && <Link href={`/${locale}/dashboard/admin`} className="text-sm text-(--primary) hover:underline">Audit system →</Link>}
        </div>

        <form onSubmit={search} className="flex gap-2 mb-4">
          <input
            value={query} onChange={(e) => setQuery(e.target.value)}
            placeholder="Customer email or account ID"
            className="flex-1 px-4 py-2 rounded-lg bg-(--card-bg) border border-(--card-border) focus:outline-none focus:border-(--primary)"
          />
          <button className="px-4 py-2 rounded-lg bg-(--primary) text-(--primary-text) font-semibold">Search</button>
        </form>
        {error && <p className="text-sm text-red-500 mb-4">{error}</p>}
        {results && (
          <div className="mb-10 bg-(--card-bg) border border-(--card-border) rounded-xl divide-y divide-(--card-border)">
            {results.length === 0 && <p className="p-4 text-sm text-(--text-muted)">No account with that email or ID.</p>}
            {results.map((c) => (
              <Link key={c.id} href={`/${locale}/dashboard/admin/customers/${c.id}`} className="flex items-center justify-between p-4 hover:bg-(--primary)/5">
                <div>
                  <p className="font-medium">{c.email}</p>
                  <p className="text-xs text-(--text-muted)">{c.username} · joined {day(c.created_at)} {c.is_active ? "" : "· disabled"}</p>
                </div>
                <span className="text-xs text-(--text-muted)">DotScramble: {c.dotscramble?.tier ?? "free"}</span>
              </Link>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold">Refund requests</h2>
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="px-3 py-1.5 rounded-lg bg-(--card-bg) border border-(--card-border) text-sm">
            <option value="open">Open</option><option value="approved">Approved</option>
            <option value="denied">Denied</option><option value="all">All</option>
          </select>
        </div>
        <div className="bg-(--card-bg) border border-(--card-border) rounded-xl overflow-x-auto">
          {requests.length === 0 ? (
            <p className="p-4 text-sm text-(--text-muted)">Nothing here.</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="text-left text-(--text-muted)">
                <tr><th className="p-3">Customer</th><th className="p-3">Payment</th><th className="p-3">Reason</th><th className="p-3">Logged</th><th className="p-3">Status</th></tr>
              </thead>
              <tbody className="divide-y divide-(--card-border)">
                {requests.map((r) => (
                  <tr key={r.id}>
                    <td className="p-3"><Link className="text-(--primary) hover:underline" href={`/${locale}/dashboard/admin/customers/${r.user_id}`}>{r.user_email}</Link></td>
                    <td className="p-3 whitespace-nowrap">{r.product ?? "?"} · {r.payment_kind} {r.payment_id} · {money(r.amount_cents)}</td>
                    <td className="p-3 max-w-xs truncate" title={r.reason}>{r.reason}</td>
                    <td className="p-3 whitespace-nowrap">{day(r.created_at)}<br /><span className="text-xs text-(--text-muted)">{r.created_by}</span></td>
                    <td className="p-3"><StatusPill status={r.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
