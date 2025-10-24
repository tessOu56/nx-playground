---
id: profile
version: 1.0.0
lastUpdated: '2025-01-24'
category: react
status: production
published: true

# 產品資訊
shortDesc: |
  全端開發者作品集，具備 AI 搜尋功能與完整專案展示。

purpose: |
  專業作品集，展示技術能力、專案管理能力，
  以及透過生產級 React 應用程式呈現的現代網頁開發最佳實踐。

highlights:
  - AI 知識助手，具備對話持久化功能
  - 效能最佳化（Lighthouse 90+、PWA 就緒）
  - 自適應 UI（自動深淺色 header、流動液體技術棧背景）
  - 多語言支援（英文、繁體中文）
  - Mobile-first 響應式設計與 scroll-snap 區塊
  - Notion 風格簡潔介面
  - 完整專案與部落格展示

# 統計數據
stats:
  features: 25
  pages: 7
  libraries: 8

# 使用案例
useCases:
  - 展示全端開發技能
  - 展現專案管理能力
  - 透過部落格分享技術知識
  - 求職用專業作品集

targetAudience: |
  技術招募人員、潛在客戶，以及對現代網頁開發、monorepo 架構
  和最佳實踐感興趣的開發者。
---

# Profile - 技術作品集

使用 React 19 建構的生產級作品集應用程式，在 Nx monorepo 架構中展示技術技能與專案。

---

## 核心功能

### 多頁面應用程式
- **首頁**：Hero 區塊、技術棧展示、時間軸、聯絡方式
- **專案**：統一的應用程式與函式庫展示，含進度追蹤
- **部落格**：以年份組織的技術部落格文章
- **搜尋**：AI 知識助手
- **詳情**：Notion 風格專案頁面

### AI 搜尋
- 智能關鍵字匹配引擎
- 意圖偵測（專案/部落格/技術查詢）
- 情境式建議問題
- 對話歷史與 session 管理
- 跨所有專案、部落格和技術棧搜尋

### 使用者體驗
- 自適應 header（依據內容自動切換深淺色）
- 平滑 scroll-snap 區塊
- 回到頂端按鈕
- 載入動畫
- Mobile 最佳化導覽

---

## 技術棧

### 核心技術
- **React 19** - 具備最新功能的 UI 框架
- **TypeScript** - 型別安全開發
- **Vite 6** - 快速建構工具
- **Tailwind CSS** - Utility-first 樣式框架
- **React Router** - 客戶端路由

### 狀態管理
- **Zustand** - 輕量級狀態管理（專案、部落格、搜尋）
- **React Hooks** - 本地元件狀態

### 共享函式庫（Nx Monorepo）
- `@nx-playground/ui-components` - Radix UI 元件庫
- `@nx-playground/design-system` - 設計 tokens 和主題系統
- `@nx-playground/i18n` - i18next 國際化
- `@nx-playground/search-engine` - 自訂搜尋引擎
- `@nx-playground/hooks` - 可重用 React hooks
- `@nx-playground/tech-stack-data` - 自動技術棧收集器

---

## 效能與品質

### Lighthouse 分數
- **效能**: 90+（桌面）
- **無障礙**: 95+
- **最佳實踐**: 100
- **SEO**: 100
- **PWA**: 90+

### 最佳化
- 程式碼分割（頁面層級 + vendor chunks）
- 圖片延遲載入與模糊佔位符
- Service Worker 離線支援
- 字體最佳化（系統字體，無 web fonts）
- Bundle 大小：~250KB gzipped（符合預算）

### PWA 功能
- 可安裝於 mobile 與 desktop
- Cache-first 策略的離線支援
- App 捷徑（專案、部落格、搜尋）
- 自適應主題顏色

---

## 多語言支援

### 語言
- **英文** (en) - 預設
- **繁體中文** (zh-TW)

### 實作
- 基於功能的 i18n 與命名空間隔離
- 缺少翻譯時自動 fallback 到英文
- 所有 UI 文字已翻譯（無寫死字串）
- Locale 特定路由（`/en/*`, `/zh-TW/*`）

### 翻譯內容
- 所有頁面標題、按鈕和標籤
- 專案與部落格 metadata
- README 和 Spec 檔案（含 fallback）
- 錯誤訊息和載入狀態

---

## 架構亮點

### Monorepo 優勢
- **共享函式庫**：跨所有應用程式的可重用元件
- **一致工具**：統一的建構、lint、測試設定
- **型別安全**：共享 TypeScript 型別
- **原子提交**：libs 與 apps 的變更一起進行

### 專案結構
```
apps/profile/
├── src/
│   ├── features/        # 基於功能的組織
│   │   ├── home/       # Hero、Tech Stack、Timeline
│   │   ├── projects/   # 專案展示
│   │   ├── blogs/      # 部落格系統
│   │   ├── search/     # AI 搜尋
│   │   └── detail/     # 專案詳情頁
│   ├── components/     # 共享元件（Layout、SEO 等）
│   ├── lib/            # Loaders（projects、blogs、specs）
│   └── stores/         # Zustand 狀態管理
└── public/
    ├── sw.js           # Service Worker
    └── manifest.json   # PWA manifest
```

### 設計原則
- **簡潔最小化**：Notion 風格介面
- **效能優先**：Lighthouse 90+ 目標
- **Mobile First**：針對所有螢幕尺寸最佳化
- **無障礙**：符合 WCAG 2.1
- **SEO 就緒**：每個路由動態 meta tags

---

## 連結與資源

### 文件
- [README](../../../apps/profile/README.md) - 快速入門指南（英文）
- [README.zh-TW](../../../apps/profile/README.zh-TW.md) - 快速入門指南（繁中）
- [LIGHTHOUSE_OPTIMIZATION](../../../apps/profile/LIGHTHOUSE_OPTIMIZATION.md) - 效能最佳化指南

### 線上展示
- 即將在 Cloudflare Pages 上線

---

**最後更新**: 2025-01-24  
**狀態**: 生產就緒
