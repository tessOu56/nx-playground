# @nx-playground/i18n

NX Playground 的多語系庫，支援 Next.js 和 Vite 兩種開發環境。

## 快速開始

### 1. 設置 Provider

```tsx
import { I18nProvider } from '@nx-playground/i18n';

function App() {
  return (
    <I18nProvider>
      <YourApp />
    </I18nProvider>
  );
}
```

### 2. 使用翻譯

```tsx
import { useTranslation, useUITranslation } from '@nx-playground/i18n';

function MyComponent() {
  const { t } = useTranslation();
  const { t: tUI } = useUITranslation();

  return (
    <div>
      <h1>{t('common.welcome')}</h1>
      <button>{tUI('ui.button.save')}</button>
    </div>
  );
}
```

### 3. 語言切換

```tsx
import { useI18nSmart, LanguageSwitcher } from '@nx-playground/i18n';

function LanguageControl() {
  const { changeLanguage, currentLanguage } = useI18nSmart();

  return (
    <div>
      <LanguageSwitcher variant='dropdown' />
      {/* 或 */}
      <button onClick={() => changeLanguage('zh-TW')}>繁體中文</button>
      <button onClick={() => changeLanguage('en')}>English</button>
    </div>
  );
}
```

## 支援的語言

- `zh-TW`: 繁體中文 (預設)
- `en`: English

## 翻譯範例

### Common 翻譯

```json
{
  "common": {
    "save": "儲存",
    "cancel": "取消",
    "loading": "載入中..."
  }
}
```

### UI 翻譯

```json
{
  "ui": {
    "button": {
      "save": "儲存",
      "cancel": "取消"
    },
    "form": {
      "required": "必填"
    }
  }
}
```

## 環境配置

詳細的環境變數配置請參考：[多語系環境變數配置](../../docs/technical/i18n-environment-config.md)

## API 參考

- `useTranslation()`: 通用翻譯 hook
- `useUITranslation()`: UI 專用翻譯 hook
- `useI18nSmart()`: 語言切換 hook
- `LanguageSwitcher`: 語言切換組件
- `I18nProvider`: 多語系 Provider
