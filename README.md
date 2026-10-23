# 🌐 DotSuite

<div align="center">

**The Unified Developer Ecosystem & Digital Distribution Hub**

[![Version](https://img.shields.io/badge/version-v1.6.0-10b981?style=flat-square&labelColor=1e293b)](https://github.com/kareem2099/dotsuite)
[![Next.js](https://img.shields.io/badge/Next.js-16.2_(Turbopack)-black?style=flat-square&logo=next.js&labelColor=111111)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-06b6d4?style=flat-square&logo=react&labelColor=1e293b)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178c6?style=flat-square&logo=typescript&labelColor=1e293b)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4.2-38bdf8?style=flat-square&logo=tailwindcss&labelColor=1e293b)](https://tailwindcss.com/)
[![Rust Backend](https://img.shields.io/badge/Rust_Core-Axum-f97316?style=flat-square&logo=rust&labelColor=1e293b)](https://github.com/tokio-rs/axum)
[![Database](https://img.shields.io/badge/MongoDB-Mongoose_9-22c55e?style=flat-square&logo=mongodb&labelColor=1e293b)](https://www.mongodb.com/)
[![Linux Store](https://img.shields.io/badge/OpenDesktop-Pling_Certified-0284c7?style=flat-square&labelColor=1e293b)](https://www.opendesktop.org/)
[![i18n](https://img.shields.io/badge/i18n-5_Languages_(RTL)-8b5cf6?style=flat-square&labelColor=1e293b)](https://www.dotsuite.dev/en)
[![License](https://img.shields.io/badge/License-MIT-emerald?style=flat-square&labelColor=1e293b)](./LICENSE)

<br/>

[**🌐 Live Platform**](https://www.dotsuite.dev/en) •
[**📦 Product Ecosystem**](#-product-ecosystem) •
[**✨ Key Capabilities**](#-key-capabilities) •
[**🛠️ Tech Stack**](#-tech-stack) •
[**🚀 Getting Started**](#-getting-started) •
[**🔑 Environment Variables**](#-environment-variables) •
[**📁 Project Architecture**](#-project-architecture) •
[**📄 License**](#-license)

</div>

---

## 💡 About DotSuite

**DotSuite** is an enterprise-grade digital distribution hub and unified portfolio platform for developer productivity tools. From in-editor VS Code extensions to native cryptographic Linux utilities and cloud AI microservices, DotSuite eliminates software fragmentation by providing a seamless, centralized experience for software discovery, documentation, licensing, and community feedback.

Built from the ground up on **Next.js 16 (Turbopack)**, **React 19**, and **Tailwind CSS v4**, backed by a high-throughput **Rust Axum core microservice** and **MongoDB Atlas**, DotSuite delivers sub-millisecond response times, automated multi-language internationalization, Edge-powered Open Graph social cards, and decoupled server-side rendering.

---

## 📦 Product Ecosystem

DotSuite powers an interconnected family of developer productivity tools across desktop, editor, and cloud environments:

| Tool | Category | Description | Distribution / Links | Tier |
|:---|:---:|:---|:---|:---:|
| 🎵 **CodeTune** | VS Code Extension | AI Code Assistant & intelligent refactoring engine for in-editor acceleration | [![GitHub](https://img.shields.io/badge/GitHub-Repo-181717?style=flat-square&logo=github)](https://github.com/kareem2099/codetune) [![Open VSX](https://img.shields.io/badge/Open_VSX-Install-purple?style=flat-square)](https://open-vsx.org/extension/kareem2099/codetune) | Free |
| ⚡ **DotCommand** | VS Code Extension | Command shortcut launcher & custom productivity macro palette | [![GitHub](https://img.shields.io/badge/GitHub-Repo-181717?style=flat-square&logo=github)](https://github.com/kareem2099/dotcommand) [![Open VSX](https://img.shields.io/badge/Open_VSX-Install-purple?style=flat-square)](https://open-vsx.org/extension/kareem2099/dotcommand) | Free |
| 🔐 **DotEnvy** | VS Code Extension | Smart `.env` and environment variable manager with leak warning heuristics | [![GitHub](https://img.shields.io/badge/GitHub-Repo-181717?style=flat-square&logo=github)](https://github.com/kareem2099/dotenvy) [![Open VSX](https://img.shields.io/badge/Open_VSX-Install-purple?style=flat-square)](https://open-vsx.org/extension/kareem2099/dotenvy) | Free |
| 📡 **DotFetch** | VS Code Extension | Ultra-lightweight REST/GraphQL API client and live system info viewer | [![GitHub](https://img.shields.io/badge/GitHub-Repo-181717?style=flat-square&logo=github)](https://github.com/kareem2099/DotFetch) [![Open VSX](https://img.shields.io/badge/Open_VSX-Install-purple?style=flat-square)](https://open-vsx.org/extension/kareem2099/dotfetch) | Free |
| 📝 **DotReadme** | VS Code Extension | Live interactive README editor with GitHub Alert callouts and preview | [![GitHub](https://img.shields.io/badge/GitHub-Repo-181717?style=flat-square&logo=github)](https://github.com/kareem2099/DotReadme) [![Open VSX](https://img.shields.io/badge/Open_VSX-Install-purple?style=flat-square)](https://open-vsx.org/extension/kareem2099/dotreadme) | Free |
| 🧠 **DotSense** | VS Code Extension | Context-aware code completions, syntax diagnostics, and intelligent linting | [![GitHub](https://img.shields.io/badge/GitHub-Repo-181717?style=flat-square&logo=github)](https://github.com/kareem2099/dotsense) [![Open VSX](https://img.shields.io/badge/Open_VSX-Install-purple?style=flat-square)](https://open-vsx.org/extension/kareem2099/dotsense) | Free |
| 🚀 **DotShare** | Web & VS Code | Instant code snippet publisher, social code cards, and multi-channel sharing | [![GitHub](https://img.shields.io/badge/GitHub-Repo-181717?style=flat-square&logo=github)](https://github.com/kareem2099/DotShare) [![Open VSX](https://img.shields.io/badge/Open_VSX-Install-purple?style=flat-square)](https://open-vsx.org/extension/kareem2099/dotshare) | Pro ($5/mo) |
| 🔒 **DotScramble** | Linux Desktop (Python) | Robust image privacy, EXIF metadata scrubber, and visual obfuscation tool | [![GitHub](https://img.shields.io/badge/GitHub-Repo-181717?style=flat-square&logo=github)](https://github.com/kareem2099/DotScramble) [![OpenDesktop](https://img.shields.io/badge/OpenDesktop-Pling-0284c7?style=flat-square)](https://www.opendesktop.org/p/2362477/) | Pro ($5) |
| 🛡️ **DotAegis** | Cloud AI Service | AI-powered credential leak prevention, entropy analysis & real-time secret scanner | [![GitHub](https://img.shields.io/badge/GitHub-Repo-181717?style=flat-square&logo=github)](https://github.com/kareem2099/DotAegis) [![Live Service](https://img.shields.io/badge/Cloud-aegis.dotsuite.dev-emerald?style=flat-square)](https://aegis.dotsuite.dev/) | Cloud / Free |
| 👻 **DotGhostBoard** | Linux Desktop (Python) | Cryptographic, zero-telemetry Linux clipboard manager (v2.1.0 Leviathan) | [![GitHub](https://img.shields.io/badge/GitHub-Repo-181717?style=flat-square&logo=github)](https://github.com/kareem2099/DotGhostBoard) [![OpenDesktop](https://img.shields.io/badge/OpenDesktop-Pling-0284c7?style=flat-square)](https://www.opendesktop.org/p/2353623/) | Open-Source |

---

## ✨ Key Capabilities

### ⚡ Next.js 16 & Decoupled SSR Architecture
- **Zero Local HTTP Loopbacks** — Direct server-side data layer (`src/lib/productData.ts`) eliminating internal fetch bottlenecks and build failures.
- **Turbopack Powered** — Blazing fast sub-second HMR and optimized compilation times.
- **React 19 Concurrent Mode** — Seamless non-blocking UI transitions (`startTransition`) for language toggling, search, and tab switching.

### 🦀 Rust Axum Microservice Core (`dotsuite-core`)
- High-performance production microservice deployed at [**aegis.dotsuite.dev**](https://aegis.dotsuite.dev/).
- Handles Lemon Squeezy billing webhooks, schedule processing, and inter-service authentication via cryptographically signed internal tokens.
- High-concurrency rate limiting middleware and dynamic pricing synchronization.

### 🐧 Native Linux Desktop Integrations
- Deep integration with the **OpenDesktop** and **Pling Store** ecosystem.
- Dedicated store buttons and release tracking for **DotGhostBoard** (v2.1.0 Leviathan) and **DotScramble**.
- Direct launch integration for the **DotAegis** cloud AI security service.

### 📖 Interactive Live Documentation Reader
- **Prism.js Syntax Highlighting** — Automatic language detection, colored syntax highlighting, and one-click clipboard copying.
- **GitHub Alerts Native Parsing** — Visual callouts for `[!NOTE]`, `[!TIP]`, `[!IMPORTANT]`, `[!WARNING]`, and `[!CAUTION]`.
- **Preview vs. Raw Markdown Mode** — Switch dynamically between styled preview and raw markdown with estimated reading time.
- **Collision-Safe Markdown Renderer** — Clean attribute destructuring preventing upstream HTML `onerror` string collisions.

### 🖼️ Asset Relay & Image Proxy (`/api/proxy-image`)
- Server-side image relay with 24-hour HTTP caching headers (`s-maxage=86400, stale-while-revalidate=604800`).
- Seamlessly bypasses regional ISP blocks on `raw.githubusercontent.com` and `img.shields.io`.
- Intelligent three-tier fallback: Next.js Proxy → jsDelivr CDN → Direct URL.

### 🔍 Search Engine Optimization (SEO) & Social Graph
- **Dynamic Multi-Language Sitemap (`/sitemap.xml`)** — Indexes all static pages and product routes across 5 locales with `hreflang` alternates.
- **Automated `robots.txt` Directives** — Whitelists public crawlers while shielding against disruptive AI scraper bots (`GPTBot`, `CCBot`, `Claude-Web`, `anthropic-ai`).
- **Edge Dynamic Open Graph Images (`/api/og`)** — Generates customized 1200x630 social preview banners on the fly.
- **Rich JSON-LD Structured Data** — Embeds `Organization`, `WebSite`, `BreadcrumbList`, `FAQPage`, and `SoftwareApplication` with `AggregateRating` (⭐⭐⭐⭐⭐) schemas.

### 🌍 Global Multi-Language Internationalization (i18n)
- 5 fully localized languages: **English**, **العربية (Arabic - RTL)**, **Français (French)**, **Deutsch (German)**, and **Русский (Russian)**.
- URL-based locale routing (`/[locale]/...`) with cookie-based preference persistence.

### 🔐 Security, Authentication & Accounts
- Multi-provider authentication via **NextAuth.js v4** (Google OAuth, GitHub OAuth, Credentials).
- Email verification and password reset workflows powered by **Nodemailer**.
- Atomic MongoDB rate limiting on sensitive API endpoints.
- User management dashboard with API key generation, active session revocation, and review history.

---

## 🛠️ Tech Stack

### Core Framework & Runtimes
- **Frontend Framework**: [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
- **UI Library**: [React 19](https://react.dev/) & React-DOM
- **Language**: [TypeScript 5.9](https://www.typescriptlang.org/)
- **Microservices Core**: [Rust (Axum)](https://github.com/tokio-rs/axum) — `dotsuite-core` deployed at [aegis.dotsuite.dev](https://aegis.dotsuite.dev/)

### Styling & Design System
- **CSS Engine**: [Tailwind CSS v4.2](https://tailwindcss.com/)
- **Typography**: `@tailwindcss/typography`
- **Iconography**: [Lucide React](https://lucide.dev/)
- **Theming**: `next-themes` (Dark/Light mode with CSS custom variables)

### Database & Storage
- **Primary Database**: [MongoDB Atlas](https://www.mongodb.com/)
- **ODM**: [Mongoose 9.2](https://mongoosejs.com/)
- **Object Storage**: [AWS S3](https://aws.amazon.com/s3/) (`@aws-sdk/client-s3`)

### Internationalization & Documentation
- **i18n Engine**: `next-intl` (5 locales with bidirectional RTL support)
- **Markdown Processing**: `react-markdown`, `remark-gfm`, `rehype-raw`, `rehype-sanitize`
- **Code Highlighting**: `prismjs` + `@types/prismjs`

### Tooling, Validation & Quality
- **Form Handling**: `react-hook-form` + `@hookform/resolvers`
- **Schema Validation**: `zod 4`
- **Linter & Code Quality**: `eslint 9` + `eslint-config-next`
- **Analytics**: `@vercel/analytics` & `@vercel/speed-insights`

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.18.0 or newer (v20+ recommended)
- **npm** or **pnpm**
- **MongoDB Atlas** database cluster (or local MongoDB 6+)
- **GitHub OAuth App** (Client ID & Secret)
- **Google OAuth App** (Client ID & Secret)
- **SMTP Credentials** (e.g. Gmail App Password, Resend, or SendGrid)

### Quick Start Installation

```bash
# 1. Clone repository
git clone https://github.com/kareem2099/dotsuite.git
cd dotsuite

# 2. Install dependencies
npm install

# 3. Setup environment variables
cp .env.example .env.local

# 4. Seed initial database data
npm run seed

# 5. Launch development server with Turbopack
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Environment Variables

Create a `.env.local` file in the root directory:

```env
# ==============================================================================
# Next.js Application & Auth Configuration
# ==============================================================================
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_super_secret_nextauth_jwt_key_here
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# ==============================================================================
# Database Configuration
# ==============================================================================
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/dotsuite?retryWrites=true&w=majority

# ==============================================================================
# OAuth Providers
# ==============================================================================
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# ==============================================================================
# GitHub API & Webhooks
# ==============================================================================
GITHUB_TOKEN=ghp_your_personal_access_token_for_rate_limits
GITHUB_WEBHOOK_SECRET=your_github_webhook_secret_key

# ==============================================================================
# Transactional Email (Nodemailer SMTP)
# ==============================================================================
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
EMAIL_FROM="DotSuite <no-reply@dotsuite.dev>"

# ==============================================================================
# Rust Core Microservice (dotsuite-core — https://core.dotsuite.dev)
# ==============================================================================
CORE_API_URL=https://core.dotsuite.dev
INTERNAL_API_SECRET=your_internal_shared_secret_between_next_and_rust

# ==============================================================================
# Lemon Squeezy Monetization (Variant IDs)
# ==============================================================================
NEXT_PUBLIC_LS_VARIANT_BASIC=your_basic_variant_id
NEXT_PUBLIC_LS_VARIANT_PRO=your_pro_variant_id
NEXT_PUBLIC_LS_VARIANT_MAX=your_max_variant_id
```

---

## 📁 Project Architecture

```
dotsuite/
├── messages/                  # Localization message catalogs (en, ar, fr, de, ru)
│   ├── en.json
│   ├── ar.json
│   ├── fr.json
│   ├── de.json
│   └── ru.json
├── public/                    # Static assets, branding, and PWA manifest
│   ├── manifest.json
│   └── icons/
├── src/
│   ├── app/
│   │   ├── [locale]/          # Next.js 16 localized route hierarchy
│   │   │   ├── (auth)/        # Login, Register, Password Reset, Email Verification
│   │   │   ├── dashboard/     # User Portal, DotAegis Playground, DotShare, API Keys
│   │   │   ├── product/       # Product directory & interactive product detail view
│   │   │   ├── search/        # Debounced instant search & filter engine
│   │   │   ├── layout.tsx     # Root locale layout with JSON-LD schemas & theme provider
│   │   │   └── page.tsx       # Homepage hero, ecosystem showcase & FAQ accordion
│   │   ├── api/
│   │   │   ├── auth/          # NextAuth endpoints & callback handlers
│   │   │   ├── dotaegis/      # Live secret scanning & entropy heuristics endpoint
│   │   │   ├── og/            # Dynamic Edge-rendered OpenGraph banner generator
│   │   │   ├── pricing/       # Dynamic pricing tiers synchronized with Rust core
│   │   │   ├── products/      # Catalog API & branch-aware GitHub repository relay
│   │   │   ├── proxy-image/   # Regional ISP-bypass image proxy & asset cache
│   │   │   └── webhooks/      # Lemon Squeezy and GitHub release webhooks
│   │   ├── robots.ts          # Automated crawler directives & AI scraper blocker
│   │   └── sitemap.ts         # Multi-language dynamic XML sitemap
│   ├── components/            # Reusable UI component library
│   │   ├── reviews/           # ReviewCard, ReviewForm, ReviewList, StarRating
│   │   ├── skeletons/         # Loading skeletons for zero-CLS UX
│   │   ├── LanguageSwitcher.tsx
│   │   ├── MarkdownRenderer.tsx
│   │   ├── ThemeToggle.tsx
│   │   └── Toast.tsx
│   ├── config/
│   │   └── products.ts        # Single source of truth for all 10 products
│   ├── lib/                   # Utility helpers, database connection & productData layer
│   ├── models/                # Mongoose models (User, Review, Key, Order)
│   └── types/                 # Shared TypeScript interfaces & declarations
└── package.json
```

---

## 📜 Changelog

Detailed release notes and historical upgrades are maintained in [**CHANGELOG.md**](./CHANGELOG.md).

- **v1.6.0 (2026-10-02)** — Desktop Ecosystem Expansion: Integrated DotGhostBoard v2.1.0 (Leviathan), OpenDesktop/Pling deep-links for DotGhostBoard and DotScramble, DotAegis cloud AI service launch integration (`aegis.dotsuite.dev`), full codebase ESLint remediation (51+ files), and major dependency modernization (`npm outdated`).
- **v1.5.0 (2026-09-26)** — Advanced SEO Engine, dynamic multi-language sitemap (`/sitemap.xml`), Edge OpenGraph generator (`/api/og`), JSON-LD schemas, AI scraper protection, and decoupled SSR architecture.
- **v1.4.0 (2026-09-24)** — DotAegis AI Security & live secret detection playground on `/dashboard/dotaegis`.
- **v1.3.0 (2026-08-22)** — Interactive live docs viewer with GitHub alerts callouts and `/api/proxy-image` asset relay.
- **v1.2.0 (2026-08-10)** — Legal compliance (Terms & Privacy) and hydration performance fixes.
- **v1.1.0 (2026-07-28)** — Railway production deployment for `dotsuite-core` (Rust Axum).
- **v1.0.0 (2026-07-15)** — Initial production release with Lemon Squeezy billing, NextAuth, and MongoDB.

---

## 🤝 Contributing

Contributions make the developer community an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'feat: Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed code of conduct and contribution guidelines.

---

## 📄 License

Distributed under the **MIT License**. See [LICENSE](./LICENSE) for more information.

---

<div align="center">

**Built with passion & precision for the developer community by [kareem2099](https://github.com/kareem2099)**

[**Website**](https://www.dotsuite.dev/en) • [**GitHub**](https://github.com/kareem2099) • [**OpenDesktop**](https://www.opendesktop.org/)

</div>
