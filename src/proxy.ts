import { withAuth } from "next-auth/middleware";
import createIntlMiddleware from "next-intl/middleware";
import { NextRequest } from "next/server";
import { routing } from "./i18n/routing";

// 1. Public pages that don't require login
const publicPages = [
  "/",
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
  "/resend-verification",
  "/about",
  "/product",
  "/contact",
  "/terms",
  "/privacy",
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
    return intlMiddleware(req);
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

// 5. Main proxy function to route requests
export default function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Build regex pattern for public pages
  const publicPagesPattern = publicPages
    .map((p) => {
      if (p === "/") {
        return "(/|)";
      }
      return p;
    })
    .join("|");

  // Build regex pattern for protected pages
  const protectedPagesPattern = protectedPages.join("|");

  // Check if path matches protected pages first
  const protectedPathnameRegex = RegExp(
    `^(/(${routing.locales.join("|")}))?(${protectedPagesPattern})(/.*)?$`,
    "i"
  );

  const isProtectedPage = protectedPathnameRegex.test(pathname);

  if (isProtectedPage) {
    // Protected page: apply auth first
    return (authMiddleware as any)(req);
  }

  // Check if path matches public pages
  const publicPathnameRegex = RegExp(
    `^(/(${routing.locales.join("|")}))?(${publicPagesPattern})(/.*)?$`,
    "i"
  );

  const isPublicPage = publicPathnameRegex.test(pathname);

  if (isPublicPage) {
    // Public page: apply internationalization only
    return intlMiddleware(req);
  }

  // Default: apply internationalization
  return intlMiddleware(req);
}

export const config = {
  // Match all routes except API and static files
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
