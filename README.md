# NX Playground

> 實驗性 Nx Monorepo 專案 - 整合多個前端技術棧的完整展示平台

[![Nx](https://img.shields.io/badge/Nx-21.4-blue.svg)](https://nx.dev)
[![React](https://img.shields.io/badge/React-19-cyan.svg)](https://react.dev)
[![Next.js](https://img.shields.io/badge/Next.js-15-black.svg)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://typescriptlang.org)
[![pnpm](https://img.shields.io/badge/pnpm-10.13-orange.svg)](https://pnpm.io)

## 📋 專案簡介

NX Playground 是一個展示現代前端技術棧的實驗性 Monorepo 專案，包含：
- 🔐 完整的認證系統
- 📊 活動內容管理系統 (CMS)
- 🎫 公開活動展示平台
- 🎨 設計系統和 UI 組件庫
- 🧩 跨框架整合 (React, Next.js, Angular, Vue)

## 🚀 快速開始

### 首次設置

```bash
make setup      # 安裝依賴並設置環境
```

### 啟動服務

```bash
# 啟動單一服務
make dev-event-portal  # Event Portal 服務
make dev-event-cms     # Event CMS 服務
make dev-profile       # Profile 技術展示

# 或使用 pnpm
pnpm dev:event-portal
pnpm dev:event-cms
pnpm dev:profile
```

## 📋 常用命令

| 命令                    | 說明                   |
| ----------------------- | ---------------------- |
| `make setup`            | 首次設置開發環境       |
| `make dev`              | 啟動所有服務           |
| `make dev-event-portal` | 啟動 Event Portal 服務 |
| `make dev-event-cms`    | 啟動 Event CMS 服務    |
| `make dev-profile`      | 啟動 Profile 技術展示  |
| `make dev-vue`          | 啟動 Vue Motion 服務   |
| `make dev-angular`      | 啟動 Enterprise Admin  |
| `make stop`             | 停止所有服務           |
| `make logs`             | 查看日誌               |
| `make help`             | 查看所有命令           |

## 🌐 服務網址

- **Event Portal** (活動展示): http://localhost:3000
- **Event CMS** (活動管理): http://localhost:3002
- **Profile** (技術展示): http://localhost:3003
- **Vue Motion** (動畫實驗): http://localhost:8080
- **Enterprise Admin** (企業管理): http://localhost:4200

## 📦 專案結構

```
nx-playground/
├── apps/                    # 應用程式
│   ├── auth/               # 🔐 認證服務 (React + Vite)
│   ├── event-cms/          # 📊 活動 CMS (React + Vite, Port 3002)
│   ├── event-portal/       # 🎫 活動展示 (Next.js 15, Port 3000)
│   ├── profile/            # 🎯 技術展示 (React + Vite, Port 3003)
│   ├── enterprise-admin/   # 📈 企業管理 (Angular 20, Port 4200)
│   └── vue-motion/         # 🎨 動畫實驗 (Vue 3, Port 8080)
├── libs/                    # 共享函式庫
│   ├── api-client/         # API 客戶端 (React Query + Orval)
│   ├── auth-client/        # 認證客戶端 (SSO 整合)
│   ├── charts/             # 圖表庫 (Recharts + Chart.js)
│   ├── design-system/      # 設計系統 (Style Dictionary)
│   ├── hooks/              # React Hooks (usehooks-ts + custom)
│   ├── i18n/               # 國際化 (i18next + next-intl)
│   └── ui-components/      # UI 組件庫 (Radix UI + Tailwind)
├── templates/               # 專案模板
│   └── react-template/     # React 專案快速建立模板
├── scripts/                 # 自動化腳本
└── docs/                    # 文檔
```

## 🎯 技術棧

### 前端框架
- **React 19** - auth, event-cms, profile
- **Next.js 15** - event-portal (App Router + SSG)
- **Angular 20** - enterprise-admin
- **Vue 3** - vue-motion

### Monorepo 工具
- **Nx 21.4** - Workspace 管理、依賴圖、快取
- **pnpm** - 套件管理器

### UI/樣式
- **Tailwind CSS** - 工具類樣式系統
- **Radix UI** - 無障礙 UI 組件
- **Vanilla Extract** - CSS-in-TypeScript
- **Style Dictionary** - Design Tokens 生成

### 狀態管理
- **Zustand** - 全局狀態管理
- **React Query** - 服務端狀態管理
- **Context API** - 主題和認證

### 開發工具
- **TypeScript 5.8** - 類型系統
- **Vite 6** - 快速構建工具
- **ESLint** - 程式碼檢查
- **Prettier** - 程式碼格式化
- **Husky** - Git hooks

## 🎯 快速建立新專案

使用 React 模板快速建立新的應用：

```bash
# 方式 1: 使用腳本（推薦）
./scripts/create-react-app.sh my-new-app 3005
./scripts/finish-setup.sh my-new-app 3005

# 方式 2: 手動複製
cp -r templates/react-template apps/my-new-app
# 然後手動更新配置文件

# 啟動新專案
pnpm dev:my-new-app
```

## 📚 文檔

- [CREATE_REACT_APP.md](docs/CREATE_REACT_APP.md) - React 模板使用指南
- [PROJECT_SETUP.md](docs/PROJECT_SETUP.md) - 專案設置總結
- [MIGRATION.md](MIGRATION.md) - 專案遷移說明

### 應用文檔
- [apps/auth/README.md](apps/auth/README.md) - 認證服務
- [apps/console/README.md](apps/console/README.md) - 控制台
- [apps/events/README.md](apps/events/README.md) - 活動管理
- [apps/profile/README.md](apps/profile/README.md) - 技術展示
- [apps/angular-dashboard/README.md](apps/angular-dashboard/README.md) - Angular Dashboard

### 函式庫文檔
- [libs/api-client/README.md](libs/api-client/README.md) - API 客戶端
- [libs/ui-components/README.md](libs/ui-components/README.md) - UI 組件
- [libs/design-system/README.md](libs/design-system/README.md) - 設計系統
- [libs/i18n/README.md](libs/i18n/README.md) - 國際化
- [libs/hooks/README.md](libs/hooks/README.md) - React Hooks

## 🛠️ 開發命令

### 構建
```bash
pnpm build:safe           # 構建所有專案
pnpm build:affected       # 只構建受影響的專案
nx build <project-name>   # 構建單一專案
```

### 測試
```bash
pnpm test                 # 執行所有測試
pnpm test:watch           # 監聽模式
pnpm test:coverage        # 生成覆蓋率報告
pnpm test:affected        # 只測試受影響的專案
```

### Lint
```bash
pnpm lint                 # 檢查所有專案
pnpm lint:fix             # 自動修復
pnpm lint:affected        # 只檢查受影響的專案
```

### Nx 特性
```bash
nx graph                  # 查看專案依賴圖
nx affected:build         # 只構建受影響的專案
nx affected:test          # 只測試受影響的專案
nx reset                  # 清除 Nx 快取
```

## 🔗 相關資源

- [Nx Documentation](https://nx.dev)
- [React Documentation](https://react.dev)
- [Next.js Documentation](https://nextjs.org)
- [Angular Documentation](https://angular.dev)
- [Vue Documentation](https://vuejs.org)
