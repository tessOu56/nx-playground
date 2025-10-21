# 資料庫設計

## 🎯 設計原則

- **簡潔** - Demo 用途，不過度設計
- **正規化** - 符合第三正規化
- **可擴展** - 預留擴展空間
- **類型安全** - 使用 Prisma 確保類型安全

---

## 📊 資料模型總覽

```
User (用戶)
  ├─ has many Orders
  └─ has many Sessions

Event (活動)
  ├─ belongs to Form (optional)
  └─ has many Orders

Form (表單)
  └─ has many Events

Order (訂單)
  ├─ belongs to Event
  └─ belongs to User

Session (會話)
  └─ belongs to User
```

---

## 📋 完整的資料模型

### User (用戶)

用於管理用戶資訊和權限。

| 欄位 | 類型 | 必填 | 預設 | 說明 |
|------|------|------|------|------|
| id | String | ✓ | cuid() | 主鍵 |
| email | String | ✓ | - | Email (唯一) |
| name | String | ✓ | - | 用戶名稱 |
| avatar | String | ✗ | null | 頭像 URL |
| role | String | ✓ | "user" | 角色: user/organizer/admin |
| status | String | ✓ | "active" | 狀態: active/inactive/suspended |
| createdAt | DateTime | ✓ | now() | 創建時間 |
| updatedAt | DateTime | ✓ | auto | 更新時間 |

**關聯**:
- `orders: Order[]` - 用戶的訂單
- `sessions: Session[]` - 用戶的會話

**索引**:
- `email` - UNIQUE

**Prisma Schema**:
```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String
  avatar    String?
  role      String   @default("user")
  status    String   @default("active")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  orders    Order[]
  sessions  Session[]

  @@map("users")
}
```

---

### Event (活動)

核心業務實體，代表一個活動。

| 欄位 | 類型 | 必填 | 預設 | 說明 |
|------|------|------|------|------|
| id | String | ✓ | cuid() | 主鍵 |
| title | String | ✓ | - | 活動標題 |
| description | String | ✗ | null | 活動描述 |
| location | String | ✗ | null | 活動地點 |
| startDate | DateTime | ✓ | - | 開始時間 |
| endDate | DateTime | ✓ | - | 結束時間 |
| maxAttendees | Int | ✗ | null | 最大報名人數 |
| status | String | ✓ | "draft" | 狀態: draft/published/cancelled |
| formId | String | ✗ | null | 關聯的表單 ID |
| createdAt | DateTime | ✓ | now() | 創建時間 |
| updatedAt | DateTime | ✓ | auto | 更新時間 |

**關聯**:
- `form: Form` - 關聯的表單 (optional)
- `orders: Order[]` - 活動的訂單

**索引**:
- `status` - 常用查詢
- `startDate` - 時間範圍查詢

**Prisma Schema**:
```prisma
model Event {
  id           String   @id @default(cuid())
  title        String
  description  String?
  location     String?
  startDate    DateTime
  endDate      DateTime
  maxAttendees Int?
  status       String   @default("draft")
  formId       String?
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  form         Form?    @relation(fields: [formId], references: [id])
  orders       Order[]

  @@index([status])
  @@index([startDate])
  @@map("events")
}
```

---

### Form (表單)

表單模板，定義報名時需要填寫的欄位。

| 欄位 | 類型 | 必填 | 預設 | 說明 |
|------|------|------|------|------|
| id | String | ✓ | cuid() | 主鍵 |
| name | String | ✓ | - | 表單名稱 |
| schema | String | ✓ | - | JSON schema (字串格式) |
| createdAt | DateTime | ✓ | now() | 創建時間 |
| updatedAt | DateTime | ✓ | auto | 更新時間 |

**關聯**:
- `events: Event[]` - 使用此表單的活動

**Schema 格式範例**:
```json
{
  "fields": [
    {
      "id": "name",
      "type": "text",
      "label": "姓名",
      "required": true
    },
    {
      "id": "email",
      "type": "email",
      "label": "Email",
      "required": true
    },
    {
      "id": "phone",
      "type": "tel",
      "label": "電話",
      "required": false
    }
  ]
}
```

**Prisma Schema**:
```prisma
model Form {
  id        String   @id @default(cuid())
  name      String
  schema    String   // JSON string
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  events    Event[]

  @@map("forms")
}
```

---

### Order (訂單)

用戶的活動報名記錄。

| 欄位 | 類型 | 必填 | 預設 | 說明 |
|------|------|------|------|------|
| id | String | ✓ | cuid() | 主鍵 |
| eventId | String | ✓ | - | 活動 ID |
| userId | String | ✓ | - | 用戶 ID |
| status | String | ✓ | "pending" | 狀態: pending/confirmed/cancelled |
| data | String | ✓ | - | 表單填寫數據 (JSON 字串) |
| createdAt | DateTime | ✓ | now() | 創建時間 |
| updatedAt | DateTime | ✓ | auto | 更新時間 |

**關聯**:
- `event: Event` - 關聯的活動
- `user: User` - 關聯的用戶

**索引**:
- `eventId` - 常用查詢
- `userId` - 常用查詢
- `status` - 狀態篩選

**Data 格式範例**:
```json
{
  "name": "張三",
  "email": "user@example.com",
  "phone": "0912345678",
  "note": "無特殊需求"
}
```

**Prisma Schema**:
```prisma
model Order {
  id        String   @id @default(cuid())
  eventId   String
  userId    String
  status    String   @default("pending")
  data      String   // JSON string
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  event     Event    @relation(fields: [eventId], references: [id], onDelete: Cascade)
  user      User     @relation(fields: [userId], references: [id])

  @@index([eventId])
  @@index([userId])
  @@index([status])
  @@map("orders")
}
```

---

### Session (會話)

用戶登入會話，用於認證。

| 欄位 | 類型 | 必填 | 預設 | 說明 |
|------|------|------|------|------|
| id | String | ✓ | cuid() | 主鍵 |
| userId | String | ✓ | - | 用戶 ID |
| token | String | ✓ | - | JWT token (唯一) |
| expiresAt | DateTime | ✓ | - | 過期時間 |
| createdAt | DateTime | ✓ | now() | 創建時間 |

**關聯**:
- `user: User` - 關聯的用戶

**索引**:
- `token` - UNIQUE，快速查找
- `userId` - 查詢用戶的所有會話
- `expiresAt` - 清理過期會話

**Prisma Schema**:
```prisma
model Session {
  id        String   @id @default(cuid())
  userId    String
  token     String   @unique
  expiresAt DateTime
  createdAt DateTime @default(now())

  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([expiresAt])
  @@map("sessions")
}
```

---

## 🔗 關聯關係圖 (文字版)

```
┌──────────┐
│   User   │
└─────┬────┘
      │
      │ 1:N (has many)
      ├─────────────────┐
      │                 │
      ▼                 ▼
┌──────────┐      ┌──────────┐
│  Order   │      │ Session  │
└─────┬────┘      └──────────┘
      │
      │ N:1 (belongs to)
      ▼
┌──────────┐
│  Event   │
└─────┬────┘
      │
      │ N:1 (belongs to, optional)
      ▼
┌──────────┐
│   Form   │
└──────────┘
```

---

## 📈 索引策略

### 主鍵索引
所有表的 `id` 欄位自動建立主鍵索引。

### 唯一索引
- `users.email` - 確保 email 唯一
- `sessions.token` - 確保 token 唯一

### 查詢優化索引
- `events.status` - 常用狀態篩選
- `events.startDate` - 時間範圍查詢
- `orders.eventId` - JOIN 優化
- `orders.userId` - 查詢用戶訂單
- `orders.status` - 狀態篩選
- `sessions.userId` - 查詢用戶會話
- `sessions.expiresAt` - 清理過期會話

---

## 🔄 遷移策略

### 開發環境
```bash
# 創建新遷移
nx prisma:migrate api-server

# 應用遷移
prisma migrate deploy

# 重置資料庫 (謹慎使用)
prisma migrate reset
```

### 生產環境
```bash
# 只應用遷移，不修改
prisma migrate deploy

# 檢查狀態
prisma migrate status
```

---

## 🌱 種子數據

### seed.ts
```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // 創建用戶
  const user1 = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      name: '管理員',
      role: 'admin',
      status: 'active',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'user@example.com',
      name: '一般用戶',
      role: 'user',
      status: 'active',
    },
  });

  // 創建表單
  const form = await prisma.form.create({
    data: {
      name: '基本報名表單',
      schema: JSON.stringify({
        fields: [
          { id: 'name', type: 'text', label: '姓名', required: true },
          { id: 'email', type: 'email', label: 'Email', required: true },
          { id: 'phone', type: 'tel', label: '電話', required: false },
        ],
      }),
    },
  });

  // 創建活動
  const event = await prisma.event.create({
    data: {
      title: '技術分享會',
      description: '分享最新的前端技術',
      location: '台北市信義區',
      startDate: new Date('2025-11-01T14:00:00Z'),
      endDate: new Date('2025-11-01T17:00:00Z'),
      maxAttendees: 50,
      status: 'published',
      formId: form.id,
    },
  });

  // 創建訂單
  await prisma.order.create({
    data: {
      eventId: event.id,
      userId: user2.id,
      status: 'confirmed',
      data: JSON.stringify({
        name: '一般用戶',
        email: 'user@example.com',
        phone: '0912345678',
      }),
    },
  });

  console.log('✅ Seed data created!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

**運行種子**:
```bash
nx prisma:seed api-server
```

---

## 🗄️ 資料庫配置

### SQLite (開發)
```env
DATABASE_URL="file:./dev.db"
```

**優點**:
- 簡單，無需額外安裝
- 快速開發
- 輕量級

**缺點**:
- 不支援某些 SQL 功能
- 不適合生產環境

### PostgreSQL (生產)
```env
DATABASE_URL="postgresql://user:password@host:5432/database?schema=public"
```

**優點**:
- 功能完整
- 高性能
- 生產級別

**遷移從 SQLite 到 PostgreSQL**:
1. 更新 `schema.prisma` 的 `provider`
2. 運行遷移: `prisma migrate dev`
3. 重新生成 client: `prisma generate`

---

## 📊 查詢範例

### 查詢活動和訂單統計
```typescript
const eventWithStats = await prisma.event.findUnique({
  where: { id: 'evt_123' },
  include: {
    form: true,
    orders: {
      where: { status: 'confirmed' },
    },
  },
});

const attendeesCount = eventWithStats.orders.length;
```

### 查詢用戶的所有訂單
```typescript
const userOrders = await prisma.order.findMany({
  where: {
    userId: 'usr_123',
  },
  include: {
    event: true,
  },
  orderBy: {
    createdAt: 'desc',
  },
});
```

### 統計活動數量
```typescript
const stats = await prisma.event.groupBy({
  by: ['status'],
  _count: {
    id: true,
  },
});

// 結果: [
//   { status: 'published', _count: { id: 45 } },
//   { status: 'draft', _count: { id: 30 } },
// ]
```

---

## 🛠️ 維護操作

### 備份資料庫 (SQLite)
```bash
cp apps/api-server/prisma/dev.db backup/dev-$(date +%Y%m%d).db
```

### 清理過期會話
```typescript
await prisma.session.deleteMany({
  where: {
    expiresAt: {
      lt: new Date(),
    },
  },
});
```

### 重置開發資料庫
```bash
nx prisma:migrate api-server -- reset
nx prisma:seed api-server
```

---

## 📖 相關文檔

- [實施規格](./IMPLEMENTATION_SPEC.md)
- [API 設計](./API_DESIGN.md)
- [專案規格](../PROJECT_SPECIFICATION.md)

