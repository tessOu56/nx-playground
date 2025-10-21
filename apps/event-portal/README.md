---
id: event-portal
name: event-portal
version: 0.0.1
description: 使用 Next.js 15 App Router 構建的現代化活動平台，支援 LINE LIFF 整合、多語言、SSG 靜態生成。
techStack:
  - Next.js 15
  - SSG
  - LINE LIFF
  - next-intl
  - QR Code
features: []
lastUpdated: '2025-10-21'
---
# Events - 活動管理平台

> 基於 LINE LIFF 的活動管理和報名平台，提供完整的活動瀏覽、報名、支付和票券管理功能

## 🎯 專案簡介

使用 Next.js 15 App Router 構建的現代化活動平台，支援 LINE LIFF 整合、多語言、SSG 靜態生成。

## 🛠️ 技術棧

- **Next.js 15** - React 框架 (App Router)
- **React 19** + TypeScript
- **Tailwind CSS** - 樣式系統
- **React Query** - 數據管理
- **Zustand** - 狀態管理
- **LINE LIFF SDK** - LINE 整合
- **next-intl** - 國際化
- **@nx-playground/ui-components** - UI 組件
- **@nx-playground/design-system** - 設計系統

## 🚀 快速開始

### 在 Monorepo 中啟動

```bash
# 使用 Makefile
make dev-events

# 或使用 pnpm
pnpm dev:events

# 或使用 Nx
nx serve @nx-playground/events

# 或使用腳本
cd apps/events
./start-dev.sh
```

服務運行在: **http://localhost:3000**

## ⚙️ 環境變數

```env
# LINE LIFF 配置
NEXT_PUBLIC_LIFF_ID=2007835339-AmngJedQ
NEXT_PUBLIC_LINE_CLIENT_ID=2007835339
NEXT_PUBLIC_LINE_REDIRECT_URI=https://frontend.nx-playground.local
LINE_CLIENT_SECRET=your_line_client_secret

# API 配置
NEXT_PUBLIC_API_BASE_URL=https://api.nx-playground.local
NEXT_PUBLIC_API_TIMEOUT=10000

# 域名配置
NEXT_PUBLIC_PRODUCTION_DOMAIN=https://frontend.nx-playground.local
NEXT_PUBLIC_DEVELOPMENT_DOMAIN=http://localhost:3000

# 功能開關
NEXT_PUBLIC_ENABLE_DEVTOOLS=true
NEXT_PUBLIC_ENABLE_MOCK_DATA=true
NEXT_PUBLIC_APP_NAME=NX Playground Events
```

## 📂 專案結構

```
src/
├── app/                    # Next.js App Router
│   ├── [locale]/          # 語言路由
│   │   ├── (home)/        # 首頁
│   │   ├── events/        # 活動列表和詳情
│   │   ├── (checkout)/    # 結帳流程
│   │   ├── (registration)/ # 報名表單
│   │   ├── (checkin)/     # 票券簽到
│   │   ├── orders/        # 訂單管理
│   │   └── vendors/       # 主辦方頁面
│   ├── api/               # API Routes
│   ├── layout.tsx
│   └── globals.css
├── components/             # 共用組件
│   ├── core/              # 基礎組件
│   ├── form/              # 表單組件
│   ├── header/            # 頁面導航
│   ├── sidebar/           # 側邊欄
│   └── ...
├── libs/                   # 工具和功能
│   ├── api/               # API Hooks
│   ├── line/              # LINE LIFF 整合
│   ├── mock/              # Mock 數據
│   ├── qrcode/            # QR Code 生成
│   ├── seo/               # SEO 和 Metadata
│   └── utils/             # 工具函數
├── stores/                 # Zustand 狀態管理
├── types/                  # TypeScript 類型
└── middleware.ts           # Next.js 中間件
```

## 🎯 主要功能

### 1. 活動瀏覽
- 活動列表（支援分頁）
- 活動詳情頁
- 場次選擇
- 票券選擇
- FAQ 和活動內容展示

### 2. 報名流程
- 購物車管理
- 票券選擇
- 場次選擇
- 動態報名表單
- 支付方式選擇（現金/ATM轉帳）

### 3. 訂單管理
- 訂單列表
- 訂單詳情
- 付款狀態
- 轉帳資訊
- QR Code 顯示

### 4. 票券功能
- 票券 QR Code
- 票券驗證
- 簽到功能

### 5. LINE 整合
- LIFF 登入
- LINE 分享
- LINE 官方帳號連結

### 6. 國際化
- 繁體中文 (zh-TW)
- English (en)
- URL 路徑多語言 (/zh-TW/events, /en/events)

### 7. SEO 優化
- SSG 靜態生成 105 個頁面
- Dynamic Meta Tags
- JSON-LD 結構化數據
- Sitemap 和 Robots.txt

## 🧪 Mock 數據

開發環境使用完整的 Mock 數據系統：

```typescript
// 自動生成測試數據
import { mockEvents, mockOrders } from '@/libs/mock';

// 數據生成器提供一致的測試數據
// 包含：events, orders, users, vendors, tickets, sessions 等
```

## 📦 構建和部署

### 構建

```bash
# 生產構建（SSG）
nx build @nx-playground/event-portal --configuration=production

# 輸出目錄
dist/apps/event-portal/
```

### 部署到 Cloudflare Pages

```bash
# Build command
pnpm exec nx build @nx-playground/event-portal --configuration=production

# Output directory
dist/apps/event-portal

# Environment variables
# 設置所有 NEXT_PUBLIC_* 環境變數
```

## 🧪 測試

```bash
# 單元測試
nx test @nx-playground/events

# Mock 數據測試
pnpm test:mock-data
```

## 🔧 開發工具

### 調試工具
- 側邊欄調試面板（開發模式）
- Mock 數據切換
- 環境信息顯示

### 開發命令

```bash
# 重置 Nx 快取
nx reset

# 查看依賴圖
nx graph

# 檢查受影響的專案
nx affected:build
```

## 📚 相關文檔

- [docs/events-dev/](../../docs/events-dev/) - Events 開發文檔
- [LINE LIFF 整合](../../docs/events-dev/events-line-liff.md)
- [現金支付流程](../../docs/events-dev/events-cash-payment.md)
- [Mock 數據說明](../../docs/events-dev/events-mock-data.md)

## 🔗 相關連結

- [Next.js App Router](https://nextjs.org/docs/app)
- [LINE LIFF Documentation](https://developers.line.biz/en/docs/liff/)
- [next-intl Documentation](https://next-intl-docs.vercel.app/)
