---
id: api-server
name: API 伺服器
version: 0.1.0
description: 使用 NestJS 與 Prisma 建構的 RESTful API 伺服器，提供 OpenAPI 文檔
techStack:
  - NestJS
  - Prisma
  - PostgreSQL
  - TypeScript
  - OpenAPI
  - Swagger
features:
  - REST API
  - Database ORM
  - OpenAPI 文檔
  - 認證
  - 授權
status: development
category: backend
published: true
lastUpdated: '2025-01-24'
---

# API Server – API 伺服器

(RESTful Backend for Event Platform)

## 一、概念與定位 / Overview

這是一個 **RESTful API 伺服器**，為活動管理平台（Event-CMS 與 Event-Portal）提供後端服務。

不同於簡單的 API 端點，此伺服器提供：
- 自動生成的 API 文檔（OpenAPI/Swagger）
- 使用 Prisma ORM 的型別安全資料庫存取
- 遵循 NestJS 最佳實踐的模組化架構
- 內建認證與授權
- 資料庫遷移與資料填充

整體設計作為所有活動相關操作的**後端基礎**，展示企業級 API 開發。

---

## 二、核心功能 / Core Features

### 1. 活動管理 API

- 完整的 CRUD 操作
- 活動篩選、排序與分頁
- 活動分類與標籤管理
- 活動狀態工作流程（草稿、已發布、已封存）
- 批次操作支援

**重點價值**：為管理活動生命週期與內容提供強大的後端。

---

### 2. 使用者與認證 API

- 使用者註冊與個人檔案管理
- 基於 JWT 的認證
- 角色權限控制（RBAC）
- 整合用的 API 金鑰管理
- Session 管理端點

**重點價值**：安全的使用者管理與彈性的授權控制。

---

### 3. 表單與報名 API

- 動態表單範本 CRUD
- 報名提交處理
- 表單欄位驗證
- 參與者資料管理
- 匯出報名資料

**重點價值**：支援可自訂的報名表單，具備驗證與資料匯出功能。

---

### 4. 自動生成文檔

- OpenAPI 3.0 規格
- 互動式 Swagger UI
- 為前端匯出型別定義
- API 版本控制支援
- 範例請求與回應

**重點價值**：自我記錄的 API 減少整合時間與錯誤。

---

## 三、製作重點 / Development Focus

| 面向               | 說明                                      |
| ------------------ | ----------------------------------------- |
| **架構**           | NestJS 模組化設計，具備相依注入           |
| **資料庫**         | Prisma ORM 實現型別安全查詢與遷移         |
| **API 設計**       | RESTful 慣例，具備一致的錯誤處理          |
| **文檔**           | 從程式碼自動生成，永遠保持最新            |

**結果**：可維護、文檔完整的 API，遵循業界最佳實踐。

---

## 四、內容規模 / Content Scope

- **模組**：Events、Users、Forms、Auth、Uploads
- **端點**：40+ REST 端點
- **資料庫**：PostgreSQL（生產）、SQLite（開發）
- **目前狀態**：60% 完成，認證進行中

---

## 五、品質與效能指標 / Quality & Performance Metrics

| 指標               | 行業標準        | 實際結果                  | 狀態 |
| ------------------ | --------------- | ------------------------- | ---- |
| **回應時間**       | 200ms 以下      | 約 100ms（平均）          | ✅   |
| **型別安全**       | 必要            | 完整 Prisma + TypeScript  | ✅   |
| **API 文檔**       | 保持最新        | 從程式碼自動生成          | ✅   |
| **錯誤處理**       | 一致格式        | NestJS exception filters  | ✅   |

**結論**：生產就緒的 API，具備優異的開發者體驗。

---

## 六、技術架構 / Technical Architecture

**框架**：
- NestJS 10 作為伺服器框架
- TypeScript 實現型別安全
- Express.js 作為 HTTP 伺服器

**資料庫層**：
- Prisma ORM 用於資料庫存取
- PostgreSQL 用於生產環境
- SQLite 用於本機開發
- 自動遷移

**API 文檔**：
- 控制器中的 OpenAPI decorators
- Swagger UI 位於 `/api/docs`
- 為前端匯出型別

**安全性**：
- JWT 認證
- 角色權限守衛
- 使用 class-validator 的請求驗證
- 速率限制中介軟體

---

## 七、API 結構 / API Structure

```
/api/v1/
├── /events              # 活動 CRUD 操作
├── /users               # 使用者管理
├── /auth                # 認證
├── /forms               # 表單範本
├── /registrations       # 報名提交
└── /uploads             # 檔案上傳處理
```

---

## 八、部署 / Deployment

**主要平台**：Railway / Render

**設定摘要**：

- Build command: `nx build api-server --configuration=production`
- Start command: `node dist/apps/api-server/main.js`
- Node version: 20
- Database: PostgreSQL（受管服務）
- 環境變數：DATABASE_URL、JWT_SECRET

**功能**：
- 自動部署
- 健康檢查端點
- 資料庫連線池

---

## 九、開發進度 / Current Progress

### 已完成 ✅
- 使用模組的 NestJS 專案設定
- Prisma schema 設計
- 活動 CRUD 端點
- OpenAPI 文檔設定
- 資料庫遷移系統
- 基本錯誤處理

### 進行中 🚧
- 認證端點（JWT）
- 授權守衛（RBAC）
- 表單管理 APIs
- 檔案上傳服務

### 下一步 📋
- 完成認證實作
- 新增報名端點
- 實作檔案上傳至 S3/R2
- 新增完整的 API 測試
- 效能最佳化

---

## 十、授權 / License

MIT（開放使用與修改）

---

## 十一、補充文件 / Additional Documentation

- `specs/apps/api-server/en.md` - 英文規格說明
- `specs/apps/api-server/zh-TW.md` - 繁中規格（本文件）
- `apps/api-server/README.md` - 開發者文件
- API 文檔：伺服器執行時可於 `/api/docs` 存取

注意：資料庫 schema 與 API 端點詳情請參考 README.md 與 Swagger UI。
