# Infrastructure Gaps Analysis

**基礎架構缺口分析與建議**

---

## 📊 現況總覽

### 已有 Apps (7)
- ✅ profile (React 19 - Portfolio)
- ✅ event-cms (React 19 - CMS)
- ✅ event-portal (Next.js 15 - Portal)
- ✅ auth (React 19 - Auth Service)
- ✅ api-server (NestJS 10 - Backend API)
- ✅ vue-motion (Vue 3 - Animation Lab)
- ✅ enterprise-admin (Angular 20 - Admin Console)

### 已有 Libs (11)
- ✅ ui-components (React UI library)
- ✅ design-system (Design tokens)
- ✅ i18n (Internationalization)
- ✅ search-engine (AI search)
- ✅ supabase-client (Database client)
- ✅ api-client (OpenAPI client)
- ✅ charts (Chart.js + Recharts)
- ✅ hooks (React hooks)
- ✅ tech-stack-data (Tech metadata)
- ✅ auth-client (Auth utilities)
- ✅ animation-data (Vue animation)
- ✅ enterprise-data (Angular data)

---

## 🎯 建議新增的 Libraries

### 1. **`libs/logger`** ⭐⭐⭐

**Priority: HIGH**

**目的**: 統一的日誌系統

**功能**:
- Structured logging (JSON format)
- Log levels (debug, info, warn, error)
- Context injection (user, request ID)
- Multiple transports (console, file, remote)
- Environment-aware (dev vs prod)

**技術棧**: TypeScript (agnostic)

**使用場景**:
```typescript
import { logger } from '@nx-playground/logger';

logger.info('User logged in', { userId: '123', email: 'user@example.com' });
logger.error('API call failed', { endpoint: '/api/users', error });
```

**為什麼需要**:
- 目前各 app 可能有不同的 console.log/error 方式
- 缺乏統一的 error tracking
- Production 難以 debug

**實作參考**:
- `winston` (Node.js)
- `pino` (高效能)
- Custom wrapper for browser/server compatibility

---

### 2. **`libs/validation`** ⭐⭐⭐

**Priority: HIGH**

**目的**: 跨棧共用的 validation schemas

**功能**:
- Zod schemas for common entities
- TypeScript type inference
- Reusable validation rules
- Error message localization

**技術棧**: Zod + TypeScript (agnostic)

**使用場景**:
```typescript
import { userSchema, eventSchema } from '@nx-playground/validation';

const result = userSchema.safeParse(userData);
if (!result.success) {
  // Handle validation errors
}
```

**為什麼需要**:
- auth, event-cms, api-server 都需要 user validation
- 避免重複定義 schemas
- 前後端一致的驗證邏輯

**覆蓋範圍**:
- User schemas (login, register, profile)
- Event schemas (create, update)
- Common types (email, phone, date)

---

### 3. **`libs/utils`** ⭐⭐

**Priority: MEDIUM**

**目的**: Framework-agnostic utility functions

**功能**:
- Date/time utilities
- String formatters
- Number formatters
- Array/Object helpers
- URL builders

**技術棧**: TypeScript (agnostic)

**使用場景**:
```typescript
import { formatDate, truncate, slugify } from '@nx-playground/utils';

const formattedDate = formatDate(new Date(), 'YYYY-MM-DD');
const shortText = truncate(longText, 100);
const slug = slugify('Hello World');
```

**為什麼需要**:
- 目前 profile、event-cms 都有各自的 utils
- 減少重複代碼
- 單元測試覆蓋

---

### 4. **`libs/error-handling`** ⭐⭐

**Priority: MEDIUM**

**目的**: 統一的錯誤處理機制

**功能**:
- Custom error classes
- Error code definitions
- Error boundary components (React)
- Error interceptors
- User-friendly error messages

**技術棧**: TypeScript (with React wrapper)

**使用場景**:
```typescript
import { AppError, ErrorCodes } from '@nx-playground/error-handling';

throw new AppError(ErrorCodes.UNAUTHORIZED, 'User not authenticated');

// React Error Boundary
<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>
```

**為什麼需要**:
- 統一的 error handling strategy
- Better debugging experience
- Consistent error UI

---

### 5. **`libs/constants`** ⭐⭐

**Priority: MEDIUM**

**目的**: 共用常數定義

**功能**:
- API endpoints
- Environment variables
- Magic numbers
- Enum definitions
- Config constants

**技術棧**: TypeScript (agnostic)

**使用場景**:
```typescript
import { API_ROUTES, HTTP_STATUS, PAGINATION } from '@nx-playground/constants';

const response = await fetch(API_ROUTES.USERS);
if (response.status === HTTP_STATUS.OK) {
  // Handle success
}
```

**為什麼需要**:
- 避免 magic strings/numbers
- 單一來源真相
- Type-safe constants

---

### 6. **`libs/test-utils`** ⭐⭐

**Priority: MEDIUM**

**目的**: 測試工具與 fixtures

**功能**:
- Mock data generators
- Test helpers
- Custom matchers
- Testing utilities

**技術棧**: TypeScript + Vitest/Jest

**使用場景**:
```typescript
import { createMockUser, renderWithProviders } from '@nx-playground/test-utils';

const mockUser = createMockUser();
const { getByText } = renderWithProviders(<UserProfile user={mockUser} />);
```

**為什麼需要**:
- 統一的 testing strategy
- 減少 test boilerplate
- Reusable mock data

---

### 7. **`libs/analytics`** ⭐

**Priority: LOW**

**目的**: 統一的 analytics tracking

**功能**:
- Event tracking wrapper
- User behavior tracking
- Performance monitoring
- A/B testing utilities

**技術棧**: TypeScript (agnostic)

**使用場景**:
```typescript
import { track } from '@nx-playground/analytics';

track('button_clicked', { buttonId: 'signup', page: '/home' });
track('page_viewed', { page: '/blogs/2024-12' });
```

**為什麼需要**:
- Profile 需要 Google Analytics
- 統一的 tracking interface
- 易於切換 analytics provider

**支援的 Providers**:
- Google Analytics
- Plausible
- Mixpanel
- Custom

---

### 8. **`libs/feature-flags`** ⭐

**Priority: LOW**

**目的**: Feature flag 系統

**功能**:
- Toggle features on/off
- A/B testing support
- Environment-based flags
- User-based flags

**技術棧**: TypeScript (agnostic)

**使用場景**:
```typescript
import { useFeatureFlag } from '@nx-playground/feature-flags';

const isNewUIEnabled = useFeatureFlag('new-ui-2024');

if (isNewUIEnabled) {
  return <NewUI />;
}
return <OldUI />;
```

**為什麼需要**:
- 逐步推出新功能
- A/B testing
- 降低部署風險

---

### 9. **`libs/notifications`** ⭐

**Priority: LOW**

**目的**: 統一的通知系統

**功能**:
- Toast notifications
- Email notifications
- Push notifications (future)
- SMS notifications (future)

**技術棧**: TypeScript + React (for toast UI)

**使用場景**:
```typescript
import { toast } from '@nx-playground/notifications';

toast.success('User created successfully');
toast.error('Failed to save changes');
toast.warning('Session will expire in 5 minutes');
```

**為什麼需要**:
- 統一的 notification UX
- 跨 app 一致體驗
- Centralized notification queue

---

### 10. **`libs/permissions`** ⭐

**Priority: LOW**

**目的**: RBAC (Role-Based Access Control)

**功能**:
- Role definitions
- Permission checks
- Access control utilities
- Protected route wrappers

**技術棧**: TypeScript (agnostic)

**使用場景**:
```typescript
import { hasPermission, ProtectedRoute } from '@nx-playground/permissions';

if (hasPermission(user, 'events:create')) {
  // Show create button
}

<ProtectedRoute requiredPermissions={['admin:read']}>
  <AdminPanel />
</ProtectedRoute>
```

**為什麼需要**:
- enterprise-admin 需要 RBAC
- event-cms 需要角色管理
- 統一的權限邏輯

---

## 🔧 建議新增的 Apps

### 1. **`apps/storybook`** ⭐⭐⭐

**Priority: HIGH**

**目的**: UI Components 展示與文件

**功能**:
- Showcase all UI components
- Interactive playground
- Props documentation
- Accessibility testing

**技術棧**: Storybook 8 + React

**為什麼需要**:
- ui-components 缺乏視覺化文件
- 開發 UI 時的即時預覽
- Design System 展示

**實作**:
```bash
nx g @nx/storybook:configuration ui-components
```

---

### 2. **`apps/docs`** ⭐⭐

**Priority: MEDIUM**

**目的**: 技術文件網站

**功能**:
- API documentation
- Library usage guides
- Architecture diagrams
- Best practices

**技術棧**: Docusaurus / VitePress / Astro

**為什麼需要**:
- 目前文件散落在各 README
- 缺乏統一的文件入口
- 新成員 onboarding

**內容**:
- Getting Started
- API Reference
- Component Library
- Architecture Guides
- Migration Guides

---

### 3. **`apps/playground`** ⭐

**Priority: LOW**

**目的**: 技術實驗沙盒

**功能**:
- Test new libraries
- POC new features
- Performance testing
- Integration testing

**技術棧**: React 19 + Vite

**為什麼需要**:
- 避免在 production apps 實驗
- 隔離的測試環境
- 快速驗證想法

---

### 4. **`apps/admin-portal`** ⭐

**Priority: LOW**

**目的**: 統一的管理後台

**功能**:
- User management
- System monitoring
- Analytics dashboard
- Configuration management

**技術棧**: React 19 + Vite (or reuse enterprise-admin)

**為什麼需要**:
- 整合所有 apps 的管理功能
- 單一登入點
- 統一的 admin UI

---

## 📋 優先順序建議

### Phase 1 (立即執行)

1. **`libs/logger`** - 統一日誌系統
2. **`libs/validation`** - 共用驗證邏輯
3. **`apps/storybook`** - UI 元件文件

### Phase 2 (1-2 週內)

4. **`libs/utils`** - 通用工具函式
5. **`libs/error-handling`** - 錯誤處理機制
6. **`libs/constants`** - 共用常數
7. **`apps/docs`** - 技術文件網站

### Phase 3 (1 個月內)

8. **`libs/test-utils`** - 測試工具
9. **`libs/analytics`** - Analytics 追蹤
10. **`libs/feature-flags`** - Feature flags

### Phase 4 (未來考慮)

11. **`libs/notifications`** - 通知系統
12. **`libs/permissions`** - RBAC 權限
13. **`apps/playground`** - 實驗沙盒
14. **`apps/admin-portal`** - 統一管理後台

---

## 🎯 各 Library 的 Tags

```json
{
  "logger": ["type:lib", "stack:agnostic", "scope:shared", "category:utils"],
  "validation": ["type:lib", "stack:agnostic", "scope:shared", "category:utils"],
  "utils": ["type:lib", "stack:agnostic", "scope:shared", "category:utils"],
  "error-handling": ["type:lib", "stack:react", "scope:primary", "category:utils"],
  "constants": ["type:lib", "stack:agnostic", "scope:shared", "category:utils"],
  "test-utils": ["type:lib", "stack:react", "scope:shared", "category:utils"],
  "analytics": ["type:lib", "stack:agnostic", "scope:shared", "category:utils"],
  "feature-flags": ["type:lib", "stack:agnostic", "scope:shared", "category:utils"],
  "notifications": ["type:lib", "stack:react", "scope:primary", "category:ui"],
  "permissions": ["type:lib", "stack:agnostic", "scope:shared", "category:utils"]
}
```

---

## 🔍 現有架構的觀察

### 優勢 ✅

1. **Design System 完整**: design-system + ui-components 覆蓋良好
2. **i18n 基礎扎實**: 統一的國際化方案
3. **Data Layer 清晰**: supabase-client + api-client 分工明確
4. **Tech Stack 多元**: React, Vue, Angular, Next.js 並存
5. **Backend 健全**: NestJS + Prisma + Supabase

### 缺口 ⚠️

1. **Logger 缺乏**: 無統一日誌系統
2. **Validation 分散**: 各 app 自己定義 schemas
3. **Error Handling 不一致**: 缺乏統一策略
4. **Testing Infrastructure 弱**: 缺乏 test-utils
5. **Documentation 散亂**: 無統一文件入口
6. **Analytics 缺失**: Profile 需要 GA 整合
7. **RBAC 不完整**: enterprise-admin 需要權限系統

---

## 🚀 Quick Wins (快速見效)

### 1. 建立 `libs/logger` (30 mins)

```bash
nx g @nx/js:library logger --directory=libs/logger --bundler=vite --unitTestRunner=vitest
```

### 2. 建立 `libs/validation` (1 hour)

```bash
nx g @nx/js:library validation --directory=libs/validation --bundler=vite
pnpm add zod --filter @nx-playground/validation
```

### 3. 設置 Storybook (1 hour)

```bash
nx g @nx/storybook:configuration ui-components --uiFramework=@storybook/react-vite
```

---

## 📚 參考資料

- [Nx Library Best Practices](https://nx.dev/concepts/decisions/project-size)
- [Monorepo Patterns](https://nx.dev/concepts/decisions/folder-structure)
- [Library Types](https://nx.dev/concepts/more-concepts/library-types)

---

最後更新：2025-01-27

