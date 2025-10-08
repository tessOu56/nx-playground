# i18n (國際化)

> 對照：`libs/i18n`

## 專案目的

提供完整的多語系支援，讓 NX Playground 平台能夠服務不同語言的用戶。建立統一的翻譯管理系統，支援動態語言切換。

## 開發理念

### 開發者友善

- TypeScript 類型安全的翻譯鍵
- 統一的翻譯函數 API
- 熱重載支援翻譯更新

### 內容管理優化

- 結構化的翻譯檔案組織
- 功能模組化的翻譯分類
- 缺失翻譯的開發提醒

## 技術成果

### 支援語言

- **繁體中文 (zh-TW)**: 主要語言
- **英文 (en)**: 國際化支援
- **日文 (ja)**: 區域市場支援

### 翻譯架構

- **Common Translations**: 通用翻譯，存放在 `libs/i18n`
- **Feature Translations**: 功能專屬翻譯，存放在各功能資料夾
- **Dynamic Loading**: 按需載入翻譯資源
- **Fallback Support**: 自動回退到預設語言

### 組織結構

```
libs/i18n/
├── locales/
│   ├── zh-TW/           # 繁體中文
│   ├── en/              # 英文
│   └── ja/              # 日文
└── utils/               # 工具函數
```

## 使用方式

### 基本翻譯

```tsx
import { useTranslations } from 'next-intl';

function WelcomeMessage() {
  const t = useTranslations('common');

  return (
    <div>
      <h1>{t('welcome')}</h1>
      <p>{t('description')}</p>
    </div>
  );
}
```

### 參數化翻譯

```tsx
const t = useTranslations('user');

// 翻譯檔案: { "greeting": "Hello, {name}!" }
<p>{t('greeting', { name: userName })}</p>;
```

### 語言切換

```tsx
import { useLocale } from 'next-intl';
import { useRouter } from 'next/router';

function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();

  const switchLanguage = (newLocale: string) => {
    router.push(router.pathname, router.asPath, { locale: newLocale });
  };

  return (
    <select value={locale} onChange={e => switchLanguage(e.target.value)}>
      <option value='zh-TW'>繁體中文</option>
      <option value='en'>English</option>
      <option value='ja'>日本語</option>
    </select>
  );
}
```

## 開發指令

```bash
# 檢查翻譯完整性
pnpm exec nx run i18n:check

# 建置 i18n 資源
pnpm exec nx build i18n

# 執行 i18n 測試
pnpm exec nx test i18n
```

## 翻譯管理原則

### 檔案組織

- **通用翻譯**: 存放在 `libs/i18n/locales/`
- **功能翻譯**: 存放在各功能資料夾的 `locales/` 目錄
- **命名規範**: 使用 kebab-case，如 `user-profile.json`

### 翻譯鍵設計

```json
{
  "user": {
    "profile": {
      "title": "用戶資料",
      "fields": {
        "name": "姓名",
        "email": "電子郵件"
      }
    }
  }
}
```

## 架構價值

- **國際化**: 支援多語言市場擴展
- **一致性**: 統一的翻譯管理和使用方式
- **維護性**: 結構化的翻譯檔案組織
- **開發體驗**: TypeScript 類型安全和開發工具支援
