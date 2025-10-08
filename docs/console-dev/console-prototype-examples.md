# Examples Feature - 開發範例模組

這個模組提供了完整的開發範例，幫助新開發者快速了解如何開發 feature。

## 📁 模組結構

```
examples/
├── components/          # 範例組件
│   ├── UIComponentsExample.tsx  # UI 組件範例
│   ├── EventExample.tsx         # 事件功能範例
│   ├── SurveyExample.tsx        # 調查功能範例
│   └── FormExample.tsx          # 表單功能範例
├── hooks/              # 範例 Hooks
│   ├── useEventExample.ts  # 事件功能 Hook 範例
│   └── useSurveyExample.ts # 調查功能 Hook 範例
├── types/              # 範例類型定義
│   └── example.ts          # 範例類型
├── examples/           # 具體範例實現
│   ├── events/             # 事件功能開發範例
│   ├── survey/             # 調查功能開發範例
│   └── form/               # 表單功能開發範例
└── index.ts            # 模組導出
```

## 🚀 快速開始

### 1. 查看 UI 組件範例

```tsx
import { UIComponentsExample } from './components/UIComponentsExample';

// 在頁面中使用
<UIComponentsExample />;
```

### 2. 查看事件功能範例

```tsx
import { EventExample } from './components/EventExample';

// 在頁面中使用
<EventExample />;
```

### 3. 查看調查功能範例

```tsx
import { SurveyExample } from './components/SurveyExample';

// 在頁面中使用
<SurveyExample />;
```

### 4. 查看表單功能範例

```tsx
import { FormExample } from './components/FormExample';

// 在頁面中使用
<FormExample />;
```

## 📋 開發檢查清單

### 新增功能範例時：

- [ ] 在 `types/example.ts` 中定義範例類型
- [ ] 在 `hooks/` 中創建相關 Hook 範例
- [ ] 在 `components/` 中創建範例組件
- [ ] 在 `examples/` 中創建具體實現範例
- [ ] 更新 `index.ts` 導出
- [ ] 添加使用說明文檔

### 最佳實踐：

1. **完整性**: 每個範例都應該展示完整的功能流程
2. **清晰性**: 代碼應該有詳細的註釋說明
3. **實用性**: 範例應該基於實際使用場景
4. **一致性**: 遵循專案的開發規範

## 🔗 相關文檔

- [Feature-Driven 開發指南](../../../../docs/feature-driven-development.md)
- [TypeScript 最佳實踐](../../../../docs/typescript-best-practices.md)
- [測試指南](../../../../docs/testing-guide.md)
- [狀態管理指南](../../../../docs/state-management.md)
