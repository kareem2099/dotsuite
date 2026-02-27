# Changelog

All notable changes to **dotsuite** will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Planned
- Python tools category
- Related products section
- Product analytics tracking
- Pagination for product listing
- PWA support

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