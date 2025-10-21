---
title: 'Event Portal - 活動展示平台'
slug: 'event-portal'
category: 'apps'
tags: ['Next.js 15', 'SSG', 'LINE LIFF', 'next-intl', 'QR Code']
date: '2025-10-20'
excerpt: '**定位**: 公開的活動展示和報名平台'
author: 'NX Playground'
lang: 'zh-TW'
published: true
---

# Event Portal - 活動展示平台

> **定位**: 公開的活動展示和報名平台
> **技術**: Next.js 15 (App Router) + LINE LIFF + next-intl
> **Port**: 3000

## 📋 專案概覽

Event Portal 是面向一般用戶的活動展示平台，整合 LINE LIFF 提供無縫的活動瀏覽和報名體驗。

### 核心特色

- 🎨 **精美的活動展示** - SSG + 響應式設計
- 📱 **LINE LIFF 整合** - 原生 LINE 體驗
- 🌐 **多語言支援** - next-intl (繁中/英文)
- 🎫 **完整報名流程** - 表單填寫 → 付款 → 確認
- 💳 **多種付款方式** - 現金/ATM 轉帳
- 📋 **訂單管理** - 查看和管理報名記錄

---

## 🏗️ 專案結構

```
apps/event-portal/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── [locale]/           # 多語言路由
│   │   │   ├── (home)/         # 首頁
│   │   │   ├── vendors/        # 活動列表
│   │   │   ├── checkout/       # 結帳
│   │   │   ├── orders/         # 訂單
│   │   │   ├── payment/        # 付款
│   │   │   └── ...
│   │   │
│   │   ├── layout.tsx          # Root layout
│   │   └── globals.css
│   │
│   ├── libs/                   # 工具和函數
│   │   ├── api/                # API 調用
│   │   ├── line/               # LINE LIFF SDK
│   │   ├── i18n/               # 國際化
│   │   ├── mock/               # Mock 數據
│   │   └── constants/
│   │
│   ├── types/                  # TypeScript 類型
│   │   ├── event.ts
│   │   ├── user.ts
│   │   ├── line.ts
│   │   └── ...
│   │
│   └── components/             # 共享組件
│       ├── Header.tsx
│       ├── EventCard.tsx
│       └── ...
│
├── next.config.mjs             # Next.js 配置
├── project.json                # Nx 配置
└── package.json
```

---

## 🎯 功能模組

### 1. 首頁 (/)

**路徑**: `/[locale]`
**類型**: SSG

#### 功能

- Hero Section (英雄區塊)
- 用戶流程說明
- LINE 登入按鈕
- 活動亮點展示

#### 關鍵文件

```
app/[locale]/(home)/
├── page.tsx                    # 主頁面
└── components/
    ├── HeroSection.tsx         # 英雄區塊
    ├── UserFlowSection.tsx     # 流程說明
    └── HomePageClient.tsx      # 客戶端邏輯
```

---

### 2. 活動列表 (/vendors)

**路徑**: `/[locale]/vendors`
**類型**: SSG with ISR

#### 功能

- 所有活動列表
- 分類篩選
- 搜尋功能
- 活動卡片展示

#### 數據來源

現階段使用 Mock 數據：`libs/mock/events/data/index.ts`

---

### 3. 活動詳情 (/info)

**路徑**: `/[locale]/info`
**類型**: SSG

#### 功能

- 活動完整資訊
- 場次選擇
- 票券選擇
- 報名按鈕

---

### 4. 結帳流程 (/checkout)

**路徑**: `/[locale]/checkout`
**類型**: Client-side

#### 功能

- 訂單摘要
- 報名表單填寫
- 付款方式選擇
- 訂單確認

---

### 5. 付款 (/payment)

**路徑**: `/[locale]/payment/[orderId]`
**類型**: Client-side

#### 功能

- 現金付款說明
- ATM 轉帳資訊
- 付款狀態追蹤

---

### 6. 訂單管理 (/orders)

**路徑**: `/[locale]/orders`
**類型**: Client-side (需登入)

#### 功能

- 用戶所有訂單
- 訂單詳情
- 訂單狀態
- 取消訂單

---

## 🛠️ 技術架構

### 核心技術

| 技術         | 版本 | 用途       |
| ------------ | ---- | ---------- |
| Next.js      | 15   | React 框架 |
| React        | 19   | UI 庫      |
| next-intl    | 3.28 | 國際化     |
| LINE LIFF    | 2.24 | LINE 整合  |
| React Query  | 5    | 數據獲取   |
| Tailwind CSS | 3    | 樣式       |
| TypeScript   | 5    | 類型安全   |

### LINE LIFF 整合

```tsx
// libs/line/liff.ts
import liff from '@line/liff';

export async function initLiff(liffId: string) {
  await liff.init({ liffId });

  if (!liff.isLoggedIn()) {
    liff.login();
  }

  return liff.getProfile();
}
```

### 國際化

```tsx
// app/[locale]/page.tsx
import { useTranslations } from 'next-intl';

export default function Page() {
  const t = useTranslations('HomePage');

  return <h1>{t('title')}</h1>;
}
```

---

## 📦 數據類型

### Event 類型

```typescript
// types/event.ts
export interface Event {
  id: string;
  vendorId: string;
  title: string;
  description: string;
  date: string;
  location: string;
  price: number;
  image: string;
  likes: number;
  attendees: number;
  capacity: number;
  category: string;
  tags: string[];
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  sessions: Session[];
  registrationFormTemplate?: EventRegistrationTemplate;
}

export interface Session {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  location: string;
  capacity: number;
  tickets: Ticket[];
}

export interface Ticket {
  id: string;
  name: string;
  price: number;
  quantity: number;
  description?: string;
}
```

---

## 🌐 路由設計

```
/                              # 首頁
├── zh/                        # 繁體中文
│   ├── /                      # 首頁
│   ├── vendors                # 活動列表
│   ├── info?eventId=xxx       # 活動詳情
│   ├── checkout               # 結帳
│   ├── orders                 # 訂單列表
│   ├── payment/:orderId       # 付款
│   ├── check-in               # 簽到
│   └── debug                  # 調試頁面
│
└── en/                        # 英文
    └── ... (同上)
```

---

## 🎨 UI 設計

### 響應式設計

- **Mobile First** - 主要針對手機優化
- **Tablet & Desktop** - 適配更大螢幕
- **LINE 內瀏覽器** - 最佳化 LIFF 體驗

### 設計規範

- **Spacing**: Tailwind 的 spacing scale
- **Colors**: Tailwind 預設 + 自定義品牌色
- **Typography**: Inter 字體
- **Components**: 自定義組件 (不使用 ui-components)

---

## 🔄 數據流

### 當前 (Mock 數據)

```
Mock Data (libs/mock/) → Components → UI
```

### 未來 (真實 API)

```
NestJS API → OpenAPI → React Query Hooks → Components → UI
```

---

## ⚠️ 待重寫項目

本專案目前**功能完整**，但代碼品質需要提升。

### 需改進的地方

1. **架構分層**

   - 目前: 部分邏輯混雜在組件中
   - 目標: 清晰的 UI / Business / Data 分層

2. **組件抽象**

   - 目前: 部分組件過大，職責不清
   - 目標: 小型、可復用、單一職責

3. **類型定義**

   - 目前: 部分類型不夠嚴謹
   - 目標: 完整、精確的類型定義

4. **測試覆蓋**

   - 目前: 缺乏測試
   - 目標: Unit tests + E2E tests

5. **錯誤處理**

   - 目前: 基本錯誤處理
   - 目標: 完整的錯誤邊界和用戶反饋

6. **性能優化**
   - 目前: 基本優化
   - 目標: 圖片優化、代碼分割、預加載

---

## 🚀 開發指南

### 啟動開發

```bash
# 使用 Makefile
make dev-event-portal

# 或使用 pnpm
pnpm dev:event-portal

# 訪問 http://localhost:3000
```

### 添加新頁面

1. 在 `app/[locale]/` 下創建目錄
2. 創建 `page.tsx`
3. 添加到 `libs/constants/routes.ts`

### 添加翻譯

1. 編輯 `messages/zh.json` 和 `messages/en.json`
2. 在組件中使用 `useTranslations`

---

## 📦 構建和部署

### 構建

```bash
nx build event-portal
```

輸出: `dist/apps/event-portal/`

### 部署

推薦: Vercel, Cloudflare Pages

```bash
# Vercel
vercel --prod

# Cloudflare Pages
pnpm build:event-portal
# 部署 dist/apps/event-portal/ 目錄
```

### 環境變數

```env
NEXT_PUBLIC_LIFF_ID=your-liff-id
NEXT_PUBLIC_API_URL=https://api.example.com
NEXT_PUBLIC_STATIC_EXPORT=false
```

---

## 🔮 重寫計劃 (Phase 3)

### 目標

以資深工程師標準重構，提升代碼品質。

### 重點

1. 清晰的架構分層
2. 小型、可復用組件
3. 完整的類型定義
4. 測試覆蓋
5. 性能優化
6. 錯誤處理

### 時程

待 Phase 2 完成後開始。

---

## 📖 相關文檔

- [專案規格](../PROJECT_SPECIFICATION.md)
- [開發指南](../DEVELOPMENT_GUIDE.md)
- [Event CMS 文檔](./EVENT_CMS.md)
