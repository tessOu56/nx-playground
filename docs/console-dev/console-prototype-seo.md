# Console Prototype SEO 使用指南

## 概述

Console Prototype 使用 `react-helmet-async` 來管理頁面的 SEO 和 meta 標籤。

## 安裝

`react-helmet-async` 已安裝在 Nx 工作區根目錄：

```bash
pnpm add react-helmet-async -w
```

## 設置

### 1. HelmetProvider

在 `main.tsx` 中已設置 `HelmetProvider`：

```tsx
import { HelmetProvider } from 'react-helmet-async';

root.render(
  <React.StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </React.StrictMode>
);
```

### 2. SEO 組件

創建了可重用的 `SEO` 組件：

```tsx
import { SEO } from '../components/SEO';
import { seoConfigs } from '../utils/seo';

export const MyPage: React.FC = () => {
  return (
    <>
      <SEO config={seoConfigs.dashboard} />
      {/* 頁面內容 */}
    </>
  );
};
```

## 使用方法

### 使用預定義配置

```tsx
import { SEO } from '../components/SEO';
import { seoConfigs } from '../utils/seo';

export const Dashboard: React.FC = () => {
  return (
    <>
      <SEO config={seoConfigs.dashboard} />
      <div>Dashboard 內容</div>
    </>
  );
};
```

### 使用自定義配置

```tsx
import { SEO } from '../components/SEO';
import { createSEOConfig } from '../utils/seo';

export const CustomPage: React.FC = () => {
  const customSEO = createSEOConfig({
    title: '自定義頁面',
    description: '這是自定義頁面的描述',
    keywords: '自定義, 關鍵字',
    ogUrl: 'https://console.nx-playground.local/custom',
  });

  return (
    <>
      <SEO config={customSEO} />
      <div>自定義頁面內容</div>
    </>
  );
};
```

## 預定義配置

在 `utils/seo.ts` 中定義了以下預設配置：

- `seoConfigs.dashboard` - 儀表板頁面
- `seoConfigs.events` - 事件管理頁面
- `seoConfigs.users` - 用戶管理頁面
- `seoConfigs.settings` - 設置頁面

## SEO 配置選項

```tsx
interface SEOConfig {
  title?: string;           // 頁面標題
  description?: string;     // 頁面描述
  keywords?: string;        // 關鍵字
  author?: string;          // 作者
  ogTitle?: string;         // Open Graph 標題
  ogDescription?: string;   // Open Graph 描述
  ogImage?: string;         // Open Graph 圖片
  ogUrl?: string;           // Open Graph URL
  twitterCard?: string;     // Twitter Card 類型
  twitterSite?: string;     // Twitter 網站
  canonical?: string;       // 規範 URL
}
```

## 功能特色

- **自動生成 meta 標籤**：title, description, keywords
- **Open Graph 支援**：Facebook, LinkedIn 分享優化
- **Twitter Cards**：Twitter 分享優化
- **Canonical URLs**：避免重複內容
- **響應式設計**：支援移動設備
- **TypeScript 支援**：完整的類型定義

## 注意事項

1. 每個頁面只能使用一個 `SEO` 組件
2. 配置會自動合併到頁面的 `<head>` 中
3. 支援動態更新 meta 標籤
4. 與 React Router 完全相容 