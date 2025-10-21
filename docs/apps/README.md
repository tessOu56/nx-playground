# Apps Documentation

> 所有應用程式的詳細技術文檔

**最後更新**: 2025-10-20

---

## 📱 應用程式總覽

本 monorepo 包含 **7 個應用程式**，涵蓋前端、後端、多框架展示。

---

## 🎯 生產級應用 (4 個)

### 1. [Profile](./PROFILE.md) ⭐

**定位**: 專業的技術展示 Portfolio，用於接案和求職

**技術**: React 19 + Vite + React Router
**Port**: 3003
**狀態**: ✅ Production Ready (100%)

**特色**:

- Locale-based routing (/:locale/\*)
- 可點擊技術標籤連到官網
- 配置驅動內容管理
- Cloudflare Pages 部署就緒

**文檔**: [PROFILE.md](./PROFILE.md) | [README](../../apps/profile/README.md)

---

### 2. [Event CMS](./EVENT_CMS.md)

**定位**: 活動內容管理系統（輕量級 CMS）

**技術**: React 19 + Vite + React Router + React Hook Form
**Port**: 3002
**狀態**: ✅ 功能完整 (90%)

**特色**:

- RBAC 權限管理
- 拖放式表單編輯器
- Feature-based 架構
- Design system 整合

**文檔**: [EVENT_CMS.md](./EVENT_CMS.md) | [README](../../apps/event-cms/README.md)

---

### 3. [Event Portal](./EVENT_PORTAL.md)

**定位**: 公開活動展示和報名平台

**技術**: Next.js 15 (App Router) + LINE LIFF
**Port**: 3000
**狀態**: ✅ 功能完整，待重寫

**特色**:

- SSG 靜態生成 (105+ 頁面)
- LINE LIFF 整合
- next-intl 多語系
- QR Code 票券系統

**文檔**: [EVENT_PORTAL.md](./EVENT_PORTAL.md) | [README](../../apps/event-portal/README.md)

---

### 4. [Auth](./AUTH.md)

**定位**: 基於 Ory Kratos 的統一認證服務

**技術**: React 19 + Vite + Ory Kratos
**Port**: 5173
**狀態**: ✅ 核心功能完成

**特色**:

- Ory Kratos 整合
- Google/Apple/LINE SSO
- 品牌設計（磚紅色主題）
- Design system 整合

**文檔**: [AUTH.md](./AUTH.md) | [README](../../apps/auth/README.md)

---

## 🧪 架構推演/實驗專案 (3 個)

### 5. [Enterprise Admin](./ENTERPRISE_ADMIN.md)

**定位**: 企業級 Angular 應用架構驗證

**技術**: Angular 20 + Signal Store
**Port**: 4200
**狀態**: ✅ 架構完成

**特色**:

- RBAC + Dual-control
- 資料處理在 libs/enterprise-data
- SSE 即時監控
- 完整稽核軌跡

**注意**: 這是**架構推演專案**，資料處理邏輯全部在 `libs/enterprise-data`

**文檔**: [ENTERPRISE_ADMIN.md](./ENTERPRISE_ADMIN.md) | [README](../../apps/enterprise-admin/README.md)

---

### 6. [Vue Motion](./VUE_MOTION.md)

**定位**: 動畫實驗與快速 demo Sandbox

**技術**: Vue 3 + GSAP + Three.js
**Port**: 8080
**狀態**: ✅ 展示完成，Sandbox UI 待實現

**特色**:

- GSAP, Three.js, Lottie 展示
- 互動式粒子系統
- 動畫數據在 libs/animation-data

**注意**: 這是**動畫 Sandbox**，動畫數據處理在 `libs/animation-data`

**文檔**: [VUE_MOTION.md](./VUE_MOTION.md) | [README](../../apps/vue-motion/README.md)

---

### 7. [API Server](./API_SERVER.md)

**定位**: NestJS RESTful API 後端服務

**技術**: NestJS + Prisma + SQLite
**Port**: 3333
**狀態**: 🔄 部分完成

**特色**:

- OpenAPI 規範自動生成
- Prisma ORM (type-safe)
- Events/Users API (部分實現)

**文檔**: [API_SERVER.md](./API_SERVER.md) | [README](../../apps/api-server/README.md)

---

## 📊 應用程式對比

| App                  | 定位    | 框架       | Port | 狀態    | 部署             |
| -------------------- | ------- | ---------- | ---- | ------- | ---------------- |
| **Profile**          | 生產    | React 19   | 3003 | ✅ 100% | Cloudflare Pages |
| **Event CMS**        | 生產    | React 19   | 3002 | ✅ 90%  | 待部署           |
| **Event Portal**     | 生產    | Next.js 15 | 3000 | ✅      | 待部署           |
| **Auth**             | 生產    | React 19   | 5173 | ✅      | 待整合           |
| **Enterprise Admin** | 推演    | Angular 20 | 4200 | ✅      | N/A              |
| **Vue Motion**       | Sandbox | Vue 3      | 8080 | ✅      | N/A              |
| **API Server**       | 後端    | NestJS     | 3333 | 🔄      | 待部署           |

### 技術棧詳細

| App              | 構建工具    | 狀態管理 | 樣式     | i18n      | Form | 特殊技術        |
| ---------------- | ----------- | -------- | -------- | --------- | ---- | --------------- |
| Profile          | Vite        | -        | Tailwind | i18next   | -    | Locale routing  |
| Event CMS        | Vite        | Zustand  | Tailwind | i18next   | RHF  | Drag & Drop     |
| Event Portal     | Next.js     | Zustand  | Tailwind | next-intl | -    | LINE LIFF       |
| Auth             | Vite        | MobX     | Tailwind | -         | RHF  | Ory Kratos      |
| Enterprise Admin | Angular CLI | Signals  | Tailwind | -         | -    | SSE             |
| Vue Motion       | Vue CLI     | -        | Tailwind | -         | -    | GSAP, Three.js  |
| API Server       | Webpack     | -        | -        | -         | -    | Prisma, OpenAPI |

---

## 🎓 技術展示

### React 生態

- **React 19**: Profile, Event CMS, Auth
- **Next.js 15**: Event Portal
- **React Router 6**: Profile, Event CMS, Auth
- **React Hook Form**: Event CMS, Auth
- **React Query**: Event CMS (透過 api-client)
- **Zustand**: Event CMS, Event Portal

### 多框架

- **Angular 20**: Enterprise Admin (Signal Store)
- **Vue 3**: Vue Motion (Composition API)
- **NestJS**: API Server

### 設計系統

所有 React apps 使用統一的 `@nx-playground/design-system`：

- **Profile**: 紫色主題
- **Auth**: 磚紅色主題
- **Event CMS/Portal**: 藍灰色主題

---

## 🎯 應用程式分類

### 技術展示類

- **Profile** - 個人技術展示，接案和求職
- **Vue Motion** - 動畫技術實驗和學習

### 業務應用類

- **Event CMS** - 活動管理後台
- **Event Portal** - 活動展示和報名
- **Auth** - 認證服務
- **API Server** - 後端 API

### 架構推演類

- **Enterprise Admin** - 展示企業級功能實作

---

## 📁 文檔結構

```
docs/apps/
├── README.md              ← 本檔案 (索引)
├── PROFILE.md             ← Profile 詳細文檔
├── EVENT_CMS.md           ← Event CMS 詳細文檔
├── EVENT_PORTAL.md        ← Event Portal 詳細文檔
├── AUTH.md                ← Auth 詳細文檔
├── ENTERPRISE_ADMIN.md    ← Enterprise Admin 詳細文檔
├── VUE_MOTION.md          ← Vue Motion 詳細文檔
└── API_SERVER.md          ← API Server 詳細文檔
```

各應用程式也在其專案目錄內有 README：

- `apps/profile/README.md` ⭐
- `apps/event-cms/README.md`
- `apps/event-portal/README.md`
- `apps/auth/README.md`
- `apps/enterprise-admin/README.md`
- `apps/vue-motion/README.md`
- `apps/api-server/README.md`

---

## 🚀 快速開始

### 啟動所有應用

```bash
# 在 monorepo 根目錄
make dev

# 或分別啟動
make dev-profile        # http://localhost:3003
make dev-event-cms      # http://localhost:3002
make dev-event-portal   # http://localhost:3000
make dev-auth           # http://localhost:5173
make dev-enterprise     # http://localhost:4200
make dev-vue            # http://localhost:8080
make dev-api            # http://localhost:3333
```

### 構建所有應用

```bash
# 構建所有
pnpm build:safe

# 構建單一應用
nx build profile --configuration=production
nx build event-cms --configuration=production
nx build auth --configuration=production
```

---

## 🔗 相關文檔

- [專案規格](../PROJECT_SPECIFICATION.md)
- [開發指南](../DEVELOPMENT_GUIDE.md)
- [當前狀態](../CURRENT_STATUS.md)
- [快速參考](../QUICK_REFERENCE.md)
- [Libs 文檔](../libs/README.md)

---

**總應用數**: 7 個
**生產就緒**: 4 個 (57%)
**架構推演/實驗**: 3 個
