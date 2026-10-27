"use client";

export type BillingAccess = {
  tier: string; payment_type: "subscription" | "one_time" | "owner" | null;
  subscription_id: string | null; ends_at: number | null; renews_at: number | null; one_time_ends_at: number | null;
};

export type ManagedSubscription = {
  status: string; cancelled: boolean; ends_at: number | null; renews_at: number | null;
  can_cancel: boolean; can_resume: boolean; payment_method_url: string | null;
  current_access?: BillingAccess; has_paid_access?: boolean; current_period_refunded?: boolean;
  last_payment: {
    amount_cents: number; currency: string; paid_at: string | null;
    refunded_amount_cents?: number; fully_refunded?: boolean;
  } | null;
};

export default function SubscriptionDetails({ subscription, locale, busy, onChange, onRefresh }: {
  subscription: ManagedSubscription; locale: string; busy: boolean;
  onChange: (action: "cancel" | "resume") => void; onRefresh: () => void;
}) {
  const date = (value: number) => new Date(value).toLocaleDateString(locale, { year: "numeric", month: "short", day: "numeric" });
  const payment = subscription.last_payment;
  const money = (value: number) => new Intl.NumberFormat(locale, { style: "currency", currency: payment?.currency ?? "USD" }).format(value / 100);
  const refunded = subscription.current_period_refunded === true;
  return <>
    <p><strong>{subscription.cancelled ? "Automatic renewal stopped" : subscription.status === "active" ? "Subscription active" : `Subscription status: ${subscription.status}`}</strong></p>
    {refunded ? <p role="status">The payment covering this subscription period was fully refunded. This subscription no longer grants paid access. Start a new purchase to get a new paid period.</p>
      : subscription.has_paid_access && subscription.ends_at ? <p>Your paid access remains available until <strong>{date(subscription.ends_at)}</strong>. No automatic renewal is scheduled.</p>
        : !subscription.has_paid_access && <p>This subscription does not currently grant paid access.</p>}
    {!subscription.cancelled && subscription.renews_at && <p>Next renewal: <strong>{date(subscription.renews_at)}</strong>.</p>}
    {payment && <div className="space-y-2">
      <p>Last payment: <strong>{money(payment.amount_cents)}</strong> including applicable tax{payment.paid_at ? ` · ${date(Date.parse(payment.paid_at))}` : ""}.</p>
      {(payment.fully_refunded || (payment.refunded_amount_cents ?? 0) > 0) && <p>
        {payment.fully_refunded ? "Fully refunded" : "Partially refunded"}: <strong>{money(payment.refunded_amount_cents || (payment.fully_refunded ? payment.amount_cents : 0))}</strong>.
      </p>}
    </div>}
    <div className="flex flex-wrap gap-4">
      {subscription.can_cancel && <button type="button" disabled={busy} onClick={() => onChange("cancel")} className="border rounded-lg px-4 py-3">Cancel automatic renewal</button>}
      {subscription.can_resume && subscription.has_paid_access && !refunded && <button type="button" disabled={busy} onClick={() => onChange("resume")} className="border rounded-lg px-4 py-3">Resume subscription</button>}
      <button type="button" disabled={busy} onClick={onRefresh} className="underline">Refresh status</button>
      {subscription.payment_method_url && <a href={subscription.payment_method_url} target="_blank" rel="noopener noreferrer" className="underline">Update payment details on Lemon Squeezy ↗</a>}
    </div>
  </>;
}
