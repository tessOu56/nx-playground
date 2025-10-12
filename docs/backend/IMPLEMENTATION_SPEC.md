# 後端實施規格

## 🎯 專案概述

創建一個 NestJS 後端 API Server，支援 event-cms 和 event-portal 的業務需求。

### 定位

- **用途**: Demo 和技術展示，不處理真實用戶數據
- **範圍**: 完整的 CRUD API，無複雜業務邏輯
- **資料庫**: SQLite (dev), PostgreSQL (prod)
- **OpenAPI**: Code-First，自動生成規格

---

## 🏗️ 專案結構

```
apps/api-server/
├── src/
│   ├── modules/
│   │   ├── events/
│   │   │   ├── entities/
│   │   │   │   └── event.entity.ts
│   │   │   ├── dto/
│   │   │   │   ├── create-event.dto.ts
│   │   │   │   ├── update-event.dto.ts
│   │   │   │   └── event.dto.ts
│   │   │   ├── events.controller.ts
│   │   │   ├── events.service.ts
│   │   │   └── events.module.ts
│   │   │
│   │   ├── users/
│   │   │   └── ... (同 events 結構)
│   │   │
│   │   ├── forms/
│   │   ├── orders/
│   │   └── sessions/
│   │
│   ├── common/
│   │   ├── decorators/
│   │   ├── filters/
│   │   ├── guards/
│   │   ├── interceptors/
│   │   └── pipes/
│   │
│   ├── config/
│   │   └── database.config.ts
│   │
│   ├── app.module.ts
│   └── main.ts
│
├── prisma/
│   ├── schema.prisma
│   ├── seed.ts
│   └── migrations/
│
├── project.json
├── package.json
├── tsconfig.json
├── nest-cli.json
└── README.md
```

---

## 📋 完整的 project.json

```json
{
  "name": "api-server",
  "$schema": "../../node_modules/nx/schemas/project-schema.json",
  "sourceRoot": "apps/api-server/src",
  "projectType": "application",
  "tags": ["type:app", "platform:nestjs"],
  "targets": {
    "build": {
      "executor": "@nx/webpack:webpack",
      "outputs": ["{options.outputPath}"],
      "options": {
        "target": "node",
        "compiler": "tsc",
        "outputPath": "dist/apps/api-server",
        "main": "apps/api-server/src/main.ts",
        "tsConfig": "apps/api-server/tsconfig.app.json",
        "assets": ["apps/api-server/src/assets"],
        "webpackConfig": "apps/api-server/webpack.config.js"
      },
      "configurations": {
        "production": {
          "optimization": true,
          "extractLicenses": true,
          "inspect": false
        }
      }
    },
    "serve": {
      "executor": "@nx/js:node",
      "defaultConfiguration": "development",
      "options": {
        "buildTarget": "api-server:build",
        "port": 3001
      },
      "configurations": {
        "development": {
          "buildTarget": "api-server:build:development"
        },
        "production": {
          "buildTarget": "api-server:build:production"
        }
      }
    },
    "lint": {
      "executor": "@nx/eslint:lint",
      "options": {
        "lintFilePatterns": ["apps/api-server/src/**/*.ts"]
      }
    },
    "test": {
      "executor": "@nx/jest:jest",
      "options": {
        "jestConfig": "apps/api-server/jest.config.ts"
      }
    },
    "prisma:generate": {
      "executor": "nx:run-commands",
      "options": {
        "command": "prisma generate --schema=apps/api-server/prisma/schema.prisma"
      }
    },
    "prisma:migrate": {
      "executor": "nx:run-commands",
      "options": {
        "command": "prisma migrate dev --schema=apps/api-server/prisma/schema.prisma"
      }
    },
    "prisma:seed": {
      "executor": "nx:run-commands",
      "options": {
        "command": "prisma db seed"
      }
    },
    "openapi:generate": {
      "executor": "nx:run-commands",
      "options": {
        "command": "node apps/api-server/scripts/generate-openapi.js"
      }
    }
  }
}
```

---

## 📦 完整的 Prisma Schema

```prisma
// apps/api-server/prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
  output   = "../../../node_modules/.prisma/client"
}

datasource db {
  provider = "sqlite"  // 開發用 SQLite
  // provider = "postgresql"  // 生產用 PostgreSQL
  url      = env("DATABASE_URL")
}

// ==================== 用戶模組 ====================

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String
  avatar    String?
  role      String   @default("user")
  status    String   @default("active")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // 關聯
  orders    Order[]
  sessions  Session[]

  @@map("users")
}

// ==================== 活動模組 ====================

model Event {
  id          String   @id @default(cuid())
  title       String
  description String?
  location    String?
  startDate   DateTime
  endDate     DateTime
  maxAttendees Int?
  status      String   @default("draft")
  formId      String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // 關聯
  form        Form?    @relation(fields: [formId], references: [id])
  orders      Order[]

  @@map("events")
}

// ==================== 表單模組 ====================

model Form {
  id        String   @id @default(cuid())
  name      String
  schema    String   // JSON string
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // 關聯
  events    Event[]

  @@map("forms")
}

// ==================== 訂單模組 ====================

model Order {
  id        String   @id @default(cuid())
  eventId   String
  userId    String
  status    String   @default("pending")
  data      String   // JSON string
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // 關聯
  event     Event    @relation(fields: [eventId], references: [id], onDelete: Cascade)
  user      User     @relation(fields: [userId], references: [id])

  @@map("orders")
}

// ==================== 會話模組 ====================

model Session {
  id        String   @id @default(cuid())
  userId    String
  token     String   @unique
  expiresAt DateTime
  createdAt DateTime @default(now())

  // 關聯
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("sessions")
}
```

---

## 🎯 完整的 NestJS Module 範例

### Events Module

#### events.entity.ts

```typescript
import { ApiProperty } from '@nestjs/swagger';

export class Event {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty({ required: false })
  location?: string;

  @ApiProperty()
  startDate: Date;

  @ApiProperty()
  endDate: Date;

  @ApiProperty({ required: false })
  maxAttendees?: number;

  @ApiProperty({ enum: ['draft', 'published', 'cancelled'] })
  status: string;

  @ApiProperty({ required: false })
  formId?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
```

#### create-event.dto.ts

```typescript
import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsDateString,
  IsOptional,
  IsNumber,
  IsEnum,
} from 'class-validator';

export class CreateEventDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiProperty()
  @IsDateString()
  startDate: string;

  @ApiProperty()
  @IsDateString()
  endDate: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  maxAttendees?: number;

  @ApiProperty({ enum: ['draft', 'published'], default: 'draft' })
  @IsEnum(['draft', 'published'])
  @IsOptional()
  status?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  formId?: string;
}
```

#### update-event.dto.ts

```typescript
import { PartialType } from '@nestjs/swagger';
import { CreateEventDto } from './create-event.dto';

export class UpdateEventDto extends PartialType(CreateEventDto) {}
```

#### events.controller.ts

```typescript
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Event } from './entities/event.entity';

@Controller('events')
@ApiTags('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all events' })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, type: [Event] })
  async findAll(
    @Query('status') status?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number
  ) {
    return this.eventsService.findAll({ status, page, limit });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get event by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, type: Event })
  @ApiResponse({ status: 404, description: 'Event not found' })
  async findOne(@Param('id') id: string) {
    return this.eventsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create new event' })
  @ApiResponse({ status: 201, type: Event })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async create(@Body() createEventDto: CreateEventDto) {
    return this.eventsService.create(createEventDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update event' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, type: Event })
  @ApiResponse({ status: 404, description: 'Event not found' })
  async update(
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto
  ) {
    return this.eventsService.update(id, updateEventDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete event' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Event deleted' })
  @ApiResponse({ status: 404, description: 'Event not found' })
  async remove(@Param('id') id: string) {
    return this.eventsService.remove(id);
  }
}
```

#### events.service.ts

```typescript
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: { status?: string; page?: number; limit?: number }) {
    const { status, page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const where = status ? { status } : {};

    const [items, total] = await Promise.all([
      this.prisma.event.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.event.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string) {
    const event = await this.prisma.event.findUnique({
      where: { id },
      include: { form: true },
    });

    if (!event) {
      throw new NotFoundException(`Event ${id} not found`);
    }

    return event;
  }

  async create(createEventDto: CreateEventDto) {
    return this.prisma.event.create({
      data: createEventDto,
    });
  }

  async update(id: string, updateEventDto: UpdateEventDto) {
    await this.findOne(id); // 確保存在

    return this.prisma.event.update({
      where: { id },
      data: updateEventDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id); // 確保存在

    return this.prisma.event.delete({
      where: { id },
    });
  }
}
```

#### events.module.ts

```typescript
import { Module } from '@nestjs/common';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [EventsController],
  providers: [EventsService],
})
export class EventsModule {}
```

---

## 🔧 自動化腳本

### scripts/sync-openapi.sh

```bash
#!/bin/bash
# 自動同步 OpenAPI 規格到前端

# 1. 啟動 NestJS server (background)
nx serve api-server &
SERVER_PID=$!

# 2. 等待 server 啟動
sleep 5

# 3. 下載 OpenAPI JSON
curl http://localhost:3001/api-json -o openapi.json

# 4. 複製到 api-client
cp openapi.json libs/api-client/specs/server.json

# 5. 運行 orval 生成 hooks
cd libs/api-client
pnpm orval

# 6. 停止 server
kill $SERVER_PID

echo "✅ OpenAPI sync完成！"
```

### scripts/generate-openapi.js

```javascript
const { NestFactory } = require('@nestjs/core');
const { SwaggerModule, DocumentBuilder } = require('@nestjs/swagger');
const { writeFileSync } = require('fs');
const { AppModule } = require('../src/app.module');

async function generate() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('NX Playground API')
    .setDescription('Demo API for NX Playground')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  writeFileSync('./openapi.json', JSON.stringify(document, null, 2));

  console.log('✅ OpenAPI spec generated!');
  process.exit(0);
}

generate();
```

---

## 🌍 環境變數

### .env (開發)

```env
# Database
DATABASE_URL="file:./dev.db"

# Server
PORT=3001
NODE_ENV=development

# CORS
CORS_ORIGIN=http://localhost:3002,http://localhost:3000

# Prisma
PRISMA_SCHEMA_PATH=apps/api-server/prisma/schema.prisma
```

### .env.production

```env
DATABASE_URL="postgresql://user:password@host:5432/nx_playground"
PORT=3001
NODE_ENV=production
CORS_ORIGIN=https://cms.example.com,https://portal.example.com
```

---

## 🐳 Docker 配置

### Dockerfile

```dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

# Copy source
COPY . .

# Build
RUN npx nx build api-server

# Production image
FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/dist/apps/api-server ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/api-server/prisma ./prisma

EXPOSE 3001

CMD ["node", "main.js"]
```

---

## 🚀 開發流程

### 1. 初始設定

```bash
# 安裝 NestJS CLI
pnpm add -D @nestjs/cli

# 安裝 Prisma
pnpm add prisma @prisma/client
pnpm add -D prisma

# 安裝 NestJS 核心
pnpm add @nestjs/common @nestjs/core @nestjs/platform-express
pnpm add @nestjs/swagger

# 初始化 Prisma
cd apps/api-server
npx prisma init
```

### 2. 開發新 API

```bash
# 1. 更新 Prisma schema
# 2. 遷移資料庫
nx prisma:migrate api-server

# 3. 創建 module
mkdir -p src/modules/your-module
# 4. 寫 DTOs, Controller, Service
# 5. 測試
nx serve api-server

# 6. 生成 OpenAPI
nx openapi:generate api-server

# 7. 同步到前端
./scripts/sync-openapi.sh
```

### 3. 測試

```bash
# Unit tests
nx test api-server

# E2E tests
nx e2e api-server-e2e

# Manual test
curl http://localhost:3001/events
```

---

## 📖 相關文檔

- [API 設計](./API_DESIGN.md)
- [資料庫設計](./DATABASE_DESIGN.md)
- [專案規格](../PROJECT_SPECIFICATION.md)
