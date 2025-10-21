# Phase B 部落格 - i18n 策略

**更新日期**: 2025-10-20
**核心需求**: 文檔需要多語系支援（中文 + 英文）

---

## 🌐 i18n 架構設計

### 方案對比

#### 方案 A：文檔目錄多語系 ⭐ 推薦

**結構**:

```
docs/
├── apps/
│   ├── zh-TW/
│   │   ├── PROFILE.md
│   │   ├── EVENT_CMS.md
│   │   ├── AUTH.md
│   │   └── ...
│   └── en/
│       ├── PROFILE.md
│       ├── EVENT_CMS.md
│       ├── AUTH.md
│       └── ...
└── libs/
    ├── zh-TW/
    │   ├── ENTERPRISE_DATA.md
    │   └── ANIMATION_DATA.md
    └── en/
        ├── ENTERPRISE_DATA.md
        └── ANIMATION_DATA.md
```

**優點**:

- ✅ 文檔完全獨立，易於維護
- ✅ 可以針對不同語系優化內容
- ✅ 翻譯工作清晰分離
- ✅ 支援未來添加更多語言

**缺點**:

- ❌ 需要維護兩份文檔
- ❌ 初期翻譯工作量大

---

#### 方案 B：單一文檔 + UI 多語系

**結構**:

```
docs/
├── apps/
│   ├── PROFILE.md          # 僅中文
│   ├── EVENT_CMS.md
│   └── ...
```

**優點**:

- ✅ 維護簡單
- ✅ 無需翻譯

**缺點**:

- ❌ 英文訪客看不懂內容
- ❌ SEO 不友善（僅單一語言）
- ❌ 不專業

---

#### 方案 C：混合方案

**結構**:

```
docs/
├── apps/
│   ├── zh-TW/              # 完整中文文檔
│   │   └── ...
│   └── en/                 # 僅摘要/精簡版
│       ├── PROFILE.md      # 簡短介紹
│       └── ...
```

**優點**:

- ✅ 平衡維護成本
- ✅ 英文版可以更精簡（適合快速瀏覽）

**缺點**:

- ❌ 內容不一致可能造成困惑

---

## 🎯 推薦：方案 A（完整多語系）

### 理由

1. **專業度** - 技術展示站台應該雙語完整
2. **SEO** - 中英文都能被搜尋到
3. **國際化** - 適合海外接案/求職
4. **可擴展** - 未來可添加日文等

---

## 📂 實作計劃

### Step 1: 重組文檔目錄結構

**執行**:

```bash
# 1. 重組 apps 文檔
mkdir -p docs/apps/zh-TW docs/apps/en
mv docs/apps/*.md docs/apps/zh-TW/
mv docs/apps/README.md docs/apps/  # README 保留在外層

# 2. 重組 libs 文檔
mkdir -p docs/libs/zh-TW docs/libs/en
mv docs/libs/*.md docs/libs/zh-TW/
mv docs/libs/README.md docs/libs/
```

**結果**:

```
docs/
├── apps/
│   ├── README.md           # 索引（雙語或單語）
│   ├── zh-TW/
│   │   ├── PROFILE.md
│   │   ├── EVENT_CMS.md
│   │   ├── EVENT_PORTAL.md
│   │   ├── AUTH.md
│   │   ├── ENTERPRISE_ADMIN.md
│   │   ├── VUE_MOTION.md
│   │   └── API_SERVER.md
│   └── en/
│       ├── PROFILE.md
│       ├── EVENT_CMS.md
│       ├── EVENT_PORTAL.md
│       ├── AUTH.md
│       ├── ENTERPRISE_ADMIN.md
│       ├── VUE_MOTION.md
│       └── API_SERVER.md
└── libs/
    ├── README.md
    ├── zh-TW/
    │   ├── ENTERPRISE_DATA.md
    │   └── ANIMATION_DATA.md
    └── en/
        ├── ENTERPRISE_DATA.md
        └── ANIMATION_DATA.md
```

---

### Step 2: 更新 loadDocs.ts

**支援 locale 參數**:

```typescript
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';
import readingTime from 'reading-time';

export interface BlogPost {
  slug: string;
  title: string;
  category: 'apps' | 'libs';
  tags: string[];
  date: string;
  excerpt: string;
  content: string;
  readingTime: string;
  lang: 'zh-TW' | 'en';
  published: boolean;
}

/**
 * 載入指定語言的所有文檔
 */
export function loadAllPosts(locale: 'zh-TW' | 'en' = 'zh-TW'): BlogPost[] {
  const appsDir = path.join(process.cwd(), `../../../../docs/apps/${locale}`);
  const libsDir = path.join(process.cwd(), `../../../../docs/libs/${locale}`);

  const appsPosts = loadPostsFromDir(appsDir, 'apps', locale);
  const libsPosts = loadPostsFromDir(libsDir, 'libs', locale);

  return [...appsPosts, ...libsPosts]
    .filter(post => post.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/**
 * 從目錄載入文檔
 */
function loadPostsFromDir(
  dir: string,
  category: 'apps' | 'libs',
  locale: 'zh-TW' | 'en'
): BlogPost[] {
  // 如果目錄不存在，返回空陣列
  if (!fs.existsSync(dir)) {
    console.warn(`Directory not found: ${dir}`);
    return [];
  }

  const files = fs.readdirSync(dir);

  return files
    .filter(file => file.endsWith('.md') && file !== 'README.md')
    .map(file => {
      const filePath = path.join(dir, file);
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const { data, content } = matter(fileContent);

      return {
        slug: data.slug || file.replace('.md', '').toLowerCase(),
        title: data.title || extractTitle(content),
        category,
        tags: data.tags || [],
        date: data.date || new Date().toISOString(),
        excerpt: data.excerpt || extractExcerpt(content),
        content: marked(content),
        readingTime: readingTime(content).text,
        lang: locale, // 使用參數指定的語言
        published: data.published !== false,
      };
    });
}

/**
 * 根據 slug 和 locale 載入單一文檔
 */
export function loadPostBySlug(
  slug: string,
  locale: 'zh-TW' | 'en' = 'zh-TW'
): BlogPost | null {
  const posts = loadAllPosts(locale);
  return posts.find(post => post.slug === slug) || null;
}

/**
 * 取得所有標籤
 */
export function getAllTags(locale: 'zh-TW' | 'en' = 'zh-TW'): string[] {
  const posts = loadAllPosts(locale);
  const tagsSet = new Set<string>();

  posts.forEach(post => {
    post.tags.forEach(tag => tagsSet.add(tag));
  });

  return Array.from(tagsSet).sort();
}

// Helper functions (unchanged)
function extractTitle(content: string): string {
  const match = content.match(/^#\s+(.+)$/m);
  return match ? match[1] : 'Untitled';
}

function extractExcerpt(content: string, length = 150): string {
  const plainText = content
    .replace(/^---[\s\S]*?---/, '')
    .replace(/#+ /g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .trim();

  return plainText.slice(0, length) + (plainText.length > length ? '...' : '');
}
```

---

### Step 3: 更新 Blog 頁面

**BlogListPage.tsx** - 使用當前 locale:

```typescript
import { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { BlogCard } from '../components/BlogCard';
import { TagFilter } from '../components/TagFilter';
import { SearchBar } from '../components/SearchBar';
import { loadAllPosts, getAllTags } from '../utils/loadDocs';
import { useBlogTranslation } from '../hooks/useBlogTranslation';
import { type SupportedLocale } from '../../../lib/i18n/LocaleRouter';

export function BlogListPage() {
  const { locale } = useParams<{ locale: string }>();
  const currentLocale = (locale || 'zh-TW') as SupportedLocale;

  const { t } = useBlogTranslation();
  const posts = loadAllPosts(currentLocale);
  const allTags = getAllTags(currentLocale);

  // ... rest of the component
}
```

**BlogPostPage.tsx** - 使用當前 locale:

```typescript
export function BlogPostPage() {
  const { slug, locale } = useParams<{ slug: string; locale: string }>();
  const currentLocale = (locale || 'zh-TW') as SupportedLocale;

  if (!slug) return <Navigate to={`/${currentLocale}/blog`} replace />;

  const post = loadPostBySlug(slug, currentLocale);

  if (!post) return <Navigate to={`/${currentLocale}/blog`} replace />;

  // ... rest of the component
}
```

---

### Step 4: Fallback 機制

**如果英文文檔不存在，回退到中文**:

```typescript
export function loadPostBySlug(
  slug: string,
  locale: 'zh-TW' | 'en' = 'zh-TW'
): BlogPost | null {
  // 先嘗試載入指定語言
  let posts = loadAllPosts(locale);
  let post = posts.find(p => p.slug === slug);

  // 如果找不到且不是預設語言，嘗試 fallback
  if (!post && locale !== 'zh-TW') {
    console.log(`Post "${slug}" not found in ${locale}, falling back to zh-TW`);
    posts = loadAllPosts('zh-TW');
    post = posts.find(p => p.slug === slug);

    // 添加提示訊息
    if (post) {
      post.lang = 'zh-TW'; // 標記實際語言
    }
  }

  return post || null;
}
```

---

### Step 5: 添加語言切換按鈕

**在文章頁面添加語言切換**:

```tsx
// components/LanguageToggle.tsx
import { useNavigate } from 'react-router-dom';
import { Button } from '@nx-playground/ui-components';
import { useLocalizedNavigation } from '../../../lib/i18n/useLocalizedNavigation';

interface LanguageToggleProps {
  currentSlug: string;
}

export function LanguageToggle({ currentSlug }: LanguageToggleProps) {
  const { locale, changeLanguage } = useLocalizedNavigation();

  const handleToggle = () => {
    const newLocale = locale === 'zh-TW' ? 'en' : 'zh-TW';
    changeLanguage(newLocale);
    // URL 會自動切換到 /:newLocale/blog/:slug
  };

  return (
    <Button variant='outline' size='sm' onClick={handleToggle}>
      {locale === 'zh-TW' ? 'EN' : '中文'}
    </Button>
  );
}
```

**在 BlogPostPage 使用**:

```tsx
<header className='mb-8 flex justify-between items-start'>
  <div>
    <h1 className='text-4xl font-bold text-foreground mb-4'>{post.title}</h1>
    {/* ... meta info ... */}
  </div>

  <LanguageToggle currentSlug={slug} />
</header>
```

---

## 📝 翻譯工作流程

### Phase 1: 建立英文模板

為每個文檔創建英文版本：

```markdown
---
title: 'Profile - React 19 Technical Showcase Platform'
slug: 'profile-react-portfolio'
category: 'apps'
tags: ['React 19', 'Vite', 'i18n', 'Cloudflare Pages']
date: '2025-10-20'
excerpt: 'Building a professional React showcase platform from scratch with multilingual routing and config-driven architecture'
author: 'NX Playground'
lang: 'en'
published: true
---

# Profile - Technical Showcase & Portfolio

> Professional technical showcase platform for freelancing and job applications

**Last Updated**: 2025-10-20

---

## 🎯 Project Overview

**Production-grade technical showcase platform**, providing complete user registration, login, and password recovery flows.

### Core Value

- 🔐 **Enterprise-grade Security** - Using Ory Kratos
- 🎨 **Brand Design** - Brick red theme
- 🌐 **Multi-SSO Support** - Google, Apple, LINE
- 📱 **Mobile Friendly** - Responsive design

...
```

---

### Phase 2: 漸進式翻譯

**優先順序**:

1. **高優先級** (立即翻譯):

   - PROFILE.md
   - EVENT_CMS.md
   - AUTH.md

2. **中優先級** (1 週內):

   - EVENT_PORTAL.md
   - ENTERPRISE_DATA.md

3. **低優先級** (視情況):
   - ENTERPRISE_ADMIN.md
   - VUE_MOTION.md
   - API_SERVER.md
   - ANIMATION_DATA.md

---

### Phase 3: 翻譯工具

**可使用 AI 輔助**:

```bash
# 使用 ChatGPT/Claude 批量翻譯
# 提供 prompt:
"""
Please translate the following technical documentation from Traditional Chinese to English.
Keep all markdown formatting, code blocks, and technical terms accurate.
Maintain a professional technical writing style.

[貼上中文文檔]
"""
```

**人工校對**:

- 技術術語確認
- 代碼範例檢查
- 格式一致性

---

## 🚀 實施步驟

### Day 1: 重組目錄結構

```bash
# 執行重組腳本
node scripts/reorganize-docs-i18n.js
```

### Day 2: 更新代碼

- ✅ 更新 `loadDocs.ts` 支援 locale
- ✅ 更新 `BlogListPage.tsx`
- ✅ 更新 `BlogPostPage.tsx`
- ✅ 添加 `LanguageToggle` 組件
- ✅ 實作 fallback 機制

### Day 3-5: 翻譯文檔

- ✅ 翻譯 3 個高優先級文檔
- ✅ 測試雙語切換
- ✅ 確保 SEO meta tags 正確

### Day 6-7: 測試與優化

- ✅ 測試所有路由
- ✅ 測試 fallback
- ✅ 測試語言切換
- ✅ SEO 驗證

---

## 📊 SEO 優化

### Meta Tags 多語系

```tsx
<Helmet>
  {/* 中文 */}
  <html lang='zh-TW' />
  <title>{post.title} | NX Playground</title>
  <meta name='description' content={post.excerpt} />

  {/* 英文替代 */}
  <link rel='alternate' hreflang='en' href={`/en/blog/${post.slug}`} />
  <link rel='alternate' hreflang='zh-TW' href={`/zh-TW/blog/${post.slug}`} />

  {/* Open Graph */}
  <meta property='og:locale' content={locale === 'zh-TW' ? 'zh_TW' : 'en_US'} />
  <meta
    property='og:locale:alternate'
    content={locale === 'zh-TW' ? 'en_US' : 'zh_TW'}
  />
</Helmet>
```

---

## ✅ 完成標準

- [ ] 文檔目錄已重組為 `zh-TW/` 和 `en/`
- [ ] `loadDocs.ts` 支援 locale 參數
- [ ] 所有頁面使用當前 locale 載入文檔
- [ ] Fallback 機制運作正常
- [ ] 至少 3 篇文檔有英文版本
- [ ] 語言切換按鈕正常運作
- [ ] SEO meta tags 包含 hreflang
- [ ] RSS feed 支援多語系（可選）

---

**預估增加時間**: +3-4 天（翻譯工作）
**總時間**: 1.5-2.5 週
