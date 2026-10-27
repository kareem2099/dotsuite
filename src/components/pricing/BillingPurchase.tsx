"use client";
import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import SubscriptionDetails, { type BillingAccess as Access, type ManagedSubscription as Subscription } from "./SubscriptionDetails";

type PaymentType = "subscription" | "one_time";
type Cycle = "monthly" | "annually";
type Plan = { product: string; tier: string; cycle: Cycle; payment_type: PaymentType; price_cents: number };
type Pending = { plan: Plan; starts_at: number; ready: boolean };

export default function BillingPurchase({ product }: { product: "dotshare" | "dotscramble" }) {
  const { locale } = useParams<{ locale: string }>();
  const [kind, setKind] = useState<PaymentType>("subscription");
  const [cycle, setCycle] = useState<Cycle>("monthly");
  const [plans, setPlans] = useState<Plan[]>([]);
  const [access, setAccess] = useState<Access | null>(null);
  const [pending, setPending] = useState<Pending | null>(null);
  const [now, setNow] = useState(0);
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [managing, setManaging] = useState(false);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [confirmation, setConfirmation] = useState<"cancel" | "resume" | null>(null);
  const [managementMessage, setManagementMessage] = useState("");
  const [hasSubscription, setHasSubscription] = useState(false);
  const managementRef = useRef<HTMLElement>(null);
  const title = product === "dotshare" ? "DotShare" : "DotScramble";
  const date = (value: number) => new Date(value).toLocaleDateString(locale, { year: "numeric", month: "short", day: "numeric" });

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      fetch("/api/billing/plans", { cache: "no-store" }).then(r => { if (!r.ok) throw Error("Unable to load billing plans"); return r.json(); }),
      fetch("/api/billing/status", { cache: "no-store" }).then(r => { if (!r.ok) throw Error("Unable to load account billing"); return r.json(); }),
    ]).then(([catalog, billing]) => {
      if (cancelled) return;
      setNow(Date.now());
      setPlans(catalog);
      setAccess(billing.products?.[product] ?? null);
      setHasSubscription(billing.managed_products?.includes(product) ?? !!billing.products?.[product]?.subscription_id);
      const change = billing.pending_changes?.[product];
      if (change?.ready && billing.products?.[product]?.payment_type !== change.plan.payment_type) {
        setPending(change); setKind(change.plan.payment_type); setCycle(change.plan.cycle);
      }
      setReady(true);
    }).catch(error => { if (!cancelled) setMessage(error.message); });
    return () => { cancelled = true; };
  }, [product]);

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (managing) managementRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [managing]);

  const owner = access?.payment_type === "owner";
  const switching = !owner && !!access?.payment_type && access.payment_type !== kind;
  const boundary = Math.max(access?.ends_at ?? 0, access?.renews_at ?? 0, access?.one_time_ends_at ?? 0);
  const deferred = switching && boundary > now;
  const portal = kind === "subscription" && !switching && !!access?.subscription_id;
  const manage = async (action?: "cancel" | "resume") => {
    setManaging(true); setBusy(true); setManagementMessage("");
    try {
      const response = await fetch(action ? "/api/billing/subscription" : `/api/billing/subscription?product=${product}`, action ? {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ product, action }),
      } : { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw Error(data.error || "Unable to manage subscription");
      setSubscription(data); setConfirmation(null);
      // Historical subscription dates are not the account's current entitlement.
      if (data.current_access) setAccess(data.current_access);
      else {
        const status = await fetch("/api/billing/status", { cache: "no-store" });
        if (!status.ok) throw Error("Unable to refresh current paid access. Please refresh this page.");
        const billing = await status.json();
        setAccess(billing.products?.[product] ?? null);
      }
      if (action === "resume") setPending(null);
      if (action) setManagementMessage(action === "cancel" ? "Automatic renewal is stopped." : "Your subscription has resumed. Automatic renewal is enabled again.");
    } catch (error) { setManagementMessage(error instanceof Error ? error.message : "Unable to manage subscription"); }
    finally { setBusy(false); }
  };
  const purchase = async (tier: string) => {
    if (portal) { await manage(); return; }
    setBusy(true); setMessage("");
    try {
      const response = await fetch("/api/billing/checkout", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product, tier, cycle, payment_type: kind, locale }),
      });
      const data = await response.json();
      if (!response.ok) throw Error(data.error || "Unable to start checkout");
      if (data.scheduled) {
        setPending({ plan: { product, tier, cycle, payment_type: kind, price_cents: 0 }, starts_at: data.starts_at, ready: true });
        setMessage(`Switch saved for ${date(data.starts_at)}. Your current access remains available. Return then to complete payment; saving this choice does not charge you.`);
      } else {
        window.location.assign(data.checkout_url);
      }
    } catch (error) { setMessage(error instanceof Error ? error.message : "Please try again."); }
    finally { setBusy(false); }
  };

  return <main className="max-w-4xl mx-auto px-6 py-12 space-y-8">
    <Link className="underline text-sm" href={`/${locale}/dashboard/${product}`}>← Back to {title}</Link>
    <div><h1 className="text-3xl font-bold mb-3">{title} billing</h1>{!owner && <p>Choose automatic renewal or pay once for a fixed period.</p>}</div>
    {owner && <section aria-label="Owner access" className="rounded-xl border p-6 space-y-3">
      <h2 className="text-xl font-semibold">{locale === "ar" ? "وصول المالك — بدون تجديد أو فواتير" : "Owner access — no renewal or invoices"}</h2>
      <p>{locale === "ar" ? `حسابك لديه وصول ${title} Max كمالك، بدون تاريخ انتهاء أو دفع مطلوب.` : `Your account has ${title} Max owner access, with no expiry or payment required.`}</p>
    </section>}
    {access && !owner && <p className="text-sm">Current access: <strong>{access.tier}</strong>{access.payment_type ? ` · ${access.payment_type === "one_time" ? "One-time payment" : access.ends_at ? "Subscription · renewal stopped" : "Auto-renewing subscription"}` : ""}{access.ends_at ? ` · access until ${date(access.ends_at)}` : ""}</p>}
    {managing && <section ref={managementRef} aria-label="Subscription management" className="rounded-xl border p-6 space-y-4">
      <div className="flex justify-between gap-4"><h2 className="text-xl font-semibold">Manage {title} subscription</h2><button type="button" onClick={() => { setManaging(false); setConfirmation(null); }} className="underline text-sm">Close</button></div>
      {busy && <p role="status">Updating subscription…</p>}
      {subscription && <SubscriptionDetails subscription={subscription} locale={locale} busy={busy} onChange={setConfirmation} onRefresh={() => manage()} />}
      {confirmation && <div role="group" aria-label="Confirm subscription change" className="rounded-lg border p-4 space-y-3">
        <p>{confirmation === "cancel" ? "Stop future automatic payments? Your current paid access will remain until its end date." : "Resume automatic renewal for this subscription? Future payments will follow your existing subscription agreement."}</p>
        <div className="flex gap-4"><button type="button" disabled={busy} onClick={() => manage(confirmation)} className="border rounded-lg px-4 py-2">{confirmation === "cancel" ? "Confirm cancellation" : "Confirm resume"}</button><button type="button" disabled={busy} onClick={() => setConfirmation(null)} className="underline">Keep current settings</button></div>
      </div>}
      {managementMessage && <p role="status">{managementMessage}</p>}
    </section>}
    {hasSubscription && !portal && <button type="button" disabled={busy} onClick={() => manage()} className="underline">Manage existing subscription</button>}
    {!owner && <>
    {pending && <p role="status" className="rounded-xl border p-4">Next payment type: {pending.plan.payment_type === "one_time" ? "one-time" : "auto-renewing"}, {pending.plan.cycle === "monthly" ? "1 month" : "1 year"}. {pending.starts_at > now ? `Available from ${date(pending.starts_at)}.` : "Ready for checkout now."} Complete payment to activate it.</p>}
    <fieldset className="flex flex-wrap gap-3"><legend className="font-semibold mb-2">Payment type</legend>
      {(["subscription", "one_time"] as const).map(value => <button key={value} type="button" aria-pressed={kind === value} onClick={() => setKind(value)} className={`px-4 py-3 rounded-lg border ${kind === value ? "border-(--primary) bg-(--primary)/10" : ""}`}>{value === "subscription" ? "Auto-renewing subscription" : "Pay once"}</button>)}
    </fieldset>
    <fieldset className="flex gap-3"><legend className="font-semibold mb-2">Access period</legend>
      {(["monthly", "annually"] as const).map(value => <button key={value} type="button" aria-pressed={cycle === value} onClick={() => setCycle(value)} className={`px-4 py-3 rounded-lg border ${cycle === value ? "border-(--primary) bg-(--primary)/10" : ""}`}>{value === "monthly" ? "1 month" : "1 year"}</button>)}
    </fieldset>
    <p className="text-sm">{kind === "one_time" ? "One payment for the selected period. No automatic renewal. You can buy another period later." : portal ? access?.ends_at ? "Renewal is stopped for your current subscription. Use Manage subscription to resume before paid access ends." : "Manage your current subscription here, including cancellation and renewal status." : `Renews automatically every ${cycle === "monthly" ? "month" : "year"}. You can stop renewal from this page.`}</p>
    {deferred && <p className="border rounded-xl p-4">Your paid period is preserved until {date(boundary)}. Switching stops the current automatic renewal, if any. Complete a new checkout after that date to start the selected payment type.</p>}
    <div className="grid sm:grid-cols-2 gap-6">{(product === "dotshare" ? ["pro", "max"] : ["max"]).map(tier => {
      const plan = plans.find(p => p.product === product && p.tier === tier && p.cycle === cycle && p.payment_type === kind);
      return <section key={tier} className="border rounded-xl p-6 space-y-5">
        <h2 className="text-xl font-bold capitalize">{tier}</h2>
        <p className="text-3xl font-bold">{plan ? `$${plan.price_cents / 100}` : ready ? "Unavailable" : "Loading…"}<span className="text-sm font-normal"> {kind === "one_time" ? "once" : cycle === "monthly" ? "/ month" : "/ year"}</span></p>
        {portal && <p className="text-xs">Catalog price for new purchases. Manage your subscription to view your actual payment and renewal status.</p>}
        <p className="text-sm">{product === "dotshare" ? tier === "pro" ? "Unlimited posts and images, video, and priority scheduling." : "Unlimited publishing, instant scheduling, and bring-your-own-key support." : "Premium privacy tools, batch processing, and up to 2 devices."}</p>
        <button type="button" disabled={!ready || !plan || busy} onClick={() => purchase(tier)} className="w-full px-4 py-3 rounded-lg bg-(--primary) text-(--primary-text) disabled:opacity-50">{busy ? "Please wait…" : portal ? "Manage subscription" : deferred ? "Schedule switch after current period" : kind === "one_time" ? "Pay once" : "Start subscription"}</button>
      </section>;
    })}</div>
    </>}
    {message && <p role="status" className="rounded-xl border p-4">{message}</p>}
    <p className="text-xs">Payments and refunds are processed by Lemon Squeezy. DotShare and DotScramble purchases grant access to their respective products.</p>
  </main>;
}
