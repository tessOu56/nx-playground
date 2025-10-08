# 專案遷移說明

## 概述

本專案 `nx-playground` 是從 `partivo` 專案複製而來的技術架構實驗性專案。

## 遷移日期

2025-10-08

## 遷移內容

### 1. 專案結構複製

完整複製了 Partivo 專案的以下內容：

- **應用程式 (Apps)**
  - `apps/auth` - 認證服務
  - `apps/console` - 控制台應用
  - `apps/events` - 活動管理應用

- **函式庫 (Libraries)**
  - `libs/api-client` - API 客戶端
  - `libs/auth-client` - 認證客戶端
  - `libs/design-system` - 設計系統
  - `libs/hooks` - React Hooks
  - `libs/i18n` - 國際化
  - `libs/ui-components` - UI 組件庫

- **開發文件 (Documentation)**
  - `docs/console-dev` - Console 開發文件
  - `docs/events-dev` - Events 開發文件
  - `docs/libs-dev` - 函式庫開發文件

- **配置文件**
  - Nx 配置
  - TypeScript 配置
  - ESLint 配置
  - Prettier 配置
  - Tailwind CSS 配置
  - Docker 配置
  - Makefile

### 2. 名稱空間更新

所有 `@partivo` 的引用已更新為 `@nx-playground`：

- ✅ `package.json` - 專案名稱和依賴引用
- ✅ `tsconfig.base.json` - TypeScript 路徑映射
- ✅ `nx.json` - Nx 配置
- ✅ 所有應用程式的 `package.json`
- ✅ 所有函式庫的 `package.json`
- ✅ 所有源代碼中的導入語句
- ✅ Makefile 中的命令
- ✅ Docker 配置文件

### 3. 專案識別更新

- 專案名稱：`Partivo` → `NX Playground`
- 域名引用：`partivo.com` → `nx-playground.local`
- README 描述已更新

## 技術棧

### 前端框架
- **React 19.0.0** - UI 框架
- **Next.js 15.2.5** - Events 應用框架
- **Vite** - Console 和 Auth 應用構建工具

### 狀態管理
- **Zustand** - 全局狀態管理
- **React Query (TanStack Query)** - 服務端狀態管理

### UI 組件
- **Radix UI** - 無障礙 UI 組件
- **Tailwind CSS** - 樣式框架
- **Vanilla Extract** - CSS-in-TypeScript

### 開發工具
- **Nx** - Monorepo 管理工具
- **TypeScript 5.8.2** - 類型系統
- **ESLint** - 程式碼檢查
- **Prettier** - 程式碼格式化
- **Jest & Vitest** - 測試框架

### 其他工具
- **pnpm** - 套件管理器
- **Husky** - Git hooks
- **Commitlint** - 提交訊息檢查
- **Docker** - 容器化部署

## 快速開始

### 本地開發

```bash
# 安裝依賴並設置環境
make setup

# 啟動所有服務
make dev

# 或者分別啟動
make dev-events   # Events 服務 (http://localhost:3000)
make dev-console  # Console 服務 (http://localhost:3002)
```

### Docker 開發

```bash
# 建置並啟動 Docker 服務
make docker-up-build

# 查看日誌
make docker-logs

# 停止服務
make docker-stop
```

## 專案結構

```
nx-playground/
├── apps/                    # 應用程式
│   ├── auth/               # 認證服務 (React + Vite)
│   ├── console/            # 控制台 (React + Vite)
│   └── events/             # 活動管理 (Next.js)
├── libs/                    # 共享函式庫
│   ├── api-client/         # API 客戶端
│   ├── auth-client/        # 認證客戶端
│   ├── design-system/      # 設計系統
│   ├── hooks/              # React Hooks
│   ├── i18n/               # 國際化
│   └── ui-components/      # UI 組件
├── docs/                    # 開發文件
├── scripts/                 # 自動化腳本
├── nx.json                  # Nx 配置
├── tsconfig.base.json       # TypeScript 基礎配置
├── pnpm-workspace.yaml      # pnpm workspace 配置
├── Makefile                 # 開發命令
└── docker-compose.yml       # Docker 配置
```

## Nx Workspace 配置

### 應用程式名稱
- `@nx-playground/auth`
- `@nx-playground/console`
- `@nx-playground/events`

### 函式庫名稱
- `@nx-playground/api-client`
- `@nx-playground/auth-client`
- `@nx-playground/design-system`
- `@nx-playground/hooks`
- `@nx-playground/i18n`
- `@nx-playground/ui-components`

## 環境需求

- **Node.js**: 18+
- **pnpm**: 最新版本
- **Docker**: (可選) 用於容器化開發

## 注意事項

1. **依賴安裝**: 首次使用請執行 `make setup` 安裝所有依賴
2. **環境變數**: 環境變數設置腳本會在 `make setup` 時自動執行
3. **Port 衝突**: 請確保 3000 和 3002 端口未被佔用
4. **pnpm-lock.yaml**: 此文件未更新，首次安裝時會自動更新

## 後續步驟

1. ✅ 專案結構已複製
2. ✅ 所有引用已更新
3. ⏳ 執行 `make setup` 安裝依賴
4. ⏳ 執行測試確保功能正常
5. ⏳ 根據需求調整配置

## 參考資料

- 原始專案: Partivo
- Nx 文件: https://nx.dev
- React 文件: https://react.dev
- Next.js 文件: https://nextjs.org
