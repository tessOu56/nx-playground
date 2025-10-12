# NestJS 後端實施計劃

## 🎯 目標

創建 NestJS 後端專案，實現完全自動化的 Code-First OpenAPI 流程。

## 📋 全自動流程設計

```
1. NestJS 開發 API
   ↓ (使用 @nestjs/swagger decorators)
2. NestJS 啟動時自動生成 openapi.json
   ↓ (寫入到 apps/api-server/openapi-generated.json)
3. Nx 腳本自動複製到 libs/api-client/specs/
   ↓ (watch mode 或 build hook)
4. Orval 自動生成 React Query hooks
   ↓ (libs/api-client/src/generated/)
5. 前端直接使用類型安全的 API
   ↓ (自動 import，無需手動編寫)
```

**結果**: 只需要寫 NestJS 代碼，前端 hooks 自動生成！✨

---

## 🏗️ 專案結構

```
apps/api-server/                    # NestJS 後端
├── src/
│   ├── modules/
│   │   ├── events/                # 活動模組
│   │   │   ├── events.controller.ts
│   │   │   ├── events.service.ts
│   │   │   ├── dto/
│   │   │   │   ├── create-event.dto.ts
│   │   │   │   └── update-event.dto.ts
│   │   │   └── entities/
│   │   │       └── event.entity.ts
│   │   ├── users/                 # 用戶模組
│   │   ├── auth/                  # 認證模組
│   │   └── forms/                 # 表單模組
│   ├── common/                    # 共用模組
│   │   ├── filters/
│   │   ├── interceptors/
│   │   └── guards/
│   ├── config/                    # 配置
│   ├── database/                  # 數據庫
│   │   └── prisma/
│   │       └── schema.prisma
│   ├── app.module.ts
│   └── main.ts
├── openapi-generated.json         # 自動生成的 OpenAPI
├── nest-cli.json
├── tsconfig.app.json
└── project.json
```

---

## 🚀 實施步驟

### Step 1: 創建 NestJS 專案 (30 分鐘)

```bash
# 使用 Nx 創建 NestJS 應用
nx g @nx/nest:application api-server

# 或手動創建並配置
```

**關鍵配置**:

- Port: 3001
- Prefix: /api
- CORS: 允許 localhost:3000,3002,3003

### Step 2: 安裝依賴 (5 分鐘)

```bash
pnpm add -w @nestjs/swagger
pnpm add -w @nestjs/config
pnpm add -w class-validator class-transformer
pnpm add -w prisma @prisma/client
pnpm add -D prisma
```

### Step 3: 配置 OpenAPI 自動生成 (15 分鐘)

**apps/api-server/src/main.ts**:

```typescript
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { writeFileSync } from 'fs';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger 配置
  const config = new DocumentBuilder()
    .setTitle('NX Playground API')
    .setDescription('Event management platform API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // 寫入 OpenAPI JSON
  const outputPath = join(__dirname, '../openapi-generated.json');
  writeFileSync(outputPath, JSON.stringify(document, null, 2));
  console.log(`✅ OpenAPI spec generated: ${outputPath}`);

  // Swagger UI
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(3001);
  console.log(`🚀 API Server running on http://localhost:3001`);
  console.log(`📖 API Docs: http://localhost:3001/api/docs`);
}
bootstrap();
```

### Step 4: 創建自動化腳本 (20 分鐘)

**scripts/sync-openapi.sh**:

```bash
#!/bin/bash

# 同步 OpenAPI spec 到 api-client
SOURCE="apps/api-server/openapi-generated.json"
TARGET="libs/api-client/specs/api-server.openapi.json"

if [ -f "$SOURCE" ]; then
  cp "$SOURCE" "$TARGET"
  echo "✅ Copied OpenAPI spec to api-client"

  # 自動觸發 Orval 生成
  cd libs/api-client
  npm run generate:api:server

  echo "✅ Generated React Query hooks"
else
  echo "❌ OpenAPI spec not found: $SOURCE"
  exit 1
fi
```

**libs/api-client/package.json** 添加:

```json
{
  "scripts": {
    "generate:api:server": "API_MODULE=server API_ENV=dev orval --config orval.config.ts"
  }
}
```

### Step 5: 配置 Nx 依賴 (10 分鐘)

**apps/api-server/project.json**:

```json
{
  "targets": {
    "serve": {
      "executor": "@nx/js:node",
      "options": {
        "buildTarget": "api-server:build",
        "watch": true
      },
      "dependsOn": ["generate-openapi"]
    },
    "generate-openapi": {
      "executor": "nx:run-commands",
      "options": {
        "command": "node dist/apps/api-server/main.js --generate-spec",
        "parallel": false
      }
    },
    "sync-to-frontend": {
      "executor": "nx:run-commands",
      "options": {
        "command": "bash scripts/sync-openapi.sh",
        "parallel": false
      },
      "dependsOn": ["build"]
    }
  }
}
```

### Step 6: 創建示例 API 模組 (30 分鐘)

**apps/api-server/src/modules/events/events.module.ts**:

```typescript
import { Module } from '@nestjs/common';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';

@Module({
  controllers: [EventsController],
  providers: [EventsService],
})
export class EventsModule {}
```

**apps/api-server/src/modules/events/events.controller.ts**:

```typescript
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { EventsService } from './events.service';
import { CreateEventDto, UpdateEventDto, EventDto } from './dto';

@ApiTags('events')
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all events' })
  @ApiResponse({
    status: 200,
    description: 'Return all events',
    type: [EventDto],
  })
  findAll(): EventDto[] {
    return this.eventsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get event by ID' })
  @ApiResponse({ status: 200, description: 'Return event', type: EventDto })
  findOne(@Param('id') id: string): EventDto {
    return this.eventsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create new event' })
  @ApiResponse({ status: 201, description: 'Event created', type: EventDto })
  create(@Body() createEventDto: CreateEventDto): EventDto {
    return this.eventsService.create(createEventDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update event' })
  update(
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto
  ): EventDto {
    return this.eventsService.update(id, updateEventDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete event' })
  delete(@Param('id') id: string): void {
    this.eventsService.delete(id);
  }
}
```

**apps/api-server/src/modules/events/dto/create-event.dto.ts**:

```typescript
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsDate, IsOptional } from 'class-validator';

export class CreateEventDto {
  @ApiProperty({ description: '活動名稱', example: '春季音樂節' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: '活動描述', example: '精彩的音樂盛宴' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: '開始時間' })
  @IsDate()
  startDate: Date;

  @ApiProperty({ description: '結束時間' })
  @IsDate()
  endDate: Date;

  @ApiProperty({ description: '地點', example: '台北小巨蛋' })
  @IsString()
  @IsNotEmpty()
  location: string;
}
```

### Step 7: 設置 Prisma (30 分鐘)

**apps/api-server/prisma/schema.prisma**:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model Event {
  id          String   @id @default(cuid())
  name        String
  description String?
  startDate   DateTime
  endDate     DateTime
  location    String
  status      String   @default("draft")
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model User {
  id        String   @id @default(cuid())
  name      String
  email     String   @unique
  role      String   @default("user")
  status    String   @default("pending")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### Step 8: 配置自動化工作流 (15 分鐘)

**package.json (根目錄)** 添加:

```json
{
  "scripts": {
    "api:dev": "nx serve api-server",
    "api:sync": "bash scripts/sync-openapi.sh",
    "api:generate": "nx run api-server:build && pnpm api:sync",
    "dev:fullstack": "concurrently \"pnpm api:dev\" \"pnpm dev:event-cms\" \"pnpm dev:event-portal\""
  }
}
```

**Makefile** 添加:

```makefile
dev-api: ## 啟動 API Server
	@echo "$(BLUE)[INFO]$(NC) 啟動 API Server (http://localhost:3001)..."
	@pnpm exec nx serve api-server

dev-fullstack: ## 啟動全棧開發環境
	@echo "$(BLUE)[INFO]$(NC) 啟動全棧開發環境..."
	@$(MAKE) dev-api &
	@sleep 3
	@$(MAKE) dev-event-portal &
	@sleep 3
	@$(MAKE) dev-event-cms &
	@echo "$(GREEN)[SUCCESS]$(NC) 全棧環境已啟動！"
	@echo "$(YELLOW)📱 服務網址:$(NC)"
	@echo "  API Server:   http://localhost:3001"
	@echo "  API Docs:     http://localhost:3001/api/docs"
	@echo "  Event Portal: http://localhost:3000"
	@echo "  Event CMS:    http://localhost:3002"
```

---

## 🔄 自動化工作流程

### 開發時 (Dev Mode)

```bash
# 啟動 API Server (自動生成 OpenAPI + watch mode)
pnpm api:dev

# API 變更後，手動同步（或設置 file watcher）
pnpm api:sync
```

### 構建時 (Build)

```bash
# 1. 構建後端，生成 OpenAPI
nx build api-server

# 2. 同步 OpenAPI 到前端並生成 hooks
pnpm api:sync

# 3. 構建前端（使用新生成的 hooks）
nx build event-cms
```

### CI/CD 流程

```yaml
# .github/workflows/build.yml
- name: Build API and generate OpenAPI
  run: nx build api-server

- name: Sync OpenAPI to frontend
  run: pnpm api:sync

- name: Build frontend
  run: nx build event-cms event-portal
```

---

## 📦 技術棧

### 後端

- **NestJS** 10+ - 企業級 Node.js 框架
- **Prisma** 5+ - 類型安全 ORM
- **SQLite** - 開發用資料庫（可換 PostgreSQL）
- **class-validator** - DTO 驗證
- **@nestjs/swagger** - 自動生成 OpenAPI

### API 文檔

- **Swagger UI** - 互動式 API 文檔 (http://localhost:3001/api/docs)
- **OpenAPI 3.0** - RESTful API 規範

---

## 🎯 API 模組規劃

### 1. Events API

```typescript
GET    /api/events          # 取得活動列表
GET    /api/events/:id      # 取得活動詳情
POST   /api/events          # 創建活動
PUT    /api/events/:id      # 更新活動
DELETE /api/events/:id      # 刪除活動
```

### 2. Users API

```typescript
GET    /api/users           # 取得用戶列表
GET    /api/users/:id       # 取得用戶詳情
POST   /api/users           # 創建用戶
PUT    /api/users/:id       # 更新用戶
DELETE /api/users/:id       # 刪除用戶
PUT    /api/users/:id/role  # 更新用戶角色
```

### 3. Forms API

```typescript
GET    /api/forms           # 取得表單列表
GET    /api/forms/:id       # 取得表單詳情
POST   /api/forms           # 創建表單
PUT    /api/forms/:id       # 更新表單
DELETE /api/forms/:id       # 刪除表單
```

### 4. Auth API

```typescript
POST   /api/auth/login      # 登入
POST   /api/auth/register   # 註冊
POST   /api/auth/refresh    # 刷新 token
GET    /api/auth/me         # 取得當前用戶
```

---

## 💡 代碼範例

### NestJS Controller 範例

```typescript
@Controller('events')
@ApiTags('events')
export class EventsController {
  constructor(private eventsService: EventsService) {}

  @Get()
  @ApiOperation({ summary: '取得所有活動' })
  @ApiResponse({
    status: 200,
    description: '成功取得活動列表',
    type: [EventDto],
  })
  async findAll(@Query() query: QueryEventsDto): Promise<EventDto[]> {
    return this.eventsService.findAll(query);
  }
}
```

### DTO 範例

```typescript
export class CreateEventDto {
  @ApiProperty({ description: '活動名稱' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: '活動描述', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: '開始時間' })
  @IsDateString()
  startDate: string;
}
```

### 前端自動生成的 Hook

```typescript
// 自動生成在 libs/api-client/src/generated/server/
export const useGetEvents = () => {
  return useQuery<EventDto[]>({
    queryKey: ['events'],
    queryFn: () => customInstance({ url: '/api/events' }),
  });
};

export const useCreateEvent = () => {
  return useMutation({
    mutationFn: (data: CreateEventDto) =>
      customInstance({
        url: '/api/events',
        method: 'POST',
        data,
      }),
  });
};
```

### 前端使用

```tsx
// 在 event-cms 中使用
import {
  useGetEvents,
  useCreateEvent,
} from '@nx-playground/api-client/server/dev';

function EventsList() {
  const { data, isLoading } = useGetEvents();
  const createMutation = useCreateEvent();

  // 完全類型安全！data 是 EventDto[]
  if (isLoading) return <Spinner />;

  return (
    <div>
      {data?.map(event => (
        <div key={event.id}>{event.name}</div>
      ))}
    </div>
  );
}
```

---

## 📝 實施清單

### Phase 1: 基礎設置 (1-2 小時)

- [ ] 創建 apps/api-server NestJS 專案
- [ ] 安裝所有依賴
- [ ] 配置基本設定 (CORS, Port, Prefix)
- [ ] 設置 Swagger/OpenAPI
- [ ] 測試 "Hello World" API

### Phase 2: Prisma 設置 (1 小時)

- [ ] 初始化 Prisma
- [ ] 設計 schema (Event, User, Form)
- [ ] 生成 Prisma Client
- [ ] 設置 PrismaService
- [ ] 測試資料庫連接

### Phase 3: 核心 API 開發 (3-4 小時)

- [ ] Events 模組 (CRUD)
- [ ] Users 模組 (CRUD + Roles)
- [ ] Forms 模組 (CRUD)
- [ ] Auth 模組 (Login, Register)

### Phase 4: 自動化腳本 (1 小時)

- [ ] 創建 sync-openapi.sh
- [ ] 配置 Nx targets
- [ ] 配置 Orval 生成規則
- [ ] 測試完整流程

### Phase 5: 前端整合 (1 小時)

- [ ] 更新 event-cms 使用真實 API
- [ ] 移除 mock 數據（或保留切換）
- [ ] 測試所有 CRUD 操作
- [ ] 錯誤處理

### Phase 6: 測試與文檔 (1 小時)

- [ ] API 測試
- [ ] E2E 測試
- [ ] 更新文檔

**總計**: 8-10 小時

---

## 🎯 成功標準

- ✅ NestJS 運行在 localhost:3001
- ✅ Swagger UI 可訪問 (/api/docs)
- ✅ OpenAPI spec 自動生成
- ✅ Orval 自動生成 React Query hooks
- ✅ 前端可以使用類型安全的 API
- ✅ 一個命令啟動全棧環境

---

## 🚀 快速開始命令

### 開發

```bash
# 只啟動後端
make dev-api

# 啟動全棧（API + Frontend）
make dev-fullstack

# 同步 OpenAPI 並重新生成 hooks
pnpm api:sync
```

### 訪問

- **API Server**: http://localhost:3001
- **API Docs (Swagger)**: http://localhost:3001/api/docs
- **Event CMS**: http://localhost:3002
- **Event Portal**: http://localhost:3000

---

## 💎 優勢

### 1. 完全類型安全

```typescript
// NestJS 定義一次
class CreateEventDto {
  @ApiProperty()
  name: string;
}

// 前端自動獲得相同類型
const createMutation = useCreateEvent();
createMutation.mutate({
  name: 'Test', // ✅ 類型檢查
  // description: 123 // ❌ TypeScript 錯誤
});
```

### 2. DX (Developer Experience)

- ✅ 只需維護一份 API 定義（NestJS）
- ✅ 前端自動同步
- ✅ 減少手動編寫錯誤
- ✅ API 文檔自動生成

### 3. 可維護性

- ✅ 單一事實來源 (NestJS code)
- ✅ 重構安全（TypeScript 會提示錯誤）
- ✅ 易於擴展新 API

---

## 🔮 未來擴展

### 選項 A: 添加更多功能

- WebSocket (即時更新)
- File Upload (圖片上傳)
- Email Service (通知)
- Cron Jobs (定時任務)

### 選項 B: 切換到 PostgreSQL

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### 選項 C: 添加 GraphQL

```bash
pnpm add @nestjs/graphql @nestjs/apollo
```

---

## ❓ 接下來？

1. **立即開始**：創建 NestJS 專案
2. **先規劃**：詳細設計 API 結構
3. **測試現有**：先測試前端，確認功能正常

請告訴我你想怎麼做！🚀
