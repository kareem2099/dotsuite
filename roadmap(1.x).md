# DotSuite — Roadmap (1.x Series)

> **Status:** v1.0.0 released — Lemon Squeezy billing fully integrated  
> **Backend:** `dotsuite-core` (Rust / Axum / MongoDB)  
> **Frontend:** `dotsuite` (Next.js 16 / TypeScript)

---

## ✅ v1.0.0 — Billing & Subscription Foundation *(Released: 2026-05-03)*

> The first production-ready release with a complete SaaS payment pipeline.

### Payments & Subscriptions
- [x] Lemon Squeezy integration — server-side checkout via Rust backend
- [x] Secure checkout API (`POST /internal/billing/checkout`) protected by `X-Internal-Secret`
- [x] `user_id` embedded in `checkout_data.custom` for webhook-to-user mapping
- [x] Checkout pre-fills user **email** and **name** from MongoDB automatically
- [x] Billing status API (`GET /internal/billing/status`) — returns tier, quota, subscription info
- [x] Customer portal API (`GET /internal/billing/portal`) — Lemon Squeezy self-service portal
- [x] Webhook handler in Rust maps payment events → MongoDB tier update
- [x] Variant IDs configured via environment variables (not hardcoded)

### DotShare Dashboard
- [x] Upgrade page (`/dashboard/dotshare/upgrade`) with live billing status
- [x] `PricingTiers` component shows **"✓ Current Plan"** badge on active tier
- [x] Current plan card highlighted with green border
- [x] Upgrade buttons disabled for current plan; other tiers remain clickable
- [x] Loading spinner per tier during checkout redirect
- [x] Error banner for misconfigured variant IDs or network failures

### Architecture & Security
- [x] Internal billing routes (`/internal/billing/*`) — never exposed publicly
- [x] OAuth users (Google/GitHub) get correct MongoDB `_id` in JWT — not provider ID
- [x] `logAudit()` guards against non-ObjectId provider IDs (prevents crashes on signout)
- [x] `QuotaBar` hardened with safe fallback values (no `.toLocaleString` crashes)
- [x] `DashboardError` fixed with default translation keys (no MISSING_MESSAGE crashes)
- [x] Pricing tab on product page replaced with redirect card (no duplicate pricing table)

---

## 🔜 v1.1.0 — Webhook Hardening & Subscription Lifecycle

> Goal: Make the subscription lifecycle bulletproof end-to-end.

- [ ] Configure Lemon Squeezy Webhook URL to point at `dotsuite-core` (ngrok in dev / real URL in prod)
- [ ] Test webhook end-to-end — verify `subscription_created` → MongoDB tier update
- [ ] Handle `subscription_cancelled` → downgrade user to Free tier
- [ ] Handle `subscription_updated` → tier change (e.g. Basic → Pro)
- [ ] Handle `subscription_expired` → quota reset + tier downgrade
- [ ] Store `ls_customer_id` and `ls_subscription_id` on user after first payment
- [ ] Show subscription end date in billing status UI
- [ ] "Manage Billing" button on dashboard → redirect to Lemon Squeezy customer portal

---

## 🔜 v1.2.0 — DotShare Core Publishing Features

> Goal: Let users actually schedule and publish posts from the dashboard.

- [ ] Post scheduling UI — create post form with platform selector, text editor, scheduled time
- [ ] Platform token management — connect/disconnect LinkedIn, Twitter/X, Telegram, etc.
- [ ] Post queue view — list pending/published/failed posts with status badges
- [ ] Cancel scheduled post button
- [ ] Real-time quota bar update after post submission
- [ ] Image upload support (S3/R2 — `@aws-sdk/client-s3` already in deps)
- [ ] Video upload for Pro/Max tiers

---

## 🔜 v1.3.0 — API Keys & Developer Experience

> Goal: Make DotShare usable via API for power users and CI/CD pipelines.

- [ ] API Keys dashboard page — list, create, revoke keys
- [ ] Display newly generated key once (copy-to-clipboard UX)
- [ ] Per-key usage stats (last used, total calls)
- [ ] VS Code extension integration guide
- [ ] Rate limit feedback in API responses (`X-RateLimit-Remaining` headers)

---

## 🔜 v1.4.0 — Analytics & Insights

> Goal: Give users visibility into their content performance.

- [ ] Post analytics dashboard — published count, platform breakdown, success/failure rate
- [ ] Monthly usage chart (posts used vs quota)
- [ ] Platform reach stats (impressions if APIs support it)
- [ ] Email digest — weekly summary of published posts

---

## 🔜 v1.5.0 — Admin Panel

> Goal: Internal tools for managing users and subscriptions.

- [ ] Admin dashboard at `/admin` (protected by admin role)
- [ ] User list with tier, quota, subscription status
- [ ] Manually upgrade/downgrade a user's tier
- [ ] Blacklist / unban users
- [ ] Reset quota for a user
- [ ] View audit logs per user

---

## 🔜 v1.6.0 — Referral System

> Goal: Grow through word-of-mouth with a referral rewards program.

- [ ] Referral link generation (`/r/:code`)
- [ ] Track referred signups via referral code
- [ ] Reward referrer with free Pro months (`referral_pro_months`)
- [ ] Referral stats page in dashboard
- [ ] Email notification when referral converts

---

## 🗺️ Beyond 1.x — Future Vision

| Feature | Notes |
|---|---|
| Python Tools product | New product category |
| Mobile app (React Native) | DotShare on the go |
| Team accounts | Shared quota, multi-user orgs |
| Zapier / n8n integration | Automate via no-code tools |
| Custom platform webhooks | User-defined POST endpoints |
| AI-assisted post drafting | GPT integration for content suggestions |

---

## Version History Quick Reference

| Version | Released | Highlight |
|---|---|---|
| 0.1.0 | 2026-02-23 | Auth, products, email, PWA |
| 0.2.0 | 2026-02-24 | Dashboard, rate limiting |
| 0.3.0 | 2026-02-25 | Avatars, skeletons |
| 0.4.0 | 2026-02-27 | Contact page, error boundaries |
| 0.5.0 | 2026-02-28 | Reviews, star ratings, toasts |
| 0.6.0 | 2026-04-28 | OG images, PWA, user avatar upload |
| **1.0.0** | **2026-05-03** | **Lemon Squeezy billing, DotShare subscription** |
| 1.1.0 | TBD | Webhook lifecycle, subscription management |
| 1.2.0 | TBD | Post scheduling UI |
| 1.3.0 | TBD | API Keys dashboard |
| 1.4.0 | TBD | Analytics & Insights |
| 1.5.0 | TBD | Admin Panel |
| 1.6.0 | TBD | Referral System |
