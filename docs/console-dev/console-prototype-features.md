# Features 目錄結構

這個目錄包含 console-prototype 應用的所有功能模組，每個模組都遵循統一的目錄結構和設計原則。

## 📁 統一的目錄結構

每個功能模組都遵循以下標準結構：

```
feature-name/
├── components/                     # UI 組件
├── pages/                         # 頁面組件
│   └── FeatureNamePage.tsx        # 主要頁面組件
├── hooks/                         # React Hooks
│   └── useFeatureTranslation.ts   # 本地翻譯 hook
├── types/                         # TypeScript 類型定義
│   └── metaData.ts                # SEO 元數據
├── locales/                       # 翻譯文件
│   ├── zh-TW/
│   │   └── feature.json           # 繁體中文翻譯
│   └── en/
│       └── feature.json           # 英文翻譯
├── i18n.ts                        # 本地 i18n 配置
├── index.ts                       # 模組入口點
└── README.md                      # 模組文檔
```

## 🎯 功能模組

### Dashboard

- **路徑**: `dashboard/`
- **描述**: 儀表板功能，顯示系統概覽和快速操作
- **文檔**: [Dashboard README](./dashboard/README.md)

### Settings

- **路徑**: `settings/`
- **描述**: 平台設定功能，管理外觀和語言設定
- **文檔**: [Settings README](./settings/README.md)

## 🛠️ 共用工具

所有功能模組都使用共用的 i18n 工具：

- `createFeatureI18n` - 創建 i18n 配置
- `createFeatureTranslation` - 創建翻譯 hook

詳見 [共用工具文檔](../utils/README.md)。

## 📋 設計原則

1. **模組化**: 每個功能都是獨立的模組
2. **一致性**: 統一的目錄結構和 API
3. **可維護性**: 清晰的代碼組織和文檔
4. **可擴展性**: 易於添加新功能模組
5. **多語系**: 完整的國際化支持

## 🚀 添加新功能模組

要添加新的功能模組，請遵循以下步驟：

1. **創建目錄結構**：

   ```bash
   mkdir -p features/new-feature/{components,pages,hooks,types,locales/{zh-TW,en}}
   ```

2. **創建翻譯文件**：

   - `locales/zh-TW/new-feature.json`
   - `locales/en/new-feature.json`

3. **配置 i18n**：

   ```typescript
   // i18n.ts
   import { createFeatureI18n } from '../../lib/i18n/i18n-config';

   const i18n = createFeatureI18n({
     namespace: 'new-feature',
     resources: {
       'zh-TW': zhTWTranslations,
       en: enTranslations,
     },
   });
   ```

4. **創建翻譯 hook**：

   ```typescript
   // hooks/useNewFeatureTranslation.ts
   import { createFeatureTranslation } from '../../../lib/hooks/useFeatureTranslation';

   export const useNewFeatureTranslation = createFeatureTranslation(
     'new-feature',
     ['new-feature.key1', 'new-feature.key2']
   );
   ```

5. **創建頁面組件**：

   ```typescript
   // pages/NewFeaturePage.tsx
   import { useNewFeatureTranslation } from '../hooks/useNewFeatureTranslation';
   import '../i18n';

   export const NewFeaturePage: React.FC = () => {
     const { t } = useNewFeatureTranslation();
     return <div>{t('new-feature.title')}</div>;
   };
   ```

6. **更新入口點**：

   ```typescript
   // index.ts
   export { NewFeaturePage as NewFeature } from './pages/NewFeaturePage';
   export { newFeatureMetaData } from './types/metaData';
   ```

7. **添加文檔**：創建 `README.md` 說明模組功能和使用方式

## 📚 相關文檔

- [共用 i18n 工具](../utils/README.md)
- [Dashboard 功能](./dashboard/README.md)
- [Settings 功能](./settings/README.md)
