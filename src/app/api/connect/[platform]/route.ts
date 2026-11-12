/**
 * GET /api/connect/{linkedin|x}
 *
 * Starts a social sign-in for DotShare. Query:
 *   scheme   — the editor to return to (`vscode`, `cursor`, ...); unknown values become `vscode`
 *   target   — `editor` (default: tokens go back to the extension), `cloud`
 *              (tokens are saved to the signed-in DotSuite account for scheduling)
 *              or `cli` (tokens go, encrypted, to `dotshare-agent accounts connect`
 *              listening on 127.0.0.1; needs `port`, `key` and `nonce`)
 *   returnTo — same-site path to land on after a cloud connection
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { checkRateLimit, getClientIP } from "@/lib/rateLimit";
import { editorScheme } from "@/lib/extension-callback";
import {
  ConnectTarget, PAGE_HEADERS, PROVIDERS, STATE_COOKIE_MAX_AGE, STATE_COOKIE_PATH,
  authorizeUrl, cliRequest, connectPlatform, isConfigured, newConnectState, redirectUri, resultPage,
  safeReturnPath, sealState, stateCookieName,
} from "@/lib/social-connect";

type Context = { params: Promise<{ platform: string }> };

const DEFAULT_RETURN = "/en/dashboard/dotshare";

function errorPage(title: string, message: string, status: number) {
  return new NextResponse(resultPage({ ok: false, title, message }), { status, headers: PAGE_HEADERS });
}

export async function GET(req: NextRequest, { params }: Context) {
  const platform = connectPlatform((await params).platform);
  if (!platform) return errorPage("Unknown platform", "DotShare can connect LinkedIn and X here.", 404);
  if (!isConfigured(platform)) {
    return errorPage(`${PROVIDERS[platform].label} isn't available`, "Sign-in for this platform isn't set up on the server yet. Please try again later.", 503);
  }

  const limit = await checkRateLimit(getClientIP(req.headers), `connect:${platform}`, 20, 600);
  if (!limit.success) {
    return errorPage("Too many attempts", `Please wait ${Math.ceil(limit.resetIn / 60)} minute(s) and try again.`, 429);
  }

  const query = req.nextUrl.searchParams;
  const requested = query.get("target");
  const target: ConnectTarget = requested === "cloud" || requested === "cli" ? requested : "editor";
  const cli = target === "cli" ? cliRequest(query) : null;
  if (target === "cli" && !cli) {
    return errorPage("Invalid sign-in link", "Start the sign-in again from your terminal with dotshare-agent accounts connect.", 400);
  }
  const returnTo = safeReturnPath(query.get("returnTo"), DEFAULT_RETURN);

  let userId: string | undefined;
  if (target === "cloud") {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      const locale = returnTo.split("/")[1] || "en";
      return NextResponse.redirect(new URL(`/${locale}/login`, req.url));
    }
    userId = session.user.id;
  }

  const state = newConnectState({ platform, scheme: editorScheme(query.get("scheme")), target, returnTo, userId, ...(cli && { cli }) });
  const response = NextResponse.redirect(authorizeUrl(state, redirectUri(platform, req.nextUrl.origin)));
  response.headers.set("Cache-Control", "no-store");
  response.cookies.set(stateCookieName(platform), sealState(state), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    // Lax still sends the cookie on the provider's top-level redirect back.
    sameSite: "lax",
    path: STATE_COOKIE_PATH,
    maxAge: STATE_COOKIE_MAX_AGE,
  });
  return response;
}
