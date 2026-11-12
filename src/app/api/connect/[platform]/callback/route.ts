/**
 * GET /api/connect/{linkedin|x}/callback
 *
 * Where LinkedIn and X send the user back. Verifies the signed state cookie,
 * exchanges the code on the server, then hands the tokens to the editor (a page
 * that opens `<scheme>://freerave.dotshare/auth?...`), to the waiting CLI
 * (encrypted, on 127.0.0.1), or saves them to the signed-in DotSuite account.
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { rustInternal } from "@/lib/rust-api";
import {
  ConnectPlatform, PAGE_HEADERS, PROVIDERS, STATE_COOKIE_PATH, cliFailure, cliRedirect, connectPlatform, editorLink,
  exchangeCode, openState, redirectUri, resultPage, sameState, stateCookieName,
} from "@/lib/social-connect";

type Context = { params: Promise<{ platform: string }> };

function page(html: string, status: number, platform?: ConnectPlatform) {
  const response = new NextResponse(html, { status, headers: PAGE_HEADERS });
  // The state is single-use, whatever the outcome.
  if (platform) response.cookies.set(stateCookieName(platform), "", { path: STATE_COOKIE_PATH, maxAge: 0 });
  return response;
}

function failure(platform: ConnectPlatform, message: string, status: number, retry?: string) {
  return page(resultPage({ ok: false, title: `${PROVIDERS[platform].label} wasn't connected`, message, retry }), status, platform);
}

/** Back to the waiting CLI; the loopback page there tells the user what happened. */
function toCli(location: string, platform: ConnectPlatform) {
  const response = NextResponse.redirect(location, 303);
  response.headers.set("Cache-Control", "no-store");
  response.headers.set("Referrer-Policy", "no-referrer");
  response.cookies.set(stateCookieName(platform), "", { path: STATE_COOKIE_PATH, maxAge: 0 });
  return response;
}

/** Back to the dashboard with a status the page can show, clearing the state cookie. */
function backTo(req: NextRequest, path: string, platform: ConnectPlatform, status: "connected" | "error", reason?: string) {
  const url = new URL(path, req.url);
  url.searchParams.set(status, platform);
  if (reason) url.searchParams.set("reason", reason);
  const response = NextResponse.redirect(url);
  response.cookies.set(stateCookieName(platform), "", { path: STATE_COOKIE_PATH, maxAge: 0 });
  return response;
}

export async function GET(req: NextRequest, { params }: Context) {
  const platform = connectPlatform((await params).platform);
  if (!platform) return page(resultPage({ ok: false, title: "Unknown platform", message: "This sign-in link isn't valid." }), 404);

  const query = req.nextUrl.searchParams;
  const state = openState(req.cookies.get(stateCookieName(platform))?.value, platform);
  if (!state) {
    return failure(platform, "This sign-in expired or was started in another browser. Start again from DotShare.", 400);
  }
  if (!sameState(state.state, query.get("state"))) {
    return failure(platform, "The sign-in didn't match the one started here, so it was stopped for your safety. Please start again.", 400);
  }

  const retry = `/api/connect/${platform}?${new URLSearchParams({ scheme: state.scheme, target: state.target, returnTo: state.returnTo })}`;
  const denied = query.get("error");
  if (denied) {
    const message = denied === "access_denied" || denied === "user_cancelled_authorize" || denied === "user_cancelled_login"
      ? "You cancelled the sign-in. Nothing was changed."
      : `${PROVIDERS[platform].label} returned an error: ${(query.get("error_description") || denied).slice(0, 200)}`;
    if (state.cli) return toCli(cliFailure(state.cli, message), platform);
    return state.target === "cloud" ? backTo(req, state.returnTo, platform, "error", "cancelled") : failure(platform, message, 400, retry);
  }

  const code = query.get("code");
  if (!code) {
    const message = `${PROVIDERS[platform].label} didn't return a sign-in code.`;
    return state.cli ? toCli(cliFailure(state.cli, message), platform) : failure(platform, message, 400, retry);
  }

  let token;
  try {
    token = await exchangeCode(state, code, redirectUri(platform, req.nextUrl.origin));
  } catch (error) {
    const message = error instanceof Error ? error.message : "The token exchange failed.";
    console.error(`[connect] ${platform} token exchange failed: ${message}`);
    if (state.cli) return toCli(cliFailure(state.cli, message), platform);
    return state.target === "cloud" ? backTo(req, state.returnTo, platform, "error", "exchange") : failure(platform, message, 502, retry);
  }

  if (state.target === "cli" && state.cli) return toCli(cliRedirect(state.cli, platform, token), platform);

  if (state.target === "editor") {
    return page(resultPage({ ok: true, platform, scheme: state.scheme, link: editorLink(platform, state.scheme, token) }), 200, platform);
  }

  // Cloud: only the DotSuite user who started this connection can receive it.
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.id !== state.userId) {
    return failure(platform, "You were signed out of DotSuite, or switched accounts, during the sign-in. Sign in and connect again.", 401);
  }

  const saved = await rustInternal("/internal/oauth/save", {
    method: "POST",
    body: JSON.stringify({
      platform,
      access_token: token.access_token,
      ...(token.refresh_token && { refresh_token: token.refresh_token }),
      expires_in: token.expires_in,
    }),
  }, session.user.id).catch(() => null);

  if (!saved?.ok) {
    console.error(`[connect] saving ${platform} for cloud failed: ${saved?.status ?? "unreachable"}`);
    return backTo(req, state.returnTo, platform, "error", "save");
  }
  return backTo(req, state.returnTo, platform, "connected");
}
