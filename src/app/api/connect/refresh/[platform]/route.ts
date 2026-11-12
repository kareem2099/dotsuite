/**
 * POST /api/connect/refresh/x   body: { "refreshToken": "..." }
 *
 * Swaps an X refresh token for a new access token (X access tokens last two
 * hours). LinkedIn issues no refresh tokens to DotShare, so only X is accepted.
 */

import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, getClientIP } from "@/lib/rateLimit";
import { isConfigured, refreshX, xServerOnly } from "@/lib/social-connect";

type Context = { params: Promise<{ platform: string }> };

const NO_STORE = { "Cache-Control": "no-store" };

export async function POST(req: NextRequest, { params }: Context) {
  if ((await params).platform !== "x") {
    return NextResponse.json({ error: "Only X tokens can be refreshed." }, { status: 404, headers: NO_STORE });
  }
  if (xServerOnly()) {
    // X tokens now stay on DotSuite, which posts and refreshes them itself.
    return NextResponse.json({ error: "X posting now goes through your DotSuite account. Update DotShare and connect X again.", reauth_required: true }, { status: 410, headers: NO_STORE });
  }
  if (!isConfigured("x")) {
    return NextResponse.json({ error: "X sign-in isn't set up on the server." }, { status: 503, headers: NO_STORE });
  }

  const limit = await checkRateLimit(getClientIP(req.headers), "connect:refresh:x", 60, 3600);
  if (!limit.success) {
    return NextResponse.json({ error: "Too many refresh attempts.", retry_after: limit.resetIn }, { status: 429, headers: { ...NO_STORE, "Retry-After": String(limit.resetIn) } });
  }

  const body = (await req.json().catch(() => null)) as { refreshToken?: unknown; refresh_token?: unknown } | null;
  const refreshToken = body?.refreshToken ?? body?.refresh_token;
  if (typeof refreshToken !== "string" || !refreshToken || refreshToken.length > 4096) {
    return NextResponse.json({ error: "refreshToken is required." }, { status: 400, headers: NO_STORE });
  }

  try {
    return NextResponse.json(await refreshX(refreshToken), { headers: NO_STORE });
  } catch (error) {
    // X rejects a used or revoked refresh token with 400; the user has to sign in again.
    const message = error instanceof Error ? error.message : "Refresh failed.";
    return NextResponse.json({ error: message, reauth_required: true }, { status: 401, headers: NO_STORE });
  }
}
