# Locale-based URL Routing

Profile app 使用 locale-based URL routing，語言代碼直接包含在 URL 路徑中。

## 🌐 URL 結構

### 路由格式

所有 URL 都包含語言前綴：

```
/zh-TW          → 中文首頁
/zh-TW/apps     → 中文 Apps 頁面
/zh-TW/apps/auth → 中文 Auth App 詳情
/zh-TW/libs     → 中文 Libs 頁面

/en             → English home page
/en/apps        → English apps page
/en/apps/auth   → English auth app detail
/en/libs        → English libs page
```

### 支援的語言

- `zh-TW` - 繁體中文（預設）
- `en` - English

### 根路徑行為

訪問根路徑 `/` 會自動重定向到預設語言：

```
/ → /zh-TW
```

## 🔧 實現架構

### 1. LocaleRouter 組件

`src/lib/i18n/LocaleRouter.tsx`

負責：
- 從 URL 提取 locale 參數
- 驗證 locale 是否有效
- 設置 i18n 語言
- 無效 locale 重定向

```typescript
// 使用方式
<Route path="/:locale" element={
  <LocaleRouter>
    <Layout>
      {/* your routes */}
    </Layout>
  </LocaleRouter>
} />
```

### 2. useLocalizedNavigation Hook

`src/lib/i18n/useLocalizedNavigation.ts`

提供 locale-aware 的導航功能：

```typescript
const { locale, navigate, changeLanguage, getLocalizedPath } = useLocalizedNavigation();

// 導航（自動加上 locale）
navigate('/apps'); // 實際導航到 /${currentLocale}/apps

// 切換語言（更新 URL）
changeLanguage('en'); // 從 /zh-TW/apps → /en/apps

// 獲取帶 locale 的路徑
const path = getLocalizedPath('/apps'); // → /zh-TW/apps
```

### 3. 自定義 LanguageSwitcher

`src/components/LanguageSwitcher.tsx`

不使用 `@nx-playground/ui-components` 的 LanguageSwitcher（需要 I18nSmartContext），
而是自定義實現，直接使用 `useLocalizedNavigation`。

```typescript
const { locale, changeLanguage } = useLocalizedNavigation();

// 切換語言會：
// 1. 更新 i18n.language
// 2. 更新 URL (保持在同一頁面)
```

## 🔄 語言切換流程

### 用戶點擊語言切換器

```
當前: /zh-TW/apps
點擊 "EN"
↓
changeLanguage('en') 被調用
↓
i18n.changeLanguage('en')
navigate('/en/apps')
↓
結果: /en/apps (同一頁面，不同語言)
```

### URL 變化觸發語言更新

```
用戶直接訪問: /en/libs
↓
LocaleRouter useEffect 檢測到 locale='en'
↓
i18n.changeLanguage('en')
↓
頁面以英文顯示
```

## 📝 組件使用方式

### 在 Layout 中使用

```typescript
import { useLocalizedNavigation } from '../lib/i18n/useLocalizedNavigation';

export function Layout() {
  const { getLocalizedPath } = useLocalizedNavigation();
  
  return (
    <Link to={getLocalizedPath('/apps')}>
      Apps
    </Link>
  );
}
```

### 在頁面組件中使用

```typescript
import { useLocalizedNavigation } from '../../../lib/i18n/useLocalizedNavigation';

export function MyPage() {
  const { navigate } = useLocalizedNavigation();
  
  const handleClick = () => {
    navigate('/apps/auth'); // 自動變成 /${locale}/apps/auth
  };
  
  return <button onClick={handleClick}>View Auth</button>;
}
```

### 檢查當前語言

```typescript
const { locale } = useLocalizedNavigation();

console.log(locale); // 'zh-TW' or 'en'
```

## 🎨 URL 設計原則

### 為什麼使用 locale 前綴？

**優點**:
1. ✅ **SEO 友善** - 搜尋引擎可以索引不同語言版本
2. ✅ **可分享** - URL 包含語言資訊，分享時保持語言
3. ✅ **書籤友善** - 書籤記住語言選擇
4. ✅ **清晰明確** - URL 明確指示內容語言

**與 event-portal 一致**:
- event-portal 使用 Next.js App Router: `/[locale]/...`
- profile 使用 React Router: `/:locale/...`
- 兩者都實現相同的 UX

### 預設語言選擇

選擇 `zh-TW` 作為預設語言因為：
- 主要目標受眾是台灣市場
- 專案內容主要為繁體中文
- 可在 `App.tsx` 中修改預設語言

## 🔧 進階配置

### 修改預設語言

編輯 `src/App.tsx`:

```typescript
// 從
<Route path='/' element={<Navigate to='/zh-TW' replace />} />

// 改為
<Route path='/' element={<Navigate to='/en' replace />} />
```

### 添加新語言

1. 更新 `LocaleRouter.tsx`:
```typescript
const SUPPORTED_LOCALES = ['zh-TW', 'en', 'ja'] as const; // 添加 'ja'
```

2. 添加翻譯檔案:
```
src/features/home/locales/ja/home.json
src/features/apps/locales/ja/apps.json
src/features/libs/locales/ja/libs.json
```

3. 更新 LanguageSwitcher:
```typescript
const languages = [
  { code: 'zh-TW', label: '繁中' },
  { code: 'en', label: 'EN' },
  { code: 'ja', label: '日本語' }, // 新增
];
```

### 根據瀏覽器語言自動選擇

可在 `App.tsx` 實現：

```typescript
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function AutoLocaleRedirect() {
  const navigate = useNavigate();
  
  useEffect(() => {
    const browserLang = navigator.language;
    const locale = browserLang.startsWith('zh') ? 'zh-TW' : 'en';
    navigate(`/${locale}`, { replace: true });
  }, []);
  
  return null;
}

// 在 Route 中使用
<Route path='/' element={<AutoLocaleRedirect />} />
```

## 📊 與其他方案的對比

### 方案 1: Query Parameter (?lang=zh-TW)

❌ 不推薦，因為：
- SEO 不友善
- URL 不清晰
- 不易分享

### 方案 2: Subdomain (zh-tw.example.com)

❌ 不適用，因為：
- 需要額外的 DNS 設置
- Cloudflare Pages 不易支援
- 維護成本高

### 方案 3: Path Prefix (✅ 我們的選擇)

✅ 推薦，因為：
- SEO 最友善
- URL 清晰可讀
- 易於實現
- 與 Next.js 標準一致

## 🧪 測試

### 測試所有路由

訪問以下 URL 確認都正常：

**中文路由**:
- http://localhost:3003/zh-TW
- http://localhost:3003/zh-TW/apps
- http://localhost:3003/zh-TW/apps/auth
- http://localhost:3003/zh-TW/libs

**英文路由**:
- http://localhost:3003/en
- http://localhost:3003/en/apps
- http://localhost:3003/en/apps/event-cms
- http://localhost:3003/en/libs

**重定向測試**:
- http://localhost:3003/ → 應重定向到 /zh-TW
- http://localhost:3003/apps → 應重定向到 /zh-TW

### 測試語言切換

1. 訪問 `/zh-TW/apps`
2. 點擊 "EN" 按鈕
3. 應該跳轉到 `/en/apps`
4. 內容以英文顯示
5. 再點擊 "繁中"
6. 應該回到 `/zh-TW/apps`

## 🚀 部署注意事項

### Cloudflare Pages _redirects

`public/_redirects` 保持不變：

```
/* /index.html 200
```

這會確保所有路由（包括 `/:locale/*`）都由 React Router 處理。

### 直接訪問測試

部署後，確保直接訪問任何 URL 都正常：

```
直接訪問: https://your-domain.com/en/apps/auth
↓
Cloudflare 返回: index.html
↓
React Router 處理: /:locale/apps/:appId
↓
正確顯示: Auth App 詳情頁（英文）
```

## 💡 最佳實踐

### 1. 始終使用 getLocalizedPath

```typescript
// ✅ 好
<Link to={getLocalizedPath('/apps')}>Apps</Link>

// ❌ 不好
<Link to='/apps'>Apps</Link>
```

### 2. 使用 navigate 而非 useNavigate

```typescript
// ✅ 好
const { navigate } = useLocalizedNavigation();
navigate('/apps');

// ❌ 不好
const nav = useNavigate();
nav('/apps'); // 會導致無效路徑
```

### 3. 語言切換使用 changeLanguage

```typescript
// ✅ 好
const { changeLanguage } = useLocalizedNavigation();
changeLanguage('en');

// ❌ 不好
i18n.changeLanguage('en'); // 只改語言，不更新 URL
```

---

**架構完成**: ✅  
**測試通過**: ✅  
**部署就緒**: ✅  

完整的 locale-based routing 已實現！🎉

