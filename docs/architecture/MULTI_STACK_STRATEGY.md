# Multi-Stack Strategy in Nx Monorepo

**多技術棧共存策略**

---

## 📋 目標 / Objectives

在同一個 Nx monorepo 中維護：
1. **主要技術棧 (Primary Stack)**: React 19 + TypeScript + Vite
   - 完整的 CI/CD pipeline
   - Design System (Storybook)
   - 共用 libraries
   - 產品主線開發

2. **輔助技術棧 (Secondary Stacks)**: Vue, Angular, Next.js
   - 技術展示與學習
   - 實驗性功能驗證
   - 特定場景應用
   - 獨立部署管道

3. **跨棧共用 (Cross-Stack Shared)**: TypeScript utilities, Domain logic
   - Framework-agnostic libraries
   - Type definitions
   - Business logic
   - API clients

---

## 🏗️ 現況分析 / Current State

### Apps (7個)

| App                | Stack         | Purpose           | Status    | Scope         |
|--------------------|---------------|-------------------|-----------|---------------|
| `profile`          | React 19      | Portfolio site    | ✅ Primary | Production    |
| `event-cms`        | React 19      | Event management  | ✅ Primary | Development   |
| `auth`             | React 19      | Auth service      | ✅ Primary | Development   |
| `event-portal`     | Next.js 15    | Event platform    | 🟡 Hybrid | Development   |
| `vue-motion`       | Vue 3         | Animation lab     | 🟣 Secondary | Demo        |
| `enterprise-admin` | Angular 20    | Admin console     | 🔴 Secondary | Development |
| `api-server`       | NestJS 10     | Backend API       | 🟢 Backend | Functional  |

### Libraries (11個)

| Library            | Stack         | Scope         | Consumers             |
|--------------------|---------------|---------------|-----------------------|
| `ui-components`    | React         | Primary       | profile, event-cms    |
| `design-system`    | Agnostic      | Shared        | All React apps        |
| `i18n`             | Agnostic      | Shared        | All frontend apps     |
| `search-engine`    | Agnostic      | Shared        | profile               |
| `supabase-client`  | Agnostic      | Shared        | profile, event-portal |
| `api-client`       | Agnostic      | Shared        | event-cms, api-server |
| `charts`           | React         | Primary       | profile, event-cms    |
| `hooks`            | React         | Primary       | All React apps        |
| `tech-stack-data`  | Agnostic      | Shared        | profile               |
| `auth-client`      | React         | Primary       | profile, auth         |
| `animation-data`   | Vue           | Secondary     | vue-motion            |
| `enterprise-data`  | Angular       | Secondary     | enterprise-admin      |

---

## 🎯 分層策略 / Layered Strategy

```
┌─────────────────────────────────────────────────────────────────┐
│                   Primary Stack (React 19)                       │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐                │
│  │  profile   │  │ event-cms  │  │    auth    │                │
│  └─────┬──────┘  └─────┬──────┘  └─────┬──────┘                │
│        └─────────────┬─────────────────┘                        │
│                      │                                           │
│  ┌───────────────────▼────────────────────────────────────┐    │
│  │      Primary Libraries (React)                          │    │
│  │  - ui-components                                        │    │
│  │  - charts                                               │    │
│  │  - hooks                                                │    │
│  │  - auth-client                                          │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│              Shared / Framework-Agnostic Layer                   │
│  ┌───────────────────────────────────────────────────────┐     │
│  │  - design-system (tokens, themes)                      │     │
│  │  - i18n (translations, locales)                        │     │
│  │  - search-engine (domain logic)                        │     │
│  │  - supabase-client (database, auth)                    │     │
│  │  - api-client (OpenAPI types)                          │     │
│  │  - tech-stack-data (metadata)                          │     │
│  └───────────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────────┘
                   │                    │
        ┌──────────┘                    └──────────┐
        │                                          │
        ▼                                          ▼
┌──────────────────┐                    ┌──────────────────┐
│  Next.js Stack   │                    │  Vue Stack       │
│  ┌────────────┐  │                    │  ┌────────────┐  │
│  │event-portal│  │                    │  │vue-motion  │  │
│  └────────────┘  │                    │  └────────────┘  │
│                  │                    │  ┌────────────┐  │
│  (RSC, SSR, SSG) │                    │  │animation-  │  │
│                  │                    │  │  data      │  │
└──────────────────┘                    │  └────────────┘  │
                                        └──────────────────┘
        ▼                                          ▼
┌──────────────────┐                    ┌──────────────────┐
│  Angular Stack   │                    │  Backend Stack   │
│  ┌────────────┐  │                    │  ┌────────────┐  │
│  │enterprise- │  │                    │  │api-server  │  │
│  │  admin     │  │                    │  │ (NestJS)   │  │
│  └────────────┘  │                    │  └────────────┘  │
│  ┌────────────┐  │                    │                  │
│  │enterprise- │  │                    │  (Prisma, REST,  │
│  │  data      │  │                    │   OpenAPI)       │
│  └────────────┘  │                    └──────────────────┘
└──────────────────┘
```

---

## ⚙️ Nx Configuration

### 1. 更新 `nx.json` - 加入 Tags 系統

```json
{
  "$schema": "./node_modules/nx/schemas/nx-schema.json",
  "cli": {
    "packageManager": "pnpm"
  },
  "plugins": [
    "@nx/js/typescript",
    "@nx/react/router-plugin",
    "@nx/eslint/plugin",
    "@nx/vite/plugin",
    "@nx/next/plugin"
  ],
  "targetDefaults": {
    "test": {
      "dependsOn": ["^build"]
    },
    "@nx/js:tsc": {
      "cache": true,
      "dependsOn": ["^build"],
      "inputs": ["production", "^production"]
    }
  },
  "generators": {
    "@nx/react": {
      "application": {
        "babel": true,
        "style": "tailwind",
        "linter": "eslint",
        "bundler": "vite"
      },
      "library": {
        "style": "tailwind",
        "linter": "eslint",
        "unitTestRunner": "vitest"
      }
    }
  }
}
```

### 2. 為每個專案加入 Tags

在各個 `apps/*/project.json` 和 `libs/*/project.json` 加入 tags：

#### Apps Tags

```json
// apps/profile/project.json
{
  "name": "profile",
  "tags": ["type:app", "stack:react", "scope:primary", "status:production"]
}

// apps/event-cms/project.json
{
  "name": "event-cms",
  "tags": ["type:app", "stack:react", "scope:primary", "status:development"]
}

// apps/event-portal/project.json
{
  "name": "event-portal",
  "tags": ["type:app", "stack:nextjs", "scope:hybrid", "status:development"]
}

// apps/vue-motion/project.json
{
  "name": "vue-motion",
  "tags": ["type:app", "stack:vue", "scope:secondary", "status:demo"]
}

// apps/enterprise-admin/project.json
{
  "name": "enterprise-admin",
  "tags": ["type:app", "stack:angular", "scope:secondary", "status:experimental"]
}

// apps/api-server/project.json
{
  "name": "api-server",
  "tags": ["type:app", "stack:nestjs", "scope:backend", "status:functional"]
}
```

#### Libraries Tags

```json
// libs/ui-components/project.json
{
  "name": "ui-components",
  "tags": ["type:lib", "stack:react", "scope:primary", "category:ui"]
}

// libs/design-system/project.json
{
  "name": "design-system",
  "tags": ["type:lib", "stack:agnostic", "scope:shared", "category:ui"]
}

// libs/supabase-client/project.json
{
  "name": "supabase-client",
  "tags": ["type:lib", "stack:agnostic", "scope:shared", "category:data"]
}

// libs/i18n/project.json
{
  "name": "i18n",
  "tags": ["type:lib", "stack:agnostic", "scope:shared", "category:utils"]
}
```

### 3. 建立 Dependency Constraints

在 `.eslintrc.json` 或 `eslint.config.mjs` (root level):

```javascript
// eslint.config.mjs
export default [
  // ... other configs
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: [],
          depConstraints: [
            // Primary React apps can only depend on React or Shared libs
            {
              sourceTag: 'scope:primary',
              onlyDependOnLibsWithTags: [
                'scope:primary',
                'scope:shared',
                'stack:react',
                'stack:agnostic',
              ],
            },
            // Secondary stacks can only depend on their own stack or Shared
            {
              sourceTag: 'scope:secondary',
              onlyDependOnLibsWithTags: [
                'scope:secondary',
                'scope:shared',
                'stack:agnostic',
              ],
            },
            // Shared libs cannot depend on framework-specific libs
            {
              sourceTag: 'scope:shared',
              onlyDependOnLibsWithTags: ['scope:shared', 'stack:agnostic'],
            },
            // React libs can only depend on React or Shared
            {
              sourceTag: 'stack:react',
              onlyDependOnLibsWithTags: ['stack:react', 'stack:agnostic'],
            },
            // Vue libs can only depend on Vue or Shared
            {
              sourceTag: 'stack:vue',
              onlyDependOnLibsWithTags: ['stack:vue', 'stack:agnostic'],
            },
            // Angular libs can only depend on Angular or Shared
            {
              sourceTag: 'stack:angular',
              onlyDependOnLibsWithTags: ['stack:angular', 'stack:agnostic'],
            },
          ],
        },
      ],
    },
  },
];
```

---

## 📊 CI/CD 策略 / CI/CD Strategy

### Primary Stack (Full Pipeline)

```yaml
# .github/workflows/primary-stack-ci.yml
name: Primary Stack CI/CD

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  affected:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      
      - name: Install pnpm
        uses: pnpm/action-setup@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
      
      - name: Install dependencies
        run: pnpm install --frozen-lockfile
      
      - name: Lint affected (Primary Stack)
        run: pnpm nx affected -t lint --configuration=production --exclude='tag:scope:secondary'
      
      - name: Test affected (Primary Stack)
        run: pnpm nx affected -t test --configuration=production --exclude='tag:scope:secondary'
      
      - name: Build affected (Primary Stack)
        run: pnpm nx affected -t build --configuration=production --exclude='tag:scope:secondary'
      
      - name: Deploy (Production)
        if: github.ref == 'refs/heads/main'
        run: |
          pnpm nx deploy profile --configuration=production
          pnpm nx deploy event-cms --configuration=production
```

### Secondary Stack (Minimal Pipeline)

```yaml
# .github/workflows/secondary-stack-ci.yml
name: Secondary Stack Verification

on:
  pull_request:
    branches: [main]

jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Install pnpm
        uses: pnpm/action-setup@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
      
      - name: Install dependencies
        run: pnpm install --frozen-lockfile
      
      - name: Build affected (Secondary Stack)
        run: pnpm nx affected -t build --configuration=production --projects='tag:scope:secondary'
```

---

## 🧩 Nx Commands by Stack

### Query by Tags

```bash
# List all Primary Stack apps
nx show projects --with-target=build --projects='tag:scope:primary'

# List all React libraries
nx show projects --projects='tag:stack:react,tag:type:lib'

# List all Shared libraries
nx show projects --projects='tag:scope:shared'

# List Secondary Stack apps
nx show projects --projects='tag:scope:secondary'
```

### Run Tasks by Stack

```bash
# Build all Primary Stack apps
nx run-many -t build --projects='tag:scope:primary'

# Test all React libraries
nx run-many -t test --projects='tag:stack:react,tag:type:lib'

# Lint all Shared libraries
nx run-many -t lint --projects='tag:scope:shared'

# Build everything except Secondary Stack
nx run-many -t build --exclude='tag:scope:secondary'
```

### Affected Commands (Respecting Tags)

```bash
# Affected for Primary Stack only
nx affected -t build --exclude='tag:scope:secondary'

# Affected for specific stack
nx affected -t test --projects='tag:stack:react'

# Affected graph visualization
nx graph --affected
```

---

## 📚 Documentation Standards

### Each App/Lib Should Have

1. **README.md** (Developer-facing, English only)
   - Quick start
   - Tech stack
   - Commands
   - Project structure
   - Key decisions

2. **Spec (en.md / zh-TW.md)** (Public-facing, Bilingual)
   - Overview
   - Features
   - Use cases
   - Screenshots

3. **Stack Declaration**
   ```json
   // package.json or project.json
   {
     "meta": {
       "stack": "react",
       "scope": "primary",
       "status": "production"
     }
   }
   ```

---

## 🎯 Best Practices

### ✅ DO

- Keep Shared libs framework-agnostic
- Use tags to enforce boundaries
- Document stack purpose in README
- Maintain separate CI pipelines for Primary vs Secondary
- Use consistent naming: `{purpose}-{stack}` (e.g., `event-portal-next`)

### ❌ DON'T

- Import React components in Vue apps
- Put framework-specific code in Shared libs
- Mix Primary and Secondary in the same CI job
- Create circular dependencies across stacks
- Forget to update tags when scope changes

---

## 🔄 Migration Path

### Adding a New Stack

1. **Add Nx Plugin**
   ```bash
   pnpm add -D @nx/vue  # or @nx/svelte, @nx/solid
   ```

2. **Generate App**
   ```bash
   nx g @nx/vue:app my-vue-app
   ```

3. **Update project.json with Tags**
   ```json
   {
     "tags": ["type:app", "stack:vue", "scope:secondary", "status:experimental"]
   }
   ```

4. **Update Dependency Constraints**
   ```javascript
   {
     sourceTag: 'stack:vue',
     onlyDependOnLibsWithTags: ['stack:vue', 'stack:agnostic']
   }
   ```

5. **Document in Architecture**
   - Update `MULTI_STACK_STRATEGY.md`
   - Update `PROJECT_STATUS.md`

---

## 📊 Current Tag Distribution

```
Apps (7):
  - scope:primary (3): profile, event-cms, auth
  - scope:hybrid (1): event-portal
  - scope:secondary (2): vue-motion, enterprise-admin
  - scope:backend (1): api-server

Libs (11):
  - scope:primary (4): ui-components, charts, hooks, auth-client
  - scope:shared (7): design-system, i18n, search-engine, supabase-client, api-client, tech-stack-data
  - scope:secondary (2): animation-data, enterprise-data

Stacks:
  - stack:react (7)
  - stack:nextjs (1)
  - stack:vue (2)
  - stack:angular (2)
  - stack:nestjs (1)
  - stack:agnostic (7)
```

---

## 🔗 Links

- [Nx Enforce Module Boundaries](https://nx.dev/core-features/enforce-module-boundaries)
- [Nx Tags & Project Configuration](https://nx.dev/recipes/other/project-graph-plugins)
- [Project Status](../../specs/PROJECT_STATUS.md)

---

最後更新：2025-01-27

