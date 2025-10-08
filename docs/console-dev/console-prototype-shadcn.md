# Console Prototype - Shadcn/ui 使用指南

## 概述

Console Prototype 可以使用根目錄的 `@nx-playground/ui-components` 庫，該庫提供了基於 shadcn/ui 設計模式的組件。

## 安裝和配置

### 1. 依賴已安裝

`@nx-playground/ui-components` 已經在 `package.json` 中配置為 workspace 依賴：

```json
{
  "dependencies": {
    "@nx-playground/ui-components": "workspace:*"
  }
}
```

### 2. 樣式已整合

根目錄的 Tailwind 配置已經整合了 design-system 的設計令牌，所以所有組件都會自動使用統一的設計系統。

## 可用的組件

### 基礎組件

```tsx
import { Button, Card, Input, Select } from '@nx-playground/ui-components';
```

#### Button 組件

```tsx
// 變體
<Button variant="primary">主要按鈕</Button>
<Button variant="secondary">次要按鈕</Button>
<Button variant="outline">外框按鈕</Button>
<Button variant="ghost">幽靈按鈕</Button>

// 大小
<Button size="sm">小按鈕</Button>
<Button size="md">中按鈕</Button>
<Button size="lg">大按鈕</Button>
```

#### Card 組件

```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@nx-playground/ui-components';

<Card>
  <CardHeader>
    <CardTitle>卡片標題</CardTitle>
    <CardDescription>卡片描述</CardDescription>
  </CardHeader>
  <CardContent>
    <p>卡片內容</p>
  </CardContent>
  <CardFooter>
    <Button>操作按鈕</Button>
  </CardFooter>
</Card>;
```

#### Input 組件

```tsx
<Input placeholder="請輸入..." className="mt-1" />
```

#### Select 組件

```tsx
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@nx-playground/ui-components';

<Select>
  <SelectTrigger>
    <SelectValue placeholder="選擇選項" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">選項 1</SelectItem>
    <SelectItem value="option2">選項 2</SelectItem>
  </SelectContent>
</Select>;
```

#### Prose 組件

```tsx
import { Prose } from '@nx-playground/ui-components';

<Prose>
  <h1>標題</h1>
  <p>段落內容</p>
  <ul>
    <li>列表項目</li>
  </ul>
  <blockquote>
    <p>引用內容</p>
  </blockquote>
</Prose>;
```

## 實際使用範例

### 1. 在 Dashboard 中使用

```tsx
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Select } from '@nx-playground/ui-components';

export const Dashboard: React.FC = () => {
  return (
    <div className="p-6">
      {/* 使用 Card 組件 */}
      <Card>
        <CardHeader>
          <CardTitle>統計卡片</CardTitle>
        </CardHeader>
        <CardContent>
          <p>統計內容</p>
        </CardContent>
      </Card>

      {/* 使用表單組件 */}
      <Card>
        <CardHeader>
          <CardTitle>搜尋</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input placeholder="搜尋..." />
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="選擇狀態" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部</SelectItem>
              <SelectItem value="active">進行中</SelectItem>
            </SelectContent>
          </Select>
          <Button>搜尋</Button>
        </CardContent>
      </Card>
    </div>
  );
};
```

### 2. 創建表單

```tsx
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Select } from '@nx-playground/ui-components';

export const UserForm: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>用戶資訊</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label htmlFor="name" className="text-sm font-medium text-text-primary">
            姓名
          </label>
          <Input id="name" placeholder="請輸入姓名" className="mt-1" />
        </div>

        <div>
          <label htmlFor="role" className="text-sm font-medium text-text-primary">
            角色
          </label>
          <Select>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="選擇角色" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">管理員</SelectItem>
              <SelectItem value="user">一般用戶</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          <Button variant="primary">保存</Button>
          <Button variant="outline">取消</Button>
        </div>
      </CardContent>
    </Card>
  );
};
```

## 設計系統整合

### 語義化顏色

組件自動使用 design-system 的語義化顏色：

- `text-text-primary` - 主要文字顏色
- `text-text-secondary` - 次要文字顏色
- `bg-background-primary` - 主要背景顏色
- `bg-background-secondary` - 次要背景顏色
- `border-border-primary` - 主要邊框顏色

### 主題支援

組件支援深色模式，會自動響應 `[data-theme=dark]` 屬性。

## 最佳實踐

### 1. 組件組合

```tsx
// 好的做法：使用 Card 包裝內容
<Card>
  <CardHeader>
    <CardTitle>標題</CardTitle>
  </CardHeader>
  <CardContent>
    <Input placeholder="輸入..." />
    <Button>提交</Button>
  </CardContent>
</Card>
```

### 2. 一致的間距

```tsx
// 使用 space-y-4 保持一致的垂直間距
<CardContent className="space-y-4">
  <Input />
  <Select />
  <Button />
</CardContent>
```

### 3. 語義化標籤

```tsx
// 為表單元素添加適當的標籤
<div>
  <label htmlFor="email" className="text-sm font-medium text-text-primary">
    電子郵件
  </label>
  <Input id="email" type="email" className="mt-1" />
</div>
```

## 擴展組件

如果需要新的組件，可以：

1. 在 `libs/ui-components/src/lib/components/core/` 中創建新組件
2. 在 `libs/ui-components/src/index.ts` 中導出
3. 在 console-prototype 中直接使用

## 參考資源

- [Shadcn/ui 官方文檔](https://ui.shadcn.com/)
- [Radix UI 組件](https://www.radix-ui.com/primitives)
- [Tailwind CSS 文檔](https://tailwindcss.com/docs)
