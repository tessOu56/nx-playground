# Blog Feature 实作进度报告

**开始日期**: 2025-10-20
**当前状态**: Phase 1 部分完成（30%）

---

## ✅ 已完成项目

### Phase A: 文档 i18n 重组

- ✅ 执行重组脚本
- ✅ 移动 9 个文档到 `zh-TW/`
- ✅ 创建 9 个英文模板
- ✅ 重组后结构验证

### Phase 1: Blog Feature 基础（30%完成）

#### ✅ 依赖安装

```bash
pnpm add gray-matter marked reading-time rss highlight.js
```

已安装：

- `gray-matter` - Front Matter 解析
- `marked` - Markdown 渲染
- `reading-time` - 阅读时间估算
- `rss` - RSS Feed 生成
- `highlight.js` - 语法高亮

#### ✅ 目录结构创建

```
apps/profile/src/features/blog/
├── components/     ✅ 已创建
├── pages/          ✅ 已创建
├── utils/          ✅ 已创建
├── hooks/          ✅ 已创建
├── locales/        ✅ 已创建
│   ├── en/        ✅ 已创建
│   └── zh-TW/     ✅ 已创建
├── types.ts        ✅ 已创建
└── (待创建文件)
```

#### ✅ 核心代码

**types.ts** ✅ 完成

- BlogPost interface
- BlogCategory type
- SupportedLocale type

**utils/loadDocs.ts** ✅ 完成

- 使用 Vite `import.meta.glob` 动态导入
- `loadAllPosts(locale)` - 载入所有文章
- `loadPostBySlug(slug, locale)` - 载入单篇文章（含 fallback）
- `getAllTags(locale)` - 获取所有标签
- `getPostsByCategory()` - 按分类筛选
- `getPostsByTag()` - 按标签筛选

---

## ⏳ 待完成项目

### Phase 1: Blog Feature 基础（剩余 70%）

#### 📝 i18n 翻译文件

**locales/zh-TW/blog.json**:

```json
{
  "blog": {
    "title": "技术博客",
    "subtitle": "Monorepo 实战与架构探索",
    "searchPlaceholder": "搜索文章...",
    "noResults": "没有找到相关文章",
    "readMore": "阅读更多",
    "allTags": "所有标签",
    "categories": {
      "apps": "应用程式",
      "libs": "共享函式库"
    }
  }
}
```

**locales/en/blog.json**:

```json
{
  "blog": {
    "title": "Technical Blog",
    "subtitle": "Monorepo in Practice & Architecture Exploration",
    "searchPlaceholder": "Search articles...",
    "noResults": "No articles found",
    "readMore": "Read more",
    "allTags": "All Tags",
    "categories": {
      "apps": "Applications",
      "libs": "Shared Libraries"
    }
  }
}
```

---

#### 🎨 UI 组件

需要创建的组件（8 个）：

1. **components/BlogCard.tsx** - 文章卡片
2. **components/SearchBar.tsx** - 搜索框
3. **components/TagFilter.tsx** - 标签筛选
4. **components/LanguageToggle.tsx** - 语言切换按钮
5. **components/TableOfContents.tsx** - 目录
6. **components/ShareButtons.tsx** - 分享按钮
7. **components/BlogPost.tsx** - 文章内容容器
8. **components/TagList.tsx** - 标签列表

---

#### 📄 页面组件

需要创建的页面（2 个）：

1. **pages/BlogListPage.tsx** - 文章列表页

   - 搜索功能
   - 标签筛选
   - 分类筛选
   - 使用当前 locale

2. **pages/BlogPostPage.tsx** - 文章详情页
   - Markdown 渲染
   - 目录（TOC）
   - 语言切换
   - Fallback 机制
   - 分享按钮

---

#### 🔗 路由整合

**更新 App.tsx**:

```tsx
import { BlogListPage } from './features/blog/pages/BlogListPage';
import { BlogPostPage } from './features/blog/pages/BlogPostPage';

// 在 Routes 中添加:
<Route path='/:locale/blog' element={<BlogListPage />} />
<Route path='/:locale/blog/:slug' element={<BlogPostPage />} />
```

**更新 Layout.tsx**:

```tsx
<Button onClick={() => navigate(getLocalizedPath('/blog'))}>
  {t('nav.blog')}
</Button>
```

**更新导航翻译**:

- `src/components/locales/en/layout.json` 添加 `"blog": "Blog"`
- `src/components/locales/zh-TW/layout.json` 添加 `"blog": "博客"`

---

### Phase 2: 为文档添加 Front Matter

#### 创建自动化脚本

**scripts/add-frontmatter-to-docs.js**:

```javascript
#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// 为所有 zh-TW 文档添加 Front Matter
const docsDir = path.join(__dirname, '..', 'docs');

function addFrontMatter(filePath, category) {
  const content = fs.readFileSync(filePath, 'utf-8');

  // 如果已有 front matter，跳过
  if (content.startsWith('---')) {
    console.log(`⏭️  ${filePath} already has front matter`);
    return;
  }

  // 提取标题
  const titleMatch = content.match(/^#\s+(.+)$/m);
  const title = titleMatch ? titleMatch[1] : 'Untitled';

  // 提取 slug（从文件名）
  const filename = path.basename(filePath, '.md');
  const slug = filename.toLowerCase().replace(/_/g, '-');

  // 生成 Front Matter
  const frontMatter = `---
title: '${title}'
slug: '${slug}'
category: '${category}'
tags: []
date: '2025-10-20'
excerpt: ''
author: 'NX Playground'
lang: 'zh-TW'
published: true
---

`;

  // 写回文件
  fs.writeFileSync(filePath, frontMatter + content);
  console.log(`✅ Added front matter to ${filename}`);
}

// 处理 apps
const appsDir = path.join(docsDir, 'apps', 'zh-TW');
if (fs.existsSync(appsDir)) {
  const files = fs.readdirSync(appsDir);
  files.forEach(file => {
    if (file.endsWith('.md') && file !== 'README.md') {
      addFrontMatter(path.join(appsDir, file), 'apps');
    }
  });
}

// 处理 libs
const libsDir = path.join(docsDir, 'libs', 'zh-TW');
if (fs.existsSync(libsDir)) {
  const files = fs.readdirSync(libsDir);
  files.forEach(file => {
    if (file.endsWith('.md') && file !== 'README.md') {
      addFrontMatter(path.join(libsDir, file), 'libs');
    }
  });
}
```

#### 执行脚本

```bash
node scripts/add-frontmatter-to-docs.js
```

---

### Phase 3: SEO 优化（未开始）

- RSS Feed 生成
- Sitemap 生成
- Meta tags 完整
- Open Graph 设置

---

### Phase 4: 测试与部署（未开始）

- 所有功能测试
- Build 测试
- Cloudflare Pages 部署

---

## 📊 完成度统计

| 阶段    | 任务              | 完成度 | 状态      |
| ------- | ----------------- | ------ | --------- |
| Phase A | 文档重组          | 100%   | ✅ 完成   |
| Phase 1 | Blog Feature 基础 | 30%    | 🔄 进行中 |
| Phase 2 | 添加 Front Matter | 0%     | ⏳ 待开始 |
| Phase 3 | SEO 优化          | 0%     | ⏳ 待开始 |
| Phase 4 | 测试部署          | 0%     | ⏳ 待开始 |

**总体完成度**: **20%**

---

## 🚀 下一步行动

### 立即可执行（优先级排序）

1. **创建 i18n 翻译文件** （5 分钟）

   - `locales/zh-TW/blog.json`
   - `locales/en/blog.json`
   - 更新导航翻译

2. **创建 UI 组件** （1-2 小时）

   - BlogCard
   - SearchBar
   - TagFilter
   - 其他 5 个组件

3. **创建页面组件** （2-3 小时）

   - BlogListPage
   - BlogPostPage

4. **路由整合** （30 分钟）

   - 更新 App.tsx
   - 更新 Layout.tsx

5. **添加 Front Matter** （10 分钟）
   - 创建脚本
   - 执行脚本
   - 验证结果

---

## ⚠️ 关键注意事项

### Vite import.meta.glob 配置

需要确保 Vite 配置允许导入 `/docs/**/*.md` 文件。

**vite.config.ts** 可能需要更新：

```typescript
export default defineConfig({
  // ... 其他配置
  assetsInclude: ['**/*.md'], // 确保 .md 文件被包含
});
```

### Async 处理

`loadDocs.ts` 的所有函数都是 async，使用时需要：

```tsx
const [posts, setPosts] = useState<BlogPost[]>([]);

useEffect(() => {
  loadAllPosts(locale).then(setPosts);
}, [locale]);
```

或使用 React Query / SWR 更优雅地处理。

---

## 📝 建议

### 选项 A: 继续当前会话

我可以继续完成剩余的组件和页面（可能需要多个回合）

### 选项 B: 分阶段执行

1. 你先手动添加 Front Matter 到几个文档测试
2. 下次会话我们继续完成组件和页面

### 选项 C: 提供完整代码模板

我创建所有组件和页面的完整代码，你一次性复制粘贴

---

**你想选择哪个选项？** 🤔

或者你需要我：

- 先创建 Front Matter 添加脚本？
- 先完成所有组件代码？
- 还是有其他想法？
