import { withAuth } from "next-auth/middleware";
import createIntlMiddleware from "next-intl/middleware";
import { NextRequest } from "next/server";
import { routing } from "./i18n/routing";

// 1. Public pages that don't require login (exact match only — no wildcards)
const publicPages = [
  "/",
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
  "/resend-verification",
  "/about",
  "/contact",
  "/terms",
  "/privacy",
  "/banned",
];

// Public page prefixes (allow sub-routes, e.g. /product/slug)
const publicPrefixes = [
  "/product",
];

// 2. Protected pages that require authentication
const protectedPages = [
  "/dashboard",
];

// 3. Internationalization proxy (formerly middleware)
const intlMiddleware = createIntlMiddleware(routing);

// 4. Auth proxy with NextAuth
const authMiddleware = withAuth(
  function onSuccess(req: NextRequest) {
    const res = intlMiddleware(req);
    
    // ── Ban check ─────────────────────────────────────────────────────────────
    // We don't hit the DB here (Edge runtime) — instead we set a custom header
    // and let the dashboard Server Layout do the actual ban check.
    // The ban state is validated per-page-load in the layout server component.
    const token = (req as any).nextauth?.token;
    
    // Forward the user's MongoDB ID to the layout for efficient server-side check
    if (token?.sub) {
      res.headers.set("x-user-id", token.sub);
    }
    
    return res;
  },
  {
    callbacks: {
      authorized: ({ token }) => token != null,
    },
    pages: {
      signIn: "/login",
    },
  }
);

// ─── Pre-compiled Regex Patterns (performance: compile once, match many) ───

const localeSegment = `(${routing.locales.join("|")})`;

const publicPagesPattern = publicPages
  .map((p) => {
    if (p === "/") {
      return "(/|)"; // home page only
    }
    // escape special regex chars
    return p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  })
  .join("|");

const protectedPagesPattern = protectedPages
  .map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
  .join("|");

const publicPrefixesPattern = publicPrefixes
  .map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
  .join("|");

// Check protected pages first (includes sub-routes like /dashboard/profile)
const protectedPathnameRegex = RegExp(
  `^(/${localeSegment})?(${protectedPagesPattern})(/.*)?$`,
  "i"
);

// Exact match for public pages only (no sub-routes)
const publicPathnameRegex = RegExp(
  `^(/${localeSegment})?(${publicPagesPattern})$`,
  "i"
);

// Prefix match for public pages that allow sub-routes (e.g. /product/slug)
const publicPrefixRegex = RegExp(
  `^(/${localeSegment})?(${publicPrefixesPattern})(/.*)?$`,
  "i"
);

// 5. Main proxy function to route requests
export default function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. Check protected pages first (auth required)
  if (protectedPathnameRegex.test(pathname)) {
    return (authMiddleware as any)(req);
  }

  // 2. Check exact public pages
  if (publicPathnameRegex.test(pathname)) {
    return intlMiddleware(req);
  }

  // 3. Check public prefixes (allow sub-routes)
  if (publicPrefixRegex.test(pathname)) {
    return intlMiddleware(req);
  }

  // 4. Default: treat unknown routes as protected (secure by default)
  return (authMiddleware as any)(req);
}

export const config = {
  // Match all routes except API and static files
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
