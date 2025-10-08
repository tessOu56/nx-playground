# NX Playground 專案設置總結

## 📊 專案概覽

NX Playground 是一個基於 Nx Monorepo 的實驗性專案，整合了多個前端技術棧。

## 🏗️ 完整專案結構

```
nx-playground/
├── apps/                       # 應用程式
│   ├── auth/                  # 認證服務 (React + Vite) - Port 3000
│   ├── console/               # 控制台 (React + Vite) - Port 3002
│   ├── events/                # 活動管理 (Next.js 15) - Port 3000
│   ├── profile/               # 技術展示 (React + Vite) - Port 3003 ⭐ 新增
│   └── angular-dashboard/     # Angular Dashboard - Port 4200 ⭐ 新增
├── libs/                       # 共享函式庫
│   ├── api-client/            # API 客戶端
│   ├── auth-client/           # 認證客戶端
│   ├── design-system/         # 設計系統（含 token 生成）
│   ├── hooks/                 # React Hooks
│   ├── i18n/                  # 國際化
│   ├── ui-components/         # UI 組件庫
│   └── vue-motion/            # Vue 動畫效果庫 ⭐ 新增
├── templates/                  # 專案模板 ⭐ 新增
│   └── react-template/        # React 專案模板
├── scripts/                    # 自動化腳本
│   ├── create-react-app.sh   # 建立 React 專案 ⭐ 新增
│   ├── finish-setup.sh        # 完成專案設置 ⭐ 新增
│   └── ... (其他腳本)
└── docs/                       # 文檔
    ├── CREATE_REACT_APP.md    # React 模板使用指南 ⭐ 新增
    └── PROJECT_SETUP.md       # 本文檔 ⭐ 新增
```

## 🎯 主要功能

### 1. Profile App（技術展示）

**位置**: `apps/profile`
**端口**: 3003
**技術**: React 19 + Vite + TypeScript

**展示內容**:
- ✅ Nx Monorepo 特性（依賴圖、快取、affected）
- ✅ React 19 功能（Hooks、組件組合、性能優化）
- ✅ Design System 整合（按鈕、顏色、排版、間距）
- ✅ 共享函式庫使用示範

**啟動**:
```bash
make dev-profile
# 或
pnpm dev:profile
# 訪問 http://localhost:3003
```

### 2. React Template（專案模板）

**位置**: `templates/react-template`
**用途**: 快速建立新的 React 應用

**包含**:
- 完整的 Nx 配置
- TypeScript 設置
- Vite 構建配置
- ESLint 配置
- 基本 React 應用結構
- 設計系統和 UI 組件整合

**使用方式**:
```bash
# 快速建立新專案
./scripts/create-react-app.sh my-app 3005
./scripts/finish-setup.sh my-app 3005

# 啟動專案
pnpm dev:my-app
```

## 📦 所有應用程式

| 應用 | 技術 | 端口 | 命令 |
|------|------|------|------|
| Auth | React + Vite | 3000 | `make dev-auth` |
| Console | React + Vite | 3002 | `make dev-console` |
| Events | Next.js 15 | 3000 | `make dev-events` |
| Profile | React + Vite | 3003 | `make dev-profile` |
| Angular Dashboard | Angular 20 | 4200 | `make dev-angular` |
| Vue Motion | Vue 3 | 8080 | `make dev-vue` |

## 🛠️ 技術棧

### 前端框架
- **React 19** - auth, console, profile
- **Next.js 15** - events
- **Angular 20** - angular-dashboard
- **Vue 3** - vue-motion

### 構建工具
- **Vite 6** - React 應用
- **Next.js** - SSG/SSR 應用
- **Angular CLI** - Angular 應用
- **Vue CLI** - Vue 應用

### Monorepo
- **Nx 21.4** - Workspace 管理
- **pnpm** - 套件管理器

### UI/樣式
- **Tailwind CSS 3** - 工具類樣式
- **Radix UI** - 無障礙組件
- **Vanilla Extract** - CSS-in-TypeScript
- **Style Dictionary** - Design Tokens

### 狀態管理
- **Zustand** - 全局狀態
- **React Query (TanStack)** - 服務端狀態

### 開發工具
- **TypeScript 5.8** - 類型系統
- **ESLint 9** - 程式碼檢查
- **Prettier** - 程式碼格式化
- **Husky** - Git hooks
- **Jest & Vitest** - 測試框架

## 🚀 常用命令

### 開發
```bash
make setup          # 首次設置環境
make dev            # 啟動所有服務
make dev-events     # 啟動 Events
make dev-console    # 啟動 Console
make dev-profile    # 啟動 Profile
make dev-vue        # 啟動 Vue Motion
make dev-angular    # 啟動 Angular
make stop           # 停止所有服務
```

### 構建
```bash
pnpm build:safe           # 構建所有專案
pnpm build:affected       # 只構建受影響的專案
nx build @nx-playground/profile  # 構建單一專案
```

### 測試
```bash
pnpm test              # 執行所有測試
pnpm test:watch        # 監聽模式
pnpm test:coverage     # 生成覆蓋率報告
pnpm test:affected     # 只測試受影響的專案
```

### Lint
```bash
pnpm lint              # 檢查所有專案
pnpm lint:fix          # 自動修復
pnpm lint:affected     # 只檢查受影響的專案
```

## 📈 構建結果

最後一次成功構建：
- ✅ **10 個專案**構建成功
- ✅ **3 個任務**使用快取（30% 加速）
- ✅ **Events App**: 105 個靜態頁面
- ✅ **Console App**: ~1.5 MB (優化後)
- ✅ **Profile App**: ~522 KB (優化後)
- ✅ **Auth App**: ~472 KB

## 🎉 遷移歷史

1. **初始設置** - 從 Partivo 專案遷移
2. **品牌更新** - 替換所有 partivo 和 oosa 引用
3. **Vue 整合** - 添加 vue-motion-sandbox
4. **Angular 整合** - 添加 angular-dashboard-sandbox
5. **Profile 創建** - 新增技術展示專案
6. **Template 創建** - 建立 React 專案模板

## 📝 Git 提交記錄

```
9337e37 Update generated tokens
9e369d4 Add documentation for React template generator
e1c94ea Fix hooks path and update configurations
400eec6 Add Profile app and React template generator
34d0b8e Fix variable name syntax error in lineSettings test
d50bfb3 Update README with new project structure
e6f0518 Integrate Vue Motion and Angular Dashboard into monorepo
c4526e1 Remove Partivo reference from README
3211c1b Replace all partivo and oosa references with nx-playground
686232f Initial commit: Migrate from Partivo architecture
```

## 🎓 學習資源

- **Profile App**: http://localhost:3003 - 查看 Nx 和 React 技術展示
- **Console App**: http://localhost:3002 - 查看完整的業務應用範例
- **Events App**: http://localhost:3000 - 查看 Next.js SSG 範例

## 🔗 相關文檔

- [MIGRATION.md](../MIGRATION.md) - 遷移說明
- [CREATE_REACT_APP.md](./CREATE_REACT_APP.md) - React 模板使用指南
- [README.md](../README.md) - 專案簡介

## 💡 下一步

1. ✅ 專案結構已完成
2. ✅ 所有應用可以運行
3. ✅ 構建測試通過
4. ⏳ 根據需求添加功能
5. ⏳ 部署到生產環境
