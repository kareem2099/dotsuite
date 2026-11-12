/**
 * GET /api/connect/health — which sign-ins DotShare can offer right now.
 * The extension checks this before enabling its LinkedIn and X buttons.
 */

import { NextResponse } from "next/server";
import { isConfigured } from "@/lib/social-connect";

export const dynamic = "force-dynamic";

export function GET() {
  const platforms = { linkedin: isConfigured("linkedin"), x: isConfigured("x") };
  return NextResponse.json(
    { ok: true, platforms },
    { headers: { "Cache-Control": "no-store", "Access-Control-Allow-Origin": "*" } },
  );
}
