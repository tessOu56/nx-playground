# Phase B: Profile 部落格系統 - 修訂版（方案 A）

**規劃日期**: 2025-10-20
**方案**: A（純前端）
**內容來源**: 現有 docs/apps/ 和 docs/libs/ 文檔
**預估時間**: 1-2 週 ⚡

---

## 🎯 核心策略

**將現有技術文檔轉為部落格文章**

### 優勢

1. ✅ **內容已完成** - 16 篇文檔 = 16 篇文章
2. ✅ **質量保證** - 實際專案經驗，非空談
3. ✅ **SEO 價值高** - 每個技術點都可被搜尋
4. ✅ **維護簡單** - 文檔更新 = 部落格更新
5. ✅ **實作快速** - 1-2 週即可完成

### 內容來源

```
docs/
├── apps/
│   ├── PROFILE.md          → "Profile - React 19 技術展示平台實作"
│   ├── EVENT_CMS.md        → "Event CMS - 輕量級活動管理系統"
│   ├── EVENT_PORTAL.md     → "Event Portal - Next.js SSG + LINE LIFF 整合"
│   ├── AUTH.md             → "Auth - Ory Kratos 認證服務實作"
│   ├── ENTERPRISE_ADMIN.md → "Enterprise Admin - Angular 架構推演"
│   ├── VUE_MOTION.md       → "Vue Motion - GSAP 動畫 Sandbox"
│   └── API_SERVER.md       → "API Server - NestJS + Prisma 後端"
│
└── libs/
    ├── ENTERPRISE_DATA.md  → "Enterprise Data - Angular 資料處理架構"
    └── ANIMATION_DATA.md   → "Animation Data - Vue 動畫數據管理"
```

**總計**: 9 篇 apps 文章 + 2 篇 libs 專文 = **11 篇核心文章**

（libs/README.md 可拆分為各個 lib 的短文，增加到 16+ 篇）

---

## 📂 專案結構

```
apps/profile/src/
├── features/blog/
│   ├── components/
│   │   ├── BlogCard.tsx           # 文章卡片
│   │   ├── BlogPost.tsx           # 文章容器
│   │   ├── MarkdownRenderer.tsx   # Markdown 渲染
│   │   ├── TableOfContents.tsx    # 目錄
│   │   ├── CodeBlock.tsx          # 程式碼
│   │   ├── TagList.tsx            # 標籤列表
│   │   └── ShareButtons.tsx       # 分享
│   ├── pages/
│   │   ├── BlogListPage.tsx       # 列表頁
│   │   └── BlogPostPage.tsx       # 詳情頁
│   ├── utils/
│   │   ├── loadDocs.ts            # ⭐ 載入 docs/ 文檔
│   │   ├── parseFrontMatter.ts    # Front matter 解析
│   │   ├── generateMetadata.ts    # 自動生成 metadata
│   │   ├── generateRss.ts         # RSS 生成
│   │   └── readingTime.ts         # 閱讀時間
│   ├── hooks/
│   │   └── useBlogTranslation.ts
│   ├── locales/
│   │   ├── en/blog.json
│   │   └── zh-TW/blog.json
│   ├── types.ts
│   ├── i18n.ts
│   └── index.ts
│
└── data/                          # ⭐ 軟連結到 docs/
    └── docs/ -> ../../../../docs/
```

**關鍵設計**：直接讀取 `docs/` 文檔，無需複製

---

## 🛠️ 技術實作

### Week 1: 基礎架構 (5 天)

#### Day 1: 文檔 Front Matter 添加

為每個文檔添加 Front Matter：

**範例：docs/apps/PROFILE.md**

```markdown
---
title: 'Profile - React 19 技術展示平台實作'
slug: 'profile-react-portfolio'
category: 'apps'
tags: ['React 19', 'Vite', 'i18n', 'Cloudflare Pages']
date: '2025-10-20'
excerpt: '從零打造專業的 React 技術展示平台，整合多語系路由和配置驅動架構'
author: 'NX Playground'
lang: 'zh-TW'
published: true
---

# Profile - 技術展示與 Portfolio

> 專業的技術展示平台，用於接案和求職
> ...
```

**自動化腳本**:

```typescript
// scripts/add-frontmatter.ts
import fs from 'fs';
import path from 'path';

const docsDir = 'docs/apps';
const files = fs.readdirSync(docsDir);

files.forEach(file => {
  if (!file.endsWith('.md') || file === 'README.md') return;

  const content = fs.readFileSync(path.join(docsDir, file), 'utf-8');

  // 如果已有 front matter，跳過
  if (content.startsWith('---')) return;

  // 生成 front matter
  const frontMatter = generateFrontMatter(file, content);
  const newContent = `---\n${frontMatter}\n---\n\n${content}`;

  fs.writeFileSync(path.join(docsDir, file), newContent);
});
```

---

#### Day 2-3: 文檔載入系統

**utils/loadDocs.ts**:

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
 * 載入所有文檔
 */
export function loadAllPosts(): BlogPost[] {
  const appsDir = path.join(process.cwd(), '../../../../docs/apps');
  const libsDir = path.join(process.cwd(), '../../../../docs/libs');

  const appsPosts = loadPostsFromDir(appsDir, 'apps');
  const libsPosts = loadPostsFromDir(libsDir, 'libs');

  return [...appsPosts, ...libsPosts]
    .filter(post => post.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/**
 * 從目錄載入文檔
 */
function loadPostsFromDir(dir: string, category: 'apps' | 'libs'): BlogPost[] {
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
        lang: data.lang || 'zh-TW',
        published: data.published !== false,
      };
    });
}

/**
 * 根據 slug 載入單一文檔
 */
export function loadPostBySlug(slug: string): BlogPost | null {
  const posts = loadAllPosts();
  return posts.find(post => post.slug === slug) || null;
}

/**
 * 取得所有標籤
 */
export function getAllTags(): string[] {
  const posts = loadAllPosts();
  const tagsSet = new Set<string>();

  posts.forEach(post => {
    post.tags.forEach(tag => tagsSet.add(tag));
  });

  return Array.from(tagsSet).sort();
}

// Helper functions
function extractTitle(content: string): string {
  const match = content.match(/^#\s+(.+)$/m);
  return match ? match[1] : 'Untitled';
}

function extractExcerpt(content: string, length = 150): string {
  const plainText = content
    .replace(/^---[\s\S]*?---/, '') // Remove frontmatter
    .replace(/#+ /g, '') // Remove headers
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove links
    .replace(/`([^`]+)`/g, '$1') // Remove code
    .trim();

  return plainText.slice(0, length) + (plainText.length > length ? '...' : '');
}
```

---

#### Day 4: Blog 頁面實作

**pages/BlogListPage.tsx**:

```tsx
import { useState, useMemo } from 'react';
import { BlogCard } from '../components/BlogCard';
import { TagFilter } from '../components/TagFilter';
import { SearchBar } from '../components/SearchBar';
import { loadAllPosts, getAllTags } from '../utils/loadDocs';
import { useBlogTranslation } from '../hooks/useBlogTranslation';

export function BlogListPage() {
  const { t } = useBlogTranslation();
  const posts = loadAllPosts();
  const allTags = getAllTags();

  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      // 標籤篩選
      if (selectedTag && !post.tags.includes(selectedTag)) return false;

      // 搜尋篩選
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          post.title.toLowerCase().includes(query) ||
          post.excerpt.toLowerCase().includes(query) ||
          post.tags.some(tag => tag.toLowerCase().includes(query))
        );
      }

      return true;
    });
  }, [posts, selectedTag, searchQuery]);

  return (
    <div className='container mx-auto px-4 py-8'>
      <header className='mb-12 text-center'>
        <h1 className='text-4xl font-bold text-foreground mb-4'>
          {t('blog.title')}
        </h1>
        <p className='text-lg text-muted-foreground'>{t('blog.subtitle')}</p>
      </header>

      <div className='mb-8 space-y-4'>
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder={t('blog.searchPlaceholder')}
        />

        <TagFilter
          tags={allTags}
          selectedTag={selectedTag}
          onSelectTag={setSelectedTag}
        />
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {filteredPosts.map(post => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <div className='text-center py-12'>
          <p className='text-muted-foreground'>{t('blog.noResults')}</p>
        </div>
      )}
    </div>
  );
}
```

**pages/BlogPostPage.tsx**:

```tsx
import { useParams, Navigate } from 'react-router-dom';
import { loadPostBySlug } from '../utils/loadDocs';
import { BlogPost } from '../components/BlogPost';
import { TableOfContents } from '../components/TableOfContents';
import { ShareButtons } from '../components/ShareButtons';
import { TagList } from '../components/TagList';

export function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();

  if (!slug) return <Navigate to='/blog' replace />;

  const post = loadPostBySlug(slug);

  if (!post) return <Navigate to='/blog' replace />;

  return (
    <div className='container mx-auto px-4 py-8'>
      <article className='max-w-4xl mx-auto'>
        <header className='mb-8'>
          <h1 className='text-4xl font-bold text-foreground mb-4'>
            {post.title}
          </h1>

          <div className='flex items-center gap-4 text-sm text-muted-foreground mb-4'>
            <time>{new Date(post.date).toLocaleDateString('zh-TW')}</time>
            <span>•</span>
            <span>{post.readingTime}</span>
            <span>•</span>
            <span className='capitalize'>{post.category}</span>
          </div>

          <TagList tags={post.tags} />
        </header>

        <div className='grid grid-cols-1 lg:grid-cols-4 gap-8'>
          <aside className='lg:col-span-1'>
            <div className='sticky top-4'>
              <TableOfContents content={post.content} />
            </div>
          </aside>

          <div className='lg:col-span-3'>
            <BlogPost content={post.content} />

            <footer className='mt-12 pt-8 border-t border-border'>
              <ShareButtons title={post.title} url={window.location.href} />
            </footer>
          </div>
        </div>
      </article>
    </div>
  );
}
```

---

#### Day 5: 路由整合

**更新 App.tsx**:

```tsx
import { Route, Routes } from 'react-router-dom';
import { LocaleRouter } from './lib/i18n/LocaleRouter';
import { HomePage } from './features/home/pages/HomePage';
import { AppsPage } from './features/apps/pages/AppsPage';
import { LibsPage } from './features/libs/pages/LibsPage';
import { BlogListPage } from './features/blog/pages/BlogListPage'; // 新增
import { BlogPostPage } from './features/blog/pages/BlogPostPage'; // 新增

export function App() {
  return (
    <Routes>
      <Route
        path='/:locale/*'
        element={
          <LocaleRouter>
            <Layout>
              <Routes>
                <Route path='/' element={<HomePage />} />
                <Route path='/apps' element={<AppsPage />} />
                <Route path='/apps/:appId' element={<AppDetailPage />} />
                <Route path='/libs' element={<LibsPage />} />
                <Route path='/blog' element={<BlogListPage />} /> {/* 新增 */}
                <Route path='/blog/:slug' element={<BlogPostPage />} /> {/* 新增 */}
              </Routes>
            </Layout>
          </LocaleRouter>
        }
      />
    </Routes>
  );
}
```

**更新 Layout 導航**:

```tsx
<nav>
  <Button onClick={() => navigate(getLocalizedPath('/'))}>
    {t('nav.home')}
  </Button>
  <Button onClick={() => navigate(getLocalizedPath('/apps'))}>
    {t('nav.apps')}
  </Button>
  <Button onClick={() => navigate(getLocalizedPath('/libs'))}>
    {t('nav.libs')}
  </Button>
  <Button onClick={() => navigate(getLocalizedPath('/blog'))}>
    {' '}
    {/* 新增 */}
    {t('nav.blog')}
  </Button>
</nav>
```

---

### Week 2: SEO 與優化 (5 天)

#### Day 1: SEO Meta Tags

為每篇文章添加完整的 meta tags。

#### Day 2: RSS Feed

自動生成 RSS feed，包含所有文章。

#### Day 3: Sitemap

生成 sitemap.xml。

#### Day 4: 語法高亮優化

確保所有程式碼區塊正確高亮。

#### Day 5: 測試與部署

全面測試，準備部署。

---

## 📝 待辦清單

### Phase 1: 準備文檔 (1 天)

- [ ] 為所有 docs/apps/\*.md 添加 Front Matter
- [ ] 為所有 docs/libs/\*.md 添加 Front Matter
- [ ] 補充缺少的 libs 文檔（7 個 libs）
- [ ] 統一標籤分類（React, Next.js, Angular, Vue, Design System 等）

### Phase 2: Blog Feature (3 天)

- [ ] 創建 features/blog/ 結構
- [ ] 實作 loadDocs.ts（文檔載入）
- [ ] 實作 BlogListPage（列表頁）
- [ ] 實作 BlogPostPage（詳情頁）
- [ ] 實作 BlogCard 組件
- [ ] 實作 TagFilter 組件
- [ ] 實作 SearchBar 組件

### Phase 3: SEO & 優化 (2 天)

- [ ] RSS Feed 生成
- [ ] Sitemap 生成
- [ ] Meta tags 完整
- [ ] Open Graph 設定
- [ ] 語法高亮（highlight.js）
- [ ] 閱讀進度條

### Phase 4: 部署 (1 天)

- [ ] Cloudflare Pages 部署
- [ ] \_redirects 設定
- [ ] 測試所有路由
- [ ] Google Search Console 提交

---

## 🎨 UI 設計

### 列表頁

```
┌─────────────────────────────────────┐
│         Technical Blog              │
│   Monorepo 實戰與架構探索           │
│                                     │
│  🔍 [Search...        ]             │
│  🏷️  All | React | Next.js | ...   │
│                                     │
│  ┌─────┐  ┌─────┐  ┌─────┐        │
│  │Card │  │Card │  │Card │        │
│  │     │  │     │  │     │        │
│  └─────┘  └─────┘  └─────┘        │
└─────────────────────────────────────┘
```

### 詳情頁

```
┌─────────────────────────────────────┐
│  Profile - React 19 技術展示平台    │
│  2025-10-20 • 5 min read • apps     │
│  🏷️ React 19  Vite  i18n           │
│                                     │
│  ┌─────┐  ┌──────────────────────┐ │
│  │ TOC │  │  Article Content     │ │
│  │     │  │                      │ │
│  │  1. │  │  ## 核心功能         │ │
│  │  2. │  │  ...                 │ │
│  └─────┘  └──────────────────────┘ │
│                                     │
│  Share: Twitter | LinkedIn         │
└─────────────────────────────────────┘
```

---

## ⚡ 快速開始

```bash
# 1. 安裝依賴
pnpm add gray-matter marked reading-time rss highlight.js

# 2. 創建 blog feature
mkdir -p apps/profile/src/features/blog/{components,pages,utils,hooks,locales/{en,zh-TW}}

# 3. 添加 Front Matter 到文檔
node scripts/add-frontmatter.ts

# 4. 實作載入邏輯
# 創建 utils/loadDocs.ts

# 5. 實作頁面
# 創建 pages/BlogListPage.tsx 和 BlogPostPage.tsx

# 6. 測試
pnpm dev:profile
```

---

## 📊 預期成果

### 內容

- ✅ **11+ 篇技術文章**（apps + libs）
- ✅ **所有文章都是實戰經驗**
- ✅ **標籤豐富**（React, Next.js, Angular, Vue, NestJS 等）
- ✅ **SEO 友善**（每篇都是獨立頁面）

### 技術展示

- ✅ MDX/Markdown 處理
- ✅ 語法高亮
- ✅ RSS Feed
- ✅ SEO 優化
- ✅ 檔案系統操作

### 商業價值

- ✅ 技術文章 SEO 流量
- ✅ 展示實戰經驗
- ✅ 專業形象建立
- ✅ 接案/求職材料

---

**預估完成時間**: 1-2 週 🚀
**難度**: ⭐⭐ (中等)
**投資回報率**: ⭐⭐⭐⭐⭐ (極高)
