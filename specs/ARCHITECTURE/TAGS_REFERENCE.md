# Nx Project Tags Reference

快速參考：如何使用 Tags 管理多技術棧

---

## 📋 Tag Categories

### 1. Type Tags (專案類型)

| Tag         | Description          | Examples                        |
|-------------|----------------------|---------------------------------|
| `type:app`  | Application project  | profile, event-cms, api-server  |
| `type:lib`  | Library project      | ui-components, hooks, i18n      |

### 2. Stack Tags (技術棧)

| Tag              | Description                | Projects              |
|------------------|----------------------------|-----------------------|
| `stack:react`    | React 19 + Vite            | profile, event-cms    |
| `stack:nextjs`   | Next.js 15 (App Router)    | event-portal          |
| `stack:vue`      | Vue 3 + Vite               | vue-motion            |
| `stack:angular`  | Angular 20                 | enterprise-admin      |
| `stack:nestjs`   | NestJS 10                  | api-server            |
| `stack:agnostic` | Framework-agnostic (TS)    | design-system, i18n   |

### 3. Scope Tags (範疇)

| Tag               | Description                                     | Purpose                  |
|-------------------|-------------------------------------------------|--------------------------|
| `scope:primary`   | 主要技術棧，完整 CI/CD                          | Product development      |
| `scope:secondary` | 輔助技術棧，實驗性質                            | Learning, POC            |
| `scope:hybrid`    | 混合（如 Next.js 使用 React + SSR）             | Specific use cases       |
| `scope:shared`    | 跨棧共用                                        | Utilities, types         |
| `scope:backend`   | 後端服務                                        | APIs, databases          |

### 4. Status Tags (狀態)

| Tag                   | Description                          |
|-----------------------|--------------------------------------|
| `status:production`   | 已上線或準備上線                     |
| `status:development`  | 開發中                               |
| `status:experimental` | 實驗性質                             |
| `status:demo`         | 展示用途                             |
| `status:functional`   | 功能完整但未完全測試                 |

### 5. Category Tags (分類 - Libraries only)

| Tag            | Description                | Examples                     |
|----------------|----------------------------|------------------------------|
| `category:ui`  | UI components              | ui-components, design-system |
| `category:data`| Data management            | api-client, supabase-client  |
| `category:utils`| Utilities                 | hooks, i18n                  |

---

## 🎯 Common Nx Commands with Tags

### Query Projects

```bash
# List all Primary Stack apps
nx show projects --projects='tag:scope:primary'

# List all React projects (apps + libs)
nx show projects --projects='tag:stack:react'

# List all Shared libraries
nx show projects --projects='tag:scope:shared'

# List production-ready apps
nx show projects --projects='tag:status:production'

# List UI libraries
nx show projects --projects='tag:category:ui'
```

### Run Tasks by Tags

```bash
# Build all Primary Stack
nx run-many -t build --projects='tag:scope:primary'

# Test all React libraries
nx run-many -t test --projects='tag:stack:react,tag:type:lib'

# Lint all Shared libraries
nx run-many -t lint --projects='tag:scope:shared'

# Build everything except Secondary Stack
nx run-many -t build --exclude='tag:scope:secondary'
```

### Affected Commands

```bash
# Affected build (Primary Stack only)
nx affected -t build --exclude='tag:scope:secondary'

# Affected test (React only)
nx affected -t test --projects='tag:stack:react'

# Affected lint (all except experimental)
nx affected -t lint --exclude='tag:status:experimental'
```

### Dependency Graph

```bash
# View dependency graph (all projects)
nx graph

# View affected projects
nx graph --affected

# View specific stack
nx graph --projects='tag:stack:react'

# View Primary Stack dependencies
nx graph --projects='tag:scope:primary'
```

---

## 🔒 Dependency Constraints Examples

### Prevent Cross-Stack Pollution

```javascript
// eslint.config.mjs
{
  '@nx/enforce-module-boundaries': [
    'error',
    {
      depConstraints: [
        {
          sourceTag: 'stack:react',
          onlyDependOnLibsWithTags: ['stack:react', 'stack:agnostic'],
        },
        {
          sourceTag: 'stack:vue',
          onlyDependOnLibsWithTags: ['stack:vue', 'stack:agnostic'],
        },
      ],
    },
  ],
}
```

**Result**:
- ✅ React apps can import from `@nx-playground/ui-components` (React lib)
- ✅ React apps can import from `@nx-playground/i18n` (Agnostic lib)
- ❌ React apps **cannot** import from `@nx-playground/animation-data` (Vue lib)

### Enforce Shared Library Purity

```javascript
{
  sourceTag: 'scope:shared',
  onlyDependOnLibsWithTags: ['scope:shared', 'stack:agnostic'],
}
```

**Result**:
- ✅ Shared lib can import from another Shared lib
- ❌ Shared lib **cannot** import from React-specific lib

---

## 📝 How to Add Tags

### Option 1: Manual Edit

Edit `project.json` directly:

```json
{
  "name": "my-app",
  "tags": ["type:app", "stack:react", "scope:primary", "status:development"]
}
```

### Option 2: Use Script (Recommended)

```bash
# Dry run (preview changes)
tsx scripts/add-project-tags.ts --dry-run

# Apply changes
tsx scripts/add-project-tags.ts
```

---

## 🧩 Tag Combinations

### Common Queries

| Query                                                    | Result                                      |
|----------------------------------------------------------|---------------------------------------------|
| `tag:scope:primary,tag:type:app`                        | All Primary Stack apps                      |
| `tag:stack:react,tag:category:ui`                       | All React UI libraries                      |
| `tag:scope:shared,tag:category:data`                    | All Shared data libraries                   |
| `tag:status:production` OR `tag:status:development`     | Production or Development apps              |

### Exclusion Patterns

| Pattern                              | Result                                      |
|--------------------------------------|---------------------------------------------|
| `--exclude='tag:scope:secondary'`    | All except Secondary Stack                  |
| `--exclude='tag:status:experimental'`| All except Experimental projects            |
| `--exclude='tag:stack:vue'`          | All except Vue projects                     |

---

## 🎨 Tag Naming Convention

Format: `{category}:{value}`

- **Lowercase only**
- **Kebab-case for multi-word values**
- **Consistent categories** (type, stack, scope, status, category)
- **No duplicates** (don't add `stack:react` twice)

**Good**:
- `type:app`
- `stack:react`
- `scope:primary`
- `category:ui`

**Bad**:
- `TypeApp` (uppercase)
- `stack_react` (underscore)
- `React` (missing category)
- `primary` (missing category)

---

## 🚀 CI/CD Integration

### GitHub Actions Example

```yaml
# Build Primary Stack only
- name: Build Primary Stack
  run: pnpm nx run-many -t build --projects='tag:scope:primary' --configuration=production

# Test all except Secondary
- name: Test Core Projects
  run: pnpm nx affected -t test --exclude='tag:scope:secondary'

# Lint Shared libraries
- name: Lint Shared Libs
  run: pnpm nx run-many -t lint --projects='tag:scope:shared'
```

---

## 📊 Current Tag Distribution

```
Apps (7):
  scope:primary (3): profile, event-cms, auth
  scope:hybrid (1): event-portal
  scope:secondary (2): vue-motion, enterprise-admin
  scope:backend (1): api-server

Libraries (11):
  scope:primary (4): ui-components, charts, hooks, auth-client
  scope:shared (7): design-system, i18n, search-engine, supabase-client, api-client, tech-stack-data
  scope:secondary (2): animation-data, enterprise-data

Stacks:
  stack:react (7 projects)
  stack:nextjs (1 project)
  stack:vue (2 projects)
  stack:angular (2 projects)
  stack:nestjs (1 project)
  stack:agnostic (7 projects)
```

---

## 🔗 Links

- [Multi-Stack Strategy](./MULTI_STACK_STRATEGY.md)
- [Nx Enforce Module Boundaries](https://nx.dev/core-features/enforce-module-boundaries)
- [Project Status](../../specs/PROJECT_STATUS.md)

---

最後更新：2025-10-27

