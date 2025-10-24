---
id: profile
name: Profile
version: 0.0.1
description: >-
  展示技術技能、專案和共享函式庫的專業個人網站，建構於 Nx monorepo 架構
techStack:
  - React 19
  - Vite
  - i18n
  - Tailwind CSS
  - React Router
features:
  - 多語言支援
  - 響應式設計
  - 應用程式展示
  - 函式庫展示
  - 技術文件搜尋
lastUpdated: '2025-10-21'
---
# Profile - 技術個人網站 & 作品集

> 展示技術技能、專案和共享函式庫的專業個人網站，建構於 Nx monorepo 架構

## 🎯 概覽

這是一個全功能的技術個人網站，用於展示：

- 現代網頁開發的個人技能和專長
- Nx monorepo 中建構的所有應用程式
- 共享函式庫及其用途
- 基於 locale 路由的多語言支援（英文和繁體中文）
- 自由接案和全職工作機會的專業展示

## 🚀 快速開始

### 1. 安裝相依套件

```bash
pnpm install
```

### 2. 啟動開發伺服器

```bash
# 使用 Makefile（推薦）
make dev-profile

# 使用 pnpm
pnpm dev:profile

# 直接使用 Nx
nx serve @nx-playground/profile
```

訪問：**http://localhost:3003**

應用程式會自動重定向到 `/zh-TW`（預設語系）。

### 3. 自訂內容

編輯以下設定檔來個人化你的作品集：

```typescript
// src/data/profile.config.ts
export const profileConfig = {
  name: '你的名字', // ← 修改這裡
  title: {
    'zh-TW': '你的職稱',
    en: 'Your Title',
  },
  bio: {
    'zh-TW': '你的簡介...',
    en: 'Your bio...',
  },
  contact: {
    github: 'https://github.com/yourusername', // ← 你的 GitHub
  },
};
```

### 4. 建構生產版本

```bash
nx build @nx-playground/profile --configuration=production
```

輸出目錄：`dist/apps/profile/`

### 5. 部署到 Cloudflare Pages

詳細說明請參閱下方的[部署指南](#-部署)。

## ✨ 功能特色

### 首頁

- 可設定內容的個人簡介
- 展示技術棧的互動式技能雲
- 分類的技術（前端、後端、工具、測試、部署）
- 聯絡資訊區塊
- 可用性狀態

### 應用程式展示

- 所有 monorepo 應用程式的網格顯示
- 每個應用程式的詳細頁面
- 技術棧視覺化
- 主要功能和亮點
- 示範連結（含「即將推出」狀態）
- 本地開發指令

### 函式庫文件

- 完整的函式庫展示
- 依用途分類（UI、資料、工具）
- 共享函式庫的優勢
- 使用統計
- Monorepo 架構亮點

### 國際化

- 完整支援英文（en）和繁體中文（zh-TW）
- 基於功能的翻譯命名空間
- 導覽列中的語言切換器
- 所有內容可翻譯

## 🛠️ 技術棧

- **React 19** - 具備最新功能的 UI 框架
- **TypeScript** - 型別安全開發
- **Vite 6** - 超快速建構工具
- **React Router 6** - 客戶端路由
- **Tailwind CSS** - Utility-first 樣式框架
- **@nx-playground/i18n** - 國際化（i18next）
- **@nx-playground/ui-components** - 共享 UI 元件
- **@nx-playground/design-system** - 設計 tokens 和主題系統
- **@nx-playground/hooks** - 自訂 React hooks

## 🚀 開發

### 啟動開發伺服器

```bash
# 使用 Makefile
make dev-profile

# 使用 pnpm
pnpm dev:profile

# 直接使用 Nx
nx serve @nx-playground/profile
```

訪問：**http://localhost:3003**

### 建構生產版本

```bash
# 建構最佳化的生產版本
nx build @nx-playground/profile --configuration=production

# 輸出目錄：dist/apps/profile
```

### 其他指令

```bash
# 執行測試
nx test @nx-playground/profile

# Lint 程式碼
nx lint @nx-playground/profile

# 型別檢查
nx typecheck @nx-playground/profile
```

## 📂 專案結構

```
apps/profile/
├── src/
│   ├── features/               # 基於功能的組織
│   │   ├── home/              # 首頁功能
│   │   │   ├── components/    # TechProfile, SkillCloud, ContactSection
│   │   │   ├── pages/         # HomePage
│   │   │   ├── locales/       # i18n 翻譯（en, zh-TW）
│   │   │   └── i18n.ts        # 功能 i18n 設定
│   │   ├── projects/          # 專案展示功能
│   │   │   ├── components/    # ProjectCard
│   │   │   ├── pages/         # ProjectsPage
│   │   │   ├── locales/       # i18n 翻譯
│   │   │   └── i18n.ts
│   │   ├── blogs/             # 部落格功能
│   │   │   ├── components/    # BlogCard
│   │   │   ├── pages/         # BlogListPage, BlogPostPage
│   │   │   ├── locales/       # i18n 翻譯
│   │   │   └── i18n.ts
│   │   └── search/            # AI 搜尋功能
│   │       ├── components/    # SearchInput, ChatMessage
│   │       ├── pages/         # SearchPage
│   │       └── i18n.ts
│   ├── components/
│   │   └── layout/            # Layout, Header, Footer
│   ├── lib/                   # 工具函式和載入器
│   │   ├── projectLoader.ts   # 專案資料載入
│   │   ├── blogLoader.ts      # 部落格資料載入
│   │   └── specLoader.ts      # Spec 檔案載入
│   ├── stores/                # Zustand 狀態管理
│   ├── App.tsx                # 路由設定
│   └── main.tsx               # 應用程式進入點
├── public/
│   ├── _redirects             # Cloudflare Pages 的 SPA 路由
│   └── assets/                # 靜態資源
└── vite.config.ts             # Vite 設定
```

## 🌐 部署

### Cloudflare Pages（推薦）

此應用程式已針對 Cloudflare Pages 部署進行最佳化。

#### 選項 1：Git 整合（推薦）

1. 將程式碼推送到 GitHub/GitLab
2. 前往 Cloudflare 控制台 > Pages
3. 建立新專案並連接你的儲存庫
4. 設定建構設定：
   - **建構指令**：`pnpm exec nx build @nx-playground/profile --configuration=production`
   - **建構輸出目錄**：`dist/apps/profile`
   - **根目錄**：`/`（monorepo 根目錄）
   - **Node 版本**：20 或更高
   - **環境變數**：新增 `NODE_VERSION=20`

#### 選項 2：使用 Wrangler 直接上傳

```bash
# 執行部署腳本
./apps/profile/scripts/deploy-cloudflare.sh

# 或手動執行：
# 1. 建構應用程式
pnpm exec nx build @nx-playground/profile --configuration=production

# 2. 安裝 Wrangler（如果尚未安裝）
npm install -g wrangler

# 3. 登入 Cloudflare
wrangler login

# 4. 部署
wrangler pages deploy dist/apps/profile --project-name=your-project-name
```

### SPA 路由

`public/_redirects` 檔案確保所有路由都由 React Router 處理：

```
/* /index.html 200
```

這對於在 Cloudflare Pages 上正確運作客戶端路由至關重要。

## ⚙️ 設定與自訂

### 逐步自訂指南

#### 1. 個人資訊

編輯 `src/data/profile.config.ts`（已棄用，現在使用 homeConfig）：

```typescript
// src/features/home/data/homeConfig.ts
export const homeConfig = {
  tagline: {
    'zh-TW': '全端工程師 & Nx Monorepo 專家',
    en: 'Full-Stack Developer & Nx Monorepo Specialist',
  },
  // ... 其他設定
};
```

#### 2. 技術棧與技能

技術棧資料現在由 `@nx-playground/tech-stack-data` 函式庫自動收集。

#### 3. 專案展示

專案資料由 README 和 Spec 檔案自動載入。新增專案：

1. 在 `apps/` 或 `libs/` 中建立專案
2. 加入 `README.md` 和 `README.zh-TW.md`
3. 在 `specs/apps/` 或 `specs/libs/` 中建立 spec 檔案
4. 應用程式會自動偵測並顯示

#### 4. 翻譯

更新 `src/features/*/locales/` 中的翻譯檔案：

- `en/*.json` - 英文翻譯
- `zh-TW/*.json` - 繁體中文翻譯

### 自訂檢查清單

- [ ] 更新首頁設定（homeConfig）
- [ ] 測試兩個語言版本（EN & ZH-TW）
- [ ] 驗證所有連結正常運作
- [ ] 建構並測試生產版本
- [ ] 部署到 Cloudflare Pages

## 🌍 國際化

應用程式使用基於功能的 i18n 與命名空間隔離：

- **home**: 首頁翻譯
- **projects**: 專案展示翻譯
- **blogs**: 部落格翻譯
- **search**: 搜尋頁面翻譯
- **detail**: 詳細頁面翻譯
- **layout**: 版面配置（Header、Footer）翻譯

支援的語言：

- 英文（`en`）
- 繁體中文（`zh-TW`）

## 📊 效能最佳化

- **程式碼分割**：自動基於路由的分割
- **Tree Shaking**：消除未使用的程式碼
- **手動分塊**：分離 vendor 函式庫
- **延遲載入**：按需載入元件
- **最佳化建構**：Vite 生產環境最佳化
- **PWA 支援**：Service Worker 和離線快取
- **圖片最佳化**：Lazy loading 和模糊佔位符

## 🎨 主題

應用程式透過設計系統支援淺色和深色模式：

- 自動偵測主題
- 手動切換主題
- 持久化主題偏好
- Tailwind 深色模式工具

## 🔧 相依套件

所有共享函式庫都在 Nx monorepo 中管理：

```json
{
  "@nx-playground/ui-components": "workspace:*",
  "@nx-playground/design-system": "workspace:*",
  "@nx-playground/i18n": "workspace:*",
  "@nx-playground/hooks": "workspace:*",
  "@nx-playground/tech-stack-data": "workspace:*",
  "@nx-playground/search-engine": "workspace:*"
}
```

## 📝 授權

MIT

## 🔗 線上展示

即將在 Cloudflare Pages 上線！

---

使用 Nx、React 和現代網頁技術建構 ❤️

