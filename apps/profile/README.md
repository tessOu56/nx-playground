# Profile App

NX Playground 的技術展示專案，展示 Nx Monorepo 和 React 技術棧的最佳實踐。

## 🎯 目標

展示以下技術和功能：
- Nx Monorepo 架構
- React 19 + TypeScript
- Vite 構建工具
- 設計系統整合
- 共享 UI 組件庫
- 國際化 (i18n)
- 狀態管理
- 路由管理

## 🚀 開發

```bash
# 啟動開發服務器
make dev-profile
# 或
pnpm dev:profile
# 或
nx serve @nx-playground/profile

# 構建
nx build @nx-playground/profile

# 測試
nx test @nx-playground/profile

# Lint
nx lint @nx-playground/profile
```

## 🌐 服務網址

- **開發**: http://localhost:3003
- **預覽**: http://localhost:3003 (after build)

## 📦 使用的技術

- **React 19** - UI 框架
- **TypeScript** - 類型安全
- **Vite** - 快速構建工具
- **React Router** - 路由管理
- **Zustand** - 狀態管理
- **@nx-playground/design-system** - 設計系統
- **@nx-playground/ui-components** - UI 組件庫
- **@nx-playground/i18n** - 國際化
- **@nx-playground/hooks** - 自定義 Hooks
