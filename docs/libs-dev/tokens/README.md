# Design System Tokens

> 對照：`libs/design-system`

## 專案目的

建立統一的設計語言系統，確保整個 NX Playground 平台的視覺一致性。透過自動化的 token 生成流程，讓設計師與開發者能夠高效協作。

## 開發理念

### 設計師友善

- 直接從 Figma 導出設計 tokens
- 視覺化的 token 預覽頁面
- 語義化的命名系統

### 開發者友善

- TypeScript 類型安全
- 自動生成 Tailwind 配置
- 與 UI 組件庫無縫整合

## 技術成果

### 自動化流程

1. **Figma → CSS** - 設計師導出 CSS 檔案
2. **CSS → JSON** - 自動轉換為結構化 tokens
3. **JSON → Theme** - 生成 Vanilla Extract 主題
4. **Theme → Config** - 產出 Tailwind 配置

### 可用主題

- **Base Theme**: 標準藍色主題，適用於一般場景
- **Enterprise Theme**: 企業藍灰色主題，適用於商業場景
- **Monochrome Theme**: 黑白灰主題，適用於簡約場景

### 輸出成果

- `TOKENS.md` - 完整的 tokens 參考文檔
- `tailwind-variables.css` - CSS 變數定義
- `tailwind-config.js` - Tailwind 配置檔案
- `tokens-visual.html` - 視覺化參考頁面

## 使用方式

### 在組件中使用

```tsx
// ✅ 推薦：語義化顏色
className = 'text-primary bg-background-primary border-border-primary';

// ❌ 避免：硬編碼顏色
className = 'text-gray-900 bg-white border-gray-300';
```

### Tailwind 整合

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

## 開發指令

```bash
# 建置設計 Tokens
pnpm run design:tokens

# 監視檔案變更
pnpm run design:tokens:watch

# 查看 Tokens 視覺化頁面
pnpm run design:tokens:view
```

## 架構價值

- **一致性**: 確保整個平台的視覺統一
- **效率性**: 自動化減少手動維護成本
- **擴展性**: 支援多主題切換
- **維護性**: 集中管理所有設計 tokens
