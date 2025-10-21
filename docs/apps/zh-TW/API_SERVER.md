---
title: 'API Server - NestJS 後端服務'
slug: 'api-server'
category: 'apps'
tags: ['NestJS', 'Prisma', 'OpenAPI', 'REST API', 'TypeScript']
date: '2025-10-20'
excerpt: 'OpenAPI 驅動的 RESTful API 服務'
author: 'NX Playground'
lang: 'zh-TW'
published: true
---

# API Server - NestJS 後端服務

> OpenAPI 驅動的 RESTful API 服務

**最後更新**: 2025-10-20

---

## 🎯 專案定位

**後端 API 服務**，提供 events 和 users 的 RESTful API。

### 核心功能

- 📋 **Events API** - 活動 CRUD
- 👥 **Users API** - 用戶管理
- 📄 **OpenAPI 規範** - 自動生成 API 文檔
- 🔄 **Prisma ORM** - 類型安全的資料庫操作

---

## 🛠️ 技術棧

### 核心技術

- **NestJS** - Node.js 框架
- **TypeScript** - 類型安全
- **Prisma** - ORM
- **SQLite** - 開發資料庫
- **PostgreSQL** - 生產資料庫（可選）

### API 技術

- **Swagger/OpenAPI** - API 文檔
- **Class Validator** - DTO 驗證
- **Class Transformer** - 資料轉換

---

## 📂 專案結構

```
src/
├── app.module.ts            # 主模組
├── main.ts                  # 入口點
├── config/                  # 配置
├── common/                  # 共用模組
│   └── prisma/             # Prisma 服務
└── modules/                # 功能模組
    ├── events/             # 活動模組
    │   ├── events.controller.ts
    │   ├── events.service.ts
    │   ├── events.module.ts
    │   └── dto/
    │       ├── create-event.dto.ts
    │       └── update-event.dto.ts
    └── users/              # 用戶模組
        ├── users.controller.ts
        ├── users.service.ts
        ├── users.module.ts
        └── dto/
```

---

## 🗄️ 資料庫設計

### Prisma Schema

```prisma
model Event {
  id          String   @id @default(uuid())
  title       String
  description String?
  location    String?
  startDate   DateTime
  endDate     DateTime
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  sessions    Session[]
  tickets     Ticket[]
}

model User {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String
  role      String   @default("user")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

---

## 🚀 開發

```bash
# 啟動開發服務器
pnpm dev:api
# 或
nx serve @nx-playground/api-server

# 訪問
http://localhost:3333
```

### API 文檔

啟動後訪問：

- **Swagger UI**: http://localhost:3333/api
- **OpenAPI JSON**: http://localhost:3333/api-json

---

## 📋 API Endpoints

### Events

```
GET    /events          # 取得所有活動
GET    /events/:id      # 取得單一活動
POST   /events          # 創建活動
PATCH  /events/:id      # 更新活動
DELETE /events/:id      # 刪除活動
```

### Users

```
GET    /users           # 取得所有用戶
GET    /users/:id       # 取得單一用戶
POST   /users           # 創建用戶
PATCH  /users/:id       # 更新用戶
DELETE /users/:id       # 刪除用戶
```

---

## 🔄 Prisma 使用

### 遷移

```bash
# 創建遷移
npx prisma migrate dev --name init

# 應用遷移
npx prisma migrate deploy

# Prisma Studio（資料庫 GUI）
npx prisma studio
```

### Seed 資料

```bash
# 執行 seed
npx prisma db seed
```

---

## 📄 OpenAPI 生成

### 生成 API Client

```bash
# 生成 OpenAPI spec
node apps/api-server/scripts/generate-openapi.js

# 使用 Orval 生成 React Query hooks
nx generate-api-client
```

產出：

- `libs/api-client/src/generated/` - React Query hooks
- Type-safe API 調用

---

## 🧪 測試

```bash
# Unit tests
nx test @nx-playground/api-server

# E2E tests
# TODO: 待實現
```

---

## 📦 部署

### Docker

```bash
# Build image
docker build -t nx-playground-api .

# Run container
docker run -p 3333:3333 nx-playground-api
```

### Environment Variables

```env
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
PORT=3333
NODE_ENV=production
```

---

## 📝 待辦事項

- [ ] 完成 Events CRUD 實現
- [ ] Sessions/Tickets API
- [ ] Forms API
- [ ] 圖片上傳（Cloudflare R2）
- [ ] 認證整合（Ory Kratos）
- [ ] PostgreSQL 遷移
- [ ] Docker 部署配置
- [ ] E2E 測試

---

## 🔗 相關文檔

- [NestJS Documentation](https://docs.nestjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [API Client Lib](../../libs/api-client/README.md)

---

**狀態**: ✅ 基礎架構完成，部分 API 實現，待完整整合
