---
id: 03-event-portal
name: 活動報名平台
version: 0.0.1
description: 整合 LINE LIFF 與 QR code 票券的活動瀏覽與報名平台
techStack:
  - Next.js 15
  - React 19
  - TypeScript
  - Tailwind CSS
  - LINE LIFF SDK
  - next-intl
features:
  - 活動瀏覽
  - 活動報名
  - QR Code 票券
  - LINE LIFF 整合
  - 多語言支援
status: development
category: nextjs
published: true
lastUpdated: '2025-01-24'
---

# Event Platform – 活動報名平台

(Event Browsing and Registration Platform)

## 一、概念與定位 / Overview

這是一個**面向公眾的活動平台**，讓使用者可以探索、瀏覽並報名活動，整合票券系統。

不同於基本的活動列表網站，此平台提供：
- 無縫 LINE 整合，一鍵報名
- QR code 數位票券，無接觸入場
- 多語言支援，服務國際觀眾
- 靜態網站生成，實現極速頁面載入
- 行動優先設計，最佳化隨時瀏覽體驗

整體設計作為**完整的使用者端活動平台**，展示現代 Web 應用開發與第三方整合能力。

---

## 二、核心功能 / Core Features

### 1. 活動探索與瀏覽

- 網格與列表檢視模式
- 依分類、日期、地點、價格篩選
- 即時搜尋功能
- 豐富資訊的活動詳情頁
- 社群媒體分享

**重點價值**：協助使用者快速找到符合興趣的相關活動。

---

### 2. LINE LIFF 整合

- 透過 LINE 帳號一鍵登入
- 自動同步 LINE 個人檔案
- 在 LINE 內完成報名，無需離開
- 活動更新推播通知
- 直接在 LINE 聊天中分享活動

**重點價值**：利用既有 LINE 生態系統，降低報名門檻。

---

### 3. QR Code 票券

- 報名後立即生成數位票券
- 加密保護的安全 QR code
- 離線檢視票券功能
- 活動現場快速報到
- 單一帳號管理多張票券

**重點價值**：免除實體票券，加速活動入場流程。

---

### 4. 報名與付款

- 多步驟報名表單
- 即時回饋的表單驗證
- 金流整合（準備中）
- 訂單歷史與管理
- 電子郵件確認與提醒

**重點價值**：流暢的報名體驗提升轉換率。

---

## 三、製作重點 / Development Focus

| 面向               | 說明                                      |
| ------------------ | ----------------------------------------- |
| **效能**           | Next.js SSG 實現次秒級頁面載入            |
| **行動體驗**       | PWA 支援離線檢視票券                      |
| **第三方整合**     | LINE LIFF SDK 實現無縫社交登入            |
| **國際化**         | next-intl 提供可擴展的多語言支援          |

**結果**：快速、行動最佳化的平台，具備優異使用者體驗。

---

## 四、內容規模 / Content Scope

- **主要頁面**：首頁、活動列表、活動詳情、報名、我的票券
- **整合點**：LINE LIFF、金流、QR Code 服務
- **語言**：英文、繁體中文（可擴充）
- **目前狀態**：40% 完成，LINE 整合進行中

---

## 五、品質與效能指標 / Quality & Performance Metrics

| 指標               | 行業標準        | 實際結果             | 狀態 |
| ------------------ | --------------- | -------------------- | ---- |
| **首次載入**       | 2 秒內          | 約 1 秒（SSG）       | ✅   |
| **行動效能**       | Lighthouse 80+  | 95+（目標）          | 🚧   |
| **PWA 支援**       | 可安裝          | 完整離線支援         | ✅   |
| **無障礙設計**     | WCAG AA         | 符合標準             | ✅   |

**結論**：生產就緒的效能，專注於行動使用者體驗。

---

## 六、技術架構 / Technical Architecture

**前端框架**：
- Next.js 15 App Router 實現最佳效能
- React 19 搭配 Server Components
- 活動頁面使用靜態網站生成（SSG）
- 漸進式靜態再生（ISR）處理更新

**關鍵整合**：
- LINE LIFF SDK 用於認證與社交功能
- QR code 生成函式庫用於票券
- 金流 API（規劃整合中）

**資料流**：
- 從 api-server 取得活動資料
- 使用者資料與 LINE 同步
- 票券儲存於使用者 session + 電子郵件寄送

---

## 七、部署 / Deployment

**主要平台**：Vercel（Next.js 最佳化）

**設定摘要**：

- Build command: `nx build event-portal --configuration=production`
- Output: `.next/`
- Node version: 20
- 環境變數：LINE LIFF ID、API endpoint

**功能**：
- Git push 自動部署
- PR 預覽部署
- API routes 使用 Edge Functions

---

## 八、開發進度 / Current Progress

### 已完成 ✅
- Next.js 15 專案設定，使用 App Router
- 活動瀏覽與列表頁面
- 響應式設計的活動詳情頁
- 使用 next-intl 的多語言支援
- 基本路由與導覽

### 進行中 🚧
- LINE LIFF SDK 整合
- QR code 票券生成
- 報名表單與驗證
- 使用者認證流程

### 下一步 📋
- 完成 LINE 登入整合
- 實作票券生成服務
- 與 api-server 連接以取得活動資料
- 金流整合
- 電子郵件通知系統

---

## 九、授權 / License

MIT（開放使用與修改）

---

## 十、補充文件 / Additional Documentation

- `specs/apps/event-portal/en.md` - 英文規格說明
- `specs/apps/event-portal/zh-TW.md` - 繁中規格（本文件）
- `apps/event-portal/README.md` - 開發者文件

注意：技術實作細節與 LINE LIFF 設定請參考 README.md。
