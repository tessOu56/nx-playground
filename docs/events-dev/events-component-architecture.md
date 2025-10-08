# 組件架構文檔

## 概述

本項目採用組件化架構，將大型頁面拆分成更小、更可重用的組件。這樣可以提高代碼的可維護性、可測試性和可重用性。

## 組件結構

### Vendor 頁面組件

#### 1. VendorProfile

- **文件**: `src/components/VendorProfile.tsx`
- **功能**: 顯示主辦方的基本資訊，包括頭像、名稱、統計資訊和簡介
- **Props**:
  - `vendorInfo`: 主辦方資訊對象
  - `className`: 可選的 CSS 類名

#### 2. VendorTabs

- **文件**: `src/components/VendorTabs.tsx`
- **功能**: 提供標籤頁導航，包括活動、關於、聯絡等標籤
- **Props**:
  - `activeTab`: 當前活動的標籤
  - `onTabChange`: 標籤切換回調函數
  - `className`: 可選的 CSS 類名

#### 3. EventGrid

- **文件**: `src/components/EventGrid.tsx`
- **功能**: 顯示活動網格，類似 Instagram 的貼文佈局
- **Props**:
  - `events`: 活動數組
  - `onEventClick`: 活動點擊回調函數
  - `className`: 可選的 CSS 類名

#### 4. LoadMoreButton

- **文件**: `src/components/LoadMoreButton.tsx`
- **功能**: 載入更多按鈕，支援載入狀態和無更多數據的顯示
- **Props**:
  - `onLoadMore`: 載入更多回調函數
  - `loading`: 載入狀態
  - `hasMore`: 是否還有更多數據
  - `className`: 可選的 CSS 類名

### 數據層

#### MockData

- **文件**: `src/lib/mockData.ts`
- **功能**: 集中管理模擬數據，包括主辦方資訊和活動數據
- **導出**:
  - `mockVendorInfo`: 主辦方模擬數據
  - `mockEvents`: 活動模擬數據

## 組件關係圖

```
VendorPage (主頁面)
├── VendorProfile (主辦方資訊)
├── VendorTabs (標籤頁導航)
└── TabContent (標籤頁內容)
    ├── EventGrid (活動網格) + LoadMoreButton (載入更多)
    ├── AboutContent (關於內容)
    └── ContactContent (聯絡內容)
```

## 類型定義

### VendorInfo

```typescript
interface VendorInfo {
  name: string;
  avatar: string;
  bio: string;
  followers: number;
  following: number;
  events: number;
}
```

### Event

```typescript
interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  price: number;
  image: string;
  likes: number;
  attendees: number;
}
```

## 使用方式

### 基本使用

```tsx
import {
  VendorProfile,
  VendorTabs,
  EventGrid,
  LoadMoreButton,
} from '../components';
import { mockVendorInfo, mockEvents } from '../lib/mockData';

function MyPage() {
  return (
    <div>
      <VendorProfile vendorInfo={mockVendorInfo} />
      <VendorTabs activeTab='events' onTabChange={handleTabChange} />
      <EventGrid events={mockEvents} onEventClick={handleEventClick} />
      <LoadMoreButton onLoadMore={handleLoadMore} />
    </div>
  );
}
```

### 自定義樣式

```tsx
<VendorProfile vendorInfo={vendorInfo} className='custom-vendor-profile' />
```

## 最佳實踐

### 1. 組件設計原則

- **單一職責**: 每個組件只負責一個特定功能
- **可重用性**: 組件應該可以在不同場景中重用
- **可配置性**: 通過 props 提供配置選項
- **類型安全**: 使用 TypeScript 確保類型安全

### 2. 狀態管理

- 使用 React hooks 管理組件狀態
- 將複雜狀態提升到父組件
- 使用回調函數進行組件間通信

### 3. 性能優化

- 使用 React.memo 優化渲染性能
- 避免在組件內部創建函數和對象
- 使用 useCallback 和 useMemo 優化依賴

### 4. 可訪問性

- 提供適當的 ARIA 標籤
- 確保鍵盤導航支援
- 使用語義化的 HTML 元素

## 擴展指南

### 添加新組件

1. 在 `src/components/` 目錄下創建新組件文件
2. 定義組件的 props 接口
3. 實現組件邏輯
4. 在 `src/components/index.ts` 中導出組件
5. 更新本文檔

### 添加新類型

1. 在相應的組件文件中定義類型
2. 在 `src/components/index.ts` 中導出類型
3. 更新本文檔的類型定義部分

## 測試策略

### 單元測試

- 測試每個組件的獨立功能
- 測試 props 的正確傳遞
- 測試事件處理函數

### 整合測試

- 測試組件間的交互
- 測試頁面的完整流程
- 測試數據流

### 視覺回歸測試

- 確保 UI 變更不會破壞現有功能
- 測試不同螢幕尺寸的響應式設計

## 維護指南

### 代碼審查

- 確保組件遵循設計原則
- 檢查類型定義的完整性
- 驗證組件的可重用性

### 文檔更新

- 當組件 API 變更時更新文檔
- 添加使用示例和最佳實踐
- 記錄已知問題和解決方案
