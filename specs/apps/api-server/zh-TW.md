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
  - OpenAPI Docs
  - Authentication
  - Authorization
lastUpdated: '2025-01-24'
category: backend
status: development
published: true

shortDesc: |
  使用 NestJS 與 Prisma 建構的 RESTful API 伺服器，提供 OpenAPI 文檔。
  活動管理平台的後端服務。

purpose: |
  後端 API 展示 NestJS 架構、Prisma 資料庫設計，
  以及 code-first OpenAPI 文檔方法。

highlights:
  - NestJS 10 with TypeScript
  - Prisma ORM 型別安全資料庫存取
  - 自動生成 OpenAPI/Swagger 文檔
  - PostgreSQL/SQLite 支援
  - RESTful API 設計
  - 模組化架構

useCases:
  - Event-CMS 與 Event-Portal 的後端 API
  - RESTful API 設計展示
  - NestJS 最佳實踐範例
  - Prisma 資料庫 schema 管理

targetAudience: |
  展示後端開發技能、API 設計，以及全端開發能力。

reviewer: tessou
reviewedAt: '2025-10-24'
nextReview: '2025-11-24'
updateFrequency: per-feature
draftStatus: false
approvalStatus: approved

lastSync: '2025-10-24'
---

# API Server - NestJS 後端服務

為活動管理平台提供 RESTful API，具備自動生成的 OpenAPI 文檔。

## 技術棧
- NestJS 10
- Prisma ORM
- PostgreSQL / SQLite
- OpenAPI/Swagger
- TypeScript
- Jest 測試

## API Endpoints
- Events API（CRUD）
- Users API（CRUD）
- OpenAPI 文檔於 /api/docs
- Health check endpoint

---

## 進度與規劃

### 目前狀態
- **版本**: 0.1.0
- **完成度**: 80%
- **階段**: 功能可用（開發中）
- **最後更新**: 2025-01-24

### 已完成功能
- ✅ NestJS 10 專案設定
- ✅ Prisma ORM 整合 PostgreSQL/SQLite
- ✅ Events API（完整 CRUD）
- ✅ Users API（完整 CRUD）
- ✅ OpenAPI/Swagger 文檔
- ✅ Code-first API 設計
- ✅ DTO 驗證（class-validator）
- ✅ 資料庫遷移
- ✅ Seed data 腳本
- ✅ 自動生成 OpenAPI 供前端使用

### 進行中
- 🚧 JWT 認證 guards
- 🚧 RBAC（角色權限控制）
- 🚧 測試覆蓋率提升

### 下一步（Roadmap）

**P0 - 關鍵** (2-3 週):
- [ ] 實作 JWT 認證 guards
- [ ] 新增 RBAC 保護端點
- [ ] 檔案上傳服務（活動圖片）
- [ ] 測試（單元 + 整合，目標 70%+）

**P1 - 高優先** (1 個月):
- [ ] Rate limiting middleware
- [ ] 請求日誌記錄
- [ ] 錯誤追蹤（Sentry）
- [ ] API 版本化策略

**P2 - 中優先**:
- [ ] 快取層（Redis）
- [ ] 資料庫查詢最佳化
- [ ] API 效能監控
- [ ] 文檔改進

### 技術債務
- 認證 guards 尚未實作
- 授權邏輯缺失
- 測試覆蓋率 < 20%（目標 70%+）
- 生產資料庫尚未配置
- 錯誤處理需要標準化

### 相依性
- 需要：PostgreSQL 生產環境
- 需要：Redis 快取（未來）
- 需要：檔案儲存服務（未來）

### Changelog
詳見 `apps/api-server/CHANGELOG.md`（待建立）

