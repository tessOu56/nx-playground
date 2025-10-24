---
id: profile
version: 1.0.0
lastUpdated: '2025-01-24'
category: react
status: production
published: true

# Product Information
shortDesc: |
  Full-Stack Developer Portfolio with AI-powered search and comprehensive project showcase.

purpose: |
  Professional portfolio demonstrating technical skills, project management capabilities,
  and modern web development best practices through a production-grade React application.

highlights:
  - AI-powered knowledge assistant with conversation persistence
  - Performance optimized (Lighthouse 90+, PWA ready)
  - Adaptive UI (auto dark/light header, liquid tech stack background)
  - Multi-language support (English, Traditional Chinese)
  - Mobile-first responsive design with scroll-snap sections
  - Notion-inspired clean interface
  - Comprehensive project and blog showcase

# Statistics
stats:
  features: 25
  pages: 7
  libraries: 8

# Use Cases
useCases:
  - Showcase full-stack development skills
  - Demonstrate project management capability
  - Share technical knowledge through blog posts
  - Professional portfolio for job opportunities

targetAudience: |
  Tech recruiters, potential clients, and fellow developers interested in
  modern web development, monorepo architecture, and best practices.
---

# Profile - Technical Portfolio

Production-grade portfolio application built with React 19, showcasing technical skills and projects in an Nx monorepo architecture.

---

## Core Features

### Multi-Page Application
- **Home**: Hero section, tech stack showcase, timeline, contact
- **Projects**: Unified apps & libraries showcase with progress tracking
- **Blogs**: Year-based technical blog posts
- **Search**: AI-powered knowledge assistant
- **Detail**: Notion-style project pages

### AI-Powered Search
- Smart keyword matching engine
- Intent detection (project/blog/tech queries)
- Contextual suggested questions
- Conversation history with session management
- Search across all projects, blogs, and tech stack

### User Experience
- Adaptive header (auto dark/light mode based on content)
- Smooth scroll-snap sections
- Scroll-to-top button
- Loading animations
- Mobile-optimized navigation

---

## Technical Stack

### Core Technologies
- **React 19** - UI framework with latest features
- **TypeScript** - Type-safe development
- **Vite 6** - Fast build tool
- **Tailwind CSS** - Utility-first styling
- **React Router** - Client-side routing

### State Management
- **Zustand** - Lightweight state management for projects, blogs, and search
- **React Hooks** - Local component state

### Shared Libraries (Nx Monorepo)
- `@nx-playground/ui-components` - Radix UI component library
- `@nx-playground/design-system` - Design tokens and theming
- `@nx-playground/i18n` - i18next internationalization
- `@nx-playground/search-engine` - Custom search engine
- `@nx-playground/hooks` - Reusable React hooks
- `@nx-playground/tech-stack-data` - Auto tech stack collector

---

## Performance & Quality

### Lighthouse Scores
- **Performance**: 90+ (Desktop)
- **Accessibility**: 95+
- **Best Practices**: 100
- **SEO**: 100
- **PWA**: 90+

### Optimizations
- Code splitting (page-level + vendor chunks)
- Image lazy loading with blur placeholders
- Service Worker for offline support
- Font optimization (system fonts, no web fonts)
- Bundle size: ~250KB gzipped (within budget)

### PWA Features
- Installable on mobile & desktop
- Offline support with cache-first strategy
- App shortcuts (Projects, Blogs, Search)
- Adaptive theme colors

---

## Multi-Language Support

### Languages
- **English** (en) - Default
- **繁體中文** (zh-TW) - Traditional Chinese

### Implementation
- Feature-based i18n with namespace isolation
- Automatic fallback to English for missing translations
- All UI text translated (no hardcoded strings)
- Locale-specific routing (`/en/*`, `/zh-TW/*`)

### Translated Content
- All page headers, buttons, and labels
- Project and blog metadata
- README and Spec files (with fallback)
- Error messages and loading states

---

## Architecture Highlights

### Monorepo Benefits
- **Shared Libraries**: Reusable components across all apps
- **Consistent Tooling**: Unified build, lint, test configuration
- **Type Safety**: Shared TypeScript types
- **Atomic Commits**: Changes across libs and apps together

### Project Structure
```
apps/profile/
├── src/
│   ├── features/        # Feature-based organization
│   │   ├── home/       # Hero, Tech Stack, Timeline
│   │   ├── projects/   # Project showcase
│   │   ├── blogs/      # Blog system
│   │   ├── search/     # AI search
│   │   └── detail/     # Project detail pages
│   ├── components/     # Shared components (Layout, SEO, etc)
│   ├── lib/            # Loaders (projects, blogs, specs)
│   └── stores/         # Zustand state management
└── public/
    ├── sw.js           # Service Worker
    └── manifest.json   # PWA manifest
```

### Design Principles
- **Clean & Minimal**: Notion-inspired interface
- **Performance First**: Lighthouse 90+ target
- **Mobile First**: Optimized for all screen sizes
- **Accessibility**: WCAG 2.1 compliant
- **SEO Ready**: Dynamic meta tags per route

---

## Links & Resources

### Documentation
- [README](../../../apps/profile/README.md) - Quick start guide
- [README.zh-TW](../../../apps/profile/README.zh-TW.md) - 快速入門指南
- [LIGHTHOUSE_OPTIMIZATION](../../../apps/profile/LIGHTHOUSE_OPTIMIZATION.md) - Performance optimization guide

### Live Demo
- Coming soon on Cloudflare Pages

---

**Last Updated**: 2025-01-24  
**Status**: Production Ready
