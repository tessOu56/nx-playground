---
id: i18n
name: i18n
version: 0.0.1
description: 此函式庫已整合到 workspace，所有專案可直接使用：
techStack: []
features: []
lastUpdated: '2025-10-21'
---
# @nx-playground/i18n

> 統一的國際化解決方案，支援 React (i18next) 和 Next.js (next-intl)

## 🎯 功能特色

- 🌍 **多框架支援** - React 和 Next.js
- 🔄 **語言切換** - 動態語言切換
- 📝 **類型安全** - TypeScript 支援
- 🎯 **功能級翻譯** - 模組化翻譯管理
- 🔌 **易於擴展** - 簡單添加新語言

## 📦 在 Monorepo 中使用

此函式庫已整合到 workspace，所有專案可直接使用：

```tsx
import { useTranslation } from '@nx-playground/i18n';
```

## 🚀 支援的語言

- 🇹🇼 繁體中文 (zh-TW)
- 🇬🇧 English (en)

## 📖 使用指南

### 在 React 應用中使用 (Vite)

#### 1. 設置 i18n Provider

```tsx
// src/main.tsx
import { I18nextProvider } from 'react-i18next';
import { i18n } from '@nx-playground/i18n';

root.render(
  <I18nextProvider i18n={i18n}>
    <App />
  </I18nextProvider>
);
```

#### 2. 使用翻譯

```tsx
import { useTranslation } from '@nx-playground/i18n';

function MyComponent() {
  const { t, i18n } = useTranslation();

  return (
    <div>
      <h1>{t('common.welcome')}</h1>
      <button onClick={() => i18n.changeLanguage('en')}>
        Switch to English
      </button>
    </div>
  );
}
```

#### 3. 使用 UI 翻譯

```tsx
import { useUITranslation } from '@nx-playground/i18n';

function UIComponent() {
  const { t } = useUITranslation();

  return (
    <button>{t('ui.buttons.submit')}</button>
  );
}
```

### 在 Next.js 應用中使用

#### 1. 配置 next-intl

```tsx
// app/layout.tsx
import { NextIntlClientProvider } from '@nx-playground/i18n/next-intl';
import { getMessages } from '@nx-playground/i18n/next-intl';

export default async function RootLayout({ children, params: { locale } }) {
  const messages = await getMessages(locale);

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```

#### 2. 使用翻譯

```tsx
import { useTranslations } from '@nx-playground/i18n/next-intl';

function MyPage() {
  const t = useTranslations('common');

  return <h1>{t('welcome')}</h1>;
}
```

#### 3. 服務端翻譯

```tsx
import { getTranslations } from '@nx-playground/i18n/next-intl';

export default async function Page() {
  const t = await getTranslations('common');

  return <h1>{t('welcome')}</h1>;
}
```

## 📁 翻譯文件結構

```
src/locales/
├── en/
│   ├── common.json        # 通用翻譯
│   └── ui.json           # UI 組件翻譯
└── zh-TW/
    ├── common.json
    └── ui.json
```

### common.json 範例

```json
{
  "welcome": "歡迎",
  "buttons": {
    "submit": "提交",
    "cancel": "取消",
    "save": "儲存"
  }
}
```

### ui.json 範例

```json
{
  "ui": {
    "loading": "載入中...",
    "error": "發生錯誤",
    "success": "成功"
  }
}
```

## 🎨 功能級翻譯

為特定功能模組創建獨立的翻譯：

```tsx
// features/dashboard/i18n.ts
import { createFeatureI18n } from '@nx-playground/i18n';

export const dashboardI18n = createFeatureI18n('dashboard', {
  'zh-TW': () => import('./locales/zh-TW/dashboard.json'),
  'en': () => import('./locales/en/dashboard.json'),
});

// features/dashboard/hooks/useDashboardTranslation.ts
import { createFeatureTranslation } from '@nx-playground/i18n';
import { dashboardI18n } from '../i18n';

export const useDashboardTranslation = createFeatureTranslation(dashboardI18n);

// 在組件中使用
function DashboardPage() {
  const { t } = useDashboardTranslation();
  return <h1>{t('dashboard.title')}</h1>;
}
```

## 🌍 添加新語言

### 1. 創建翻譯文件

```
src/locales/
└── ja/              # 日文
    ├── common.json
    └── ui.json
```

### 2. 更新 i18n 配置

```tsx
// src/lib/i18n.ts
i18n
  .use(LanguageDetector)
  .init({
    resources: {
      'zh-TW': { ... },
      'en': { ... },
      'ja': { ... },  // 添加新語言
    },
    fallbackLng: 'zh-TW',
    supportedLngs: ['zh-TW', 'en', 'ja'],
  });
```

## 🔧 API 參考

### useTranslation()

```tsx
const { t, i18n } = useTranslation();

// 翻譯文字
t('common.welcome')
t('buttons.submit')

// 帶參數
t('greeting', { name: 'John' })  // "Hello, John"

// 切換語言
i18n.changeLanguage('en')

// 當前語言
i18n.language  // 'zh-TW'
```

### useUITranslation()

```tsx
const { t } = useUITranslation();

// 專門用於 UI 組件的翻譯
t('ui.loading')
t('ui.error')
```

## 🔧 開發

### 構建

```bash
# 在 Monorepo 根目錄
nx build i18n
```

### 測試

```bash
nx test i18n
```

## 📚 最佳實踐

### 1. 使用命名空間組織翻譯

```json
{
  "auth": {
    "login": "登入",
    "logout": "登出"
  },
  "dashboard": {
    "title": "儀表板"
  }
}
```

### 2. 避免硬編碼文字

```tsx
// ❌ 不好
<button>提交</button>

// ✅ 好
<button>{t('buttons.submit')}</button>
```

### 3. 為複數提供不同翻譯

```json
{
  "items": "{{count}} 個項目",
  "items_plural": "{{count}} 個項目",
  "items_zero": "沒有項目"
}
```

## 🔗 相關連結

- [i18next Documentation](https://www.i18next.com/)
- [next-intl Documentation](https://next-intl-docs.vercel.app/)
- [React i18next](https://react.i18next.com/)
