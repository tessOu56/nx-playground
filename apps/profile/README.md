---
id: profile
name: Profile
version: 1.0.0
description: Technical portfolio showcasing projects and skills in Nx monorepo
techStack:
  - React 19
  - Vite 6
  - TypeScript
  - Tailwind CSS
  - React Router
features:
  - Multi-language Support (en, zh-TW)
  - AI-Powered Search
  - Project & Blog Showcase
  - Responsive Design
  - PWA Support
lastUpdated: '2025-01-24'
---

# Profile - Technical Portfolio

> Full-stack developer portfolio built with React 19, Vite 6, and modern web technologies in an Nx monorepo.

## Quick Start

### Install Dependencies
```bash
pnpm install
```

### Start Development Server
```bash
# Using Makefile (recommended)
make dev-profile

# Using pnpm
pnpm dev:profile

# Using Nx
nx serve profile
```

Visit: **http://localhost:3003**

### Build for Production
```bash
nx build profile --configuration=production
```

Output: `dist/apps/profile/`

---

## Features

- **Multi-page Application**: Home, Projects, Blogs, Search, Detail pages
- **AI Search**: Smart keyword matching with conversation persistence
- **Multi-language**: Full support for English and Traditional Chinese
- **Performance**: Lighthouse 90+, PWA ready, code splitting
- **Responsive**: Mobile-first design with adaptive header
- **Modern UI**: Notion-style clean interface

---

## Tech Stack

- React 19 + TypeScript
- Vite 6 (build tool)
- React Router 6 (routing)
- Tailwind CSS (styling)
- Zustand (state management)
- i18next (internationalization)

### Shared Libraries
- `@nx-playground/ui-components` - Component library
- `@nx-playground/design-system` - Design tokens
- `@nx-playground/i18n` - Internationalization
- `@nx-playground/search-engine` - Search engine
- `@nx-playground/hooks` - React hooks

---

## Project Structure

```
src/
├── features/           # Feature modules
│   ├── home/          # Home page
│   ├── projects/      # Projects showcase
│   ├── blogs/         # Blog system
│   ├── search/        # AI search
│   └── detail/        # Detail pages
├── components/        # Shared components
├── lib/               # Utilities (loaders, helpers)
├── stores/            # Zustand stores
└── locales/           # i18n translations
```

---

## Development

### Available Commands

```bash
# Development
pnpm dev:profile          # Start dev server
nx serve profile          # Alternative with Nx

# Build
nx build profile          # Production build
nx build profile --watch  # Watch mode

# Test
nx test profile           # Run tests
nx test profile --watch   # Watch mode

# Lint
nx lint profile           # Check code quality
```

---

## Deployment

### Cloudflare Pages

**Build settings**:
- Build command: `nx build profile --configuration=production`
- Build output: `dist/apps/profile`
- Node version: 20+

**Environment variables**:
- `NODE_VERSION=20`

---

## License

MIT

---

Built with ❤️ using Nx, React, and modern web technologies
