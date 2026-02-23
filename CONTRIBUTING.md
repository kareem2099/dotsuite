# Contributing to dotsuite 🤝

Thank you for your interest in contributing! Here's everything you need to know.

---

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Commit Convention](#commit-convention)
- [Pull Request Process](#pull-request-process)
- [Code Standards](#code-standards)
- [Reporting Issues](#reporting-issues)

---

## 📜 Code of Conduct

By participating in this project, you agree to be respectful and constructive.
We welcome contributors of all backgrounds and experience levels.

---

## 🚀 Getting Started

### 1. Fork & Clone
```bash
git clone https://github.com/YOUR_USERNAME/dotsuite.git
cd dotsuite
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment
```bash
cp .env.example .env.local
# Fill in your values
```

### 4. Run Development Server
```bash
npm run dev
```

---

## 🔄 Development Workflow

### Create a Branch
```bash
git checkout -b feat/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

### Make Changes

- Write clean TypeScript (no `any` types)
- Add Zod validation for new API routes
- Use existing CSS variables for theming
- Test in dark and light mode
- Test in LTR and RTL (Arabic) layouts
- Add rate limiting on new public endpoints

### Test Your Changes
```bash
npm run build   # Make sure it builds
npm run dev     # Test locally
```

---

## 📝 Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org):

| Prefix | Description | Example |
|---|---|---|
| `feat:` | New feature | `feat: add product search` |
| `fix:` | Bug fix | `fix: verify email token expiry` |
| `docs:` | Documentation | `docs: update README` |
| `style:` | Formatting only | `style: fix indentation` |
| `refactor:` | Code refactor | `refactor: extract UserMenu component` |
| `perf:` | Performance | `perf: add Promise.all for GitHub fetch` |
| `chore:` | Maintenance | `chore: update dependencies` |

---

## 🔀 Pull Request Process

1. Make sure `npm run build` passes with no errors
2. Update `CHANGELOG.md` under `[Unreleased]`
3. Open a PR with a clear title and description
4. Reference any related issues (`Closes #123`)
5. Wait for review — we'll respond within 48 hours

### PR Title Format
```
feat: add product rating system
fix: resolve email verification token expiry bug
```

---

## ✅ Code Standards
```typescript
// ✅ Good - typed interfaces
interface UserProfile {
  name: string;
  email: string;
}

// ❌ Bad - any type
const user: any = {};

// ✅ Good - Zod validation on API routes
const schema = z.object({
  email: z.string().email(),
});

// ✅ Good - rate limiting on public endpoints
const rateLimit = await checkRateLimit(ip, "action", 5, 3600);

// ✅ Good - error handling
try {
  await connectDB();
} catch (error) {
  console.error("DB error:", error);
  return NextResponse.json({ error: "Server error" }, { status: 500 });
}
```

---

## 🐛 Reporting Issues

When reporting a bug, please include:

- **Description** — What happened?
- **Steps to reproduce** — How can we reproduce it?
- **Expected behavior** — What should happen?
- **Screenshots** — If applicable
- **Environment** — OS, Node version, browser

Open an issue at: [github.com/kareem2099/dotsuite/issues](https://github.com/kareem2099/dotsuite/issues)

---

## 💡 Feature Requests

Have an idea? Open a [GitHub Discussion](https://github.com/kareem2099/dotsuite/discussions) or create an issue with the `enhancement` label.

---

<div align="center">
  Thanks for contributing to <strong>dotsuite</strong> ❤️
</div>
```

---

