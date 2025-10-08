# Console Prototype

基於 React + TypeScript + Vite 的管理後台原型

## 🚀 快速開始

### 環境要求

- Node.js 18+
- pnpm 8+

### 安裝與運行

```bash
# 安裝依賴
pnpm install

# 啟動開發服務器
pnpm exec nx serve console-prototype

# 建置生產版本
pnpm exec nx build console-prototype
```

開發服務器將在 `http://localhost:4200` 啟動。

## 📁 專案結構

```
src/
├── api/           # API 相關
├── components/    # 共用組件
├── features/      # 功能模組
│   ├── dashboard/ # 儀表板
│   ├── events/    # 活動管理
│   ├── templates/ # 模板管理
│   ├── users/     # 用戶管理
│   └── settings/  # 設定
├── hooks/         # 自定義 Hooks
├── router/        # 路由配置
├── shared/        # 共用資源
├── types/         # TypeScript 類型
└── utils/         # 工具函數
```

## 🎯 主要功能

- **活動管理**: 活動列表、創建、編輯、刪除
- **模板管理**: 表單模板創建、編輯器、欄位類型支援
- **用戶管理**: 用戶列表、角色管理、狀態管理
- **儀表板**: 數據概覽、快速操作入口

## 🛠️ 技術棧

- **前端**: React 18 + TypeScript + Vite
- **路由**: React Router v6
- **狀態**: React Hooks + Context
- **UI**: @nx-playground/ui-components
- **樣式**: Tailwind CSS
- **表單**: React Hook Form + Yup
- **通知**: React Hot Toast

## 🔧 開發指南

### 添加新功能

1. 在 `src/features/` 下創建新功能目錄
2. 實現相關組件和邏輯
3. 在路由中添加新頁面
4. 更新導航菜單

### 添加新 API

1. 在 `src/api/mockApi.ts` 中添加新 API 函數
2. 創建對應的 Hook
3. 在組件中使用新的 Hook

## 🧪 測試

```bash
# 運行測試
pnpm exec nx test console-prototype

# 運行測試並監視
pnpm exec nx test console-prototype --watch
```

## 📚 相關文檔

- [技術規格](../../docs/technical/console-prototype-spec.md)
- [API 文檔](../../docs/technical/api-documentation.md)
- [設計系統](../../docs/technical/design-system-architecture.md)
