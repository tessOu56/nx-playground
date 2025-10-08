# API Client

> 對照：`libs/api-client`

## 專案目的

提供類型安全的 API 客戶端，自動從 OpenAPI 規格生成 TypeScript 介面和請求函數。確保前後端 API 契約的一致性。

## 開發理念

### 自動化優先

- 從 OpenAPI spec 自動生成客戶端代碼
- CI/CD 自動更新 API 定義
- 減少手動維護的錯誤風險

### 類型安全

- 完整的 TypeScript 類型定義
- 編譯時期的 API 契約檢查
- IDE 智能提示和自動完成

## 技術成果

### 自動化流程

1. **OpenAPI Spec** - 後端提供 API 規格文件
2. **Orval 生成** - 自動生成 TypeScript 客戶端
3. **類型檢查** - 編譯時期驗證 API 使用
4. **CI/CD 整合** - 自動化建置和部署

### 生成內容

- **API Functions**: 每個端點對應的請求函數
- **Type Definitions**: 完整的請求/響應類型定義
- **React Query Hooks**: 與 React Query 整合的 hooks
- **Mock Data**: 開發和測試用的 mock 資料

## 使用方式

### 基本 API 調用

```tsx
import { getUserProfile, updateUserProfile } from '@nx-playground/api-client';

// 獲取用戶資料
const profile = await getUserProfile({ userId: '123' });

// 更新用戶資料
await updateUserProfile({
  userId: '123',
  data: { name: '新名稱' },
});
```

### React Query 整合

```tsx
import { useGetUserProfile, useUpdateUserProfile } from '@nx-playground/api-client';

function UserProfile({ userId }: { userId: string }) {
  const { data: profile, isLoading } = useGetUserProfile({ userId });
  const updateMutation = useUpdateUserProfile();

  if (isLoading) return <div>載入中...</div>;

  return (
    <div>
      <h1>{profile?.name}</h1>
      <button
        onClick={() =>
          updateMutation.mutate({
            userId,
            data: { name: '新名稱' },
          })
        }
      >
        更新
      </button>
    </div>
  );
}
```

## 開發指令

```bash
# 重新生成 API 客戶端
pnpm exec nx run api-client:generate

# 建置 API 客戶端
pnpm exec nx build api-client

# 執行 API 測試
pnpm exec nx test api-client
```

## 架構價值

- **一致性**: 確保前後端 API 契約一致
- **安全性**: TypeScript 類型檢查防止 API 錯誤使用
- **效率性**: 自動生成減少手動編寫 API 代碼
- **維護性**: 集中管理所有 API 定義和更新
