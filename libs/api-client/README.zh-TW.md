---
id: api-client
name: API Client
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
lastUpdated: '2025-10-21'
---
# @nx-playground/api-client

NX Playground 活動管理平台的綜合 React SDK，具備從 OpenAPI 規格自動生成的 API 客戶端，並完整支援 TypeScript。

## 功能特色

- 🔄 **自動生成 API 客戶端** - 使用 Orval 從 OpenAPI 規格生成
- 🔐 **認證管理** - JWT token 處理與自動更新
- 📊 **React Query 整合** - 最佳化的資料抓取與快取
- 🎯 **型別安全** - 完整的 TypeScript 支援與自動生成型別
- 🔌 **React Hooks** - 常見操作的自訂 hooks
- 📱 **SSR 支援** - 適用於 Next.js 和其他 SSR 框架
- 🛠️ **開發體驗** - 內建 devtools 和錯誤處理

## 安裝

```bash
# 安裝 SDK
npm install @nx-playground/api-client

# Peer dependencies（如果尚未安裝）
npm install react react-dom @tanstack/react-query axios
```

## 快速開始

### 1. 設定 Providers

```tsx
import { AuthProvider, QueryProvider } from '@nx-playground/api-client';

function App() {
  return (
    <QueryProvider>
      <AuthProvider>
        <YourApp />
      </AuthProvider>
    </QueryProvider>
  );
}
```

### 2. 使用認證

```tsx
import { useAuth } from '@nx-playground/api-client';

function LoginForm() {
  const { login, isLoading, error } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch (error) {
      console.error('登入失敗:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* 你的表單欄位 */}
      <button type="submit" disabled={isLoading}>
        {isLoading ? '登入中...' : '登入'}
      </button>
      {error && <div className="error">{error}</div>}
    </form>
  );
}
```

### 3. 抓取活動資料

```tsx
import { useUpcomingEvents } from '@nx-playground/api-client';

function EventsList() {
  const { data: events, isLoading, error } = useUpcomingEvents(10);

  if (isLoading) return <div>載入中...</div>;
  if (error) return <div>錯誤: {error.message}</div>;

  return (
    <div>
      {events?.map((event) => (
        <div key={event.id}>
          <h3>{event.title}</h3>
          <p>{event.description}</p>
        </div>
      ))}
    </div>
  );
}
```

### 4. 報名活動

```tsx
import { useEventRegistration } from '@nx-playground/api-client';

function RegisterButton({ eventId }) {
  const { mutate: register, isLoading } = useEventRegistration();

  const handleRegister = () => {
    register(
      { eventId, notes: '期待這個活動！' },
      {
        onSuccess: () => {
          alert('報名成功！');
        },
        onError: (error) => {
          alert('報名失敗: ' + error.message);
        },
      }
    );
  };

  return (
    <button onClick={handleRegister} disabled={isLoading}>
      {isLoading ? '報名中...' : '報名'}
    </button>
  );
}
```

## API 生成

SDK 使用 [Orval](https://orval.dev/) 從 OpenAPI 規格生成 TypeScript API 客戶端。

### 生成 API 客戶端

```bash
# 從 OpenAPI 規格生成 API 客戶端
npm run generate:api

# 僅生成 TypeScript 型別
npm run generate:types
```

### OpenAPI 規格

OpenAPI 規格位於 `./specs/openapi.yaml`，定義了所有可用的端點、請求/回應型別和認證要求。

## 設定

### 環境變數

```env
# API Base URL
NEXT_PUBLIC_API_URL=https://api.nx-playground.local/v1

# 開發環境
NODE_ENV=development
```

### 自訂 API 客戶端

你可以自訂 API 客戶端設定：

```tsx
import { apiClient, setTokens } from '@nx-playground/api-client';

// 設定 base URL
apiClient.defaults.baseURL = 'https://your-api.com/v1';

// 設定自訂 headers
apiClient.defaults.headers.common['X-Custom-Header'] = 'value';

// 設定認證 tokens
setTokens('your-access-token', 'your-refresh-token');
```

## 可用的 Hooks

### 認證

- `useAuth()` - 認證狀態和方法
- `useLogin()` - 登入 mutation（自動生成）
- `useRegister()` - 註冊 mutation（自動生成）

### 活動

- `useEvents()` - 列出活動與篩選器（自動生成）
- `useEvent()` - 取得單一活動（自動生成）
- `useUpcomingEvents()` - 即將舉辦的活動自訂 hook
- `useMyEvents()` - 使用者已報名的活動
- `useEventRegistration()` - 報名活動
- `useCanRegisterForEvent()` - 檢查報名資格

### 使用者

- `useUsers()` - 列出使用者（自動生成）
- `useUser()` - 取得單一使用者（自動生成）
- `useUpdateUser()` - 更新使用者 mutation（自動生成）

### 檔案

- `useUploadFile()` - 檔案上傳 mutation（自動生成）

## 自訂 Hooks

你可以為複雜的業務邏輯建立自訂 hooks：

```tsx
import { useApiQuery, queryKeys } from '@nx-playground/api-client';

export const useEventStatistics = (eventId: string) => {
  return useApiQuery(
    [...queryKeys.events.detail(eventId), 'statistics'],
    async () => {
      // 自訂邏輯
      return fetchEventStatistics(eventId);
    },
    {
      enabled: !!eventId,
      staleTime: 5 * 60 * 1000, // 5 分鐘
    }
  );
};
```

## 錯誤處理

SDK 提供完整的錯誤處理：

```tsx
import { getErrorMessage, isApiError } from '@nx-playground/api-client';

try {
  await someApiCall();
} catch (error) {
  if (isApiError(error)) {
    console.error('API 錯誤:', error.response?.data);
  } else {
    console.error('一般錯誤:', getErrorMessage(error));
  }
}
```

## Query Keys

使用 query keys factory 進行一致的快取管理：

```tsx
import { queryKeys, useQueryClient } from '@nx-playground/api-client';

const queryClient = useQueryClient();

// 無效化所有活動
queryClient.invalidateQueries({ queryKey: queryKeys.events.all });

// 無效化特定活動
queryClient.invalidateQueries({ queryKey: queryKeys.events.detail(eventId) });
```

## 開發

### 前置需求

- Node.js 18+
- npm 或 yarn

### 設定

```bash
# 安裝相依套件
npm install

# 生成 API 客戶端
npm run generate:api

# 建構函式庫
npm run build

# 執行測試
npm test
```

### 專案結構

```
src/
├── lib/
│   └── api-client.ts          # 核心 API 客戶端
├── generated/                 # 自動生成的 API 程式碼
├── providers/
│   ├── AuthProvider.tsx       # 認證 context
│   └── QueryProvider.tsx      # React Query 設定
├── hooks/
│   ├── useApi.ts             # 通用 API hooks
│   └── useEvents.ts          # 活動專用 hooks
├── utils/
│   └── query-keys.ts         # Query key factory
└── index.ts                  # 主要匯出
```

## 貢獻

1. 更新 `./specs/openapi.yaml` 中的 OpenAPI 規格
2. 執行 `npm run generate:api` 重新生成客戶端
3. 根據需要新增自訂業務邏輯 hooks
4. 更新測試和文件

## 授權

MIT License - 詳見 LICENSE 檔案。

