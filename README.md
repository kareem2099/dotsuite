# dotsuite 🟢

> Developer tools built to make your workflow faster and smarter.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?logo=mongodb)](https://www.mongodb.com)
[![License](https://img.shields.io/badge/License-MIT-green)](./LICENSE)

---

## 📖 Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

---

## 🧩 About

**dotsuite** is a portfolio and distribution platform for developer productivity tools — including VS Code extensions, Next.js solutions, and Python utilities.

It features a full authentication system, multi-language support, GitHub integration for live README/Changelog rendering, and Open VSX marketplace support.

---

## ✨ Features

- 🔐 **Full Auth System** — Register, Login, Email Verification, Forgot/Reset Password
- 🌍 **Multi-language** — English, Arabic, French, Russian, German
- 🌙 **Dark / Light Theme** — System-aware with manual toggle
- 📦 **Product Catalog** — VS Code, Next.js, Python tools with live GitHub data
- 📖 **Live README & Changelog** — Fetched directly from GitHub repos
- 🔄 **GitHub Webhooks** — Auto cache revalidation on push/release
- 🛡️ **Rate Limiting** — MongoDB-backed atomic rate limiting (60 req/min)
- 📧 **HTML Emails** — Professional transactional emails via Nodemailer
- 👤 **User Dashboard** — Stats, profile, settings, activity
- 📱 **Responsive** — Mobile-first design with ultra-wide support
- ⚡ **Debounced Search** — Optimized search with useDebounce hook

---

## 🛠 Tech Stack

| Category | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Database | MongoDB + Mongoose |
| Auth | NextAuth.js v4 |
| Styling | Tailwind CSS v4 |
| Email | Nodemailer |
| Validation | Zod + React Hook Form |
| i18n | next-intl |
| Markdown | react-markdown + remark-gfm |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas account
- GitHub OAuth App
- Google OAuth App

### Installation
```bash
git clone https://github.com/kareem2099/dotsuite.git
cd dotsuite
npm install
cp .env.example .env.local
npm run seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🔑 Environment Variables
```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
MONGODB_URI=mongodb+srv://...
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GITHUB_TOKEN=your_github_personal_access_token
GITHUB_WEBHOOK_SECRET=your_webhook_secret
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM="dotsuite <your_email@gmail.com>"
```

---

## 📁 Project Structure
```
dotsuite/
├── src/
│   ├── app/
│   │   ├── [locale]/
│   │   │   ├── (auth)/
│   │   │   ├── dashboard/
│   │   │   └── product/
│   │   └── api/
│   │       ├── auth/
│   │       ├── products/
│   │       ├── webhooks/
│   │       └── contact/
│   ├── components/
│   ├── lib/
│   ├── models/
│   └── i18n/
├── scripts/
├── messages/
└── public/
```

---

## 🤝 Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md)

---

## 📄 License

This project is licensed under the MIT License — see [LICENSE](./LICENSE)

---

<div align="center">
  <strong>Built with ❤️ by <a href="https://github.com/kareem2099">kareem2099</a></strong>
</div>