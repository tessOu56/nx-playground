---
id: api-server
version: 0.1.0
lastUpdated: '2025-10-24'
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

## 當前狀態
- 完成度：80%
- 認證系統：待實作
- 生產環境：僅開發環境

## 技術棧
- NestJS 10
- Prisma ORM
- PostgreSQL
- OpenAPI/Swagger

## API Endpoints
- Events API（CRUD）
- Users API（CRUD）
- OpenAPI 文檔於 /api/docs

## 路線圖
- 實作 JWT 認證
- 新增 RBAC（角色權限控制）
- 檔案上傳服務
- Rate limiting
- 生產環境部署

