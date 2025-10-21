---
id: auth
version: 1.0.0
lastUpdated: '2025-10-20'
category: react
status: production
published: true
shortDesc: 基於 Ory Kratos 的現代化認證系統
purpose: '**最後更新**: 2025-10-20'
highlights:
  - React 19
  - Vite
  - Ory Kratos
  - Authentication
  - SSO
reviewer: tessou
updateFrequency: per-feature
---

# Auth - 統一認證服務

> 基於 Ory Kratos 的現代化認證系統

**最後更新**: 2025-10-20

---

## 🎯 專案定位

**生產級認證服務**，提供完整的用戶註冊、登入、密碼恢復流程。

### 核心價值

- 🔐 **企業級安全** - 使用 Ory Kratos
- 🎨 **品牌設計** - 磚紅色主題
- 🌐 **多 SSO 支援** - Google, Apple, LINE
- 📱 **移動友善** - 響應式設計

---

## 🛠️ 技術棧

### 核心技術

- **React 19** - UI 框架
- **TypeScript** - 類型安全
- **Vite 6** - 構建工具
- **React Router 6** - 路由
- **Tailwind CSS** - 樣式（含 design-system）

### 認證技術

- **Ory Kratos** - 身份認證
- **React Hook Form** - 表單管理
- **Yup** - 表單驗證
- **Cloudflare Turnstile** - 機器人防護

### UI 庫

- **Headless UI** - 無樣式組件
- **React Icons** - 圖標
- **Sonner** - Toast 通知

---

## 📂 專案結構

```
src/
├── pages/                    # 頁面
│   ├── SignIn/              # 登入
│   ├── SignUp/              # 註冊
│   ├── Recovery/            # 密碼恢復
│   ├── Home/                # 首頁
│   ├── ErrorPage/           # 錯誤頁
│   └── NotFound/            # 404
├── components/              # UI 組件
│   ├── PrimaryButton/       # 主要按鈕
│   ├── SecondaryButton/     # 次要按鈕
│   ├── LabeledInput/        # 標籤輸入框
│   ├── GoogleButton/        # Google SSO
│   ├── AppleButton/         # Apple SSO
│   ├── LineButton/          # LINE SSO
│   ├── AvatarButton/        # 頭像選擇
│   └── CustomTurnstile/     # Cloudflare 驗證
├── services/                # 業務邏輯
│   ├── orySdk.ts           # Ory Kratos SDK
│   ├── handleOidcAuth.ts   # OIDC 處理
│   ├── handleRedirect.ts   # 重定向邏輯
│   ├── handleDomain.ts     # 域名處理
│   └── useOryVerification.ts
├── api/                     # API 層
│   ├── apiClient.ts
│   ├── apiCodes.json       # 錯誤碼
│   ├── validationRules.ts  # 驗證規則
│   └── ErrorBoundary.tsx
├── assets/                  # 資源
│   ├── images/             # Google, Apple logos
│   └── avatar/             # 頭像 emotions
├── stores.ts                # MobX stores
├── types.ts                 # 類型定義
└── main.css                 # 樣式（已整合 design-system）
```

---

## ✨ 核心功能

### 1. 用戶註冊

- Email + 密碼註冊
- Email 驗證流程
- 密碼強度檢查
- Turnstile 機器人防護

### 2. 用戶登入

- Email + 密碼登入
- 記住我功能
- 錯誤處理（帳號不存在、密碼錯誤）
- 重定向到原頁面

### 3. 密碼恢復

- Email 恢復連結
- 驗證碼確認
- 密碼重設

### 4. SSO 整合

- **Google** - OAuth 2.0
- **Apple** - Sign in with Apple
- **LINE** - LINE Login

### 5. 頭像系統

- 10+ 情緒頭像
- 頭像選擇介面
- 預設頭像

---

## 🎨 設計系統

### 品牌色彩（磚紅色主題）

```css
primary: #B34438        /* 磚紅色 - 主色 */
primary_light: #C26960  /* 淡磚紅色 - hover */
primary_dark: #A33E33   /* 深磚紅色 - active */
```

### Design System 整合

已整合 `@nx-playground/design-system`：

```css
@import '@nx-playground/design-system/tokens/generated/tailwind-variables.css';
@import '@nx-playground/design-system/index.css';
```

保留自定義樣式用於：

- 品牌色系
- Typography 調整
- Ory Kratos UI 特定需求

---

## 🔐 Ory Kratos 整合

### 認證流程

```typescript
// 1. 初始化 flow
const flow = await orySDK.createLoginFlow();

// 2. 用戶提交表單
const result = await postOryForm(flowId, {
  identifier: email,
  password: password,
});

// 3. 處理結果
if (result.session) {
  // 登入成功，重定向
  handleRedirect(returnUrl);
} else {
  // 顯示錯誤
  handleOryError(result);
}
```

### 錯誤處理

使用 `apiCodes.json` 統一錯誤訊息：

```json
{
  "ErrorCodes": {
    "4000006": {
      "field": "email",
      "tips": "帳號不存在或密碼錯誤"
    }
  }
}
```

---

## 🚀 開發

```bash
# 啟動開發服務器
pnpm dev:auth
# 或
nx serve auth

# 訪問
http://localhost:5173
```

### 環境變數

```env
# Ory Kratos API
ORY_KRATOS_URL=http://localhost:4433

# Cloudflare Turnstile
TURNSTILE_SITE_KEY=your_site_key
```

---

## 📦 構建

```bash
# Production build
nx build auth --configuration=production

# Output
dist/apps/auth/

# Bundle size
471 KB (152 KB gzipped)
```

---

## 🧪 測試

```bash
# Unit tests
nx test auth

# E2E tests
# TODO: 待實現
```

---

## 🔗 相關文檔

- [Ory Kratos Documentation](https://www.ory.sh/docs/kratos)
- [React Hook Form](https://react-hook-form.com/)
- [Design System](../../libs/design-system/README.md)

---

## 📝 待辦事項

- [ ] 補充單元測試
- [ ] E2E 測試設置
- [ ] 實際 Ory Kratos 部署測試
- [ ] SSO 提供商完整測試
- [ ] Session 管理優化

---

**狀態**: ✅ 核心功能完成，Design system 整合完成，待測試補充
