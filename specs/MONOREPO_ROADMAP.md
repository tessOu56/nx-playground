# NX Monorepo Development Roadmap

**Last Updated**: 2025-10-24  
**Maintainer**: Tess  
**Status**: Living Document

---

## 專案狀態

### Apps 完成度

| App | 技術棧 | 完成度 | 狀態 | 最新更新 |
|-----|--------|--------|------|----------|
| profile | React 19 + Vite | 95% | 🟢 Production Ready | 2025-10-24 |
| event-portal | Next.js 15 | 70% | 🟡 Development | 2025-10-21 |
| event-cms | React + Vite | 70% | 🟡 Development | 2025-10-21 |
| api-server | NestJS 10 | 80% | 🟢 Functional | 2025-10-21 |
| auth | React + Vite | 60% | 🟡 Development | - |
| enterprise-admin | Angular 20 | 75% | 🟡 Development | 2025-10-21 |
| vue-motion | Vue 3 | 85% | 🟢 Demo Ready | - |

### Shared Libraries

| Library | 狀態 | 用途 |
|---------|------|------|
| ui-components | ✅ Stable | Radix UI 組件庫 |
| design-system | ✅ Stable | Design tokens |
| i18n | ✅ Stable | 國際化 |
| search-engine | 🆕 New | AI Search 引擎 |
| api-client | ✅ Stable | API 客戶端 |
| charts | ✅ Stable | 圖表庫 |
| hooks | ✅ Stable | React hooks |
| tech-stack-data | ✅ Stable | Tech stack 資料 |

---

## Profile App 詳細進度

### 已完成功能

**核心頁面** (100%):
- Home, Projects, Blogs, Search, 404
- 多語言（en, zh-TW）
- SEO 優化
- Notion 風格 Detail 頁面

**UX 增強** (100%):
- Header 自動深淺色切換
- 導航底線動畫
- Mobile RWD
- Scroll snap
- Footer 條件顯示

**效能優化** (90%):
- Code splitting, PWA
- Build optimization
- ⏳ Lighthouse: 55 → 目標 90+

**AI Search** (80%):
- Phase 1: 關鍵字搜尋 ✅
- 對話持久化 ✅
- 建議問題 ✅
- ⏳ Phase 2: OpenAI RAG

### 待完成功能

**短期** (1-2 週):
1. Lighthouse Performance 90+ (2-3 天)
2. AI Search Phase 2 (3-5 天)
3. Production 部署 (1-2 天)

**中期** (1-2 月):
1. Blog 編輯器
2. 專案展示增強
3. Analytics 整合

---

## Event Platform 進度

### 已完成
- UI 基本架構 (70%)
- Event-CMS 表單
- Event-Portal 展示頁面
- API Server 基本 endpoints

### 待完成
- API 完整串接
- LINE LIFF 整合
- 支付流程
- QR 票券系統
- Authentication

**預估工作量**: 4-6 週

---

## 優先級排序

### P0 - Critical (必須完成)
1. Profile Performance 90+ 
2. API Server Authentication

### P1 - High (高價值)
1. AI Search Phase 2
2. Event 平台 API 整合
3. Profile Production 部署

### P2 - Medium (中價值)
1. Blog 編輯器
2. Enterprise-Admin 功能頁面
3. UI Components 擴充

### P3 - Low (Nice to have)
1. Analytics
2. Mobile App
3. Real-time features

---

## Quick Wins

可快速完成的小功能：

**Profile App**:
- Blog 分類過濾 (1 天)
- 專案搜尋 (1 天)
- 深色模式切換 (1 天)
- 分享按鈕 (0.5 天)

**API Server**:
- Swagger UI 美化 (0.5 天)
- Error handling (1 天)
- Logging (1 天)

---

## 技術債務

### High Priority
- Profile: Lighthouse Performance 55 → 90+
- API Server: 缺少 Auth guards
- Testing: 覆蓋率不足

### Medium Priority
- TypeScript strict mode
- E2E 測試
- 文檔更新

### Low Priority
- CI/CD pipeline
- Monitoring setup

---

## 建議的開發路徑

### 路徑 A: 快速完成 Profile (推薦)
- **時間**: 1-2 週
- **目標**: Production ready portfolio
- **內容**: Performance 90+ + AI Phase 2 + Deploy

### 路徑 B: Event 平台整合
- **時間**: 4-6 週  
- **目標**: Full-stack SaaS demo
- **內容**: Auth + API 整合 + LINE LIFF

### 路徑 C: 技術廣度
- **時間**: 持續
- **目標**: 展示多樣技術
- **內容**: 各 app 都完善一些

---

## 投資報酬率 (ROI)

| 功能 | 工作量 | 難度 | 展示價值 | ROI |
|------|--------|------|----------|-----|
| Profile Perf 90+ | 低 | 中 | 高 | ⭐⭐⭐⭐⭐ |
| AI Search Phase 2 | 中 | 中 | 極高 | ⭐⭐⭐⭐⭐ |
| Event 整合 | 高 | 高 | 高 | ⭐⭐⭐⭐ |
| Blog 編輯器 | 中 | 低 | 中 | ⭐⭐⭐ |

---

## 變更記錄

### 2025-10-24
- 完成 Profile mobile RWD 優化
- 完成 Search 對話持久化
- 完成 Notion 風格 Detail 頁面
- 完成 Footer 條件顯示
- 初始版本 roadmap

---

## 下一步

等待決策：選擇開發路徑 A/B/C

