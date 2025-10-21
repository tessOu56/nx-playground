# NX Playground 文檔

> 最後更新: 2025-10-20

## 📖 文檔導覽

> 歡迎來到 NX Playground 文檔中心

## 🚀 快速開始

如果你是：

- **新加入的開發者** → 先讀 [專案規格](./PROJECT_SPECIFICATION.md)
- **AI 接手開發** → 先讀 [專案規格](./PROJECT_SPECIFICATION.md) + [開發指南](./DEVELOPMENT_GUIDE.md)
- **想快速查命令** → 看 [快速參考](./QUICK_REFERENCE.md)
- **想了解進度** → 看 [當前狀態](./CURRENT_STATUS.md)

---

## 📚 核心文檔

### ⭐ 必讀文檔

| 文檔                                   | 說明                           | 適合對象   |
| -------------------------------------- | ------------------------------ | ---------- |
| [當前狀態](./CURRENT_STATUS.md)        | 專案進度、已完成功能、技術決策 | 所有人     |
| [專案規格](./PROJECT_SPECIFICATION.md) | 完整的專案規格和架構設計       | 開發者、AI |
| [開發指南](./DEVELOPMENT_GUIDE.md)     | 如何正確創建 libs/apps         | 開發者、AI |

### 📖 參考文檔

| 文檔                             | 說明                     |
| -------------------------------- | ------------------------ |
| [快速參考](./QUICK_REFERENCE.md) | 常用命令、網址、配置速查 |

### 📁 詳細文檔

| 目錄                   | 說明                              |
| ---------------------- | --------------------------------- |
| [apps/](./apps/)       | 所有應用程式的詳細技術文檔 (7 個) |
| [libs/](./libs/)       | 所有共享函式庫的詳細文檔 (9 個)   |
| [archive/](./archive/) | 歷史文檔和階段性完成報告          |

---

## 🖥️ 應用文檔

**總計**: 7 個應用
**索引**: [apps/README.md](./apps/README.md)

### 生產級應用 (4 個)

1. **[Profile](./apps/PROFILE.md)** ⭐ - 技術展示 Portfolio
   - React 19 + Vite | Port 3003 | ✅ 100%
2. **[Event CMS](./apps/EVENT_CMS.md)** - 活動管理系統
   - React 19 + Vite | Port 3002 | ✅ 90%
3. **[Event Portal](./apps/EVENT_PORTAL.md)** - 活動展示平台
   - Next.js 15 | Port 3000 | ✅ 功能完整
4. **[Auth](./apps/AUTH.md)** - 統一認證服務
   - React 19 + Vite + Ory Kratos | Port 5173 | ✅ 核心完成

### 架構推演/實驗專案 (3 個)

5. **[Enterprise Admin](./apps/ENTERPRISE_ADMIN.md)** - Angular 架構推演
   - Angular 20 | Port 4200 | ✅ 架構完成
6. **[Vue Motion](./apps/VUE_MOTION.md)** - 動畫 Sandbox
   - Vue 3 + GSAP | Port 8080 | ✅ 展示完成
7. **[API Server](./apps/API_SERVER.md)** - NestJS 後端
   - NestJS + Prisma | Port 3333 | 🔄 部分完成

---

## 📦 文檔結構

```
docs/
├── README.md                   📋 本文件（導覽頁）
│
├── 核心文檔/
│   ├── CURRENT_STATUS.md       ⭐ 專案現況
│   ├── PROJECT_SPECIFICATION.md ⭐ 專案規格
│   ├── DEVELOPMENT_GUIDE.md    ⭐ 開發指南
│   └── QUICK_REFERENCE.md      📖 快速參考
│
├── apps/                       🖥️ 應用文檔
│   ├── EVENT_CMS.md            # Event CMS 文檔
│   └── EVENT_PORTAL.md         # Event Portal 文檔
│
├── backend/                    🏗️ 後端文檔
│   ├── IMPLEMENTATION_SPEC.md  # 實施規格
│   ├── API_DESIGN.md           # API 設計
│   └── DATABASE_DESIGN.md      # 資料庫設計
│
└── archive/                    📁 歷史文檔
    ├── PHASE1_COMPLETION.md    # Phase 1 報告
    ├── PHASE2_COMPLETION.md    # Phase 2 報告
    ├── PROJECT_RENAME_AND_CHARTS.md  # 重命名記錄
    ├── FRONTEND_PROGRESS_SUMMARY.md  # 前端進度
    ├── PROJECT_SETUP.md        # 專案設置
    ├── CREATE_REACT_APP.md     # React 模板
    ├── RENAME_MIGRATION.md     # 遷移記錄
    └── BACKEND_NESTJS_PLAN.md  # 後端計劃
```

---

## 🎯 常見任務

### 我想...

**創建新的 Library**
→ 閱讀 [開發指南 - 創建新 Library](./DEVELOPMENT_GUIDE.md#創建新-library)

**創建新的 Application**
→ 閱讀 [開發指南 - 創建新 App](./DEVELOPMENT_GUIDE.md#創建新-app)

**添加新的 UI 組件**
→ 閱讀 [開發指南 - UI 組件開發](./DEVELOPMENT_GUIDE.md#ui-組件開發)

**添加新的 Hook**
→ 閱讀 [開發指南 - Hooks 開發](./DEVELOPMENT_GUIDE.md#hooks-開發)

**添加新的 API**
→ 閱讀 [專案規格 - OpenAPI 工作流程](./PROJECT_SPECIFICATION.md#openapi-工作流程)

**解決建構問題**
→ 閱讀 [開發指南 - 常見問題](./DEVELOPMENT_GUIDE.md#常見問題)

**查看常用命令**
→ 閱讀 [快速參考](./QUICK_REFERENCE.md)

---

## ⚠️ 重要提醒

### 給開發者

1. **千萬不要用 `nx g` 指令創建新專案**

   - Nx 預設配置與本專案不兼容
   - 必須參考現有專案手動複製配置
   - 詳見 [開發指南](./DEVELOPMENT_GUIDE.md)

2. **OpenAPI 是核心**

   - 所有 API 修改必須先更新 OpenAPI spec
   - 使用 Code-First 方式（NestJS decorators）

3. **測試構建**
   - 每次改動後立即測試構建
   - `nx build your-project`

### 給 AI

1. **先讀核心文檔**

   - [專案規格](./PROJECT_SPECIFICATION.md)
   - [開發指南](./DEVELOPMENT_GUIDE.md)

2. **參考現有代碼**

   - 不要憑空創造，參考現有專案
   - 保持代碼風格一致

3. **遵循規範**
   - 查看 `.cursor/rules/nx-playground.md`（如果存在）

---

## 📊 專案狀態

### 整體進度

```
前端基礎設施: ████████████████████ 100%
event-cms:    ██████████████████░░  90%
event-portal: ████████████████████ 100% (待重寫)
其他 apps:    ████████████████████ 100%
後端:         ░░░░░░░░░░░░░░░░░░░░   0% (已規劃)

總體進度:     █████████░░░░░░░░░░░  45%
```

### 下一步

1. **Profile 部署** (立即)

   - 自定義個人資訊
   - 部署到 Cloudflare Pages
   - 作為技術展示和接案平台

2. **後端實施** (優先)

   - 創建 NestJS 應用
   - 實施 Prisma schema
   - 生成 OpenAPI
   - 整合前端

3. **event-cms Events 列表頁** (短期)

4. **event-portal 重寫** (中期)

---

## 🔗 相關資源

### 內部

- [專案 README](../README.md) - 專案根目錄 README

### 外部

- [Nx 官方文檔](https://nx.dev)
- [React 官方文檔](https://react.dev)
- [Next.js 官方文檔](https://nextjs.org)
- [NestJS 官方文檔](https://nestjs.com)

---

## 📝 文檔更新

**最後更新**: 2025-10-20
**版本**: 1.1
**維護者**: NX Playground Team

### 更新記錄

- 2025-10-20: Profile App 完整重構文檔 + Cloudflare 部署準備
- 2025-10-20: 添加 docs/apps/PROFILE.md 和 apps/README.md
- 2025-10-20: 更新 CURRENT_STATUS.md 記錄重構成果
- 2025-10-12: 完成文檔重組和整理
- 2025-10-12: 添加後端規格文檔
- 2025-10-12: 創建應用文檔

---

_如有疑問，請參考相關文檔或查看代碼實現_
