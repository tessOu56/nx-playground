# Settings Feature - 多語系架構

## 文件結構

```
settings/
├── components/                     # UI 組件
├── pages/                         # 頁面組件
│   └── SettingsPage.tsx           # 主要設定頁面組件
├── hooks/                         # React Hooks
│   └── useSettingsTranslation.ts  # 本地翻譯 hook
├── types/                         # TypeScript 類型定義
│   └── metaData.ts                # SEO 元數據
├── locales/                       # 翻譯文件
│   ├── zh-TW/
│   │   └── settings.json          # 繁體中文翻譯
│   └── en/
│       └── settings.json          # 英文翻譯
├── i18n.ts                        # 本地 i18n 配置
├── index.ts                       # 模組入口點
└── README.md                      # 本文檔
```

## 多語系使用

### 翻譯 Hook

```typescript
import { useSettingsTranslation } from './hooks/useSettingsTranslation';

export const Settings: React.FC = () => {
  const { t } = useSettingsTranslation();

  return (
    <div>
      <h1>{t('settings.title')}</h1>
      <p>{t('settings.description')}</p>
    </div>
  );
};
```

### 初始化 i18n

在 Settings 組件中導入 i18n 配置：

```typescript
import '../i18n'; // 初始化本地 i18n 配置
```

### 翻譯鍵值

- `settings.title` - 頁面標題
- `settings.description` - 頁面描述
- `settings.appearance.title` - 外觀設定標題
- `settings.appearance.theme.title` - 主題切換標題
- `settings.appearance.theme.description` - 主題切換描述
- `settings.appearance.language.title` - 語言設定標題
- `settings.appearance.language.description` - 語言設定描述

## 設計原則

1. **模組化翻譯**：settings 功能擁有自己的翻譯文件，與全局翻譯分離
2. **類型安全**：使用 TypeScript 確保翻譯鍵值的類型安全
3. **本地化配置**：每個功能模組管理自己的 i18n 配置
4. **統一的 API**：與其他功能模組保持一致的翻譯 API

## 與全局 i18n 的關係

- settings 功能使用獨立的 i18n 實例
- 與全局 i18n 共享語言狀態
- 翻譯文件按功能模組組織，便於維護

## 🛠️ 共用工具

Settings 使用共用的 i18n 工具來簡化配置：

### 使用的共用工具

- `createFeatureI18n` - 用於創建 i18n 配置
- `createFeatureTranslation` - 用於創建翻譯 hook

詳見 [共用 i18n 工具文檔](../../utils/README.md)。

### 優勢

- **代碼重用**：避免重複的 i18n 配置代碼
- **一致性**：確保所有功能模組使用相同的配置方式
- **易於維護**：統一的 API 和配置結構
