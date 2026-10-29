"use client";

import { ReactNode, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useConfirm } from "@/components/ConfirmModal";
import StatusPill from "@/components/admin/StatusPill";
import { day, money, useStaffRole } from "@/components/admin/useStaffRole";

type Payment = { kind: "order" | "invoice"; id: string; subscription_id: string | null; product: string | null; cycle: string | null; payment_type: string | null; created_at: string | null; total_cents: number; paid: boolean; refunded: boolean; refunded_cents: number; billing_reason: string; term_end: string | null; refundable: boolean };
type Device = { machine_id: string; name: string | null; app_version: string | null; activated_at: string | null; last_seen_at: string | null; in_slot: boolean; key: { prefix: string; source: string; label: string; active: boolean } | null };
type UsageRow = { day: string; machine_id: string; pro_saves: number; batch_images: number; metadata_cleaned: number; ai_runs: number };
type Counts = Partial<Record<"pro_saves" | "batch_images" | "metadata_cleaned" | "ai_runs", number>>;
type RefundRequest = { id: string; payment_kind: string; payment_id: string; product: string | null; amount_cents: number; reason: string; status: string; created_by: string; created_at: string; decided_by: string | null; decided_at: string | null; decision_note: string | null; provider_error: string | null };
type Evidence = {
  customer: { id: string; email: string; username: string; created_at: string; is_active: boolean };
  access: { tier: string; payment_type: string | null; ends_at: number | null; renews_at: number | null };
  payments: Payment[];
  subscriptions: { id: string; product: string | null; cycle: string | null; status: string; created_at: string | null; ends_at: string | null; renews_at: string | null }[];
  devices: Device[];
  usage: { days: UsageRow[]; total: Counts; since_latest_payment: Counts; since_day: string | null };
  events: { event: string; detail: string; at: string }[];
  refund_requests: RefundRequest[];
  self_removals: { left: number; resets_at: string | null };
};

const USAGE_LABELS: [keyof Counts, string][] = [
  ["pro_saves", "Photos saved with Pro"], ["batch_images", "Photos through Batch"],
  ["metadata_cleaned", "Pro metadata cleans"], ["ai_runs", "AI detection / Evasion runs"],
];

function Card({ title, children, aside }: { title: string; children: ReactNode; aside?: ReactNode }) {
  return (
    <section className="p-6 bg-(--card-bg) border border-(--card-border) rounded-xl mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold">{title}</h2>
        {aside}
      </div>
      {children}
    </section>
  );
}

const ms = (value: number | null) => (value ? new Date(value).toISOString() : null);

/** Everything needed to answer a support request or judge a refund, for one customer. */
export default function CustomerPage() {
  const role = useStaffRole();
  const { confirm } = useConfirm();
  const params = useParams();
  const locale = (params.locale as string) || "en";
  const id = params.id as string;
  const [data, setData] = useState<Evidence | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [logging, setLogging] = useState<Payment | null>(null);
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState<Record<string, string>>({});

  const load = useCallback(() => {
    return fetch(`/api/admin/customers/${id}`, { cache: "no-store" })
      .then(async (r) => {
        const body = await r.json();
        if (!r.ok) throw new Error(body.error ?? "Unable to load this customer");
        setData(body);
        setError("");
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Unable to load this customer"));
  }, [id]);

  useEffect(() => {
    if (role) load();
  }, [role, load]);

  async function post(url: string, body: unknown) {
    setBusy(true);
    setError("");
    try {
      const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const result = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(result.error ?? "Request failed");
      if (result.warning) setError(result.warning);
      return true;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Request failed");
      return false;
    } finally {
      setBusy(false);
      await load();
    }
  }

  async function logRequest() {
    if (!logging) return;
    if (await post(`/api/admin/customers/${id}/refund-requests`, { payment_kind: logging.kind, payment_id: logging.id, reason })) {
      setLogging(null);
      setReason("");
    }
  }

  async function removeDevice(device: Device) {
    const ok = await confirm(
      `Free ${device.name ?? "this computer"}'s slot? It returns to the Free plan at its next check-in. This doesn't use the customer's own removals.`,
      { title: "Remove device", confirmLabel: "Remove", variant: "danger" },
    );
    if (!ok) return;
    setBusy(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/customers/${id}/devices/${device.machine_id}`, { method: "DELETE" });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error ?? "Unable to remove the device");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to remove the device");
    } finally {
      setBusy(false);
      await load();
    }
  }

  async function decide(request: RefundRequest, decision: "approve" | "deny") {
    const note = (notes[request.id] ?? "").trim();
    if (!note) { setError("Write why before deciding; it is kept with the decision."); return; }
    const ok = await confirm(
      decision === "approve"
        ? `Refund ${money(request.amount_cents)} for ${request.payment_kind} ${request.payment_id} through Lemon Squeezy? A subscription is also cancelled. Paid access ends when Lemon Squeezy confirms the refund.`
        : `Deny this refund request? The customer is not charged or refunded; your reason is kept.`,
      { title: decision === "approve" ? "Issue refund" : "Deny refund", confirmLabel: decision === "approve" ? "Refund" : "Deny", variant: decision === "approve" ? "danger" : "warning" },
    );
    if (ok) await post(`/api/admin/refund-requests/${request.id}/decision`, { decision, note });
  }

  if (!role) return null;
  const isAdmin = role === "admin";
  const openFor = (p: Payment) => data?.refund_requests.some((r) => r.payment_id === p.id && ["pending", "processing", "failed"].includes(r.status));

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <Link href={`/${locale}/dashboard/admin/customers`} className="text-sm text-(--text-muted) hover:text-(--primary)">← Customers &amp; refunds</Link>
        {error && <p className="mt-4 p-3 rounded-lg bg-red-500/10 text-red-500 text-sm">{error}</p>}
        {!data ? (
          !error && <div className="mt-6 h-40 rounded-xl bg-gray-500/10 animate-pulse" />
        ) : (
          <>
            <div className="mt-4 mb-8">
              <h1 className="text-2xl font-bold">{data.customer.email}</h1>
              <p className="text-sm text-(--text-muted)">
                {data.customer.username} · joined {day(data.customer.created_at)} · <span className="font-mono">{data.customer.id}</span>
                {!data.customer.is_active && " · account disabled"}
              </p>
              <p className="mt-2 text-sm">
                DotScramble: <strong className="uppercase">{data.access.tier}</strong>
                {data.access.payment_type && ` · ${data.access.payment_type}`}
                {data.access.ends_at && ` · ends ${day(ms(data.access.ends_at))}`}
                {data.access.renews_at && ` · renews ${day(ms(data.access.renews_at))}`}
              </p>
            </div>

            <Card title="Usage of Pro" aside={<span className="text-xs text-(--text-muted)">Counts reported by the app; no photos or file names</span>}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                {USAGE_LABELS.map(([key, label]) => (
                  <div key={key} className="p-3 rounded-lg border border-(--card-border)">
                    <p className="text-2xl font-bold">{data.usage.since_latest_payment[key] ?? 0}</p>
                    <p className="text-xs text-(--text-muted)">{label}{data.usage.since_day ? ` since ${data.usage.since_day}` : ""}</p>
                    <p className="text-xs text-(--text-muted)">All time: {data.usage.total[key] ?? 0}</p>
                  </div>
                ))}
              </div>
              {data.usage.days.length > 0 ? (
                <div className="overflow-x-auto max-h-72">
                  <table className="w-full text-sm">
                    <thead className="text-left text-(--text-muted)"><tr><th className="py-1 pr-4">Day</th><th className="pr-4">Computer</th><th className="pr-4">Saves</th><th className="pr-4">Batch</th><th className="pr-4">Metadata</th><th>AI</th></tr></thead>
                    <tbody>
                      {data.usage.days.map((u) => (
                        <tr key={u.day + u.machine_id} className="border-t border-(--card-border)">
                          <td className="py-1 pr-4">{u.day}</td>
                          <td className="pr-4">{data.devices.find((d) => d.machine_id === u.machine_id)?.name ?? <span className="font-mono">{u.machine_id.slice(0, 8)}</span>}</td>
                          <td className="pr-4">{u.pro_saves}</td><td className="pr-4">{u.batch_images}</td><td className="pr-4">{u.metadata_cleaned}</td><td>{u.ai_runs}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-sm text-(--text-muted)">No usage reported. Versions before 1.6 don&apos;t report usage; activity below still shows activations and check-ins.</p>
              )}
            </Card>

            <Card title="Payments">
              {data.payments.length === 0 ? <p className="text-sm text-(--text-muted)">No payments.</p> : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="text-left text-(--text-muted)"><tr><th className="py-1 pr-4">Date</th><th className="pr-4">Product</th><th className="pr-4">Payment</th><th className="pr-4">Amount</th><th className="pr-4">State</th><th /></tr></thead>
                    <tbody>
                      {data.payments.map((p) => (
                        <tr key={p.kind + p.id} className="border-t border-(--card-border)">
                          <td className="py-2 pr-4 whitespace-nowrap">{day(p.created_at)}</td>
                          <td className="pr-4">{p.product ?? "?"} {p.cycle && `· ${p.cycle}`} {p.payment_type && `· ${p.payment_type}`}</td>
                          <td className="pr-4 whitespace-nowrap">{p.kind} {p.id}{p.billing_reason && ` · ${p.billing_reason}`}</td>
                          <td className="pr-4">{money(p.total_cents)}</td>
                          <td className="pr-4">{p.refunded ? `refunded ${money(p.refunded_cents)}` : p.paid ? "paid" : "unpaid"}</td>
                          <td className="text-right">
                            {isAdmin && p.refundable && !openFor(p) && (
                              <button onClick={() => { setLogging(p); setReason(""); }} className="text-(--primary) hover:underline whitespace-nowrap">Log refund request</button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {logging && (
                <div className="mt-4 p-4 rounded-lg border border-(--primary)/40">
                  <p className="text-sm mb-2">Refund request for {logging.kind} {logging.id} ({money(logging.total_cents)}): what did the customer say?</p>
                  <textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={3} maxLength={2000}
                    className="w-full p-2 rounded-lg bg-transparent border border-(--card-border) text-sm" placeholder="e.g. Says the app never activated on their laptop" />
                  <div className="flex gap-2 mt-2">
                    <button disabled={busy || !reason.trim()} onClick={logRequest} className="px-3 py-1.5 rounded-lg bg-(--primary) text-(--primary-text) text-sm font-semibold disabled:opacity-50">Log request</button>
                    <button onClick={() => setLogging(null)} className="px-3 py-1.5 rounded-lg text-sm">Cancel</button>
                  </div>
                </div>
              )}
            </Card>

            <Card title="Refund requests">
              {data.refund_requests.length === 0 ? <p className="text-sm text-(--text-muted)">None.</p> : (
                <div className="space-y-4">
                  {data.refund_requests.map((r) => {
                    const open = ["pending", "failed"].includes(r.status);
                    return (
                      <div key={r.id} className="p-4 rounded-lg border border-(--card-border)">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <StatusPill status={r.status} />
                          <span className="text-sm font-medium">{r.product ?? "?"} · {r.payment_kind} {r.payment_id} · {money(r.amount_cents)}</span>
                          <span className="text-xs text-(--text-muted)">logged {day(r.created_at)} by {r.created_by}</span>
                        </div>
                        <p className="text-sm">Customer: {r.reason}</p>
                        {r.decision_note && <p className="text-sm text-(--text-muted)">Decision by {r.decided_by} on {day(r.decided_at)}: {r.decision_note}</p>}
                        {r.provider_error && <p className="text-sm text-red-500">{r.provider_error}</p>}
                        {isAdmin && open && (
                          <div className="mt-3">
                            <textarea value={notes[r.id] ?? ""} onChange={(e) => setNotes({ ...notes, [r.id]: e.target.value })} rows={2} maxLength={2000}
                              className="w-full p-2 rounded-lg bg-transparent border border-(--card-border) text-sm" placeholder="Why (kept with the decision): e.g. Used Batch on 120 photos after buying" />
                            <div className="flex gap-2 mt-2">
                              <button disabled={busy} onClick={() => decide(r, "approve")} className="px-3 py-1.5 rounded-lg bg-green-600 text-white text-sm font-semibold disabled:opacity-50">{r.status === "failed" ? "Retry refund" : "Approve & refund"}</button>
                              <button disabled={busy} onClick={() => decide(r, "deny")} className="px-3 py-1.5 rounded-lg border border-red-500/40 text-red-500 text-sm disabled:opacity-50">Deny</button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>

            <Card title="Devices" aside={<span className="text-xs text-(--text-muted)">Active now: {data.devices.filter((d) => d.in_slot).length} of 2 · customer removals left: {data.self_removals.left} of 2{data.self_removals.resets_at ? ` (next on ${day(data.self_removals.resets_at)})` : ""}</span>}>
              {data.devices.length === 0 ? <p className="text-sm text-(--text-muted)">Never activated on any computer.</p> : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="text-left text-(--text-muted)"><tr><th className="py-1 pr-4">Computer</th><th className="pr-4">Activated</th><th className="pr-4">Last check-in</th><th className="pr-4">Version</th><th className="pr-4">Activated with</th><th className="pr-4">Now</th><th /></tr></thead>
                    <tbody>
                      {data.devices.map((d) => (
                        <tr key={d.machine_id} className="border-t border-(--card-border)">
                          <td className="py-2 pr-4">{d.name ?? "Unnamed"} <span className="font-mono text-xs text-(--text-muted)">{d.machine_id.slice(0, 8)}</span></td>
                          <td className="pr-4 whitespace-nowrap">{day(d.activated_at)}</td>
                          <td className="pr-4 whitespace-nowrap">{day(d.last_seen_at)}</td>
                          <td className="pr-4">{d.app_version ?? "≤1.5"}</td>
                          <td className="pr-4">{d.key ? `${d.key.source === "dotscramble" ? "Connect (browser)" : "key entered by hand"}${d.key.active ? "" : ", key revoked"}` : "—"}</td>
                          <td className="pr-4">{d.in_slot ? "active" : "removed"}</td>
                          <td className="text-right">
                            {isAdmin && d.in_slot && (
                              <button disabled={busy} onClick={() => removeDevice(d)} className="text-red-500 hover:underline disabled:opacity-50">Remove</button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>

            <Card title="Activity" aside={<span className="text-xs text-(--text-muted)">Last 90 days</span>}>
              {data.events.length === 0 ? <p className="text-sm text-(--text-muted)">No activity.</p> : (
                <ul className="text-sm space-y-1 max-h-80 overflow-y-auto">
                  {data.events.map((e, i) => (
                    <li key={i} className="flex gap-3"><span className="text-(--text-muted) whitespace-nowrap">{day(e.at)}</span><span className="font-mono text-xs pt-0.5">{e.event}</span><span className="text-(--text-muted) truncate" title={e.detail}>{e.detail}</span></li>
                  ))}
                </ul>
              )}
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
