---
id: api-client
name: API 客戶端
version: 0.0.1
description: 使用 Orval 從 OpenAPI 規格自動生成的型別安全 API 客戶端
techStack:
  - OpenAPI
  - Orval
  - React Query
  - TypeScript
features:
  - OpenAPI 整合
  - 自動型別生成
  - React Query hooks
  - Mock 資料支援
status: production
category: data
published: true
lastUpdated: '2025-01-24'
---

# API Client – API 客戶端

(Type-Safe API Client Library)

## 一、概念與定位 / Overview

這是一個**自動生成的 API 客戶端**，提供具備完整 TypeScript 支援的型別安全後端服務存取。

不同於手動的 API 呼叫，此函式庫提供：

- 從 OpenAPI 規格自動生成
- 型別安全的請求/回應介面
- 用於快取與狀態管理的 React Query hooks
- 開發用的 mock 資料支援
- 與後端 API 變更自動同步

此函式庫展示**程式碼生成**與 **API-first 開發**模式。

---

## 二、核心能力 / Core Capabilities

### 1. 自動生成客戶端程式碼

- Orval 從 OpenAPI specs 生成客戶端
- 型別安全的請求 payloads 與回應
- 使用 Zod schemas 的自動驗證
- 含型別例外的錯誤處理
- 生成的 React Query hooks

**重點價值**：免除手動 API 客戶端維護與型別不符問題。

---

### 2. React Query 整合

- 更好 UX 的樂觀更新
- 自動快取與失效
- Loading 與錯誤狀態管理
- 背景重新取得
- 分頁與無限捲動支援

**重點價值**：以最少樣板程式碼實現強大的資料取得。

---

### 3. 開發工具

- 測試用的 mock 資料生成
- API 回應攔截器
- 請求/回應記錄
- 錯誤重試策略
- 網路狀態處理

**重點價值**：無需等待後端完成即可加速前端開發。

---

## 三、技術亮點 / Technical Highlights

| 面向            | 說明                             |
| --------------- | -------------------------------- |
| **Orval**       | OpenAPI 至 TypeScript 程式碼生成 |
| **React Query** | 強大的非同步狀態管理             |
| **型別安全**    | 從後端到前端的端到端型別安全     |
| **Mock 支援**   | MSW 整合用於測試                 |

**結果**：減少整合錯誤的型別安全 API 層。

---

## 四、使用範圍 / Usage Scope

**應用程式**：

- Event-CMS（活動管理 APIs）
- Event-Portal（活動瀏覽 APIs）
- 未來連接至 api-server 的應用程式

**生成來源**：

- `api-server` OpenAPI 規格
- 透過 `pnpm sync:api` 自動更新

---

## 五、整合方式 / API & Integration

**使用範例**：

```tsx
import { useGetEvents, useCreateEvent } from '@nx-playground/api-client';

function EventList() {
  const { data, isLoading } = useGetEvents();
  const createMutation = useCreateEvent();

  const handleCreate = (eventData) => {
    createMutation.mutate(eventData);
  };

  return (/* UI */);
}
```

---

## 六、品質標準 / Quality Standards

**型別安全**：

- 生成的型別與後端完全符合
- 編譯時錯誤偵測
- 所有 API 端點的 IntelliSense

**測試**：

- Mock Service Worker（MSW）用於測試
- 自動 mock 資料生成
- 與真實 API 的整合測試

---

## 七、授權 / License

MIT（開放使用與修改）

---

## 八、補充文件 / Additional Documentation

- `specs/libs/api-client/en.md` - 英文規格說明
- `specs/libs/api-client/zh-TW.md` - 繁中規格（本文件）
- `libs/api-client/README.md` - 開發者文件
