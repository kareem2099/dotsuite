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
  "/about",
  "/product",
  "/contact",
];

// 2. Internationalization proxy (formerly middleware)
const intlMiddleware = createIntlMiddleware(routing);

// 3. Auth proxy with NextAuth
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

// 4. Main proxy function to route requests
export default function proxy(req: NextRequest) {
  // Build regex pattern for public pages - handle "/" specially
  const publicPagesPattern = publicPages
    .map((p) => {
      if (p === "/") {
        // Match both "" and "/" for root
        return "(/|)";
      }
      return p;
    })
    .join("|");

  // Smart regex to match public pages in all languages
  const publicPathnameRegex = RegExp(
    `^(/(${routing.locales.join("|")}))?(${publicPagesPattern})(/.*)?$`,
    "i"
  );
  
  const isPublicPage = publicPathnameRegex.test(req.nextUrl.pathname);

  if (isPublicPage) {
    // Public page: apply internationalization only
    return intlMiddleware(req);
  } else {
    // Protected page (e.g., /dashboard): apply auth first
    return (authMiddleware as any)(req);
  }
}

export const config = {
  // Match all routes except API and static files
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};