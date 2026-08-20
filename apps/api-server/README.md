---
id: api-server
name: API Server
version: 0.1.0
description: >-
  RESTful API server built with NestJS and Prisma, providing OpenAPI
  documentation
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
lastUpdated: '2025-10-21'
---
# API Server - NestJS Backend

> **定位**: Demo API Server for NX Playground
> **技術**: NestJS 10 + Prisma 5 + PostgreSQL
> **Port**: 3001

## 📋 專案概覽

NestJS 後端 API Server，提供完整的 CRUD API 支援 event-cms 和 event-portal。

### 核心特色

- 🔧 **Code-First OpenAPI** - 自動生成 API 規格
- 📦 **Prisma ORM** - 類型安全的資料庫操作
- ✅ **自動驗證** - class-validator + class-transformer
- 🔄 **自動化工作流** - OpenAPI → Orval → React Query
- 🎯 **單一事實來源** - NestJS code 定義一切

---

## 🚀 快速開始

### 1. 安裝依賴

```bash
pnpm install
```

### 2. 設置環境變數

複製 repo 根 `.env.example` 值到 gitignored `.env`（或 `make db-up` + `./scripts/env-setup.sh`）:

```bash
# repo root .env — never sqlite
DATABASE_URL=postgresql://event:event@127.0.0.1:5433/event_stack
```

### 3. 初始化資料庫

```bash
# 生成 Prisma Client
nx prisma-generate api-server

# 運行遷移
nx prisma-migrate api-server

# 種子數據
nx prisma-seed api-server
```

### 4. 啟動開發服務

```bash
nx serve api-server
```

訪問：

- API: http://localhost:3001/api
- Swagger Docs: http://localhost:3001/api/docs

---

## 📦 API Endpoints

### Events API

- `GET /api/events` - 取得活動列表
- `GET /api/events/:id` - 取得活動詳情
- `POST /api/events` - 創建活動
- `PUT /api/events/:id` - 更新活動
- `DELETE /api/events/:id` - 刪除活動

### Users API

- `GET /api/users` - 取得用戶列表
- `GET /api/users/:id` - 取得用戶詳情
- `POST /api/users` - 創建用戶
- `PUT /api/users/:id` - 更新用戶
- `DELETE /api/users/:id` - 刪除用戶

完整 API 文檔請查看 Swagger UI 或 `specs/BACKEND/API_DESIGN.md`

---

## 🔧 開發工作流

### 添加新的 API

1. **創建 Entity**

   ```typescript
   // src/modules/your-module/entities/your.entity.ts
   export class YourEntity {
     @ApiProperty()
     id: string;

     @ApiProperty()
     name: string;
   }
   ```

2. **創建 DTOs**

   ```typescript
   // dto/create-your.dto.ts
   export class CreateYourDto {
     @ApiProperty()
     @IsString()
     name: string;
   }
   ```

3. **創建 Service**

   ```typescript
   @Injectable()
   export class YourService {
     constructor(private prisma: PrismaService) {}
     // CRUD methods
   }
   ```

4. **創建 Controller**

   ```typescript
   @Controller('your-resource')
   @ApiTags('your-resource')
   export class YourController {
     // REST endpoints
   }
   ```

5. **更新 AppModule**

   ```typescript
   @Module({
     imports: [YourModule, ...],
   })
   ```

6. **生成 OpenAPI**

   ```bash
   nx openapi-generate api-server
   ```

7. **前端自動獲得 hooks**
   ```bash
   cd libs/api-client
   pnpm orval
   ```

---

## 🗄️ Prisma 命令

### 開發

```bash
# 生成 Prisma Client
nx prisma-generate api-server

# 創建遷移
nx prisma-migrate api-server

# 重置資料庫
cd apps/api-server
prisma migrate reset --schema=prisma/schema.prisma

# 種子數據
nx prisma-seed api-server

# Prisma Studio (資料庫 GUI)
cd apps/api-server
prisma studio --schema=prisma/schema.prisma
```

### 生產

```bash
# 應用遷移
prisma migrate deploy --schema=apps/api-server/prisma/schema.prisma

# 檢查狀態
prisma migrate status --schema=apps/api-server/prisma/schema.prisma
```

---

## 📚 專案結構

```
apps/api-server/
├── src/
│   ├── modules/
│   │   ├── events/              # Events module
│   │   │   ├── entities/
│   │   │   ├── dto/
│   │   │   ├── events.controller.ts
│   │   │   ├── events.service.ts
│   │   │   └── events.module.ts
│   │   │
│   │   └── users/               # Users module
│   │       └── ... (same structure)
│   │
│   ├── common/
│   │   └── prisma/              # Prisma service
│   │
│   ├── app.module.ts
│   └── main.ts
│
├── prisma/
│   ├── schema.prisma            # Database schema
│   ├── seed.cjs                 # Seed data (node; postgres only)
│   └── migrations/              # Migration files
│
├── scripts/
│   └── generate-openapi.js      # OpenAPI generator
│
├── .env.example
├── project.json
├── package.json
└── README.md
```

---

## 🔄 OpenAPI 自動化

### 完整流程

```
1. 寫 NestJS Controller + DTOs
   ↓
2. 啟動 server (Swagger 自動生成)
   ↓
3. 運行 generate-openapi script
   ↓
4. OpenAPI JSON 自動複製到 libs/api-client/specs/
   ↓
5. 運行 orval 生成 React Query hooks
   ↓
6. 前端直接使用類型安全的 hooks
```

### 手動生成

```bash
# 方法 1: 使用 Nx target
nx openapi-generate api-server

# 方法 2: 直接運行腳本
node apps/api-server/scripts/generate-openapi.js
```

---

## 📦 構建和部署

### 構建

```bash
nx build api-server
```

輸出: `dist/apps/api-server/`

### 運行生產版本

```bash
node dist/apps/api-server/main.js
```

### Docker

```bash
# 構建
docker build -t nx-playground-api -f apps/api-server/Dockerfile .

# 運行
docker run -p 3001:3001 nx-playground-api
```

---

## 🧪 測試

```bash
# Unit tests
nx test api-server

# E2E tests (TBD)
nx e2e api-server-e2e

# 測試 API (手動)
curl http://localhost:3001/api/events
curl http://localhost:3001/api/users
```

---

## 📖 相關文檔

- [實施規格](../../specs/BACKEND/IMPLEMENTATION_SPEC.md)
- [API 設計](../../specs/BACKEND/API_DESIGN.md)
- [資料庫設計](../../specs/BACKEND/DATABASE_DESIGN.md)
- [專案規格](../../docs/PROJECT_SPECIFICATION.md)
