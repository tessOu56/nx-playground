---
title: 'Event CMS - 活動內容管理系統'
slug: 'event-cms'
category: 'apps'
tags: ['React 19', 'Vite', 'Zustand', 'React Hook Form', 'RBAC', 'CMS', 'i18n']
date: '2025-10-20'
excerpt: '**定位**: 輕量級 CMS，用於創建和管理活動'
author: 'NX Playground'
lang: 'zh-TW'
published: true
---

# Event CMS - 活動內容管理系統

> **定位**: 輕量級 CMS，用於創建和管理活動
> **技術**: React 19 + Vite + React Router + React Hook Form + Zustand
> **Port**: 3002

## 📋 專案概覽

Event CMS 是一個專為活動管理設計的後台管理系統，提供完整的活動創建、用戶管理、表單設計和系統設定功能。

### 核心特色

- 📝 **拖拽式活動編輯器** - React DnD
- 📊 **豐富的儀表板圖表** - Recharts + Chart.js
- 👥 **完整的用戶管理** - CRUD + 權限管理
- 🎨 **UI 組件展示** - 23+ 組件範例
- 📋 **表單模板系統** - 可復用的表單設計
- ⚙️ **系統設定** - 多分類完整設定

---

## 🏗️ 專案結構

```
apps/event-cms/
├── src/
│   ├── features/          # 功能模組
│   │   ├── dashboard/     # 儀表板
│   │   ├── events/        # 活動管理
│   │   ├── users/         # 用戶管理
│   │   ├── forms/         # 表單管理
│   │   ├── settings/      # 系統設定
│   │   └── examples/      # UI 組件展示
│   │
│   ├── components/        # 共享組件
│   │   ├── Sidebar/       # 側邊欄
│   │   └── ...
│   │
│   ├── layouts/           # 佈局組件
│   │   └── ContentLayout.tsx
│   │
│   ├── router/            # 路由配置
│   │   ├── index.tsx
│   │   └── routes/
│   │
│   ├── styles/            # 樣式
│   ├── App.tsx            # 應用入口
│   └── main.tsx           # React 掛載
│
├── vite.config.ts         # Vite 配置
├── project.json           # Nx 配置
└── package.json
```

---

## 🎯 功能模組

### 1. Dashboard (儀表板)

**路徑**: `/dashboard`
**狀態**: ✅ 100%

#### 功能

- 統計卡片（活動數、用戶數、訂單數、營收）
- 活動趨勢圖表 (Recharts LineChart)
- 用戶參與統計 (Chart.js BarChart)
- 時間趨勢 (Recharts AreaChart)
- 狀態分布 (Chart.js PieChart)

#### 關鍵文件

```
features/dashboard/
├── pages/
│   └── DashboardPage.tsx           # 主頁面
├── components/
│   ├── StatCard.tsx                # 統計卡片
│   └── charts/
│       ├── EventTrendChart.tsx     # 活動趨勢
│       ├── ParticipationChart.tsx  # 參與統計
│       ├── TimeTrendChart.tsx      # 時間趨勢
│       └── StatusDistributionChart.tsx  # 狀態分布
└── mock/
    └── chartData.ts                # Mock 數據
```

---

### 2. Events (活動管理)

**路徑**: `/events`
**狀態**: 🔨 70% (創建完整，列表頁待開發)

#### 功能

- ✅ 創建活動（多步驟表單）
  - 基本資訊（封面、標題、描述、地點）
  - 活動內容（拖拽式區塊編輯）
  - FAQ 管理
  - 場次管理
  - 票券管理
  - 表單設計
  - 可見性設定
  - 付款方式
- ⏳ 活動列表（待開發）
- ⏳ 活動編輯（待開發）

#### 關鍵文件

```
features/events/
├── pages/
│   └── CreateEventsPage.tsx        # 創建活動主頁
├── components/
│   ├── composite/                  # 複合組件
│   │   ├── EventsCoverImage.tsx    # 封面上傳
│   │   ├── EventIntroduction.tsx   # 活動簡介
│   │   ├── EventContent.tsx        # 內容編輯
│   │   ├── FAQ.tsx                 # FAQ 管理
│   │   ├── SessionBlock.tsx        # 場次管理
│   │   ├── TicketBlock.tsx         # 票券管理
│   │   ├── FormBlock.tsx           # 表單設計
│   │   ├── VisibilityBlock.tsx     # 可見性
│   │   └── PaymentBlock.tsx        # 付款方式
│   │
│   ├── EventCreateTopbar.tsx       # 頂部工具欄
│   ├── EventCreateSidebar.tsx      # 側邊欄導航
│   └── EventCreateBottombar.tsx    # 底部操作欄
│
├── types.ts                        # TypeScript 類型
├── useEventStore.ts                # Zustand store
├── useNavigateStore.ts             # 導航狀態
└── usePreviewStore.ts              # 預覽狀態
```

#### 技術亮點

- **React Hook Form** - 表單管理
- **Zod** - Schema 驗證
- **React DnD** - 拖拽編輯
- **Zustand** - 狀態管理

---

### 3. Users (用戶管理)

**路徑**: `/users`
**狀態**: ✅ 100%

#### 功能

- 用戶列表（DataTable + 分頁）
- 用戶詳情（3 Tabs: 基本資訊、權限、活動記錄）
- 創建/編輯用戶（Dialog）
- 角色管理（視覺化權限設定）
- 批量操作

#### 關鍵文件

```
features/users/
├── pages/
│   └── UsersPage.tsx               # 主頁面
├── components/
│   ├── UserEditDialog.tsx          # 編輯對話框
│   ├── UserDetailDialog.tsx        # 詳情對話框 (Tabs)
│   └── UserRoleManager.tsx         # 權限管理
├── types/
│   └── index.ts                    # User 類型定義
└── mock/
    └── userData.ts                 # Mock 數據
```

---

### 4. Forms (表單管理)

**路徑**: `/forms`
**狀態**: ✅ 100%

#### 功能

- 表單模板列表
- 創建表單模板
- 編輯表單模板
- 表單預覽
- 表單字段拖拽排序

#### 關鍵文件

```
features/forms/
├── pages/
│   ├── FormsPage.tsx               # 列表頁
│   └── FormEditorPage.tsx          # 編輯器頁
└── components/
    └── FormBuilder.tsx             # 表單構建器
```

---

### 5. Settings (系統設定)

**路徑**: `/settings`
**狀態**: ✅ 100%

#### 功能

- **個人資料** - 姓名、Email、頭像
- **通知設定** - Email/推播通知偏好
- **安全設定** - 修改密碼、2FA、會話管理
- **系統設定** - 網站名稱、註冊開關、維護模式
- **外觀設定** - 主題、語言

#### 關鍵文件

```
features/settings/
├── pages/
│   └── SettingsPage.tsx            # 主頁面 (5 Tabs)
└── components/
    ├── ProfileSettings.tsx         # 個人資料
    ├── NotificationSettings.tsx    # 通知設定
    ├── SecuritySettings.tsx        # 安全設定
    └── SystemSettings.tsx          # 系統設定
```

---

### 6. Examples (UI 組件展示)

**路徑**: `/examples`
**狀態**: ✅ 100%

展示所有可用的 UI 組件，用於開發參考。

---

## 🛠️ 技術架構

### 核心技術

| 技術            | 版本   | 用途              |
| --------------- | ------ | ----------------- |
| React           | 19     | UI 框架           |
| Vite            | 6      | 建構工具          |
| React Router    | 7      | 路由              |
| React Hook Form | 7.54   | 表單管理          |
| Zod             | 3.24   | Schema 驗證       |
| Zustand         | 5      | 狀態管理          |
| React Query     | 5      | 服務端狀態        |
| React DnD       | 16.0.1 | 拖拽功能          |
| Recharts        | 3.2.1  | 圖表 (React 原生) |
| Chart.js        | 4.5.0  | 圖表 (高性能)     |

### 共享庫依賴

```tsx
import { Button, Card, Dialog, Tabs } from '@nx-playground/ui-components';
import { useModal, usePagination } from '@nx-playground/hooks';
import { Recharts, ChartJS } from '@nx-playground/charts';
```

---

## 🎨 代碼風格

### 組件範例

```tsx
// features/users/pages/UsersPage.tsx
import { useState } from 'react';
import { Button, Card } from '@nx-playground/ui-components';
import { useModal } from '@nx-playground/hooks';

export function UsersPage() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const editModal = useModal();

  return (
    <div className='p-6'>
      <Card>
        <CardHeader>
          <CardTitle>用戶管理</CardTitle>
          <Button onClick={editModal.open}>新增用戶</Button>
        </CardHeader>
        <CardContent>{/* DataTable */}</CardContent>
      </Card>

      <UserEditDialog
        isOpen={editModal.isOpen}
        onClose={editModal.close}
        user={selectedUser}
      />
    </div>
  );
}
```

---

## 📡 API 整合 (計劃)

當後端實施後，將整合 OpenAPI 生成的 hooks：

```tsx
import {
  useGetEvents,
  useCreateEvent,
  useUpdateEvent,
  useDeleteEvent,
} from '@nx-playground/api-client/server/dev';

function EventsList() {
  const { data, isLoading } = useGetEvents({ status: 'published' });
  const createMutation = useCreateEvent();

  const handleCreate = (eventData) => {
    createMutation.mutate(eventData, {
      onSuccess: () => {
        toast.success('活動創建成功');
      },
    });
  };

  return ...;
}
```

---

## 🚀 開發指南

### 啟動開發

```bash
# 使用 Makefile
make dev-event-cms

# 或使用 pnpm
pnpm dev:event-cms

# 訪問 http://localhost:3002
```

### 添加新頁面

1. 在 `features/your-feature/` 創建目錄
2. 創建 `pages/YourPage.tsx`
3. 在 `router/routes/` 添加路由
4. 在 Sidebar 添加導航鏈接

### 添加新圖表

1. 選擇 Recharts 或 Chart.js
2. 使用 `@nx-playground/charts` 導入
3. 準備數據格式
4. 配置圖表選項

---

## 📦 構建和部署

### 構建

```bash
nx build event-cms
```

輸出: `dist/apps/event-cms/`

### 部署

推薦: Cloudflare Pages, Vercel, Netlify

```bash
# Cloudflare Pages
pnpm build:event-cms
# 部署 dist/apps/event-cms/ 目錄
```

---

## 🔮 未來計劃

### 短期

- [ ] 完成活動列表頁
- [ ] 活動編輯功能
- [ ] 活動刪除和歸檔

### 中期

- [ ] 整合真實 API
- [ ] 添加搜尋和篩選
- [ ] 批量操作
- [ ] 數據匯出

### 長期

- [ ] 權限控制 (RBAC)
- [ ] 活動範本
- [ ] 活動複製
- [ ] 進階分析

---

## 📖 相關文檔

- [專案規格](../PROJECT_SPECIFICATION.md)
- [開發指南](../DEVELOPMENT_GUIDE.md)
- [Event Portal 文檔](./EVENT_PORTAL.md)
