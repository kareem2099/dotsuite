"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

/** Dashboard card for admin and support: customers, evidence and refund requests. */
export default function StaffLink({ locale }: { locale: string }) {
  const [role, setRole] = useState<string | null>(null);
  useEffect(() => {
    fetch("/api/admin/me", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : { role: null }))
      .then((d) => setRole(d.role ?? null))
      .catch(() => setRole(null));
  }, []);
  if (!role) return null;
  return (
    <Link
      href={`/${locale}/dashboard/admin/customers`}
      className="p-6 bg-(--card-bg) border border-(--card-border) rounded-xl hover:border-(--primary)/50 transition-colors group"
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-(--primary)/10 flex items-center justify-center group-hover:bg-(--primary)/20 transition-colors">
          <svg className="w-6 h-6 text-(--primary)" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <div>
          <h3 className="font-semibold">Customers &amp; refunds</h3>
          <p className="text-sm text-(--text-muted)">{role === "admin" ? "Support, evidence and refunds" : "Support (view only)"}</p>
        </div>
      </div>
    </Link>
  );
}
