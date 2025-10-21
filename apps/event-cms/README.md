---
id: event-cms
name: event-cms
version: 0.0.1
description: 完整的管理控制台應用，展示了 Nx Monorepo 中如何構建大型 React 應用，並整合共享函式庫。
techStack:
  - React 19
  - Vite
  - Zustand
  - React Hook Form
  - RBAC
features: []
lastUpdated: '2025-10-21'
---
# Console - 管理控制台

> 基於 React + Vite 的現代化管理後台，提供活動管理、表單模板、用戶管理等功能

## 🎯 專案簡介

完整的管理控制台應用，展示了 Nx Monorepo 中如何構建大型 React 應用，並整合共享函式庫。

## 🛠️ 技術棧

- **React 19** + TypeScript
- **Vite 6** - 構建工具
- **React Router 6** - 路由管理
- **Zustand** - 狀態管理
- **React Query** - 數據獲取
- **React Hook Form** - 表單管理
- **Tailwind CSS** - 樣式
- **@nx-playground/ui-components** - UI 組件庫
- **@nx-playground/design-system** - 設計系統
- **@nx-playground/i18n** - 國際化

## 🚀 快速開始

### 在 Monorepo 中啟動

```bash
# 使用 Makefile
make dev-console

# 或使用 pnpm
pnpm dev:console

# 或使用 Nx
nx serve @nx-playground/console
```

服務運行在: **http://localhost:3002**

### 獨立開發

```bash
cd apps/console
pnpm install
pnpm dev
```

## 📂 專案結構

```
src/
├── components/       # 共用組件
│   ├── Sidebar/     # 側邊欄導航
│   ├── TopBar/      # 頂部欄
│   ├── DataTable/   # 數據表格
│   └── ...
├── features/         # 功能模組
│   ├── dashboard/   # 儀表板
│   ├── events/      # 活動管理
│   ├── form/        # 表單模板管理
│   ├── users/       # 用戶管理
│   ├── settings/    # 設定
│   └── examples/    # UI 組件範例
├── layouts/          # 佈局組件
├── router/           # 路由配置
├── stores/           # Zustand 狀態管理
└── lib/              # 工具函數
```

## 🎯 主要功能

### 1. 活動管理
- 活動列表、創建、編輯
- 封面圖片上傳
- 場次管理
- 票券設定
- 支付方式配置

### 2. 表單模板管理
- 拖放式表單編輯器
- 多種欄位類型（文字、選擇、日期等）
- 模板預覽
- 複製和重命名功能

### 3. 用戶管理
- 用戶列表
- 角色管理
- 狀態管理

### 4. UI 組件展示
- 所有 UI 組件的實際應用範例
- 設計系統組件演示

### 5. 國際化
- 支援繁體中文和英文
- 功能級別的翻譯管理

## 📦 使用的共享函式庫

```tsx
// UI 組件
import { Button, Card } from '@nx-playground/ui-components';

// 設計系統
import { baseTheme } from '@nx-playground/design-system';

// 國際化
import { useTranslation } from '@nx-playground/i18n';

// API 客戶端
import { useEvents } from '@nx-playground/api-client';

// 自定義 Hooks
import { useDebounce } from '@nx-playground/hooks';
```

## 🧪 測試

```bash
# 執行測試
nx test @nx-playground/console

# 監聽模式
nx test @nx-playground/console --watch

# 生成覆蓋率
nx test @nx-playground/console --coverage
```

## 📦 構建

```bash
# 開發構建
nx build @nx-playground/console --configuration=development

# 生產構建
nx build @nx-playground/console --configuration=production
```

輸出目錄: `dist/apps/console`

## 🎨 樣式系統

使用 Tailwind CSS 和設計系統的語義化 token：

```tsx
// ✅ 推薦：使用設計系統 token
className="bg-background-primary text-text-primary"

// ❌ 避免：硬編碼顏色
className="bg-white text-gray-900"
```

## 🔧 開發指南

### 添加新功能模組

1. 在 `src/features/` 下創建新目錄
2. 創建頁面組件
3. 在 `src/router/routes/` 添加路由
4. 在側邊欄添加導航項

### 添加新頁面

```tsx
// src/features/my-feature/pages/MyPage.tsx
export function MyPage() {
  return <div>My Page</div>;
}

// src/router/routes/my-feature.tsx
export const myFeatureRoutes = [
  {
    path: '/my-feature',
    element: <MyPage />,
  },
];
```

## 📚 相關文檔

- [docs/console-dev/](../../docs/console-dev/) - Console 開發文檔
- [技術規格](../../docs/console-dev/console-prototype-features.md)
- [表單系統](../../docs/console-dev/console-prototype-form.md)
