"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export type StaffRole = "admin" | "support";

/** The signed-in user's staff role; sends anyone else back to the dashboard. */
export function useStaffRole() {
  const router = useRouter();
  const [role, setRole] = useState<StaffRole | null | undefined>(undefined);
  useEffect(() => {
    fetch("/api/admin/me", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : { role: null }))
      .then((data) => {
        setRole(data.role ?? null);
        if (!data.role) router.replace("/dashboard");
      })
      .catch(() => router.replace("/dashboard"));
  }, [router]);
  return role;
}

export const money = (cents: number) => `$${(cents / 100).toFixed(2)}`;
export const day = (iso: string | null | undefined) =>
  iso ? new Date(iso).toLocaleString(undefined, { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "—";
