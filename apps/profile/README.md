# Profile - Technical Portfolio

> Production-grade React portfolio with AI search, built in Nx monorepo

![Status](https://img.shields.io/badge/status-production-green) ![Version](https://img.shields.io/badge/version-1.0.0-blue) ![TypeScript](https://img.shields.io/badge/typescript-100%25-blue)

---

## TL;DR / Quickstart

```bash
# 1. Install dependencies
pnpm install

# 2. Start dev server
make dev-profile
# or: nx serve profile

# 3. Visit
http://localhost:3003
```

---

## Scripts (Nx Command Cheatsheet)

```bash
# Development
nx serve profile                    # Start dev server (port 3003)
nx serve profile --host 0.0.0.0    # Expose to network

# Build
nx build profile                    # Production build
nx build profile --configuration=development

# Test
nx test profile                     # Run unit tests
nx test profile --watch            # Watch mode
nx test profile --coverage         # With coverage

# Quality
nx lint profile                     # ESLint
nx typecheck profile               # TypeScript check

# Preview
cd apps/profile && pnpm preview    # Preview production build
```

---

## Configuration

| Variable   | Required | Default     | Purpose                   |
| ---------- | -------- | ----------- | ------------------------- |
| `NODE_ENV` | No       | development | Environment mode          |
| `VITE_*`   | No       | -           | Vite env vars (if needed) |

No environment variables required for basic development.

---

## Project Structure

```
apps/profile/
├── src/
│   ├── features/           # Feature modules
│   │   ├── home/          # Hero, Tech Stack, Timeline, Contact
│   │   ├── projects/      # Projects showcase with progress
│   │   ├── blogs/         # Blog list and detail pages
│   │   ├── search/        # AI-powered search
│   │   └── detail/        # Notion-style detail pages
│   ├── components/        # Shared UI components
│   │   ├── layout/       # Header, Footer, Layout
│   │   ├── SEO.tsx       # Meta tags management
│   │   └── ScrollToTop.tsx
│   ├── lib/              # Utilities and loaders
│   │   ├── projectLoader.ts  # Load projects from specs
│   │   ├── blogLoader.ts     # Load blogs from markdown
│   │   └── specLoader.ts     # Load spec files
│   ├── stores/           # Zustand state management
│   │   ├── useProjectsStore.ts
│   │   ├── useBlogsStore.ts
│   │   └── searchStore.ts
│   └── locales/          # i18n translations (en, zh-TW)
├── public/
│   ├── sw.js            # Service Worker (PWA)
│   ├── manifest.json    # PWA manifest
│   └── specs/           # Spec markdown files (served by Vite)
└── vite.config.ts       # Vite config with markdown loader
```

---

## 🔒 Security

### Security Headers

This application implements comprehensive security headers:

- **CSP (Content Security Policy)**: Prevents XSS attacks
- **X-Frame-Options**: Prevents clickjacking
- **X-Content-Type-Options**: Prevents MIME sniffing
- **Referrer-Policy**: Controls referrer information
- **Permissions-Policy**: Restricts browser features
- **HSTS**: Forces HTTPS (production only)

### Configuration Files

- `security-headers.config.ts` - TypeScript config with dev/prod separation
- `public/_headers` - Cloudflare Pages headers
- `SECURITY.md` - Detailed security documentation

### Validation

Check security headers:

```bash
tsx apps/profile/scripts/verify-security-headers.ts http://localhost:3003
```

See `SECURITY.md` for detailed security policy and best practices.

---

## Tech Decisions (Summary)

### Why React 19?

- Latest features (Compiler, Server Components ready)
- Industry standard, large ecosystem
- Excellent TypeScript support

### Why Vite 6?

- Fast HMR (Hot Module Replacement)
- Better DX than Create React App
- Native ESM, faster builds

### Why Zustand?

- Simpler than Redux (less boilerplate)
- Performant (no unnecessary re-renders)
- Small bundle size (~1KB)

### Why Nx Monorepo?

- Share libraries across apps
- Consistent tooling and standards
- Atomic commits across dependencies

**Details**: See `specs/apps/profile/en.md`

---

## Interfaces (App Routes)

### Public Routes

- `GET /` → Redirect to `/en`
- `GET /:locale` → Home page
- `GET /:locale/projects` → Projects showcase
- `GET /:locale/projects/:id` → Project detail
- `GET /:locale/blogs` → Blog list
- `GET /:locale/blogs/:slug` → Blog post
- `GET /:locale/search` → AI search
- `GET /:locale/*` → 404 page

### Supported Locales

- `en` - English
- `zh-TW` - Traditional Chinese

---

## Development

### Local Development

```bash
# Start dev server
nx serve profile

# Server runs on http://localhost:3003
# Auto-redirects to /zh-TW (default locale)
```

### Testing

```bash
# Unit tests
nx test profile

# With coverage
nx test profile --coverage

# Watch mode
nx test profile --watch
```

### Type Checking

```bash
# Check TypeScript types
nx typecheck profile

# Check with watch
nx typecheck profile --watch
```

---

## CI / Release

### Nx Affected Commands

```bash
# Test only affected projects
nx affected:test

# Build only affected
nx affected:build

# Lint only affected
nx affected:lint
```

### Versioning

```bash
# Bump version (update package.json)
npm version patch   # 1.0.0 → 1.0.1
npm version minor   # 1.0.0 → 1.1.0
npm version major   # 1.0.0 → 2.0.0
```

---

## i18n (Internationalization)

### Supported Languages

- **English** (`en`) - Default
- **Traditional Chinese** (`zh-TW`)

### Translation Files

```
src/
├── locales/              # Shared translations
│   ├── en/
│   │   ├── common.json
│   │   ├── home.json
│   │   └── projects.json
│   └── zh-TW/
│       ├── common.json
│       ├── home.json
│       └── projects.json
└── features/
    └── */locales/        # Feature-specific translations
```

### Check for Missing Translations

```bash
# Search for missing translation keys
grep -r "MISSING" apps/profile/src/locales

# Check if all keys are used
grep -r "t('" apps/profile/src
```

---

## Deployment

### Cloudflare Pages

**Build Settings**:

- Build command: `nx build profile --configuration=production`
- Build output directory: `dist/apps/profile`
- Root directory: `/` (monorepo root)
- Node version: `20`

**Environment Variables**:

```
NODE_VERSION=20
```

**Custom Redirects**:
`public/_redirects` handles SPA routing:

```
/* /index.html 200
```

---

## Links

- **Spec**: `specs/apps/profile/en.md` (Product specification)
- **Spec (繁中)**: `specs/apps/profile/zh-TW.md`
- **Performance**: `apps/profile/LIGHTHOUSE_OPTIMIZATION.md`
- **Project Status**: `specs/PROJECT_STATUS.md` (Overall progress)
- **Live Demo**: TBD (Cloudflare Pages)

---

## License

MIT

---

**Built with ❤️ using Nx, React, and modern web technologies**
