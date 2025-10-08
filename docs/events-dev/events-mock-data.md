# Mock Data 結構文檔

## 概述

本項目重新整理了 mock data 結構，建立了完整的數據關係模型，包含 vendor（主辦方）、用戶、活動和報名記錄之間的關聯。

## 數據結構

### 1. Vendor（主辦方）

```typescript
interface Vendor {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  followers: number;
  following: number;
  events: number;
  location: string;
  website?: string;
  email: string;
  phone: string;
}
```

**示例數據**:

- `vendor-1`: NX Playground Events（主要主辦方）
- `vendor-2`: 台北文創中心
- `vendor-3`: 科技創新協會

### 2. Event（活動）

```typescript
interface Event {
  id: string;
  vendorId: string; // 關聯到主辦方
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  price: number;
  image: string;
  likes: number;
  attendees: number;
  capacity: number;
  category: string;
  tags: string[];
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
}
```

**活動分類**:

- 音樂類：音樂節
- 科技類：科技研討會、AI 技術研討會
- 美食類：美食節
- 藝術類：藝術展覽、傳統工藝展
- 商業類：創業論壇、創業加速器計劃
- 文創類：文創市集
- 攝影類：戶外攝影工作坊

### 3. User（用戶）

```typescript
interface User {
  id: string;
  name: string;
  avatar: string;
  email: string;
  phone?: string;
  bio?: string;
  joinedDate: string;
  followingVendors: string[]; // 追蹤的主辦方 ID 列表
  registeredEvents: string[]; // 報名的活動 ID 列表
}
```

**示例用戶**:

- `user-1`: 張小明（熱愛音樂和科技）
- `user-2`: 李小華（攝影愛好者）

### 4. UserEventRegistration（報名記錄）

```typescript
interface UserEventRegistration {
  id: string;
  userId: string; // 關聯到用戶
  eventId: string; // 關聯到活動
  registrationDate: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  ticketType?: string;
  price: number;
}
```

## 數據關係

### 關係圖

```
Vendor (主辦方)
├── 1:N ── Event (活動)
└── M:N ── User (用戶追蹤)

User (用戶)
├── M:N ── Vendor (追蹤主辦方)
├── M:N ── Event (報名活動)
└── 1:N ── UserEventRegistration (報名記錄)

Event (活動)
├── N:1 ── Vendor (所屬主辦方)
├── M:N ── User (參與用戶)
└── 1:N ── UserEventRegistration (報名記錄)
```

### 具體關係示例

#### 張小明 (user-1)

- **追蹤的主辦方**: NX Playground Events, 台北文創中心
- **參與的活動**:
  - 音樂節 2024 (NX Playground Events)
  - 科技研討會 (NX Playground Events)
  - 文創市集 (台北文創中心)
  - AI 技術研討會 (科技創新協會)

#### 李小華 (user-2)

- **追蹤的主辦方**: NX Playground Events, 科技創新協會
- **參與的活動**:
  - 美食節 (NX Playground Events)
  - 藝術展覽 (NX Playground Events)
  - 戶外攝影工作坊 (NX Playground Events)
  - 創業加速器計劃 (科技創新協會)

## 輔助函數

### 查詢函數

```typescript
// 根據 ID 獲取主辦方
getVendorById(vendorId: string): Vendor | undefined

// 根據主辦方 ID 獲取活動列表
getEventsByVendorId(vendorId: string): Event[]

// 根據 ID 獲取用戶
getUserById(userId: string): User | undefined

// 根據用戶 ID 獲取參與的活動
getEventsByUserId(userId: string): Event[]

// 根據用戶 ID 獲取報名記錄
getRegistrationsByUserId(userId: string): UserEventRegistration[]

// 根據 ID 獲取活動
getEventById(eventId: string): Event | undefined
```

### 使用示例

```typescript
import {
  getVendorById,
  getEventsByVendorId,
  getUserById,
  getEventsByUserId,
} from '../lib/mockData';

// 獲取 NX Playground Events 的所有活動
const nx-playgroundEvents = getEventsByVendorId('vendor-1');

// 獲取張小明參與的活動
const xiaomingEvents = getEventsByUserId('user-1');

// 獲取活動的主辦方資訊
const event = getEventById('event-1');
const vendor = event ? getVendorById(event.vendorId) : null;
```

## 頁面應用

### 1. Vendor 頁面 (`/vendors`)

- 顯示主辦方資訊
- 顯示該主辦方的所有活動
- 支援標籤頁切換（活動、關於、聯絡）

### 2. 用戶個人資料頁面 (`/user/[id]`)

- 顯示用戶資訊
- 顯示用戶參與的活動
- 顯示報名記錄
- 支援標籤頁切換（參與的活動、報名記錄、個人資料）

### 3. 活動詳情頁面 (`/events/[eventId]`)

- 顯示活動詳細資訊
- 顯示主辦方資訊
- 提供報名功能

## 數據擴展建議

### 1. 添加更多主辦方

- 可以輕鬆添加新的主辦方數據
- 每個主辦方可以有自己的活動列表

### 2. 添加更多用戶

- 可以創建更多用戶數據
- 每個用戶可以追蹤不同主辦方和參與不同活動

### 3. 添加更多活動類型

- 可以根據需要添加新的活動類別
- 支援更豐富的活動屬性

### 4. 添加評論和評分

- 可以擴展數據結構支援用戶評論
- 添加活動評分功能

## 向後兼容性

為了保持現有代碼的兼容性，提供了以下導出：

```typescript
// 向後兼容的導出
export const mockVendorInfo = mockVendors[0]; // NX Playground Events
export const mockEventsForVendor = getEventsByVendorId('vendor-1');
```

這樣現有的組件可以繼續使用這些導出，而不需要立即修改所有代碼。
