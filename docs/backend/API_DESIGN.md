# API 設計規格

## 📋 API 概覽

基於 RESTful 風格，遵循以下原則：

- **統一格式** - 所有 API 返回結構一致
- **語意化 HTTP 方法** - GET/POST/PUT/DELETE
- **分頁查詢** - 統一的分頁參數
- **錯誤處理** - 標準化錯誤訊息
- **OpenAPI** - 完整的規格文檔

---

## 🌐 API Base URL

**開發環境**: `http://localhost:3001/api`
**生產環境**: `https://api.nx-playground.local/api`

---

## 📦 返回格式

### 成功響應

#### 單一資源
```json
{
  "id": "clu123abc",
  "title": "活動名稱",
  "description": "活動描述",
  "createdAt": "2025-10-12T10:00:00Z",
  "updatedAt": "2025-10-12T10:00:00Z"
}
```

#### 列表資源（分頁）
```json
{
  "items": [
    { "id": "1", "title": "Item 1" },
    { "id": "2", "title": "Item 2" }
  ],
  "total": 100,
  "page": 1,
  "limit": 10,
  "totalPages": 10
}
```

### 錯誤響應

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request",
  "details": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ]
}
```

---

## 🎯 Events API

### GET /api/events
取得活動列表

**Query Parameters**:
```typescript
{
  status?: 'draft' | 'published' | 'cancelled',
  page?: number,    // default: 1
  limit?: number,   // default: 10
  sort?: string,    // default: '-createdAt'
  search?: string,  // 搜尋標題/描述
}
```

**Response 200**:
```json
{
  "items": [
    {
      "id": "evt_123",
      "title": "技術分享會",
      "description": "分享最新的前端技術",
      "location": "台北市信義區",
      "startDate": "2025-11-01T14:00:00Z",
      "endDate": "2025-11-01T17:00:00Z",
      "maxAttendees": 50,
      "status": "published",
      "formId": "form_456",
      "createdAt": "2025-10-12T10:00:00Z",
      "updatedAt": "2025-10-12T10:00:00Z"
    }
  ],
  "total": 25,
  "page": 1,
  "limit": 10,
  "totalPages": 3
}
```

---

### GET /api/events/:id
取得單一活動詳情

**Path Parameters**:
- `id` (string, required) - 活動 ID

**Response 200**:
```json
{
  "id": "evt_123",
  "title": "技術分享會",
  "description": "分享最新的前端技術",
  "location": "台北市信義區",
  "startDate": "2025-11-01T14:00:00Z",
  "endDate": "2025-11-01T17:00:00Z",
  "maxAttendees": 50,
  "currentAttendees": 32,
  "status": "published",
  "formId": "form_456",
  "form": {
    "id": "form_456",
    "name": "報名表單",
    "schema": "{...}"
  },
  "createdAt": "2025-10-12T10:00:00Z",
  "updatedAt": "2025-10-12T10:00:00Z"
}
```

**Response 404**:
```json
{
  "statusCode": 404,
  "message": "Event evt_999 not found",
  "error": "Not Found"
}
```

---

### POST /api/events
創建新活動

**Request Body**:
```json
{
  "title": "技術分享會",
  "description": "分享最新的前端技術",
  "location": "台北市信義區",
  "startDate": "2025-11-01T14:00:00Z",
  "endDate": "2025-11-01T17:00:00Z",
  "maxAttendees": 50,
  "status": "draft",
  "formId": "form_456"
}
```

**Validation**:
- `title` - required, string, 1-200 characters
- `description` - optional, string, max 2000 characters
- `location` - optional, string
- `startDate` - required, ISO 8601 date string
- `endDate` - required, ISO 8601 date string, must be after startDate
- `maxAttendees` - optional, number, min 1
- `status` - optional, enum: ['draft', 'published'], default: 'draft'
- `formId` - optional, string

**Response 201**:
```json
{
  "id": "evt_789",
  "title": "技術分享會",
  "description": "分享最新的前端技術",
  "location": "台北市信義區",
  "startDate": "2025-11-01T14:00:00Z",
  "endDate": "2025-11-01T17:00:00Z",
  "maxAttendees": 50,
  "status": "draft",
  "formId": "form_456",
  "createdAt": "2025-10-12T10:30:00Z",
  "updatedAt": "2025-10-12T10:30:00Z"
}
```

**Response 400**:
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request",
  "details": [
    {
      "field": "title",
      "message": "title is required"
    }
  ]
}
```

---

### PUT /api/events/:id
更新活動

**Path Parameters**:
- `id` (string, required) - 活動 ID

**Request Body**: (所有欄位 optional)
```json
{
  "title": "更新後的標題",
  "status": "published"
}
```

**Response 200**: (同 GET /api/events/:id)

**Response 404**: Event not found

---

### DELETE /api/events/:id
刪除活動

**Path Parameters**:
- `id` (string, required) - 活動 ID

**Response 200**:
```json
{
  "message": "Event deleted successfully",
  "id": "evt_123"
}
```

**Response 404**: Event not found

---

## 👥 Users API

### GET /api/users
取得用戶列表

**Query Parameters**:
```typescript
{
  role?: 'admin' | 'user' | 'organizer',
  status?: 'active' | 'inactive' | 'suspended',
  page?: number,
  limit?: number,
  search?: string,
}
```

**Response 200**: (同 Events 分頁格式)

---

### GET /api/users/:id
取得用戶詳情

**Response 200**:
```json
{
  "id": "usr_123",
  "email": "user@example.com",
  "name": "張三",
  "avatar": "https://...",
  "role": "user",
  "status": "active",
  "createdAt": "2025-01-01T00:00:00Z",
  "updatedAt": "2025-10-12T10:00:00Z",
  "stats": {
    "totalOrders": 5,
    "totalEvents": 3
  }
}
```

---

### POST /api/users
創建用戶

**Request Body**:
```json
{
  "email": "user@example.com",
  "name": "張三",
  "role": "user",
  "password": "hashed_password"
}
```

**Response 201**: (同 GET /api/users/:id)

---

### PUT /api/users/:id
更新用戶

**Request Body**: (所有欄位 optional)
```json
{
  "name": "李四",
  "role": "organizer",
  "status": "active"
}
```

**Response 200**: (同 GET /api/users/:id)

---

### DELETE /api/users/:id
刪除用戶

**Response 200**:
```json
{
  "message": "User deleted successfully",
  "id": "usr_123"
}
```

---

## 📝 Forms API

### GET /api/forms
取得表單列表

**Response 200**:
```json
{
  "items": [
    {
      "id": "form_123",
      "name": "基本報名表單",
      "schema": "{...}",
      "createdAt": "2025-10-01T00:00:00Z",
      "updatedAt": "2025-10-01T00:00:00Z",
      "eventsCount": 5
    }
  ],
  "total": 10,
  "page": 1,
  "limit": 10,
  "totalPages": 1
}
```

---

### GET /api/forms/:id
取得表單詳情

**Response 200**:
```json
{
  "id": "form_123",
  "name": "基本報名表單",
  "schema": {
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
      }
    ]
  },
  "createdAt": "2025-10-01T00:00:00Z",
  "updatedAt": "2025-10-01T00:00:00Z",
  "events": [
    {
      "id": "evt_123",
      "title": "技術分享會"
    }
  ]
}
```

---

### POST /api/forms
創建表單

**Request Body**:
```json
{
  "name": "基本報名表單",
  "schema": {
    "fields": [...]
  }
}
```

**Validation**:
- `name` - required, string, 1-100 characters
- `schema` - required, valid JSON object

**Response 201**: (同 GET /api/forms/:id)

---

### PUT /api/forms/:id
更新表單

**Request Body**: (所有欄位 optional)
```json
{
  "name": "更新後的表單名稱",
  "schema": {...}
}
```

**Response 200**: (同 GET /api/forms/:id)

---

### DELETE /api/forms/:id
刪除表單

**Response 200**:
```json
{
  "message": "Form deleted successfully",
  "id": "form_123"
}
```

---

## 📋 Orders API

### GET /api/orders
取得訂單列表

**Query Parameters**:
```typescript
{
  eventId?: string,
  userId?: string,
  status?: 'pending' | 'confirmed' | 'cancelled',
  page?: number,
  limit?: number,
}
```

**Response 200**:
```json
{
  "items": [
    {
      "id": "ord_123",
      "eventId": "evt_456",
      "userId": "usr_789",
      "status": "confirmed",
      "data": {
        "name": "張三",
        "email": "user@example.com"
      },
      "createdAt": "2025-10-15T10:00:00Z",
      "updatedAt": "2025-10-15T10:00:00Z",
      "event": {
        "id": "evt_456",
        "title": "技術分享會"
      },
      "user": {
        "id": "usr_789",
        "name": "張三"
      }
    }
  ],
  "total": 50,
  "page": 1,
  "limit": 10,
  "totalPages": 5
}
```

---

### GET /api/orders/:id
取得訂單詳情

**Response 200**: (同列表單一 item + 更多詳情)

---

### POST /api/orders
創建訂單

**Request Body**:
```json
{
  "eventId": "evt_456",
  "userId": "usr_789",
  "data": {
    "name": "張三",
    "email": "user@example.com",
    "phone": "0912345678"
  }
}
```

**Validation**:
- `eventId` - required, valid event ID
- `userId` - required, valid user ID
- `data` - required, object matching form schema

**Response 201**: (同 GET /api/orders/:id)

---

### PUT /api/orders/:id
更新訂單狀態

**Request Body**:
```json
{
  "status": "confirmed"
}
```

**Response 200**: (同 GET /api/orders/:id)

---

### DELETE /api/orders/:id
取消訂單

**Response 200**:
```json
{
  "message": "Order cancelled successfully",
  "id": "ord_123"
}
```

---

## 🔐 Sessions API (認證)

### POST /api/sessions
登入 (創建會話)

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response 201**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresAt": "2025-10-13T10:00:00Z",
  "user": {
    "id": "usr_123",
    "email": "user@example.com",
    "name": "張三",
    "role": "user"
  }
}
```

**Response 401**:
```json
{
  "statusCode": 401,
  "message": "Invalid credentials",
  "error": "Unauthorized"
}
```

---

### DELETE /api/sessions/:token
登出 (刪除會話)

**Path Parameters**:
- `token` (string, required) - Session token

**Response 200**:
```json
{
  "message": "Logged out successfully"
}
```

---

### GET /api/sessions/me
取得當前用戶

**Headers**:
```
Authorization: Bearer <token>
```

**Response 200**:
```json
{
  "id": "usr_123",
  "email": "user@example.com",
  "name": "張三",
  "role": "user",
  "avatar": "https://..."
}
```

**Response 401**:
```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized"
}
```

---

## 📈 Statistics API (統計)

### GET /api/stats/dashboard
取得儀表板統計

**Response 200**:
```json
{
  "totalEvents": 150,
  "activeEvents": 45,
  "totalUsers": 1200,
  "totalOrders": 3500,
  "recentEvents": [...],
  "eventTrend": [
    { "date": "2025-10-01", "count": 12 },
    { "date": "2025-10-02", "count": 15 }
  ],
  "participationStats": {
    "confirmed": 2800,
    "pending": 500,
    "cancelled": 200
  }
}
```

---

## 🛠️ 錯誤代碼

| Status Code | 說明 | 範例 |
|-------------|------|------|
| 200 | 成功 | GET, PUT 成功 |
| 201 | 創建成功 | POST 成功 |
| 400 | 請求錯誤 | 驗證失敗 |
| 401 | 未認證 | Token 無效 |
| 403 | 無權限 | 權限不足 |
| 404 | 資源不存在 | ID 不存在 |
| 409 | 衝突 | Email 已存在 |
| 500 | 伺服器錯誤 | 內部錯誤 |

---

## 🔒 認證流程

### 1. 登入
```
POST /api/sessions
→ 返回 token
```

### 2. 使用 API
```
GET /api/events
Headers: Authorization: Bearer <token>
```

### 3. 登出
```
DELETE /api/sessions/:token
```

---

## 📊 分頁規範

所有列表 API 支援分頁：

**Query Parameters**:
- `page` - 頁碼，從 1 開始
- `limit` - 每頁數量，預設 10，最大 100

**Response**:
```json
{
  "items": [...],
  "total": 總數,
  "page": 當前頁,
  "limit": 每頁數量,
  "totalPages": 總頁數
}
```

---

## 🔍 搜尋和篩選

**通用 Query Parameters**:
- `search` - 模糊搜尋（標題、描述）
- `sort` - 排序，格式：`field` 或 `-field`（descending）
- 狀態篩選 - 根據各資源的 `status` 欄位

**範例**:
```
GET /api/events?search=技術&status=published&sort=-createdAt&page=1&limit=20
```

---

## 📖 相關文檔

- [實施規格](./IMPLEMENTATION_SPEC.md)
- [資料庫設計](./DATABASE_DESIGN.md)
- [專案規格](../PROJECT_SPECIFICATION.md)

