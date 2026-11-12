/**
 * GET /api/x/usage — the signed-in user's X budget for this month: plan budget,
 * spent, reserved, remaining, today's posts, current prices and the last 20
 * charges (estimate, what X actually deducted when measured, and the charge).
 */

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { rustInternal } from "@/lib/rust-api";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const res = await rustInternal("/internal/x/usage", { method: "GET" }, session.user.id).catch(() => null);
  if (!res?.ok) return NextResponse.json({ error: "X usage is unavailable right now." }, { status: 502 });
  return NextResponse.json(await res.json(), { headers: { "Cache-Control": "no-store" } });
}
