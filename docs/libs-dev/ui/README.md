# UI Components

> 對照：`libs/ui-components`

## 專案目的

建立可重用的 UI 組件庫，提供一致的使用者體驗。所有組件都整合設計系統 tokens，確保視覺統一性。

## 開發理念

### 設計系統整合

- 所有組件都使用 Design System tokens
- 支援多主題切換
- 語義化的 props 設計

### 開發體驗優化

- TypeScript 完整類型支援
- Storybook 文檔和測試
- 樹搖優化 (Tree-shaking)

## 技術成果

### 核心組件

- **Form Components**: Input, Select, Checkbox, Radio 等表單組件
- **Navigation**: Button, Link, Menu 等導航組件
- **Layout**: Container, Grid, Flex 等佈局組件
- **Feedback**: Alert, Toast, Modal 等回饋組件

### 特色功能

- **主題支援**: 自動適配 base/enterprise/monochrome 主題
- **響應式設計**: 內建 mobile-first 響應式支援
- **無障礙支援**: 符合 WCAG 2.1 標準
- **國際化支援**: 與 i18n 系統整合

## 使用方式

### 基本使用

```tsx
import { Button, Input, Select } from '@nx-playground/ui-components';

function MyForm() {
  return (
    <form>
      <Input placeholder='輸入姓名' />
      <Select options={options} />
      <Button type='submit'>提交</Button>
    </form>
  );
}
```

### 主題切換

```tsx
import { ThemeProvider } from '@nx-playground/ui-components';

function App() {
  return (
    <ThemeProvider theme='enterprise'>
      <MyApp />
    </ThemeProvider>
  );
}
```

## 開發指令

```bash
# 啟動 Storybook
pnpm exec nx storybook ui-components

# 建置組件庫
pnpm exec nx build ui-components

# 執行組件測試
pnpm exec nx test ui-components
```

## 架構價值

- **一致性**: 確保所有應用使用相同的 UI 元素
- **效率性**: 減少重複開發，提升開發速度
- **品質性**: 集中測試和維護，提升組件品質
- **擴展性**: 易於新增和修改組件功能
