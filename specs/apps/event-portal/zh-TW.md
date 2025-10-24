---
id: event-portal
name: Event Platform
version: 0.0.1
description: Event browsing and registration platform with LINE LIFF integration and QR code ticketing
techStack:
  - Next.js 15
  - React 19
  - TypeScript
  - Tailwind CSS
  - LINE LIFF SDK
  - next-intl
features:
  - Event Browsing
  - Event Registration
  - QR Code Tickets
  - LINE LIFF Integration
  - Multi-language Support
lastUpdated: '2025-01-24'
category: nextjs
status: development
published: true

shortDesc: |
  活動瀏覽與報名平台，整合 LINE LIFF 與 QR code 票券。
  使用 Next.js 15 App Router 打造最佳效能。

purpose: |
  公開活動平台，展示 Next.js SSG/SSR、
  第三方整合（LINE LIFF）與面向使用者的產品開發能力。

highlights:
  - Next.js 15 App Router with React 19
  - 靜態網站生成（SSG）提升效能
  - LINE LIFF SDK 整合
  - QR code 票券生成
  - next-intl 多語言
  - 響應式活動瀏覽

useCases:
  - 活動探索與瀏覽
  - 線上活動報名
  - QR code 票券系統
  - LINE 整合展示

targetAudience: |
  展示 Next.js 專業能力、第三方 API 整合，
  以及面向使用者的產品開發技能。

reviewer: tessou
reviewedAt: '2025-10-24'
nextReview: '2025-11-24'
updateFrequency: per-feature
draftStatus: false
approvalStatus: approved

lastSync: '2025-10-24'
---

# Event Portal - 公開活動平台

基於 Next.js 的活動瀏覽與報名平台，整合 LINE LIFF。

## 技術棧
- Next.js 15（App Router）
- React 19
- LINE LIFF SDK
- next-intl 國際化
- Tailwind CSS
- TypeScript

---

## 進度與規劃

### 目前狀態
- **版本**: 0.0.1
- **完成度**: 70%
- **階段**: 開發中
- **最後更新**: 2025-01-24

### 已完成功能
- ✅ Next.js 15 App Router 設定
- ✅ 活動瀏覽 UI（列表與詳情頁）
- ✅ LINE LIFF SDK 配置
- ✅ 多語言支援（next-intl）
- ✅ 響應式設計
- ✅ 活動卡片元件
- ✅ 靜態網站生成（SSG）

### 進行中
- 🚧 與活動 API server 整合
- 🚧 報名流程實作
- 🚧 LINE LIFF 認證測試

### 下一步（Roadmap）

**P0 - 關鍵** (2-3 週):
- [ ] 完成與 api-server 的 API 整合
- [ ] 實作活動報名流程
- [ ] LINE LIFF 完整認證整合
- [ ] QR code 票券生成系統

**P1 - 高優先** (1 個月):
- [ ] 支付流程（Stripe/TapPay 整合）
- [ ] 使用者儀表板（我的活動、票券）
- [ ] Email 通知
- [ ] 測試（Playwright E2E）

**P2 - 中優先**:
- [ ] 活動搜尋與篩選
- [ ] 活動推薦
- [ ] 社群分享
- [ ] Analytics 整合

### 技術債務
- API client 需要完整整合
- 認證流程尚未完成
- 測試覆蓋率：0%（目標 60%+）
- 生產環境部署待處理

### 相依性
- 需要：`api-server` 提供活動 endpoints
- 需要：LINE LIFF 測試帳號
- 需要：金流閘道設定

### Changelog
正式發布後開始追蹤版本歷史

