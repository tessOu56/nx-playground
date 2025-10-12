# NX Playground 專案現況

> 最後更新：2025-10-12

## 📋 專案概覽

NX Playground 是一個實驗性 Nx Monorepo 專案，展示現代前端技術棧整合和企業級應用開發模式。

### 核心特色

- 🎯 **多框架整合** - React, Next.js, Angular, Vue 在同一個 monorepo
- 📦 **共享函式庫** - 7 個可復用的 libs
- 🎨 **完整設計系統** - Design tokens + UI 組件庫
- 📊 **數據視覺化** - 雙軌制圖表庫
- 🔐 **企業級功能** - RBAC, Dual-control, SSE
- 🌐 **OpenAPI 驅動** - 自動生成 React Query hooks

---

## 🏗️ 專案架構

### Apps (6 個應用)

| 專案 | 定位 | 技術 | Port | 狀態 | 完整度 |
|------|------|------|------|------|--------|
| **event-cms** | 活動內容管理系統 | React 19 + Vite | 3002 | ✅ | 90% |
| **event-portal** | 公開活動展示平台 | Next.js 15 | 3000 | ⚠️ | 100% (待重寫) |
| **enterprise-admin** | 企業級管理平台 | Angular 20 | 4200 | ✅ | 100% |
| **profile** | 技術展示平台 | React 19 + Vite | 3003 | ✅ | 100% |
| **auth** | 統一認證服務 | React 19 + Vite | 5173 | ✅ | 100% |
| **vue-motion** | 動畫效果實驗 | Vue 3 | 8080 | ✅ | 100% |

### Libs (7 個函式庫)

| 函式庫 | 用途 | 框架 | 狀態 |
|--------|------|------|------|
| **api-client** | OpenAPI → React Query hooks | React | ✅ |
| **charts** | Recharts + Chart.js 雙軌制 | React | ✅ |
| **ui-components** | 23+ Radix UI 組件 | React | ✅ |
| **hooks** | 8 個自定義 + 20+ 重新導出 | React | ✅ |
| **design-system** | Design tokens 系統 | 框架無關 | ✅ |
| **i18n** | 國際化 (繁中/英文) | React + Next.js | ✅ |
| **auth-client** | SSO 認證客戶端 | React | ✅ |

---

## ✅ 已完成功能

### Phase 1: 基礎設施 (完成度 100%)

#### UI 組件庫擴充
- ✅ Dialog/Modal 組件 (Radix UI)
- ✅ Tabs 組件 (Radix UI)
- ✅ Alert 組件 (5 種變體)
- ✅ 23+ 核心和複合組件

#### Hooks 擴充
- ✅ useAsync - 異步操作管理
- ✅ useModal - Modal 狀態管理
- ✅ usePagination - 分頁邏輯
- ✅ useToast - Toast 通知

#### Profile 技術展示
- ✅ API Integration 頁面
- ✅ State Management 頁面
- ✅ Performance 優化頁面
- ✅ 共 7 個展示頁面

#### 專案重命名
- ✅ console → event-cms
- ✅ events → event-portal
- ✅ libs/vue-motion → apps/vue-motion
- ✅ angular-dashboard → enterprise-admin

#### 圖表庫創建
- ✅ libs/charts 雙軌制設計
- ✅ 4 種圖表 x 2 實現 = 8 個組件
- ✅ 統一的 TypeScript 介面

### Phase 2: 業務功能 (完成度 100%)

#### event-cms Users 管理
- ✅ UserEditDialog - 創建/編輯用戶
- ✅ UserDetailDialog - 用戶詳情 (3 Tabs)
- ✅ UserRoleManager - 視覺化權限管理
- ✅ UsersPage - 完整 CRUD

#### event-cms Settings 設定
- ✅ NotificationSettings - 通知偏好
- ✅ SecuritySettings - 安全設定 (密碼、2FA、會話)
- ✅ SystemSettings - 系統設定
- ✅ ProfileSettings - 個人資料
- ✅ SettingsPage - 5 個分類 Tab

#### event-cms Dashboard
- ✅ EventTrendChart - 30 天趨勢
- ✅ ParticipationChart - 參與統計
- ✅ TimeTrendChart - 時間趨勢
- ✅ StatusDistributionChart - 狀態分布

---

## 📊 event-cms 功能完整度

| 功能模組 | 狀態 | 說明 |
|---------|------|------|
| Dashboard | ✅ 100% | 統計卡片 + 4 個圖表 |
| Users | ✅ 100% | 列表、詳情、編輯、權限管理 |
| Settings | ✅ 100% | 5 個分類完整設定 |
| Forms | ✅ 100% | 表單模板 CRUD |
| Events | 🔨 70% | 創建完整，列表頁待開發 |
| Examples | ✅ 100% | UI 組件展示 |

**總體**: 90% 完成

---

## 🎯 技術決策記錄

### 為什麼重命名專案？

**console → event-cms**
- 突出內容管理系統性質
- 配合 event-portal 形成前後台對應
- 更清楚的業務定位

**events → event-portal**
- 清楚表達公開展示平台性質
- 與 event-cms 形成對比

**angular-dashboard → enterprise-admin**
- 強調企業級管理平台定位
- 與 event-cms 的輕量級 CMS 區隔

### 為什麼 libs 都是 React？

**決策**: 不強制跨框架兼容

**理由**:
1. React 應用 (event-cms, profile, auth) 是主要開發對象
2. Angular 應用 (enterprise-admin) 已自給自足，有完整生態
3. Vue 應用 (vue-motion) 是獨立練習專案
4. 跨框架抽象會增加複雜度和維護成本
5. 各框架有自己的最佳實踐

**例外**: design-system (CSS tokens) 框架無關

### 為什麼使用雙軌制圖表？

**libs/charts 同時支援 Recharts 和 Chart.js**

**理由**:
- Recharts: React 原生，適合簡單圖表
- Chart.js: 高性能，適合複雜場景
- 開發者可根據需求選擇
- 統一介面，切換成本低

### 為什麼選擇 Code-First OpenAPI？

**NestJS → OpenAPI → Orval → React Query**

**理由**:
1. 單一事實來源 (NestJS 代碼)
2. 自動生成，減少手動維護
3. 類型安全端到端
4. 重構安全（TypeScript 會提示錯誤）
5. 文檔自動生成 (Swagger UI)

---

## 🚀 快速開始

### 安裝依賴
```bash
pnpm install
```

### 啟動服務
```bash
# 單一服務
make dev-event-cms       # CMS 管理後台
make dev-event-portal    # 活動展示前台
make dev-profile         # 技術展示
make dev-enterprise      # 企業管理

# 或使用 pnpm
pnpm dev:event-cms
pnpm dev:event-portal
pnpm dev:profile
pnpm dev:enterprise
```

### 服務網址

- **Event CMS**: http://localhost:3002
- **Event Portal**: http://localhost:3000
- **Profile**: http://localhost:3003
- **Enterprise Admin**: http://localhost:4200
- **Vue Motion**: http://localhost:8080
- **Auth**: http://localhost:5173

---

## 📦 技術棧

### 前端框架
- **React 19** - event-cms, profile, auth
- **Next.js 15** - event-portal (App Router + SSG)
- **Angular 20** - enterprise-admin (Signal Store)
- **Vue 3** - vue-motion (Composition API)

### Monorepo 工具
- **Nx 21.4** - Workspace 管理
- **pnpm** - 包管理器

### UI 技術
- **Radix UI** - 無障礙組件基礎
- **Tailwind CSS** - 樣式系統
- **Vanilla Extract** - CSS-in-TS
- **Design Tokens** - Style Dictionary

### 圖表
- **Recharts** 3.2.1 - React 聲明式圖表
- **Chart.js** 4.5.0 + react-chartjs-2 - 高性能圖表

### 狀態管理
- **React Query** - 服務端狀態
- **Zustand** - 客戶端全局狀態
- **Signal Store** (Angular) - Angular 狀態管理

### API 整合
- **Orval** - OpenAPI → React Query 生成器
- **Axios** - HTTP 客戶端

---

## ⏳ 待完成工作

### 低優先級
- [ ] **event-portal 重寫** (Phase 3)
  - 改善架構分層
  - 優化組件抽象
  - 添加測試覆蓋
  
- [ ] **event-cms Events 列表頁**
  - 活動列表展示
  - 篩選和搜尋
  - 分頁

### 待規劃
- [ ] **後端實施** (NestJS)
  - API Server 創建
  - Prisma 資料庫
  - OpenAPI 自動化
  - 前後端整合

---

## 📈 整體進度

```
前端基礎設施: ████████████████████ 100%
event-cms:    ██████████████████░░  90%
event-portal: ████████████████████ 100% (待重寫)
profile:      ████████████████████ 100%
enterprise-admin: ████████████████ 100%
其他 apps:    ████████████████████ 100%

總體前端進度: 85%
後端進度: 0%
```

---

## 🎨 代碼品質

### 已實施
- ✅ TypeScript 嚴格模式
- ✅ ESLint + Prettier
- ✅ Husky + Commitlint
- ✅ 模組化架構
- ✅ 單一職責原則
- ✅ Composition over Inheritance

### 測試狀態
- ✅ 所有專案可構建
- ⏳ Unit tests (部分)
- ⏳ E2E tests (待添加)

---

## 📚 重要文檔

- [專案規格](./PROJECT_SPECIFICATION.md) - AI 接手必讀
- [開發指南](./DEVELOPMENT_GUIDE.md) - 如何正確添加功能
- [快速參考](./QUICK_REFERENCE.md) - 常用命令和網址
- [後端規格](./backend/IMPLEMENTATION_SPEC.md) - NestJS 實施

---

## 🔮 未來計劃

### 短期 (1-2 週)
1. 實施 NestJS 後端
2. 整合真實 API
3. event-cms Events 列表頁

### 中期 (3-4 週)
4. event-portal 重寫
5. 添加測試覆蓋
6. 性能優化

### 長期
7. 部署到生產環境
8. 監控和分析
9. 持續優化

---

## 💡 關鍵經驗

### ⚠️ 創建新 Libs/Apps 的正確方式

**千萬不要用 `nx g` 預設指令！**

Nx 預設配置不符合本專案的相依關係和建構流程。

**正確做法**:
1. 參考現有可 build 的專案
2. 手動複製配置文件
3. 更新路徑和名稱
4. 立即測試構建

**參考範本**:
- Libs: `libs/ui-components`, `libs/hooks`, `libs/charts`
- Apps: `apps/profile`, `apps/event-cms`

詳見 [開發指南](./DEVELOPMENT_GUIDE.md)

---

## 🎊 專案成就

- ✨ 6 個應用運行正常
- ✨ 7 個共享庫構建成功
- ✨ 完整的設計系統
- ✨ 雙軌制圖表庫
- ✨ 清晰的專案定位
- ✨ 完整的文檔體系

**前端進度**: 85% ✅
**後端進度**: 0% (待實施)
**總體進度**: 42%

