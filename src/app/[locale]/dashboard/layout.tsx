import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

// ── Ban Check ─────────────────────────────────────────────────────────────────
//
// This Server Component runs on every dashboard page load.
// It calls the Rust backend's lightweight ban-status endpoint.
// On ban → redirects to /banned.
// On any network error → fail-open (never block legitimate users due to infra issues).

async function checkBanStatus(userId: string): Promise<boolean> {
  const coreUrl  = process.env.CORE_API_URL;
  const secret   = process.env.INTERNAL_SECRET;

  if (!coreUrl || !secret || !userId) return false;

  try {
    const res = await fetch(
      `${coreUrl}/v1/admin/users/${userId}/ban-status`,
      {
        method: "GET",
        headers: {
          "X-Internal-Secret": secret,
          "X-User-Id": userId,
        },
        // Short timeout — never block a page load for more than 2s
        signal: AbortSignal.timeout(2000),
        // Don't cache — always fresh (ban must take effect immediately)
        cache: "no-store",
      }
    );

    // 403 with banned:true → user is banned
    if (res.status === 403) {
      try {
        const data = await res.json() as { banned?: boolean };
        return data.banned === true;
      } catch {
        return false;
      }
    }

    return false;
  } catch {
    // Network error / timeout → fail-open (allow access)
    return false;
  }
}

// ── Layout ────────────────────────────────────────────────────────────────────

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Session is guaranteed by middleware (unauthenticated users are redirected)
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect(`/${locale}/login`);
  }

  // ── Ban check ─────────────────────────────────────────────────────────────
  const isBanned = await checkBanStatus(session.user.id);
  if (isBanned) {
    redirect(`/${locale}/banned`);
  }

  // No wrapper markup — each dashboard page owns its own layout
  return <>{children}</>;
}
