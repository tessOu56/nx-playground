---
id: ui-components
name: UI Components
version: 0.1.0
description: >-
  Comprehensive UI component library built with React, TypeScript, and Radix UI
  primitives
techStack:
  - React 19
  - Radix UI
  - Tailwind CSS
  - TypeScript
features:
  - 40+ components
  - TypeScript support
  - Accessibility-first
  - Form components
  - Navigation components
lastUpdated: '2025-10-21'
---
# NX Playground UI Components

基於 Shadcn/ui 模式的現代化 UI 組件庫，提供兩種類型的組件：

- **Core Components**: 純 UI 組件，專注於視覺呈現和基本交互
- **Composite Components**: 包含業務邏輯的組件，提供完整功能

## 快速開始

```tsx
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@nx-playground/ui-components';

function MyComponent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>我的表單</CardTitle>
      </CardHeader>
      <CardContent>
        <Button variant='primary'>提交</Button>
      </CardContent>
    </Card>
  );
}
```

## Core Components

純 UI 組件，無業務邏輯，提供最大的靈活性和可重用性。

### Button

```tsx
<Button variant="primary" size="default">按鈕</Button>
<Button variant="outline" size="sm">小按鈕</Button>
```

### Input

```tsx
<Input placeholder='請輸入內容' />
```

### Card

```tsx
<Card>
  <CardHeader>
    <CardTitle>標題</CardTitle>
  </CardHeader>
  <CardContent>內容</CardContent>
</Card>
```

### Select

```tsx
<Select>
  <SelectTrigger>
    <SelectValue placeholder='選擇選項' />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value='option1'>選項 1</SelectItem>
  </SelectContent>
</Select>
```

### Textarea

```tsx
<Textarea placeholder='請輸入內容' rows={4} />
```

### Radio

```tsx
<Radio name="option" value="value1" label="選項 1" />
<Radio name="option" value="value2" label="選項 2" />
```

### Badge

```tsx
<Badge variant="default">標籤</Badge>
<Badge variant="destructive">錯誤</Badge>
```

### IconButton

```tsx
<IconButton variant='outline' size='sm'>
  <PlusIcon />
</IconButton>
```

### LoadingSpinner

```tsx
// 基本用法
<LoadingSpinner size="md" text="載入中..." />

// 不同尺寸
<LoadingSpinner size="sm" />
<LoadingSpinner size="lg" />

// 不同容器樣式
<LoadingSpinner containerVariant="compact" />
<LoadingSpinner containerVariant="minimal" />

// 頁面級別載入
<PageLoadingSpinner />

// 組件級別載入
<ComponentLoadingSpinner />
```

## Composite Components

包含業務邏輯的組件，提供完整功能，提高開發效率。

### 表單組件

#### FormInput - 表單輸入框

```tsx
<FormInput
  name='email'
  control={control}
  label='電子郵件'
  type='email'
  placeholder='example@email.com'
  required
  error={errors.email?.message}
/>
```

#### FormSelect - 表單選擇器

```tsx
<FormSelect
  name='category'
  control={control}
  label='類別'
  options={[
    { value: 'tech', label: '技術' },
    { value: 'design', label: '設計' },
  ]}
  required
  error={errors.category?.message}
/>
```

#### FormTextarea - 表單文本區域

```tsx
<FormTextarea
  name='description'
  control={control}
  label='描述'
  placeholder='請輸入描述'
  rows={4}
  required
  error={errors.description?.message}
/>
```

#### FormButton - 表單按鈕

```tsx
<FormButton type='submit' variant='primary' loading={isSubmitting}>
  提交
</FormButton>
```

### 選擇組件

#### RadioGroup - 單選組

```tsx
<RadioGroup
  name='category'
  options={[
    { value: 'tech', label: '技術' },
    { value: 'design', label: '設計' },
  ]}
  value={selectedValue}
  onChange={setSelectedValue}
/>
```

#### SimpleSelect - 簡單選擇器

```tsx
<SimpleSelect
  options={[
    { value: 'option1', label: '選項 1' },
    { value: 'option2', label: '選項 2' },
  ]}
  value={selectedValue}
  onChange={setSelectedValue}
  placeholder='請選擇'
/>
```

### 功能組件

#### LanguageSwitcher - 語言切換器

```tsx
<LanguageSwitcher
  variant='dropdown' // 或 "buttons"
  languages={[
    { code: 'zh-TW', name: '繁體中文' },
    { code: 'en', name: 'English' },
  ]}
/>
```

#### ThemeSwitcher - 主題切換器

```tsx
<ThemeSwitcher
  currentTheme={currentTheme}
  availableThemes={availableThemes}
  onThemeChange={setCurrentTheme}
/>
```

### 完整表單範例

```tsx
import { useForm } from 'react-hook-form';
import {
  FormInput,
  FormSelect,
  FormTextarea,
  FormButton,
} from '@nx-playground/ui-components';

const MyForm = () => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = data => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
      <FormInput
        name='title'
        control={control}
        label='標題'
        placeholder='請輸入標題'
        required
        error={errors.title?.message}
      />

      <FormSelect
        name='category'
        control={control}
        options={[
          { value: 'tech', label: '技術' },
          { value: 'design', label: '設計' },
        ]}
        label='類別'
        required
        error={errors.category?.message}
      />

      <FormTextarea
        name='description'
        control={control}
        label='描述'
        placeholder='請輸入描述'
        rows={4}
        required
        error={errors.description?.message}
      />

      <FormButton type='submit' variant='primary' loading={isSubmitting}>
        提交
      </FormButton>
    </form>
  );
};
```

## 使用建議

- **Core Components**: 適合需要完全自定義或構建複雜組件時使用
- **Composite Components**: 適合快速開發表單和標準化業務邏輯時使用

## 工具函數

### cn

合併 Tailwind CSS 類名，處理條件樣式：

```tsx
import { cn } from '@nx-playground/ui-components';

// 基本用法
<div className={cn('flex items-center gap-2')} />

// 條件樣式
<div className={cn(
  'px-4 py-2 rounded-md',
  isActive && 'bg-blue-500 text-white',
  isDisabled && 'opacity-50 cursor-not-allowed'
)} />

// 覆蓋樣式
<Button className={cn('w-full', customClass)} />
```
