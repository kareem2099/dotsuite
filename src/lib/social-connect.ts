import "server-only";
import { createCipheriv, createHash, createHmac, createPublicKey, diffieHellman, generateKeyPairSync, hkdfSync, randomBytes, timingSafeEqual } from "crypto";
import { EditorScheme, editorScheme } from "@/lib/extension-callback";

/**
 * Sign-in for the social accounts DotShare publishes to (LinkedIn and X).
 *
 * Everything runs on the server: the start route keeps the CSRF state and the PKCE
 * verifier in a signed, httpOnly cookie, and the callback exchanges the code here,
 * so client secrets never reach the browser and nothing depends on sessionStorage.
 * Tokens then go either to the user's editor or, from the dashboard, to their
 * DotSuite account for cloud scheduling.
 */

export type ConnectPlatform = "linkedin" | "x";
export type ConnectTarget = "editor" | "cloud" | "cli";

interface Provider {
  label: string;
  authorizeUrl: string;
  tokenUrl: string;
  scopes: string[];
  clientIdEnv: string;
  /** Confidential clients send a secret; X is a public client and uses PKCE instead. */
  clientSecretEnv?: string;
  pkce: boolean;
  /** Seconds to assume when the provider omits expires_in. */
  defaultExpiresIn: number;
}

export const PROVIDERS: Record<ConnectPlatform, Provider> = {
  linkedin: {
    label: "LinkedIn",
    authorizeUrl: "https://www.linkedin.com/oauth/v2/authorization",
    tokenUrl: "https://www.linkedin.com/oauth/v2/accessToken",
    // openid + profile identify the member for posting; w_member_social posts and comments.
    scopes: ["openid", "profile", "w_member_social"],
    clientIdEnv: "LINKEDIN_CLIENT_ID",
    clientSecretEnv: "LINKEDIN_CLIENT_SECRET",
    pkce: false,
    defaultExpiresIn: 60 * 24 * 60 * 60,
  },
  x: {
    label: "X",
    authorizeUrl: "https://x.com/i/oauth2/authorize",
    tokenUrl: "https://api.x.com/2/oauth2/token",
    // media.write lets DotShare upload images through the v2 media endpoint.
    scopes: ["tweet.read", "tweet.write", "users.read", "media.write", "offline.access"],
    clientIdEnv: "X_CLIENT_ID",
    pkce: true,
    defaultExpiresIn: 2 * 60 * 60,
  },
};

export function connectPlatform(value: string): ConnectPlatform | null {
  return value === "linkedin" || value === "x" ? value : null;
}

export function isConfigured(platform: ConnectPlatform): boolean {
  const provider = PROVIDERS[platform];
  return Boolean(process.env[provider.clientIdEnv] && (!provider.clientSecretEnv || process.env[provider.clientSecretEnv]));
}

/** The exact callback registered with each provider. */
export function redirectUri(platform: ConnectPlatform, requestOrigin: string): string {
  const base = (process.env.NEXTAUTH_URL || requestOrigin).replace(/\/+$/, "");
  return `${base}/api/connect/${platform}/callback`;
}

/** Only same-site paths, so the callback can't be turned into an open redirect. */
export function safeReturnPath(value: string | null | undefined, fallback: string): string {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.includes("\\")) return fallback;
  return value;
}

// ── Signed state cookie ─────────────────────────────────────────────────────

export interface ConnectState {
  platform: ConnectPlatform;
  state: string;
  verifier?: string;
  scheme: EditorScheme;
  target: ConnectTarget;
  returnTo: string;
  /** DotSuite user who started a cloud connection; the callback must match it. */
  userId?: string;
  /** The DotShare CLI waiting on a loopback port for an encrypted result. */
  cli?: CliRequest;
  expiresAt: number;
}

// ── CLI hand-off ────────────────────────────────────────────────────────────
//
// `dotshare-agent accounts connect` listens on 127.0.0.1 and sends its X25519
// public key and a nonce. Tokens go back to that port only as ciphertext that
// the waiting CLI process alone can decrypt, so they never appear in a URL or
// browser history in readable form. The nonce inside the ciphertext stops
// another site from delivering its own tokens to the CLI.

export interface CliRequest { port: number; key: string; nonce: string; }

const BASE64URL = /^[A-Za-z0-9_-]+$/;

/** Null unless the query carries a valid loopback port, X25519 key and nonce. */
export function cliRequest(query: URLSearchParams): CliRequest | null {
  const port = Number(query.get("port"));
  const key = query.get("key") ?? "";
  const nonce = query.get("nonce") ?? "";
  if (!Number.isInteger(port) || port < 1024 || port > 65535) return null;
  if (!BASE64URL.test(key) || Buffer.from(key, "base64url").length !== 32) return null;
  if (!BASE64URL.test(nonce) || nonce.length < 16 || nonce.length > 64) return null;
  return { port, key, nonce };
}

const CLI_INFO = Buffer.from("dotshare-connect-v1");

/** Loopback URL carrying `token` encrypted to the CLI's key (ECDH + HKDF + AES-256-GCM). */
export function cliRedirect(cli: CliRequest, platform: ConnectPlatform, token: TokenResult): string {
  const peer = createPublicKey({ key: { kty: "OKP", crv: "X25519", x: cli.key }, format: "jwk" });
  const own = generateKeyPairSync("x25519");
  const ownKey = Buffer.from(own.publicKey.export({ format: "jwk" }).x!, "base64url");
  const shared = diffieHellman({ privateKey: own.privateKey, publicKey: peer });
  const key = Buffer.from(hkdfSync("sha256", shared, Buffer.concat([ownKey, Buffer.from(cli.key, "base64url")]), CLI_INFO, 32));
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  cipher.setAAD(CLI_INFO);
  const body = Buffer.concat([cipher.update(JSON.stringify({ nonce: cli.nonce, platform, token })), cipher.final()]);
  const payload = Buffer.concat([ownKey, iv, cipher.getAuthTag(), body]).toString("base64url");
  return `http://127.0.0.1:${cli.port}/callback?${new URLSearchParams({ payload })}`;
}

/** Tells the waiting CLI the sign-in ended without tokens, so it can stop waiting. */
export function cliFailure(cli: CliRequest, reason: string): string {
  return `http://127.0.0.1:${cli.port}/callback?${new URLSearchParams({ error: reason.slice(0, 200), nonce: cli.nonce })}`;
}

const STATE_TTL_MS = 10 * 60 * 1000;
export const stateCookieName = (platform: ConnectPlatform): string => `ds_connect_${platform}`;
export const STATE_COOKIE_PATH = "/api/connect";
export const STATE_COOKIE_MAX_AGE = STATE_TTL_MS / 1000;

function signingKey(): string {
  const key = process.env.NEXTAUTH_SECRET;
  if (!key) throw new Error("Missing NEXTAUTH_SECRET environment variable");
  return key;
}

const sign = (payload: string): string => createHmac("sha256", signingKey()).update(`dotshare-connect|${payload}`).digest("base64url");

export function newConnectState(input: Omit<ConnectState, "state" | "verifier" | "expiresAt">): ConnectState {
  return {
    ...input,
    state: randomBytes(24).toString("base64url"),
    ...(PROVIDERS[input.platform].pkce && { verifier: randomBytes(48).toString("base64url") }),
    expiresAt: Date.now() + STATE_TTL_MS,
  };
}

export function sealState(state: ConnectState): string {
  const payload = Buffer.from(JSON.stringify(state)).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

/** Null when the cookie is missing, tampered with, expired or for another platform. */
export function openState(cookie: string | undefined, platform: ConnectPlatform): ConnectState | null {
  if (!cookie) return null;
  const [payload, signature] = cookie.split(".");
  if (!payload || !signature) return null;
  const expected = Buffer.from(sign(payload));
  const actual = Buffer.from(signature);
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) return null;
  try {
    const state = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as ConnectState;
    if (state.platform !== platform || state.expiresAt < Date.now()) return null;
    return { ...state, scheme: editorScheme(state.scheme) };
  } catch {
    return null;
  }
}

/** Constant-time comparison of the state echoed by the provider. */
export function sameState(expected: string, actual: string | null): boolean {
  if (!actual) return false;
  const a = Buffer.from(expected); const b = Buffer.from(actual);
  return a.length === b.length && timingSafeEqual(a, b);
}

// ── Provider calls ──────────────────────────────────────────────────────────

export function authorizeUrl(state: ConnectState, redirect: string): string {
  const provider = PROVIDERS[state.platform];
  const url = new URL(provider.authorizeUrl);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("client_id", process.env[provider.clientIdEnv]!);
  url.searchParams.set("redirect_uri", redirect);
  url.searchParams.set("scope", provider.scopes.join(" "));
  url.searchParams.set("state", state.state);
  if (state.verifier) {
    url.searchParams.set("code_challenge", createHash("sha256").update(state.verifier).digest("base64url"));
    url.searchParams.set("code_challenge_method", "S256");
  }
  return url.toString();
}

export interface TokenResult {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  /** Unix seconds; the extension refreshes or warns ahead of this. */
  expires_at: number;
  expires_at_iso: string;
  should_refresh_soon: boolean;
  scope?: string;
  warning?: string;
}

const REFRESH_SOON_WINDOW_SEC = 7 * 24 * 60 * 60;

function withExpiry(data: Record<string, unknown>, fallback: number): TokenResult {
  const expiresIn = Number(data.expires_in) > 0 ? Math.floor(Number(data.expires_in)) : fallback;
  const expiresAt = Math.floor(Date.now() / 1000) + expiresIn;
  return {
    access_token: String(data.access_token),
    ...(typeof data.refresh_token === "string" && { refresh_token: data.refresh_token }),
    ...(typeof data.scope === "string" && { scope: data.scope }),
    expires_in: expiresIn,
    expires_at: expiresAt,
    expires_at_iso: new Date(expiresAt * 1000).toISOString(),
    should_refresh_soon: expiresIn < REFRESH_SOON_WINDOW_SEC,
  };
}

/** A short, user-readable reason; provider responses never reach logs or pages verbatim. */
function providerError(data: Record<string, unknown>, fallback: string): string {
  const message = typeof data.error_description === "string" ? data.error_description : typeof data.error === "string" ? data.error : fallback;
  return message.slice(0, 200);
}

async function tokenRequest(platform: ConnectPlatform, params: Record<string, string>): Promise<Record<string, unknown>> {
  const provider = PROVIDERS[platform];
  const clientId = process.env[provider.clientIdEnv]!;
  const body = new URLSearchParams({ client_id: clientId, ...params });
  const headers: Record<string, string> = { "Content-Type": "application/x-www-form-urlencoded", Accept: "application/json" };
  if (provider.clientSecretEnv) body.set("client_secret", process.env[provider.clientSecretEnv]!);
  // X public clients authenticate with the client ID alone.
  else headers.Authorization = `Basic ${Buffer.from(`${clientId}:`).toString("base64")}`;

  const response = await fetch(provider.tokenUrl, { method: "POST", headers, body, redirect: "error", signal: AbortSignal.timeout(15000), cache: "no-store" });
  const data = (await response.json().catch(() => ({}))) as Record<string, unknown>;
  if (!response.ok || typeof data.access_token !== "string") {
    throw new Error(providerError(data, `${provider.label} did not issue a token (${response.status}).`));
  }
  return data;
}

export async function exchangeCode(state: ConnectState, code: string, redirect: string): Promise<TokenResult> {
  const data = await tokenRequest(state.platform, {
    grant_type: "authorization_code",
    code,
    redirect_uri: redirect,
    ...(state.verifier && { code_verifier: state.verifier }),
  });
  return withExpiry(data, PROVIDERS[state.platform].defaultExpiresIn);
}

/**
 * X refresh tokens rotate: the old one stops working as soon as X accepts this
 * request, so a response without a new one is reported instead of hidden.
 */
export async function refreshX(refreshToken: string): Promise<TokenResult> {
  const data = await tokenRequest("x", { grant_type: "refresh_token", refresh_token: refreshToken });
  const result = withExpiry(data, PROVIDERS.x.defaultExpiresIn);
  return result.refresh_token ? result : { ...result, warning: "refresh_token_missing_reauth_required" };
}

// ── Returning to the editor ─────────────────────────────────────────────────

/** The deep link the DotShare extension's URI handler reads (`/auth`). */
export function editorLink(platform: ConnectPlatform, scheme: EditorScheme, token: TokenResult): string {
  const params = new URLSearchParams({
    platform,
    access_token: token.access_token,
    ...(token.refresh_token && { refresh_token: token.refresh_token }),
    expires_in: String(token.expires_in),
    expires_at: String(token.expires_at),
    expires_at_iso: token.expires_at_iso,
    should_refresh_soon: String(token.should_refresh_soon),
    ...(token.warning && { warning: token.warning }),
  });
  return `${scheme}://freerave.dotshare/auth?${params.toString()}`;
}

const EDITOR_NAMES: Record<EditorScheme, string> = {
  vscode: "VS Code", "vscode-insiders": "VS Code Insiders", vscodium: "VSCodium", "code-oss": "Code - OSS",
  cursor: "Cursor", windsurf: "Windsurf", kiro: "Kiro", trae: "Trae", positron: "Positron",
};

const escapeHtml = (value: string): string => value.replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]!);

/**
 * A small self-contained page: it opens the editor automatically and offers a
 * button in case the browser asks first. The token lives only in this response,
 * never in a dotsuite.dev URL, and the page is never cached or referred.
 */
export function resultPage(input: { ok: true; platform: ConnectPlatform; scheme: EditorScheme; link: string } | { ok: false; title: string; message: string; retry?: string }): string {
  const editor = input.ok ? EDITOR_NAMES[input.scheme] : "";
  const title = input.ok ? `${PROVIDERS[input.platform].label} connected` : input.title;
  const body = input.ok
    ? `<p>Returning to ${escapeHtml(editor)}. If nothing happens, use the button below.</p>
       <a class="button" href="${escapeHtml(input.link)}">Open ${escapeHtml(editor)}</a>
       <p class="hint">You can close this tab afterwards.</p>`
    : `<p>${escapeHtml(input.message)}</p>${input.retry ? `<a class="button" href="${escapeHtml(input.retry)}">Try again</a>` : ""}`;
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="referrer" content="no-referrer">
${input.ok ? `<meta http-equiv="refresh" content="0;url=${escapeHtml(input.link)}">` : ""}
<title>${escapeHtml(title)} · DotSuite</title>
<style>
  :root { color-scheme: dark light; --bg:#0a0a0a; --card:#141414; --text:#f4f4f5; --muted:#a1a1aa; --accent:#6366f1; --ok:#22c55e; --bad:#ef4444; }
  @media (prefers-color-scheme: light) { :root { --bg:#fafafa; --card:#fff; --text:#18181b; --muted:#52525b; } }
  * { box-sizing: border-box; }
  body { margin:0; min-height:100vh; display:grid; place-items:center; background:var(--bg); color:var(--text); font:16px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif; padding:16px; }
  main { width:100%; max-width:420px; background:var(--card); border:1px solid rgba(127,127,127,.25); border-radius:16px; padding:32px; text-align:center; }
  .icon { width:48px; height:48px; margin:0 auto 16px; border-radius:50%; display:grid; place-items:center; font-size:24px; color:#fff; background:${input.ok ? "var(--ok)" : "var(--bad)"}; }
  h1 { font-size:20px; margin:0 0 8px; } p { color:var(--muted); margin:0 0 20px; }
  .button { display:inline-block; background:var(--accent); color:#fff; text-decoration:none; padding:10px 20px; border-radius:10px; font-weight:600; }
  .hint { font-size:14px; margin:16px 0 0; } .brand { margin-top:24px; font-size:13px; color:var(--muted); }
</style></head>
<body><main>
  <div class="icon" aria-hidden="true">${input.ok ? "✓" : "!"}</div>
  <h1>${escapeHtml(title)}</h1>
  ${body}
  <div class="brand">DotShare · DotSuite</div>
</main></body></html>`;
}

export const PAGE_HEADERS = {
  "Content-Type": "text/html; charset=utf-8",
  "Cache-Control": "no-store",
  "Referrer-Policy": "no-referrer",
  "X-Content-Type-Options": "nosniff",
};
