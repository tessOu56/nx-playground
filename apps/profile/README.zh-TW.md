---
id: profile
name: Profile
version: 1.0.0
description: 在 Nx monorepo 中展示專案和技能的技術作品集
techStack:
  - React 19
  - Vite 6
  - TypeScript
  - Tailwind CSS
  - React Router
features:
  - 多語言支援（en, zh-TW）
  - AI 搜尋
  - 專案與部落格展示
  - 響應式設計
  - PWA 支援
lastUpdated: '2025-01-24'
---

# Profile - 技術作品集

> 使用 React 19、Vite 6 和現代網頁技術在 Nx monorepo 中建構的全端開發者作品集。

## 快速開始

### 安裝相依套件
```bash
pnpm install
```

### 啟動開發伺服器
```bash
# 使用 Makefile（推薦）
make dev-profile

# 使用 pnpm
pnpm dev:profile

# 使用 Nx
nx serve profile
```

訪問：**http://localhost:3003**

### 建構生產版本
```bash
nx build profile --configuration=production
```

輸出目錄：`dist/apps/profile/`

---

## 功能特色

- **多頁面應用程式**：首頁、專案、部落格、搜尋、詳情頁
- **AI 搜尋**：智能關鍵字匹配與對話持久化
- **多語言**：完整支援英文和繁體中文
- **效能**：Lighthouse 90+、PWA 就緒、程式碼分割
- **響應式**：Mobile-first 設計與自適應 header
- **現代 UI**：Notion 風格簡潔介面

---

## 技術棧

- React 19 + TypeScript
- Vite 6（建構工具）
- React Router 6（路由）
- Tailwind CSS（樣式）
- Zustand（狀態管理）
- i18next（國際化）

### 共享函式庫
- `@nx-playground/ui-components` - 元件庫
- `@nx-playground/design-system` - 設計 tokens
- `@nx-playground/i18n` - 國際化
- `@nx-playground/search-engine` - 搜尋引擎
- `@nx-playground/hooks` - React hooks

---

## 專案結構

```
src/
├── features/           # 功能模組
│   ├── home/          # 首頁
│   ├── projects/      # 專案展示
│   ├── blogs/         # 部落格系統
│   ├── search/        # AI 搜尋
│   └── detail/        # 詳情頁
├── components/        # 共享元件
├── lib/               # 工具（loaders、helpers）
├── stores/            # Zustand stores
└── locales/           # i18n 翻譯
```

---

## 開發

### 可用指令

```bash
# 開發
pnpm dev:profile          # 啟動開發伺服器
nx serve profile          # 使用 Nx 的替代方式

# 建構
nx build profile          # 生產建構
nx build profile --watch  # Watch 模式

# 測試
nx test profile           # 執行測試
nx test profile --watch   # Watch 模式

# Lint
nx lint profile           # 檢查程式碼品質
```

---

## 部署

### Cloudflare Pages

**建構設定**：
- 建構指令：`nx build profile --configuration=production`
- 建構輸出：`dist/apps/profile`
- Node 版本：20+

**環境變數**：
- `NODE_VERSION=20`

---

## 授權

MIT

---

使用 Nx、React 和現代網頁技術建構 ❤️
