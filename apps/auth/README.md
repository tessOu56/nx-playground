---
id: auth
name: Auth Service
version: 0.2.19
description: >-
  Authentication service with Ory Kratos backend, supporting email login, social
  login, and SSO
techStack:
  - React 19
  - TypeScript
  - Vite 6
  - Tailwind CSS
  - React Hook Form
  - Zod
  - Ory Kratos
features:
  - User Login
  - User Registration
  - Email Verification
  - Password Recovery
  - Social Login
  - SSO Integration
lastUpdated: '2025-10-21'
---
# Auth - 認證服務

> 基於 Ory Kratos 的自定義認證 UI，處理登入、註冊、郵箱驗證和帳戶恢復流程

## 🎯 專案簡介

提供可重用、樣式化的 UI，用於管理用戶身份認證流程，與 Ory Kratos 後端整合。

## 🛠️ 技術棧

- **React 19** + TypeScript
- **Vite 6** - 構建工具
- **Tailwind CSS** - 樣式
- **React Hook Form** + Zod - 表單管理
- **React Router** - 路由
- **Ory Kratos** - 認證後端

## 🚀 快速開始

### 在 Monorepo 中啟動

```bash
# 使用 Makefile
make dev-auth

# 或使用 pnpm
pnpm dev:auth

# 或使用 Nx
nx serve @nx-playground/auth
```

服務運行在: **http://localhost:3004**

### 獨立開發

```bash
cd apps/auth
pnpm install
pnpm dev
```

## ⚙️ 環境變數

創建 `.env.local` 文件：

```env
VITE_ORY_PUBLIC_API=http://localhost:4433
VITE_SITE_KEY=your-cloudflare-turnstile-sitekey
```

## 📂 專案結構

```
src/
├── api/              # API 客戶端和錯誤處理
├── assets/           # 圖片和資源
├── components/       # UI 組件
│   ├── *Button/     # 各種按鈕組件
│   ├── LabeledInput/
│   └── CustomTurnstile/
├── pages/            # 頁面組件
│   ├── Home/
│   ├── SignIn/
│   ├── SignUp/
│   ├── Recovery/
│   ├── ErrorPage/
│   └── NotFound/
├── services/         # 業務邏輯
└── stores.ts         # 全局狀態
```

## 🔑 主要功能

- ✅ 用戶登入（Email + 社交登入）
- ✅ 用戶註冊
- ✅ 郵箱驗證
- ✅ 密碼恢復
- ✅ 第三方登入（Google, Apple, LINE）
- ✅ Cloudflare Turnstile 驗證
- ✅ SSO 整合

## 🧪 測試

```bash
# 在 Monorepo 根目錄執行
nx test @nx-playground/auth

# 監聽模式
nx test @nx-playground/auth --watch
```

## 📦 構建

```bash
# 開發構建
nx build @nx-playground/auth --configuration=development

# 生產構建
nx build @nx-playground/auth --configuration=production
```

輸出目錄: `dist/apps/auth`

## 🔗 相關連結

- [Ory Kratos Documentation](https://www.ory.sh/docs/kratos)
- [React Hook Form](https://react-hook-form.com)
- [Zod](https://zod.dev)
