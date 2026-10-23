"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function BillingCompletePage() {
  const { locale } = useParams<{ locale: string }>();
  const [status, setStatus] = useState<"pending" | "active" | "delayed">("pending");
  const [product, setProduct] = useState("dotshare");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const expectedTier = query.get("tier");
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;
    let checks = 0;

    async function check() {
      try {
        const res = await fetch("/api/billing/status", { cache: "no-store" });
        const billing = res.ok ? await res.json() : null;
        if (cancelled) return;
        setProduct(query.get("product") === "dotscramble" ? "dotscramble" : "dotshare");
        // The redirect itself never grants access; wait for the signed webhook.
        const productName = query.get("product") === "dotscramble" ? "dotscramble" : "dotshare";
        const access = billing?.products?.[productName];
        const confirmed = query.get("payment_type") === "one_time"
          ? !!access?.one_time_order_id && access.one_time_ends_at > Date.now()
          : !!access?.subscription_id && access.tier === expectedTier;
        if (confirmed) {
          setStatus("active");
          return;
        }
      } catch { /* Retry temporary network failures within the polling window. */ }
      if (cancelled) return;
      if (++checks >= 20) setStatus("delayed");
      else timer = setTimeout(check, 3000);
    }

    void check();
    return () => { cancelled = true; clearTimeout(timer); };
  }, [attempt]);

  return (
    <main className="max-w-xl mx-auto px-6 py-20 text-center space-y-6">
      <h1 className="text-3xl font-bold">
        {status === "active" ? "Your plan is active" : "Confirming your payment"}
      </h1>
      <p className="text-(--text-muted)" role="status">
        {status === "active"
          ? "Your account has been updated. You can now use your paid features."
          : status === "delayed"
            ? "Confirmation is taking longer than expected. Check again shortly or contact support. Please avoid purchasing again."
            : "Waiting for payment confirmation. This usually takes a few seconds."}
      </p>
      {status === "delayed" && (
        <button className="underline" onClick={() => { setStatus("pending"); setAttempt((value) => value + 1); }}>Check again</button>
      )}
      <Link className="block underline" href={`/${locale}/dashboard/${product}`}>Go to dashboard</Link>
    </main>
  );
}
