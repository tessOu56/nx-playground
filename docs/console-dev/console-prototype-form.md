# Form Feature - 開發指南

## 概述

Form feature 是報名表模板管理功能，包含模板列表、編輯、預覽等功能。本功能採用模組化架構，使用 React Hook Form + Zod 進行表單驗證，並遵循 Controller Pattern 分離業務邏輯。

## 專案架構

```
src/features/form/
├── components/          # UI 元件
│   ├── FormTemplateCard.tsx      # 模板卡片元件
│   ├── FormTemplatePreview.tsx   # 模板預覽元件
│   ├── FormTemplateTitle.tsx     # 模板標題元件
│   └── RenameTemplateDialog.tsx  # 重新命名對話框
├── controllers/         # 業務邏輯控制器
│   └── useRenameTemplateController.ts
├── hooks/              # 自定義 Hooks
│   └── useFormTemplates.ts
├── pages/              # 頁面元件
│   ├── FormTemplateListPage.tsx  # 模板列表頁
│   └── FormTemplateEditPage.tsx  # 模板編輯頁
├── schemas/            # Zod 驗證 schema
│   └── renameTemplate.schema.ts
├── types/              # TypeScript 類型定義
│   └── index.ts
└── mock/               # 模擬資料
    └── index.ts
```

## 核心概念

### 1. Controller Pattern

將業務邏輯從 UI 元件中分離，保持元件純粹性：

```tsx
// controllers/useRenameTemplateController.ts
export const useRenameTemplateController = ({
  currentName,
  onSave,
  onClose,
}: UseRenameTemplateControllerProps) => {
  // 業務邏輯：表單驗證、狀態管理、事件處理
  return {
    register,
    handleSubmit,
    errors,
    // ... 其他邏輯
  };
};

// components/RenameTemplateDialog.tsx
const RenameTemplateDialog = ({ ... }) => {
  const controller = useRenameTemplateController({ ... });
  // 純 UI 渲染
};
```

### 2. 表單驗證架構

使用 React Hook Form + Zod 進行類型安全的表單驗證：

```tsx
// schemas/renameTemplate.schema.ts
export const renameTemplateSchema = z.object({
  name: z
    .string()
    .min(1, '模板名稱為必填欄位')
    .max(100, '模板名稱不能超過 100 字元'),
});

// controllers/useRenameTemplateController.ts
const {
  register,
  handleSubmit,
  formState: { errors },
} = useForm({
  resolver: zodResolver(renameTemplateSchema),
  defaultValues: { name: currentName },
});
```

### 3. 模組化元件設計

將複雜頁面拆分成可重用的元件：

```tsx
// FormTemplateListPage.tsx
export const FormTemplateListPage = () => {
  return (
    <div className='flex gap-6 h-full min-w-0'>
      {/* 左側列表 */}
      <div className='flex-1 space-y-6'>
        {formTemplates.map(template => (
          <FormTemplateCard
            key={template.id}
            template={template}
            onSelect={handleTemplateClick}
            // ... 其他 props
          />
        ))}
      </div>

      {/* 右側預覽 */}
      <FormTemplatePreview selectedTemplate={selectedTemplate} />
    </div>
  );
};
```

## 開發規範

### 1. 檔案命名

- 元件檔案：`PascalCase.tsx`
- Hook 檔案：`useCamelCase.ts`
- Schema 檔案：`camelCase.schema.ts`
- 類型檔案：`index.ts`

### 2. 元件設計原則

- **單一職責**：每個元件只負責一個功能
- **可重用性**：元件應該可以在不同場景下重用
- **純粹性**：UI 元件不包含業務邏輯
- **類型安全**：使用 TypeScript 確保類型安全

### 3. 狀態管理

- 使用 `useState` 管理本地狀態
- 使用 `useCallback` 優化函數引用
- 使用 `useMemo` 優化計算結果
- 複雜狀態考慮使用 Context 或狀態管理庫

### 4. 錯誤處理

- 使用 Toast 系統顯示錯誤訊息
- 避免使用 `console.error`，改用 `addToast`
- 提供用戶友好的錯誤提示

## 常用工具

### 1. UI 元件庫

```tsx
import { Button, Card, Input, useToast } from '@nx-playground/ui-components';
```

### 2. 表單處理

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
```

### 3. 樣式工具

```tsx
import { cn } from '@nx-playground/ui-components';
import { cva, type VariantProps } from 'class-variance-authority';
```

## 最佳實踐

### 1. 元件拆分

- 將大型頁面拆分成小型、可重用的元件
- 使用 Controller Pattern 分離業務邏輯
- 保持元件的純粹性和可測試性

### 2. 類型安全

- 為所有 props 定義明確的類型
- 使用 Zod schema 進行運行時驗證
- 避免使用 `any` 類型

### 3. 效能優化

- 使用 `React.memo` 避免不必要的重渲染
- 使用 `useCallback` 和 `useMemo` 優化效能
- 合理使用 `key` prop 優化列表渲染

### 4. 可維護性

- 保持程式碼結構清晰
- 使用有意義的變數和函數名稱
- 添加適當的註釋說明複雜邏輯

## 測試策略

### 1. 單元測試

- 測試 Controller 的業務邏輯
- 測試 Zod schema 的驗證規則
- 測試自定義 Hook 的行為

### 2. 整合測試

- 測試元件間的互動
- 測試表單提交流程
- 測試錯誤處理機制

### 3. 端到端測試

- 測試完整的用戶流程
- 測試不同設備的響應式設計
- 測試無障礙功能

## 未來改進

1. **狀態管理**：考慮引入 Zustand 或 Redux Toolkit
2. **測試覆蓋**：增加單元測試和整合測試
3. **效能監控**：添加效能監控和分析
4. **無障礙**：改善無障礙功能和鍵盤導航
5. **國際化**：支援多語言介面
