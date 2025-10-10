# @nx-playground/design-system

> 自動化設計 Token 生成系統，將 CSS 設計檔案轉換為可用的變數和 Vanilla Extract 主題

## 🎯 功能特色

- 🎨 **多主題支援** - Base, Enterprise, Monochrome
- 🔄 **自動生成** - CSS → JSON → Vanilla Extract + Tailwind
- 📝 **完整文檔** - 自動生成視覺化參考
- 🎯 **類型安全** - TypeScript 類型定義
- 🔧 **易於維護** - 統一的 token 管理

## 📦 在 Monorepo 中使用

此函式庫已整合到 workspace，所有專案可直接使用：

```tsx
// 在任何專案中導入
import '@nx-playground/design-system/index.css';
import { baseTheme } from '@nx-playground/design-system';
```

## 🚀 快速開始

### 構建 Design Tokens

```bash
# 在 Monorepo 根目錄
pnpm design:tokens

# 監視檔案變更並自動重建
pnpm design:tokens:watch

# 查看生成的 Tokens
pnpm design:tokens:view
```

### 在專案中使用

```tsx
// src/index.css
@import '@nx-playground/design-system/tokens/generated/tailwind-variables.css';
@import '@nx-playground/design-system/index.css';

@tailwind base;
@tailwind components;
@tailwind utilities;
```

## 🎨 可用主題

### 1. Base Theme (預設)
標準設計系統，使用藍色作為主要色調

```tsx
import { baseTheme } from '@nx-playground/design-system';

<div className={baseTheme}>
  {/* 你的內容 */}
</div>
```

### 2. Enterprise Theme
企業版設計系統，藍灰色主題，適合專業應用

```tsx
import { enterpriseTheme } from '@nx-playground/design-system';

<div className={enterpriseTheme}>
  {/* 你的內容 */}
</div>
```

### 3. Monochrome Theme
黑白灰色調設計系統

```tsx
import { monochromeTheme } from '@nx-playground/design-system';

<div className={monochromeTheme}>
  {/* 你的內容 */}
</div>
```

## 📝 生成的檔案

所有檔案位於 `src/tokens/generated/`:

- `base-theme.css.ts` - Vanilla Extract 主題
- `enterprise-theme.css.ts`
- `monochrome-theme.css.ts`
- `tailwind-variables.css` - CSS 變數定義
- `tailwind-config.js` - Tailwind 配置
- `tokens.json` - JSON 格式 Tokens
- `design-tokens.d.ts` - TypeScript 類型定義
- `TOKENS.md` - 完整參考文檔
- `tokens-visual.html` - 視覺化參考頁面

## 🔧 Tailwind CSS 整合

在專案的 `tailwind.config.js` 中整合：

```javascript
const designSystemConfig = require('../../libs/design-system/src/tokens/generated/tailwind-config.js');

module.exports = {
  presets: [designSystemConfig],
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      // 你的自定義配置
    },
  },
};
```

## 🎨 使用語義化顏色

```tsx
// ✅ 推薦：使用語義化 token
<div className="bg-background-primary text-text-primary border-border-primary">
  Content
</div>

// ❌ 避免：硬編碼顏色
<div className="bg-white text-gray-900 border-gray-300">
  Content
</div>
```

## 🔄 開發流程

### 1. 修改 Token 源文件

編輯 `src/tokens/source/*.css` 文件

### 2. 重建 Tokens

```bash
pnpm design:tokens
```

### 3. 查看結果

打開 `src/tokens/generated/tokens-visual.html` 查看視覺化結果

## 📚 Token 分類

### Colors (顏色)
- Primary, Secondary, Accent
- Success, Warning, Error, Info
- Background, Surface, Border
- Text (primary, secondary, disabled)

### Spacing (間距)
- xs, sm, md, lg, xl, 2xl, 3xl, 4xl
- 統一的間距系統

### Typography (排版)
- Font families, sizes, weights, line heights
- Heading 1-6, Body, Caption

### Border Radius (圓角)
- none, sm, md, lg, full
- 統一的圓角系統

### Shadows (陰影)
- sm, md, lg, xl
- 統一的陰影系統

## 🔧 自定義 Tokens

1. 編輯 `src/tokens/source/` 中的 CSS 文件
2. 運行 `pnpm design:tokens` 重建
3. 檢查 `tokens-visual.html` 確認結果

## 📖 詳細文檔

查看 `src/tokens/generated/TOKENS.md` 獲取完整的 token 參考文檔。

## 🔗 相關連結

- [Style Dictionary](https://amzn.github.io/style-dictionary)
- [Vanilla Extract](https://vanilla-extract.style)
- [Tailwind CSS](https://tailwindcss.com)