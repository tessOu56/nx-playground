# 🛂 SSO UI – Frontend for Authentication Flows

自定義前端界面，用於處理 **Ory Kratos 認證流程**，包括登入、註冊、郵箱驗證和帳戶恢復。

## ⚡️ 快速開始

### 安裝依賴

```bash
pnpm install
```

### 啟動開發服務器

```bash
pnpm dev
```

應用運行在: [http://localhost:5173](http://localhost:5173)

### 建置生產版本

```bash
pnpm build
```

### Docker 運行（可選）

```bash
docker-compose up --build
```

## ⚙️ 環境變數

創建 `.env.local` 文件：

```env
VITE_ORY_PUBLIC_API=http://localhost:4433
VITE_SITE_KEY=your-cloudflare-turnstile-sitekey
```

## 🛠️ 技術棧

- **前端**: React + Vite + TypeScript
- **樣式**: Tailwind CSS
- **表單**: react-hook-form + Zod
- **認證**: Ory Kratos 整合
- **路由**: React Router DOM

## 📂 專案目的

提供可重用、樣式化和可維護的 UI，用於使用 Ory Kratos 管理用戶身份流程。

## 🧪 測試

測試設置尚未完成，可使用：

- Vitest + Testing Library
- Storybook 整合（可選）

## 🤝 貢獻

主要由內部團隊維護，歡迎提交 issue 或 pull request。

## 📄 授權

MIT
