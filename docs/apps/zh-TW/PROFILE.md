---
title: 'Profile - 技術展示與 Portfolio 網站'
slug: 'profile'
category: 'apps'
tags: ['React 19', 'Vite', 'i18n', 'Cloudflare Pages', 'Portfolio', 'React Router']
date: '2025-10-20'
excerpt: '專業的技術展示平台，展示個人技能、monorepo 專案和共享函式庫'
author: 'NX Playground'
lang: 'zh-TW'
published: true
---

# Profile - 技術展示與 Portfolio 網站

> 專業的技術展示平台，展示個人技能、monorepo 專案和共享函式庫

**最後更新**: 2025-10-20

**重要**: 本文檔包含所有技術細節和架構決策。日常使用請參考 `apps/profile/README.md`。

## 📚 文檔索引

- [README.md](../../apps/profile/README.md) - 快速開始和使用指南
- [DEPLOYMENT.md](../../apps/profile/DEPLOYMENT.md) - 部署指南
- [LOCALE_ROUTING.md](../../apps/profile/LOCALE_ROUTING.md) - Locale routing 技術文檔
- **本文檔** - 完整技術細節和架構決策

## 🎯 專案概述

Profile App 是一個全功能的技術展示網站，用於：

- **個人品牌建立**: 展示技術能力和專業經驗
- **接案 Portfolio**: 向潛在客戶展示過往專案
- **求職履歷**: 作為技術履歷的線上補充
- **技術分享**: 展示 monorepo 架構和最佳實踐

### 關鍵特性

- ✅ **Design System 整合**: 100% 使用 `@nx-playground/design-system`
- ✅ **Locale-based Routing**: URL 包含語言代碼 (`/zh-TW/*`, `/en/*`)
- ✅ **Feature-based i18n**: 獨立的翻譯命名空間
- ✅ **可點擊技術標籤**: 所有技術連結到官方網站
- ✅ **配置驅動**: 易於自定義的數據管理
- ✅ **Production Ready**: 優化的 bundle (113KB gzipped)

## 🛠️ 技術棧

### 核心技術

- **React 19** - 最新的 React 特性
- **TypeScript** - 嚴格型別檢查
- **Vite 6** - 極速構建工具
- **React Router 6** - 客戶端路由
- **Tailwind CSS** - Utility-first 樣式系統

### Nx Monorepo 整合

使用所有共享函式庫：

```typescript
import { LanguageSwitcher } from '@nx-playground/ui-components';
import { themeManager } from '@nx-playground/design-system';
import { i18n, createFeatureI18n } from '@nx-playground/i18n';
import { useDebounce } from '@nx-playground/hooks';
```

## 📂 專案架構

### Feature-based 組織

```
src/
├── features/              # 功能模組
│   ├── home/             # Home 頁面
│   │   ├── components/   # TechProfile, SkillCloud, ContactSection
│   │   ├── pages/        # HomePage
│   │   ├── locales/      # i18n 翻譯 (EN/ZH-TW)
│   │   ├── hooks/        # useHomeTranslation
│   │   └── i18n.ts       # Feature i18n 配置
│   ├── apps/             # Apps 展示
│   │   ├── components/   # AppCard, AppDetail
│   │   ├── pages/        # AppsPage, AppDetailPage
│   │   ├── locales/      # i18n 翻譯
│   │   ├── hooks/        # useAppsTranslation
│   │   └── i18n.ts
│   └── libs/             # Libs 文檔
│       ├── components/   # LibCard
│       ├── pages/        # LibsPage
│       ├── locales/      # i18n 翻譯
│       ├── hooks/        # useLibsTranslation
│       └── i18n.ts
├── data/                 # 配置資料
│   ├── profile.config.ts # 個人資訊
│   ├── apps.config.ts    # Apps 元數據
│   ├── libs.config.ts    # Libs 元數據
│   └── techStack.ts      # 技術棧資料
├── components/
│   └── Layout.tsx        # 主要佈局
├── App.tsx               # 路由配置
└── main.tsx              # 入口點
```

### 路由結構

```
/ (Home)
├── Logo + 個人簡介
├── 技能樹 (30+ 技術標籤)
└── 聯絡方式

/apps (Apps 展示)
├── 5 個 Apps 卡片網格
└── 統計資訊

/apps/:appId (App 詳情)
├── 完整描述
├── 技術棧
├── 主要功能
├── 技術亮點
└── 連結 (Demo/GitHub)

/libs (Libraries 展示)
├── 7 個共享庫展示
├── 依類別分組
├── 優勢說明
└── Monorepo 架構資訊
```

## ✨ 核心功能

### 1. Home 頁面

**TechProfile 組件**:

- 簡單文字 Logo
- 雙語職稱和簡介
- Availability badge (可接案狀態)

**SkillCloud 組件**:

- 30+ 技術標籤
- 按類別分組展示 (Frontend, Backend, Tools, Testing, Deployment)
- 技能等級標示 (Expert, Advanced, Intermediate)
- 顏色編碼和圖例

**ContactSection 組件**:

- Email 聯絡方式
- GitHub Profile 連結
- LinkedIn Profile 連結
- 社交媒體圖標

### 2. Apps 展示

**展示的專案** (來自 monorepo):

1. **Auth Service**

   - React 19 + Ory Kratos
   - OAuth 社交登入
   - Email 驗證流程

2. **Event Management Console**

   - React 19 管理後台
   - Drag-and-drop 表單編輯器
   - 完整 CRUD 功能

3. **Event Platform**

   - Next.js 15 App Router
   - LINE LIFF 整合
   - SSG 靜態生成

4. **Enterprise Admin System**

   - Angular 20 企業應用
   - RBAC 權限系統
   - Dual-control 審批流程

5. **Vue Motion Library**
   - Vue 3 Composition API
   - GSAP 動畫
   - Three.js 3D 圖形

**每個 App 包含**:

- 技術棧列表
- 核心功能
- 技術亮點
- Demo 連結 (Coming Soon 或實際連結)
- 本地開發指令

### 3. Libraries 文檔

**展示的共享庫**:

1. **ui-components** - 40+ UI 組件
2. **design-system** - Design tokens
3. **i18n** - 國際化解決方案
4. **hooks** - 自定義 React hooks
5. **api-client** - OpenAPI 客戶端
6. **charts** - 圖表組件
7. **auth-client** - 認證工具

**展示重點**:

- 程式碼可重用性
- 型別安全
- 一致性保證
- 獨立更新能力
- Tree shaking
- 可測試性

### 4. 多語系支援

**完整雙語實作**:

- **繁體中文 (zh-TW)**: 主要語言
- **English (en)**: 國際化支援

**i18n 架構**:

```typescript
// Feature-based namespaces
- profile-home   (Home 頁面翻譯)
- profile-apps   (Apps 展示翻譯)
- profile-libs   (Libs 文檔翻譯)

// 自定義 hooks 提供型別安全
const { t } = useHomeTranslation();
const title = t('skills.title'); // 型別檢查通過
```

**翻譯檔案位置**:

- `src/features/home/locales/{locale}/home.json`
- `src/features/apps/locales/{locale}/apps.json`
- `src/features/libs/locales/{locale}/libs.json`

## 🚀 開發

### 本地開發

```bash
# 使用 Makefile (推薦)
make dev-profile

# 使用 pnpm
pnpm dev:profile

# 使用 Nx
nx serve @nx-playground/profile
```

訪問: **http://localhost:3003**

### 構建

```bash
# 生產構建
nx build @nx-playground/profile --configuration=production

# 輸出目錄
dist/apps/profile/
```

### 測試和檢查

```bash
# 型別檢查
nx typecheck @nx-playground/profile

# Lint
nx lint @nx-playground/profile

# 完整驗證
./apps/profile/scripts/verify-build.sh
```

## 📝 內容自定義

### 更新個人資訊

編輯 `src/data/profile.config.ts`:

```typescript
export const profileConfig = {
  name: 'Your Name',
  title: {
    'zh-TW': '你的職稱',
    en: 'Your Title',
  },
  bio: {
    'zh-TW': '你的簡介...',
    en: 'Your bio...',
  },
  contact: {
    email: 'your@email.com',
    github: 'https://github.com/username',
    linkedin: 'https://linkedin.com/in/username',
  },
};
```

### 更新技術棧

編輯 `src/data/techStack.ts`:

```typescript
export const techStack = [
  {
    name: 'React 19',
    category: 'frontend',
    level: 'expert', // expert | advanced | intermediate
    color: '#61DAFB',
  },
  // 添加更多技術...
];
```

### 更新 Apps 資訊

編輯 `src/data/apps.config.ts`:

- 修改現有 apps 的描述
- 添加 Demo URLs (當部署後)
- 更新技術棧和功能列表

### 更新翻譯

編輯相應的 JSON 翻譯檔案以自定義文案。

## 🌐 部署到 Cloudflare Pages

### 方法 1: Git Integration (推薦)

**設置步驟**:

1. 推送代碼到 GitHub
2. 前往 [Cloudflare Pages Dashboard](https://dash.cloudflare.com/)
3. 連接 Git repository
4. 配置構建設置:
   - Build command: `pnpm exec nx build @nx-playground/profile --configuration=production`
   - Build output: `dist/apps/profile`
   - Root directory: `/`
   - Environment: `NODE_VERSION=20`

**優點**:

- ✅ 自動化部署
- ✅ 每次 push 自動觸發
- ✅ Preview deployments for PRs
- ✅ 免費 SSL 證書

### 方法 2: Wrangler CLI

```bash
# 構建
pnpm exec nx build @nx-playground/profile --configuration=production

# 部署
wrangler pages deploy dist/apps/profile --project-name=your-project-name
```

詳細說明請參考: [apps/profile/DEPLOYMENT.md](../../apps/profile/DEPLOYMENT.md)

## 📊 效能優化

### Bundle 優化

**Code Splitting 策略**:

- `vendor-react`: React 核心庫 (~305 KB, 96 KB gzipped)
- `vendor-other`: 其他第三方庫 (~217 KB, 69 KB gzipped)
- `vendor-radix`: Radix UI components (~0.4 KB)
- `ui-components`: 共享 UI 組件
- `design-system`: 設計系統
- `app code`: 應用程式碼 (~93 KB, 25 KB gzipped)

**總大小**:

- Uncompressed: ~700 KB
- Gzipped: ~210 KB

### 優化技術

- ✅ Tree shaking - 移除未使用代碼
- ✅ Manual chunks - 優化快取
- ✅ Lazy loading - React Router 路由層級
- ✅ Image optimization - 待實作
- ✅ CSS purging - Tailwind 自動處理

## 🎨 設計系統

### 色彩方案

**品牌色**:

- Primary: Blue (#3B82F6)
- Secondary: Purple (#A855F7)
- Accent: Green (#10B981)

**技能等級**:

- Expert: Blue (#3B82F6)
- Advanced: Green (#10B981)
- Intermediate: Gray (#6B7280)

**App 類別**:

- React: Cyan (#06B6D4)
- Angular: Red (#DD0031)
- Vue: Green (#42B883)
- Next.js: Black (#000000)

### 響應式斷點

```css
- Mobile:  < 768px
- Tablet:  768px - 1024px
- Desktop: > 1024px
```

### Dark Mode

完整支援深色模式：

- 自動偵測系統設定
- 手動切換 (透過 design-system)
- 持久化儲存
- 所有組件適配

## 🌍 國際化

### 支援語言

- **繁體中文 (zh-TW)**: 主要語言
- **English (en)**: 國際化支援

### i18n 架構

採用與 event-cms 相同的模式：

```typescript
// 1. 創建 feature i18n
const i18n = createFeatureI18n({
  namespace: 'profile-home',
  resources: {
    'zh-TW': zhTWHome,
    'en': enHome,
  },
});

// 2. 創建自定義 hook
export const useHomeTranslation = createFeatureTranslation(
  'profile-home',
  ['skills.title', 'contact.email', ...],
);

// 3. 在組件中使用
const { t } = useHomeTranslation();
return <h1>{String(t('skills.title'))}</h1>;
```

### 翻譯檔案管理

所有翻譯集中在 `src/features/{feature}/locales/` 目錄：

- 依 feature 分離（避免衝突）
- 依語言分離（易於管理）
- JSON 格式（易於編輯）
- 型別安全（透過 custom hooks）

## 📦 依賴關係

Profile app 依賴以下共享庫：

```
@nx-playground/profile
├── @nx-playground/ui-components    (40+ components)
├── @nx-playground/design-system    (themes & tokens)
├── @nx-playground/i18n             (i18next)
├── @nx-playground/hooks            (custom hooks)
├── @nx-playground/api-client       (API utilities)
└── @nx-playground/auth-client      (auth helpers)
```

Nx 自動管理構建順序，確保依賴庫先構建。

## 🔧 配置系統

### 配置檔案結構

所有可自定義內容集中在 `src/data/` 目錄：

**profile.config.ts** - 個人資訊

```typescript
{
  name: string;
  title: { 'zh-TW': string; en: string };
  bio: { 'zh-TW': string; en: string };
  contact: { email, github, linkedin };
  availability: { 'zh-TW': string; en: string };
}
```

**techStack.ts** - 技術標籤

```typescript
{
  name: string;
  category: 'frontend' | 'backend' | 'tools' | 'testing' | 'deployment';
  level: 'expert' | 'advanced' | 'intermediate';
  color: string;
}
[];
```

**apps.config.ts** - 專案資訊

```typescript
{
  id: string;
  name: string;
  category: 'react' | 'angular' | 'vue' | 'nextjs';
  techStack: string[];
  features: string[];
  highlights: string[];
  demoUrl?: string;
  status: 'deployed' | 'coming-soon';
}[]
```

**libs.config.ts** - 函式庫資訊

```typescript
{
  id: string;
  packageName: string;
  category: 'ui' | 'data' | 'utils';
  description: string;
  purpose: string;
  highlights: string[];
  stats?: { components?, hooks?, utilities? };
}[]
```

## 🚀 部署流程

### 1. 準備階段

```bash
# 1. 更新個人資訊
vi apps/profile/src/data/profile.config.ts

# 2. 檢查並更新技術棧
vi apps/profile/src/data/techStack.ts

# 3. 驗證構建
./apps/profile/scripts/verify-build.sh
```

### 2. Cloudflare Pages 部署

**Git Integration** (自動化):

```bash
# 推送到 GitHub
git add .
git commit -m "feat: customize profile content"
git push origin main

# Cloudflare Pages 自動構建和部署
```

**Wrangler CLI** (手動):

```bash
# 構建
pnpm exec nx build @nx-playground/profile --configuration=production

# 部署
wrangler pages deploy dist/apps/profile --project-name=nx-playground-profile
```

### 3. 驗證部署

部署完成後測試：

- [ ] 所有頁面載入正常
- [ ] 路由切換正常
- [ ] 語言切換正常
- [ ] Dark mode 正常
- [ ] 響應式設計正常
- [ ] 所有連結正確

## 📚 文檔資源

### Profile App 專屬文檔

位於 `apps/profile/`:

1. **README.md** - 完整專案文檔
2. **DEPLOYMENT.md** - 詳細部署指南
3. **QUICKSTART.md** - 快速開始教學
4. **IMPLEMENTATION_SUMMARY.md** - 實作總結
5. **NEXT_STEPS.md** - 下一步行動指南

### 腳本工具

位於 `apps/profile/scripts/`:

1. **deploy-cloudflare.sh** - 部署腳本
2. **verify-build.sh** - 構建驗證

### 配置檔案

- **wrangler.toml** - Cloudflare Wrangler 配置
- **vite.config.ts** - Vite 構建配置
- **project.json** - Nx 專案配置

## 💡 使用場景

### 作為接案 Portfolio

**展示內容**:

- ✅ 多框架能力 (React, Angular, Vue)
- ✅ 企業級專案經驗 (RBAC, 審批流程)
- ✅ 現代化技術棧 (React 19, Next.js 15)
- ✅ 完整開發流程 (i18n, testing, deployment)
- ✅ Monorepo 架構經驗

**適合展示給**:

- 需要全端工程師的公司
- 需要 React/Angular/Vue 專家的團隊
- 尋找 Nx Monorepo 經驗的組織
- 需要國際化經驗的專案

### 作為技術履歷

**亮點**:

- 清晰展示技術深度和廣度
- 實際專案作為證明
- 程式碼品質展示 (TypeScript, 測試, 文檔)
- 持續學習態度 (最新技術)

**可搭配**:

- LinkedIn Profile
- GitHub Repositories
- 傳統履歷 (PDF/Doc)

### 作為學習參考

**學習重點**:

- Nx Monorepo 架構模式
- Feature-based i18n 實作
- Component-driven 開發
- TypeScript 最佳實踐
- Modern build tooling
- Cloudflare Pages 部署

## 🎯 最佳實踐

### 程式碼品質

- ✅ 100% TypeScript
- ✅ 嚴格型別檢查
- ✅ ESLint 規則遵循
- ✅ Component 單一職責
- ✅ Custom hooks 邏輯分離
- ✅ 配置驅動設計

### 效能考量

- ✅ Code splitting
- ✅ Lazy loading
- ✅ Tree shaking
- ✅ Bundle 優化
- ✅ 快取策略

### 維護性

- ✅ 清晰的檔案結構
- ✅ 詳盡的文檔
- ✅ 可配置的內容
- ✅ 易於擴展的架構

## 🔮 未來規劃

### 短期 (1-2 週)

- [ ] 添加個人照片/頭像
- [ ] 添加專案截圖
- [ ] SEO meta tags
- [ ] sitemap.xml
- [ ] Google Analytics

### 中期 (1-2 月)

- [ ] Contact form (Cloudflare Workers)
- [ ] Blog 系統
- [ ] 案例研究 (Case Studies)
- [ ] 客戶評價

### 長期 (3+ 月)

- [ ] CMS 整合
- [ ] 互動式 Demos
- [ ] Video 介紹
- [ ] Newsletter 訂閱

## 📊 專案統計

### 代碼量

- **總檔案**: 50+ files
- **總程式碼**: ~2000+ lines
- **Components**: 10+
- **Pages**: 5
- **Translation keys**: 60+

### 內容量

- **技術標籤**: 30+
- **Apps 展示**: 5
- **Libs 文檔**: 7
- **語言支援**: 2

### 構建產物

- **HTML**: 1 file (~1 KB)
- **CSS**: 2 files (~120 KB)
- **JS**: 5 chunks (~700 KB, 210 KB gzipped)

## 🎓 技術亮點

此專案展示的進階技術：

1. **Nx Monorepo 管理**

   - Workspace libraries
   - Build orchestration
   - Dependency graph
   - Affected commands

2. **React 19 最佳實踐**

   - Functional components
   - Custom hooks
   - TypeScript strict mode
   - Performance optimization

3. **i18n 架構設計**

   - Feature-based namespaces
   - Type-safe translations
   - SSR compatibility
   - Custom hooks pattern

4. **Modern Build Tools**

   - Vite 6 極速構建
   - Code splitting
   - Tree shaking
   - Production optimizations

5. **Cloudflare Pages 部署**
   - Monorepo 構建配置
   - SPA routing 處理
   - CI/CD 整合
   - Environment management

## 🔗 相關資源

### 內部文檔

- [PROJECT_SPECIFICATION.md](../PROJECT_SPECIFICATION.md) - 專案規格
- [DEVELOPMENT_GUIDE.md](../DEVELOPMENT_GUIDE.md) - 開發指南
- [CURRENT_STATUS.md](../CURRENT_STATUS.md) - 當前狀態

### 外部資源

- [React 19 Documentation](https://react.dev/)
- [Nx Monorepo Documentation](https://nx.dev/)
- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)

---

**專案狀態**: ✅ Production Ready

**最後更新**: 2025-10-20

**維護者**: NX Playground Team

**部署平台**: Cloudflare Pages

**Live Demo**: Coming soon! 🚀
