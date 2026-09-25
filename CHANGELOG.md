# Changelog

All notable changes to **dotsuite** will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.5.0] — 2026-09-26 — "Advanced SEO Engine & Decoupled SSR Infrastructure"

### Added
- **Dynamic Multi-Language Sitemap (`src/app/sitemap.ts`)** — Automated generation of `/sitemap.xml` indexing all static routes and 9 product entries across all 5 supported locales (`en`, `ar`, `fr`, `de`, `ru`) with `alternates` language mapping, dynamic priorities (`1.0` to `0.4`), and appropriate `changeFrequency`.
- **Crawler Directives & Bot Protection (`src/app/robots.ts`)** — Production-ready `/robots.txt` configuration:
  - Whitelists public pages and `/api/og` endpoint for search engine indexing.
  - Blacklists private, administrative, authentication, and internal API routes.
  - Blocks disruptive AI scraper bots (`GPTBot`, `CCBot`, `Claude-Web`, `anthropic-ai`, `ChatGPT-User`) from unapproved content harvesting.
  - Automatically associates and points to `${BASE_URL}/sitemap.xml`.
- **Edge-Powered Dynamic Open Graph Generator (`/api/og`)** — High-performance Edge runtime image generator producing branded, dynamic 1200x630 social preview banners featuring product categories, custom badge colors, dark palette styling, and typography.
- **Default Social Image Fallback (`src/app/[locale]/opengraph-image.tsx`)** — Static, edge-rendered default OpenGraph preview banner for root and sharing fallbacks.
- **Structured Data (JSON-LD Schemas)**:
  - `Organization` & `WebSite` schemas in root layout with `SearchAction` deep-linking.
  - `BreadcrumbList` schema embedded into the homepage.
  - Rich `SoftwareApplication` schema for all product detail pages including application category, operating systems, download URLs, pricing/offers, author, publisher, and licensing details.
  - Rich `AggregateRating` schema (⭐⭐⭐⭐⭐) embedded into `SoftwareApplication` metadata for Google Gold Star Search Snippets.
  - `FAQPage` schema on homepage embedding 5 fully localized developer questions and answers for Google Rich Accordion snippets.
- **Interactive FAQ Accordion Section** — Designed an accessible, lightweight `<details>` accordion on the homepage answering core questions with full 5-language localization.
- **Vercel Analytics & Speed Insights** — Integrated `@vercel/analytics` and `@vercel/speed-insights` for privacy-first real-time traffic analytics and Core Web Vitals monitoring without cookies.
- **Direct Server Data Layer (`src/lib/productData.ts`)** — Extracted shared `getProductDetails` helper for GitHub, OpenVSX, and product retrieval.

### Changed
- **Decoupled Server Component Architecture** — Refactored `ProductDetailPage` from an internal HTTP loopback (`fetch(/api/...)`) to direct server-side data fetching via `getProductDetails()`, preventing `ECONNREFUSED` build failures and boosting SSR performance.
- **Decoupled Client Interactions (`ProductClient.tsx`)** — Separated client-only state (tabs, reviews, ratings) from SSR shell, enabling search engine crawlers to parse complete HTML without hydration dependency.
- **PWA Web App Manifest (`public/manifest.json`)** — Updated manifest with standalone display properties, app shortcuts (Browse, Search), screenshots, categories, and theme colors.
- **Localized Metadata & Social Cards** — Enhanced metadata across all 5 languages with canonical URLs, hreflang alternates, and Twitter `summary_large_image` cards in root, home, product listing, and product detail layouts.
- **Upgraded Version References** — Bumped project version to `1.5.0` across `package.json`, `README.md`, and `CHANGELOG.md`.

---

## [1.4.0] — 2026-09-24 — "DotAegis AI Security & Live Secret Scanner"

### Added
- **DotAegis Product Integration (`prod_dotaegis`)** — Added DotAegis to the central product catalog (`products.ts`) under the Python / AI Security category with full 5-language localization (EN, AR, FR, DE, RU), live GitHub repo sync, and automated star/release display.
- **Interactive Secret Scanner & Dashboard (`/dashboard/dotaegis`)** — Built a dedicated interactive dashboard featuring:
  - Live service connectivity indicator displaying latency and release version (`v2.1.3`).
  - Real-time in-browser code and `.env` scanner with preloaded test templates (leaked AWS, Stripe, GitHub, database credentials vs. clean config).
  - Shannon entropy calculator, instant heuristic signature pattern matching, and confidential secret masking (`sk_live_•••••••1234`).
  - Integration guides and code snippets for DotEnvy VS Code extension, CI/CD pipelines (GitHub Actions), and API Key generation.
- **Server-Side Scan API Route (`/api/dotaegis/scan`)** — High-performance API route handling code analysis, entropy calculations, and health monitoring.
- **DotAegis API Key Preset (`/dashboard/keys`)** — Added dedicated `DotAegis` key preset in the API Key manager with tailored styling, cyan badges, and full localization.
- **Dashboard Quick Access Card** — Added prominent Emerald Shield card for DotAegis in `src/app/[locale]/dashboard/page.tsx`.

### Changed
- **Upgraded Version References** — Bumped project version to `1.4.0` across `package.json`, `README.md`, and `CHANGELOG.md`.

---

## [1.3.0] — 2026-08-22 — "Interactive Live Docs & Asset Proxy"

### Added
- **Interactive Live Markdown Renderer (`MarkdownRenderer.tsx`)** — Re-architected documentation reader for product detail pages supporting live GitHub README and Changelog rendering with:
  - Multi-language Prism.js syntax highlighting with language labels and one-click clipboard copying.
  - GitHub-style alert callouts (`[!NOTE]`, `[!TIP]`, `[!IMPORTANT]`, `[!WARNING]`, `[!CAUTION]`) with distinctive color coding and icons.
  - Interactive Preview vs. Raw Markdown view mode toggle with estimated reading time calculation.
  - Custom table and image container formatting with shadow styling and subtle hover transitions.
- **Server-Side Image Proxy (`/api/proxy-image`)** — Added a dedicated Next.js API proxy to securely fetch, cache, and serve remote GitHub assets, shields.io badges, and marketplace images:
  - Completely bypasses regional ISP blocks on `raw.githubusercontent.com` and `img.shields.io`.
  - Employs 24-hour HTTP cache headers (`Cache-Control: public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800`) to accelerate asset delivery.
  - Implements multi-tier fallback mechanism (Server Proxy → jsDelivr CDN → Direct URL).
- **Dynamic Branch Resolution in Product API** — Updated `/api/products/[slug]` to retrieve `default_branch` directly from GitHub API and route asset and changelog queries seamlessly across repositories using `main` or `master`.

### Changed
- **Inline Badge Links** — Enhanced markdown link renderer to detect badges and shields, preventing intrusive external link icons (`↗`) on image-only links.
- **Upgraded Version References** — Bumped project version to `1.3.0` across `package.json`, `README.md`, and `CHANGELOG.md`.

### Fixed
- **Lucide-React Missing Github Export** — Replaced removed `Github` export from `lucide-react` with a clean, inline SVG component (`GitHubIcon`).
- **TypeScript Strict Element Typing** — Resolved React 19 JSX element children type check errors in `parseGitHubAlert` and image src string conversions.

---

## [1.2.1] — 2026-06-05 — "Pricing API Proxy & Security"

### Added
- **`GET /api/pricing` Proxy Route** — Created a Next.js proxy route to securely fetch dynamic pricing tiers from the `dotsuite-core` backend, serving as a single source of truth for features and quotas.
- **Proxy Rate Limiting** — Added `checkRateLimit` middleware (30 requests/minute per IP) to `/api/pricing` to prevent abuse and DDoS attacks against the backend.

### Changed
- **Dynamic Pricing Integration** — Upgraded the `PricingTiers.tsx` component to fetch and display dynamic tier data (`tier`, `price_usd_cents`, `post_quota`, `scheduler_interval_minutes`) from the backend instead of hardcoding limits. Added a pulse skeleton loader for seamless loading states.

### Fixed
- **Next-Intl Formatting Error** — Fixed the `FORMATTING_ERROR: The intl string context variable "count" was not provided` crash that occurred when passing `{count}` variables in `PricingTiers.tsx`.
- **Locale Translations** — Injected missing keys (`featPosts`, `featImages`, `featCron`) into all 5 language files (`en`, `ar`, `de`, `fr`, `ru`).

---

## [1.2.0] — 2026-05-25 — "Legal & Compliance"

### Added
- **Terms of Service & Privacy Policy** — Implemented legally-sound TOS and Privacy Policy pages across all supported locales.
- **Secure Key Scheduling UI** — Upgraded the `/dashboard/dotshare` and `/dashboard/keys` pages to support user-consented workflow for platform keys, seamlessly integrating with the backend secure credential scheduling system.
- **Cloudflare Image Integration** — Added full support for cover image uploads via the cloud scheduler to Cloudflare R2.

### Fixed
- **React Warnings** — Resolved a unique list key warning in the `DotSharePage` component by implementing a robust index-based fallback for `.map()` operations.
- **Next.js Hydration** — Fixed client-side rendering mismatch warnings related to third-party script injection and router initialization.

---

## [1.1.0] — 2026-05-14 — "Backend Goes Live"

### Added
- **Production Rust Backend on Railway**: `dotsuite-core` is now deployed to `https://dotsuite-core-production.up.railway.app` via Railway. All internal Next.js API routes point to the live backend instead of `localhost:8080`.
- **OAuth Connection Status Routes**: New Next.js API proxies for `/api/oauth/connections`, `/api/oauth/disconnect`, and `/api/oauth/status` — enable the DotShare VS Code extension to query which platforms are connected without exposing tokens.
- **Checkout & Billing Proxy Routes**: Internal API routes for Lemon Squeezy checkout, portal, and status checks are fully wired to the Rust backend via `X-Internal-Secret` authentication.

### Changed
- **`CORE_API_URL`**: Updated from `http://127.0.0.1:8080` (local) to `https://dotsuite-core-production.up.railway.app` (production Railway URL).
- **`NEXTAUTH_URL`**: Updated from `http://localhost:3000` to `https://dotsuite.vercel.app` for production OAuth callback handling.
- **`/dashboard/dotshare` page**: Scheduler connection status is now fetched live from the production Rust backend; platform icons show a green badge when OAuth credentials are synced.

### Fixed
- Duplicate `NEXTAUTH_URL` entry in `.env.local` removed.
- `logAudit()` no longer crashes on sign-out when `userId` is a non-ObjectId string.

---

## [1.0.0] — 2026-05-03

### Added
- **Lemon Squeezy Billing** — full server-side checkout via Rust backend (`dotsuite-core`)
- **Internal Billing Routes** — `POST /internal/billing/checkout`, `GET /internal/billing/status`, `GET /internal/billing/portal`; all protected by `X-Internal-Secret`, never exposed publicly
- **Checkout pre-fill** — Lemon Squeezy checkout form auto-populated with user email & name from MongoDB
- **Webhook→User mapping** — `user_id` embedded in `checkout_data.custom` so the Rust webhook handler can tie any payment to the correct MongoDB user without session state
- **Upgrade Page** (`/dashboard/dotshare/upgrade`) — live billing status fetched on load; active plan highlighted with green "✓ Current Plan" badge and disabled button
- **Pricing Tab redirect** — product page pricing tab now shows a simple CTA card linking to the upgrade page (removed duplicate `<PricingTiers />`)
- **OAuth ID fix** — Google/GitHub OAuth users now get the real MongoDB `_id` stored in the JWT (previously stored the provider's numeric ID, breaking all Rust API calls)

### Fixed
- `logAudit()` no longer crashes on signout when `userId` is a Google/GitHub numeric string (not a valid ObjectId)
- `QuotaBar` crashes on `.toLocaleString()` when API returns `undefined` — safe fallbacks added
- `DashboardError` no longer shows `MISSING_MESSAGE` for `Error.goHome` — default messages added
- Billing routes switched from `rustProxy` (Bearer API key) to `rustInternal` (shared secret), fixing `Unable To Extract Key!` 500 errors


## [0.5.0] — 2026-02-28

### Added
- **Review Model** — MongoDB model for product reviews with rating, comment, user reference, and timestamps
- **Reviews API** — Full CRUD routes (`GET`, `POST`, `PUT`, `DELETE`) with rate limiting and one-review-per-user enforcement
- **Review Components** — `ReviewCard`, `ReviewForm`, `ReviewList`, `StarRating` — fully localized and theme-aware
- **Star Ratings** — Interactive 5-star rating input with read-only display mode; average rating shown on product page
- **Reviews Tab** — Integrated into product detail page with average rating, review count, and write/edit/delete flows
- **Toast Notification System** — Custom `Toast.tsx` (context + hook + animated renderer) and `ConfirmModal.tsx` (async `Promise<boolean>` confirm dialog); mounted once in layout, usable from any component via `useToast()` / `useConfirm()`
- **Full Review Localization** — All 4 review components fully localized; 13 new `Common` keys added to all 5 locale files (EN, AR, FR, DE, RU)
- **Star color CSS variables** — `--star-color` and `--star-empty-color` in `globals.css` replace all hardcoded Tailwind color classes

### Fixed
- Replaced `window.confirm()` in review delete flow with a proper async confirm modal
- Replaced `alert()` in newsletter subscribe with toast notification
- Replaced all inline success/error banners (profile, settings, login, forgot-password, reset-password, resend-verification) with toast calls
- Fixed wrong i18n namespace `"common"` → `"Common"` in `ReviewCard` and `ReviewList` (was silently breaking translations)
- Replaced hardcoded `bg-green-500`, `text-green-500` success colors with CSS variables across auth pages

---

## [0.4.0] — 2026-02-27

### Added
- Contact page with form validation and MongoDB storage
- Error boundary pages with i18n support (error.tsx, dashboard/error.tsx, not-found.tsx, global-error.tsx)
- Accessibility improvements (skip links, ARIA labels, focus management)
- Skip to main content link in layout
- Contact page refactored into components: ContactForm, ContactInfo, SocialLinks

### Fixed
- Improved SEO metadata across all pages

---

## [0.3.0] — 2026-02-25

### Added
- UserAvatar component with next/image optimization
- DashboardSkeleton for better loading experience
- UserAvatarSkeleton for avatar loading states

### Fixed
- CSS variables consistency (replaced hardcoded #10b981 with var(--primary))
- Theme colors now configurable from single location (globals.css)

---


## [0.2.0] — 2026-02-24

### Added
- Dashboard with stats from MongoDB
- Dashboard link in Header for authenticated users
- Translations for dashboard (EN, AR, FR, DE, RU)
- Middleware protection for dashboard routes
- Ultra-wide screen support for dashboard
- Rate limiting (60 req/min) on products API
- useDebounce hook for search optimization

### Fixed
- Middleware regex bug for protected routes
- products.map error in ProductsPage
- Variable naming conflict in ProductsPage
- Duplicate click outside handler in UserMenu

---

## [0.1.0] — 2026-02-23

### Added

#### Authentication
- User registration with email + password
- Email verification system with token expiry (24h)
- Login with credentials, Google, and GitHub OAuth
- Forgot password & reset password flow (token expiry 10min)
- Resend verification email
- Rate limiting on all auth endpoints (MongoDB atomic)
- Block unverified users from logging in

#### Products
- Product catalog with MongoDB
- GitHub API integration (stars, forks, issues, version)
- Live README & Changelog rendering (react-markdown + remark-gfm)
- Open VSX marketplace integration
- Search and category filter
- Pagination support
- GitHub webhook for auto cache revalidation

#### User
- Profile page (avatar, bio, location, website, social links)
- Settings page (change password, delete account)
- Dashboard with redirect

#### UI/UX
- Dark / Light theme (next-themes)
- Multi-language support: English, Arabic, French, Russian, German
- RTL support for Arabic
- Mobile-responsive header with hamburger menu
- Skeleton loading screens (react-loading-skeleton)
- GitHub-style markdown rendering

#### Emails
- Professional HTML email templates
- Welcome email on registration
- Email verification email
- Password reset email
- Password reset success email

#### Infrastructure
- MongoDB rate limiting with TTL index
- GitHub webhook handler with signature verification (timingSafeEqual)
- Zod validation on all API routes
- Contact form with MongoDB storage
- Favicon & PWA manifest

---

## Links

- [GitHub](https://github.com/kareem2099/dotsuite)
- [Website](https://dotsuite.dev)