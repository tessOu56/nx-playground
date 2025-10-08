# Design System

自動化設計 tokens 生成系統，將 Figma 設計檔案轉換為可用的 CSS 變數和 Vanilla Extract 主題。

## 快速開始

```bash
# 建置設計 Tokens
pnpm run design:tokens

# 監視檔案變更
pnpm run design:tokens:watch

# 查看 Tokens
pnpm run design:tokens:view
```

## 可用主題

- **base**: 標準設計系統（藍色主題）
- **enterprise**: 企業版設計系統（藍灰色主題）
- **monochrome**: 黑白灰色調設計系統

## 生成檔案

- `TOKENS.md` - 完整的 tokens 參考文檔
- `tailwind-variables.css` - CSS 變數定義
- `tailwind-config.js` - Tailwind 配置
- `tokens-visual.html` - 視覺化參考頁面

## 與其他專案整合

### Tailwind 配置

```javascript
// tailwind.config.js
const designSystemConfig = require('./libs/design-system/src/tokens/generated/tailwind-config.js');

module.exports = {
  theme: {
    extend: {
      ...designSystemConfig.theme.extend,
    },
  },
};
```

### 語義化顏色使用

```tsx
// ✅ 推薦：語義化顏色
text - primary;
bg - background - primary;
border - border - primary;

// ❌ 避免：硬編碼顏色
text - gray - 900;
bg - white;
border - gray - 300;
```

---

> 💡 **提示**：UI 組件請使用 `@nx-playground/ui-components` 套件。
