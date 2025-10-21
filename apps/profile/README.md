---
id: profile
name: Profile
version: 0.0.1
description: >-
  Professional portfolio website showcasing technical skills, projects, and
  shared libraries in a Nx monorepo
techStack:
  - React 19
  - Vite
  - i18n
  - Tailwind CSS
  - React Router
features:
  - Multi-language Support
  - Responsive Design
  - Apps Showcase
  - Libs Showcase
  - Technical Documentation Search
lastUpdated: '2025-10-21'
---
# Profile - Technical Portfolio & Showcase

> Professional portfolio website showcasing technical skills, projects, and shared libraries in a Nx monorepo architecture

## 🎯 Overview

This is a full-featured technical portfolio built to showcase:

- Personal skills and expertise in modern web development
- All applications built in the Nx monorepo
- Shared libraries and their purposes
- Multi-language support with locale-based routing (English & Traditional Chinese)
- Professional presentation for freelance and full-time opportunities

## 🚀 Quick Start

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Start Development Server

```bash
# Using Makefile (recommended)
make dev-profile

# Using pnpm
pnpm dev:profile

# Using Nx directly
nx serve @nx-playground/profile
```

Visit: **http://localhost:3003**

The app will automatically redirect to `/zh-TW` (default locale).

### 3. Customize Your Content

Edit these configuration files to personalize your portfolio:

```typescript
// src/data/profile.config.ts
export const profileConfig = {
  name: 'Your Name', // ← Change this
  title: {
    'zh-TW': '你的職稱',
    en: 'Your Title',
  },
  bio: {
    'zh-TW': '你的簡介...',
    en: 'Your bio...',
  },
  contact: {
    github: 'https://github.com/yourusername', // ← Your GitHub
  },
};
```

### 4. Build for Production

```bash
nx build @nx-playground/profile --configuration=production
```

Output: `dist/apps/profile/`

### 5. Deploy to Cloudflare Pages

See [Deployment Guide](#-deployment) below for detailed instructions.

## ✨ Features

### Home Page

- Personal profile with configurable content
- Interactive skill cloud showing tech stack
- Categorized technologies (Frontend, Backend, Tools, Testing, Deployment)
- Contact information section
- Availability status

### Apps Showcase

- Grid display of all monorepo applications
- Detailed pages for each application
- Tech stack visualization
- Key features and highlights
- Demo links (with "Coming Soon" state)
- Local development commands

### Libraries Documentation

- Comprehensive library showcase
- Categorized by purpose (UI, Data, Utils)
- Benefits of shared libraries
- Usage statistics
- Monorepo architecture highlights

### Internationalization

- Full support for English (en) and Traditional Chinese (zh-TW)
- Feature-based translation namespaces
- Language switcher in navigation
- All content translatable

## 🛠️ Tech Stack

- **React 19** - UI Framework with latest features
- **TypeScript** - Type-safe development
- **Vite 6** - Lightning-fast build tool
- **React Router 6** - Client-side routing
- **Tailwind CSS** - Utility-first styling
- **@nx-playground/i18n** - Internationalization (i18next)
- **@nx-playground/ui-components** - Shared UI components
- **@nx-playground/design-system** - Design tokens & theming
- **@nx-playground/hooks** - Custom React hooks

## 🚀 Development

### Start Development Server

```bash
# Using Makefile
make dev-profile

# Using pnpm
pnpm dev:profile

# Using Nx directly
nx serve @nx-playground/profile
```

Visit: **http://localhost:3003**

### Build for Production

```bash
# Build optimized production bundle
nx build @nx-playground/profile --configuration=production

# Output directory: dist/apps/profile
```

### Other Commands

```bash
# Run tests
nx test @nx-playground/profile

# Lint code
nx lint @nx-playground/profile

# Type checking
nx typecheck @nx-playground/profile
```

## 📂 Project Structure

```
apps/profile/
├── src/
│   ├── features/               # Feature-based organization
│   │   ├── home/              # Home page feature
│   │   │   ├── components/    # TechProfile, SkillCloud, ContactSection
│   │   │   ├── pages/         # HomePage
│   │   │   ├── locales/       # i18n translations (en, zh-TW)
│   │   │   └── i18n.ts        # Feature i18n config
│   │   ├── apps/              # Apps showcase feature
│   │   │   ├── components/    # AppCard, AppDetail
│   │   │   ├── pages/         # AppsPage, AppDetailPage
│   │   │   ├── locales/       # i18n translations
│   │   │   └── i18n.ts
│   │   └── libs/              # Libraries showcase feature
│   │       ├── components/    # LibCard
│   │       ├── pages/         # LibsPage
│   │       ├── locales/       # i18n translations
│   │       └── i18n.ts
│   ├── data/                  # Configuration files
│   │   ├── profile.config.ts  # Personal profile data
│   │   ├── apps.config.ts     # Apps metadata
│   │   ├── libs.config.ts     # Libraries metadata
│   │   └── techStack.ts       # Tech skills data
│   ├── components/
│   │   └── Layout.tsx         # Main layout with nav & footer
│   ├── App.tsx                # Route configuration
│   └── main.tsx               # App entry point
├── public/
│   ├── _redirects             # SPA routing for Cloudflare Pages
│   └── assets/                # Static assets
├── scripts/
│   └── deploy-cloudflare.sh   # Deployment script
└── vite.config.ts             # Vite configuration
```

## 🌐 Deployment

### Cloudflare Pages (Recommended)

This app is optimized for Cloudflare Pages deployment.

#### Option 1: Git Integration (Recommended)

1. Push your code to GitHub/GitLab
2. Go to Cloudflare Dashboard > Pages
3. Create a new project and connect your repository
4. Configure build settings:
   - **Build command**: `pnpm exec nx build @nx-playground/profile --configuration=production`
   - **Build output directory**: `dist/apps/profile`
   - **Root directory**: `/` (monorepo root)
   - **Node version**: 20 or higher
   - **Environment variables**: Add `NODE_VERSION=20`

#### Option 2: Direct Upload with Wrangler

```bash
# Run the deployment script
./apps/profile/scripts/deploy-cloudflare.sh

# Or manually:
# 1. Build the app
pnpm exec nx build @nx-playground/profile --configuration=production

# 2. Install Wrangler (if not already installed)
npm install -g wrangler

# 3. Login to Cloudflare
wrangler login

# 4. Deploy
wrangler pages deploy dist/apps/profile --project-name=your-project-name
```

### SPA Routing

The `public/_redirects` file ensures all routes are handled by React Router:

```
/* /index.html 200
```

This is crucial for client-side routing to work correctly on Cloudflare Pages.

## ⚙️ Configuration & Customization

### Step-by-Step Customization Guide

#### 1. Personal Information

Edit `src/data/profile.config.ts`:

```typescript
export const profileConfig: ProfileConfig = {
  name: 'NX Playground', // Your name or brand

  title: {
    'zh-TW': '全端工程師 & Nx Monorepo 專家', // Your title in Chinese
    en: 'Full-Stack Developer & Nx Monorepo Specialist', // Your title in English
  },

  bio: {
    'zh-TW': '你的完整簡介...', // Your bio in Chinese
    en: 'Your complete bio...', // Your bio in English
  },

  contact: {
    github: 'https://github.com/yourusername', // Your GitHub profile
  },

  availability: {
    'zh-TW': '接受自由接案專案和全職工作機會',
    en: 'Available for freelance projects and full-time opportunities',
  },
};
```

#### 2. Tech Stack & Skills

Edit `src/data/techStack.ts`:

```typescript
export const techStack: TechItem[] = [
  {
    name: 'React 19',
    category: 'frontend',
    level: 'expert', // 'expert' | 'advanced' | 'intermediate'
    color: '#61DAFB',
    url: 'https://react.dev', // Link to technology website
  },
  // Add your technologies...
];
```

**Skill Levels**:

- `expert`: Purple badge (3+ years, production experience)
- `advanced`: Violet badge (1-3 years, proficient)
- `intermediate`: Gray badge (< 1 year, basic knowledge)

**Categories**:

- `frontend`: Frontend Frameworks & UI
- `backend`: Backend & Database
- `tools`: Tools & Build
- `testing`: Testing
- `deployment`: Deployment

#### 3. Apps Showcase

Edit `src/data/apps.config.ts`:

```typescript
export const appsConfig: AppMetadata[] = [
  {
    id: 'your-app',
    name: { 'zh-TW': '應用名稱', en: 'App Name' },
    category: 'web', // 'web' | 'mobile' | 'desktop' | 'cli'
    status: 'deployed', // 'deployed' | 'coming-soon'
    techStack: ['React', 'TypeScript', 'Vite'],
    features: {
      'zh-TW': ['功能一', '功能二'],
      en: ['Feature 1', 'Feature 2'],
    },
    highlights: {
      'zh-TW': ['亮點一', '亮點二'],
      en: ['Highlight 1', 'Highlight 2'],
    },
    description: {
      'zh-TW': '應用描述...',
      en: 'App description...',
    },
    demoUrl: 'https://your-demo.com', // Your deployed app URL
    githubUrl: 'https://github.com/...', // Optional
  },
];
```

#### 4. Libraries Documentation

Edit `src/data/libs.config.ts`:

```typescript
export const libsConfig: LibMetadata[] = [
  {
    id: 'ui-components',
    name: 'UI Components',
    packageName: '@nx-playground/ui-components',
    category: 'ui', // 'ui' | 'data' | 'utils'
    description: {
      'zh-TW': '組件庫描述...',
      en: 'Library description...',
    },
    purpose: {
      'zh-TW': '用途說明...',
      en: 'Purpose explanation...',
    },
    // ...
  },
];
```

#### 5. Translations

Update translation files in `src/features/*/locales/`:

**Home page** (`src/features/home/locales/`):

- `en/home.json` - English translations
- `zh-TW/home.json` - Chinese translations

**Apps page** (`src/features/apps/locales/`):

- `en/apps.json`
- `zh-TW/apps.json`

**Libs page** (`src/features/libs/locales/`):

- `en/libs.json`
- `zh-TW/libs.json`

### Customization Checklist

- [ ] Update `profile.config.ts` with your personal information
- [ ] Edit `techStack.ts` with your actual skills
- [ ] Configure `apps.config.ts` with your projects
- [ ] Update `libs.config.ts` if you have shared libraries
- [ ] Customize translations in `locales/` folders
- [ ] Replace favicon in `public/favicon.ico`
- [ ] Test both language versions (EN & ZH-TW)
- [ ] Verify all links work correctly
- [ ] Build and test production bundle
- [ ] Deploy to Cloudflare Pages

## 🌍 Internationalization

The app uses feature-based i18n with namespace isolation:

- **profile-home**: Home page translations
- **profile-apps**: Apps showcase translations
- **profile-libs**: Libraries showcase translations

Translation files are located in:

- `src/features/home/locales/{locale}/home.json`
- `src/features/apps/locales/{locale}/apps.json`
- `src/features/libs/locales/{locale}/libs.json`

Supported languages:

- English (`en`)
- Traditional Chinese (`zh-TW`)

## 📊 Performance Optimizations

- **Code Splitting**: Automatic route-based splitting
- **Tree Shaking**: Unused code eliminated
- **Manual Chunks**: Vendor libraries separated
- **Lazy Loading**: Components loaded on demand
- **Optimized Build**: Vite production optimizations

## 🎨 Theming

The app supports light and dark modes through the design system:

- Automatic theme detection
- Manual theme switching
- Persistent theme preference
- Tailwind dark mode utilities

## 🔧 Dependencies

All shared libraries are managed in the Nx monorepo:

```json
{
  "@nx-playground/ui-components": "workspace:*",
  "@nx-playground/design-system": "workspace:*",
  "@nx-playground/i18n": "workspace:*",
  "@nx-playground/hooks": "workspace:*",
  "@nx-playground/auth-client": "workspace:*",
  "@nx-playground/api-client": "workspace:*"
}
```

## 📝 License

MIT

## 🔗 Live Demo

Coming soon on Cloudflare Pages!

---

Built with ❤️ using Nx, React, and modern web technologies
