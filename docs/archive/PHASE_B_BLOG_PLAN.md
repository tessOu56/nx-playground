# Phase B: Profile 部落格系統 - 詳細計劃

**規劃日期**: 2025-10-20
**預估時間**: 2-4 週（視方案而定）
**目標**: 展示 MDX, remark/rehype, 語法高亮, RSS, SEO 技術

---

## 🎯 專案目標

將 `apps/profile` 從靜態展示升級為動態技術部落格，用於：

1. **技術寫作展示** - 展示寫作和表達能力
2. **SEO 流量** - 透過技術文章吸引流量
3. **個人品牌** - 建立技術專家形象
4. **接案管道** - 被動式行銷
5. **技術能力證明** - MDX, SSG, SEO 等技術實作

---

## 📊 方案對比

### 方案 A：純前端方案 ⭐ 推薦

**架構**:

```
apps/profile/src/
└── features/blog/
    ├── data/posts/          # MDX 文章（Git 管理）
    │   ├── 2025-10-react-19.mdx
    │   ├── 2025-10-nx-monorepo.mdx
    │   └── index.ts
    ├── components/
    ├── pages/
    ├── utils/
    └── ...
```

**技術棧**:

- `@mdx-js/mdx` - MDX 支援
- `remark-gfm` - GitHub Flavored Markdown
- `rehype-highlight` - 語法高亮
- `rehype-slug` - 標題 ID
- `gray-matter` - Front matter
- `reading-time` - 閱讀時間

**特點**:

- ✅ 文章以 MDX 檔案形式存放
- ✅ Build time 生成所有頁面
- ✅ Cloudflare Pages 部署（免費）
- ✅ 極快載入速度（SSG）
- ✅ SEO 友善
- ❌ 更新文章需要 rebuild
- ❌ 無動態功能（評論、統計）

**時間**: 2-3 週

---

### 方案 B：Cloudflare Workers + D1

**架構**:

```
apps/profile/          # React 前端
libs/blog-api/         # Cloudflare Workers
  └── src/
      ├── handlers/    # API handlers
      ├── db/          # D1 schema
      └── index.ts

Database: Cloudflare D1 (SQLite)
Storage: Cloudflare R2 (圖片)
```

**技術棧**:

- **前端**: React + MDX renderer
- **後端**: Cloudflare Workers (Serverless)
- **資料庫**: Cloudflare D1 (SQLite)
- **儲存**: Cloudflare R2 (圖片/附件)

**特點**:

- ✅ 動態更新（無需 rebuild）
- ✅ 可添加評論、點讚、瀏覽數
- ✅ 全在 Cloudflare 生態（免費額度大）
- ✅ 展示全端能力
- ✅ 未來可擴展 CMS
- ❌ 開發複雜度較高
- ❌ 需要設定 D1 database

**時間**: 3-4 週

---

### 方案 C：NestJS API Server

**架構**:

```
apps/profile/          # React 前端
apps/api-server/       # NestJS 後端（已存在）
  └── modules/
      └── blog/        # 新增 blog module
```

**技術棧**:

- **前端**: React + MDX renderer
- **後端**: NestJS + Prisma
- **資料庫**: SQLite / PostgreSQL

**特點**:

- ✅ 完整後端控制
- ✅ 資料庫管理容易
- ✅ 可添加完整 CMS
- ✅ 整合現有 API Server
- ❌ 需要部署後端（成本）
- ❌ 開發時間最長

**時間**: 4 週+

---

## 🎯 推薦：方案 A（純前端）

**理由**:

1. **快速上線** - 2-3 週可完成 MVP
2. **零成本** - Cloudflare Pages 免費
3. **技術展示充分** - MDX, remark/rehype, SEO 都有
4. **符合需求** - 你的目標是展示技術，不是做 CMS
5. **可漸進升級** - 未來需要時再加後端

---

## 📋 方案 A 詳細規劃

### Week 1: MDX 基礎架構

#### Day 1-2: 設置 MDX

**安裝依賴**:

```bash
pnpm add @mdx-js/mdx @mdx-js/react remark-gfm rehype-highlight rehype-slug rehype-autolink-headings gray-matter reading-time
```

**配置 Vite**:

```typescript
// vite.config.ts
import mdx from '@mdx-js/rollup';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';

export default defineConfig({
  plugins: [
    mdx({
      remarkPlugins: [remarkGfm],
      rehypePlugins: [rehypeHighlight, rehypeSlug],
    }),
    react(),
  ],
});
```

---

#### Day 3-4: Blog Feature 結構

創建：

```
features/blog/
├── components/
│   ├── BlogCard.tsx          # 文章卡片
│   ├── BlogPost.tsx          # 文章內容容器
│   ├── MarkdownRenderer.tsx  # MDX 渲染
│   ├── TableOfContents.tsx   # 目錄
│   ├── CodeBlock.tsx         # 程式碼區塊
│   └── ShareButtons.tsx      # 分享按鈕
├── pages/
│   ├── BlogListPage.tsx      # 文章列表
│   └── BlogPostPage.tsx      # 文章詳情
├── data/
│   └── posts/                # MDX 文章
│       ├── 2025-10-react-19.mdx
│       └── index.ts          # 文章 metadata
├── utils/
│   ├── markdown.ts           # MDX 處理
│   ├── readingTime.ts        # 閱讀時間
│   └── generateRss.ts        # RSS 生成
├── hooks/
│   └── useBlogTranslation.ts
├── locales/
│   ├── en/blog.json
│   └── zh-TW/blog.json
├── types.ts
├── i18n.ts
└── index.ts
```

---

#### Day 5: 文章資料結構

**Front Matter 格式**:

```yaml
---
title: 'React 19 新特性深度解析'
slug: 'react-19-features'
date: '2025-10-15'
updated: '2025-10-20'
tags: ['React', 'Frontend', 'JavaScript']
excerpt: '深入探討 React 19 帶來的革命性新特性'
lang: 'zh-TW'
published: true
---
# React 19 新特性深度解析

文章內容...
```

**Type 定義**:

```typescript
export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  updated?: string;
  tags: string[];
  excerpt: string;
  lang: 'zh-TW' | 'en';
  published: boolean;
  readingTime: string;
  content: React.ComponentType;
}
```

---

### Week 2: 內容功能

#### Day 1-2: 文章列表頁

**功能**:

- 顯示所有已發布文章
- 依日期排序
- 標籤篩選
- 搜尋功能（客戶端）
- 分頁（如果文章多）

**UI**:

```tsx
<BlogListPage>
  <SearchBar />
  <TagFilter tags={allTags} />
  <BlogGrid>
    {posts.map(post => (
      <BlogCard post={post} />
    ))}
  </BlogGrid>
  <Pagination />
</BlogListPage>
```

---

#### Day 3-4: 文章詳情頁

**功能**:

- MDX 渲染
- 語法高亮（支援多種語言）
- 自動生成目錄（TOC）
- 閱讀進度條
- 程式碼複製按鈕
- 分享按鈕

**UI**:

```tsx
<BlogPostPage>
  <BlogHeader>
    <h1>{post.title}</h1>
    <PostMeta date={post.date} readingTime={post.readingTime} />
    <TagList tags={post.tags} />
  </BlogHeader>

  <BlogContent>
    <TableOfContents headings={headings} />
    <ArticleContent>{/* MDX 渲染內容 */}</ArticleContent>
  </BlogContent>

  <BlogFooter>
    <ShareButtons />
    <RelatedPosts />
  </BlogFooter>
</BlogPostPage>
```

---

#### Day 5: 標籤系統

**功能**:

- 自動從文章提取標籤
- 標籤頁面（/:locale/blog/tags/:tag）
- 標籤雲視覺化

---

### Week 3: SEO 與優化

#### Day 1-2: SEO 優化

**Meta Tags**:

```tsx
// 每個文章頁面
<Helmet>
  <title>{post.title} | NX Playground</title>
  <meta name='description' content={post.excerpt} />
  <meta name='keywords' content={post.tags.join(', ')} />

  {/* Open Graph */}
  <meta property='og:type' content='article' />
  <meta property='og:title' content={post.title} />
  <meta property='og:description' content={post.excerpt} />
  <meta property='og:url' content={postUrl} />
  <meta property='og:image' content={coverImage} />

  {/* Twitter Card */}
  <meta name='twitter:card' content='summary_large_image' />
  <meta name='twitter:title' content={post.title} />
  <meta name='twitter:description' content={post.excerpt} />

  {/* Article specific */}
  <meta property='article:published_time' content={post.date} />
  <meta property='article:author' content='NX Playground' />
  {post.tags.map(tag => (
    <meta property='article:tag' content={tag} />
  ))}
</Helmet>
```

---

#### Day 3: RSS Feed 生成

**功能**:

- 自動生成 RSS feed
- `/blog/rss.xml`
- 包含最新 20 篇文章

**實現**:

```typescript
// utils/generateRss.ts
import RSS from 'rss';

export function generateRssFeed(posts: BlogPost[]) {
  const feed = new RSS({
    title: 'NX Playground Blog',
    description: 'Technical articles about modern web development',
    feed_url: 'https://profile.nx-playground.com/blog/rss.xml',
    site_url: 'https://profile.nx-playground.com',
    language: 'zh-TW',
  });

  posts.slice(0, 20).forEach(post => {
    feed.item({
      title: post.title,
      description: post.excerpt,
      url: `https://profile.nx-playground.com/blog/${post.slug}`,
      date: post.date,
      categories: post.tags,
    });
  });

  return feed.xml();
}
```

---

#### Day 4: Sitemap 更新

**功能**:

- 自動生成 sitemap.xml
- 包含所有文章頁面
- 提交給 Google Search Console

---

#### Day 5: 性能優化

**優化項目**:

- Code splitting（每篇文章獨立 chunk）
- 圖片懶加載
- 語法高亮 CSS 按需加載
- 預加載相關文章

---

### Week 4: 內容與上線（可選）

#### Day 1-3: 撰寫文章

**建議主題**:

1. "NX Monorepo 實戰：從 0 到生產環境"
2. "React 19 新特性：我在專案中的實際應用"
3. "Design System 架構：Style Dictionary + Radix UI"
4. "Cloudflare Pages 部署指南：完整 CI/CD"
5. "多語系實現：i18next vs next-intl 對比"

每篇 1500-3000 字，包含：

- 實際代碼範例
- 架構圖
- 踩坑經驗
- 最佳實踐

---

#### Day 4-5: 部署與測試

**Cloudflare Pages 配置**:

```yaml
# wrangler.toml (更新)
name = "nx-playground-profile"

[build]
command = "pnpm build:profile"
publish = "dist/apps/profile"

[[redirects]]
from = "/blog/*"
to = "/index.html"
status = 200
```

**測試檢查**:

- ✅ 所有文章正常渲染
- ✅ 語法高亮正常
- ✅ RSS feed 正常
- ✅ SEO meta tags 正確
- ✅ 多語系切換正常
- ✅ 移動端響應式

---

## 📦 依賴清單

```json
{
  "dependencies": {
    "@mdx-js/mdx": "^3.0.0",
    "@mdx-js/react": "^3.0.0",
    "gray-matter": "^4.0.3",
    "reading-time": "^1.5.0",
    "rss": "^1.2.2"
  },
  "devDependencies": {
    "@mdx-js/rollup": "^3.0.0",
    "rehype-autolink-headings": "^7.1.0",
    "rehype-highlight": "^7.0.0",
    "rehype-slug": "^6.0.0",
    "remark-gfm": "^4.0.0",
    "highlight.js": "^11.9.0"
  }
}
```

---

## 🎨 設計參考

**配色**:

- 沿用 Profile 的紫色主題
- 程式碼區塊：GitHub Dark 或 Nord 主題

**排版**:

- 字體：系統字體 + 等寬字體
- 行距：1.7-1.8
- 最大寬度：800px（內容區）
- 卡片式設計（與 Profile 一致）

---

## 📊 成功標準

### 功能完整度

- [ ] MDX 支援完整
- [ ] 至少 3 篇技術文章
- [ ] 語法高亮正常（10+ 語言）
- [ ] RSS Feed 運作
- [ ] SEO meta tags 完整
- [ ] 多語系支援
- [ ] 移動端友善

### 性能指標

- Lighthouse Score > 90
- First Contentful Paint < 1s
- Time to Interactive < 2s

### SEO

- Google Search Console 提交
- Sitemap 生成
- Open Graph 正確

---

## 🚀 快速開始指令

```bash
# 1. 安裝依賴
pnpm add @mdx-js/mdx @mdx-js/react remark-gfm rehype-highlight rehype-slug rehype-autolink-headings gray-matter reading-time rss

# 2. 創建 blog feature
mkdir -p apps/profile/src/features/blog/{components,pages,data/posts,utils,hooks,locales/{en,zh-TW}}

# 3. 配置 Vite (手動編輯 vite.config.ts)

# 4. 創建第一篇文章
touch apps/profile/src/features/blog/data/posts/2025-10-hello-world.mdx

# 5. 開發
pnpm dev:profile
```

---

## ❓ 需要決定

1. **確認方案**：方案 A（純前端）OK？
2. **時間規劃**：是否現在開始？
3. **文章主題**：有想寫的特定主題嗎？
4. **設計偏好**：沿用 Profile 設計？或有其他想法？

準備好開始了嗎？ 🚀
