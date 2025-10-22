# Home Page Redesign - Progress Report

## ✅ Completed (Phase 1-3)

### Routing & Infrastructure

- ✅ Complete routing system (`/search`, `/blogs`, `/blogs/:slug`, 404)
- ✅ Locale fallback protection
- ✅ NotFoundPage with navigation options

### Blog Feature (COMPLETE)

- ✅ Blog data types (`BlogPost`, `BlogMetadata`)
- ✅ Blog loader from `specs/blogs/` with i18n
- ✅ BlogCard component (distinct from ProjectCard)
- ✅ BlogListPage with year/tag filtering
- ✅ BlogPostPage with markdown rendering
- ✅ 2 sample blog posts (2025, 2024)

### Search Feature (COMPLETE)

- ✅ ChatGPT-style search page UI
- ✅ Chat components (ChatMessage, MessageInput, ExampleQueries, InfoBanner)
- ✅ AI conversation interface (UI shell only)
- ✅ ARIA accessibility labels

## 📝 Commits Made

```
c3dc47a feat(profile): create BlogPostPage with markdown rendering
8a2b513 feat(profile): complete BlogListPage with year/tag filtering
c5a6685 feat(profile): create BlogCard component
df2da15 feat(profile): implement blog loader and sample content
6ea1a2b feat(profile): add search page and complete routing structure
```

## ⏳ Remaining Tasks (Phase 4-6)

### 1. Header Search Input

**File**: `apps/profile/src/components/layout/Layout.tsx`

- Replace search icon with input field
- OnEnter → navigate to `/search?q=...`
- Placeholder: "Ask AI about..."

### 2. Hero Section Updates

**File**: `apps/profile/src/features/home/components/HeroSection.tsx` or create new

**Tasks**:

- Add lorem-picsum background with CSS filter

  ```tsx
  <div className='relative'>
    <div className='absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-600' />
    <img
      src='https://picsum.photos/1920/1080'
      loading='lazy'
      decode='async'
      className='absolute inset-0 w-full h-full object-cover -z-10 opacity-30'
    />
    <div className='absolute inset-0 bg-black/30' />
  </div>
  ```

- Smooth scroll to contact

  ```tsx
  const scrollToContact = () => {
    document.getElementById('contact-section')?.scrollIntoView({
      behavior: 'smooth',
    });
  };
  ```

- Navigate to search
  ```tsx
  onClick={() => navigate(getLocalizedPath('/search'))}
  ```

### 3. Tech Timeline Component

**File**: `apps/profile/src/features/home/components/TechTimeline.tsx`

**Data Source**: Blog front matter (single source of truth)

```typescript
export async function getTechTimeline(locale: SupportedLocale) {
  const blogs = await loadAllBlogs(locale);

  return blogs
    .filter(blog => blog.year && blog.techStack)
    .sort((a, b) => b.year! - a.year!) // 2025 → 2019
    .map(blog => ({
      year: blog.year!,
      tech: blog.techStack!,
      milestone: blog.excerpt,
      blogSlug: blog.slug,
    }));
}
```

**UI**:

- Horizontal timeline (newest first: 2025 → 2019)
- Year markers with tech badges
- Click year → navigate to blog
- Keyboard navigation (arrow keys)
- ARIA labels

### 4. Contact Section Simplification

**File**: `apps/profile/src/features/home/components/ContactSection.tsx`

**Requirements**:

- Half-screen height (`min-h-[50vh]`)
- Email form only
- Minimal, clean design
- Add `id="contact-section"` for smooth scroll
- ARIA labels for form fields

### 5. Footer Redesign

**File**: `apps/profile/src/components/layout/Footer.tsx`

**Keep**:

- GitHub link
- Copyright © 2025

**Remove**:

- All other links (Projects, Tech Stack, Contact, etc.)

### 6. i18n Updates

**New Files Needed**:

`apps/profile/src/locales/en/search.json`:

```json
{
  "title": "AI Search",
  "placeholder": "Ask me anything about my projects, tech, or experience...",
  "thinking": "Thinking...",
  "exampleQueries": {
    "projects": "What projects have you built with React?",
    "monorepo": "Tell me about your monorepo architecture",
    "tech": "What technologies do you use?",
    "blog": "Show me your latest blog posts",
    "nx": "What experience do you have with Nx?"
  },
  "info": {
    "title": "AI-Powered Knowledge Assistant",
    "description": "This AI assistant is powered by knowledge of all my projects, blog posts, and tech stack."
  }
}
```

`apps/profile/src/locales/zh-TW/search.json`:

```json
{
  "title": "AI 搜尋",
  "placeholder": "詢問我關於專案、技術或經驗的任何問題...",
  "thinking": "思考中...",
  "exampleQueries": {
    "projects": "你用 React 建立了哪些專案？",
    "monorepo": "告訴我關於你的 monorepo 架構",
    "tech": "你使用哪些技術？",
    "blog": "顯示你最新的部落格文章",
    "nx": "你在 Nx 方面有什麼經驗？"
  },
  "info": {
    "title": "AI 知識助理",
    "description": "此 AI 助理由我所有專案、部落格文章和技術棧的知識驅動。"
  }
}
```

Update `apps/profile/src/locales/en/blogs.json`:

```json
{
  "title": "Blog",
  "subtitle": "Annual tech journey and reflections",
  "searchPlaceholder": "Search blogs...",
  "noResults": "No blogs found",
  "backToBlogs": "Back to Blogs",
  "moreFrom": "More from",
  "readingTime": "min read"
}
```

Update `apps/profile/src/locales/zh-TW/blogs.json`:

```json
{
  "title": "部落格",
  "subtitle": "每年的技術旅程與反思",
  "searchPlaceholder": "搜尋部落格...",
  "noResults": "找不到部落格",
  "backToBlogs": "返回部落格",
  "moreFrom": "更多來自",
  "readingTime": "分鐘閱讀"
}
```

## Quick Implementation Guide

### To complete remaining tasks:

1. **Header Search** (5 min)

   - Edit `Layout.tsx`
   - Add search input
   - Handle Enter key

2. **Hero Updates** (15 min)

   - Edit `HeroSection.tsx` or create new
   - Add background image
   - Add smooth scroll
   - Update button actions

3. **Tech Timeline** (20 min)

   - Create `TechTimeline.tsx`
   - Create `getTechTimeline()` helper
   - Add to HomePage

4. **Contact** (10 min)

   - Simplify `ContactSection.tsx`
   - Make it half-screen
   - Add id for scroll

5. **Footer** (5 min)

   - Edit `Footer.tsx`
   - Remove unnecessary links

6. **i18n** (15 min)
   - Create search.json files
   - Update blogs.json files
   - Initialize in main.tsx

**Total estimated time: ~70 minutes**

## Testing Checklist

- [ ] Navigate to `/search` - ChatGPT-style UI loads
- [ ] Navigate to `/blogs` - Blog list shows with filters
- [ ] Click blog card - Blog detail page loads with markdown
- [ ] Filter blogs by year - Only selected year shows
- [ ] Search blogs - Real-time filtering works
- [ ] Click "View Projects" in hero - Navigate to `/search`
- [ ] Click "Contact Me" in hero - Smooth scroll to contact
- [ ] Timeline shows years 2025 → 2019
- [ ] Click timeline year - Navigate to blog
- [ ] Header search input - Navigate to search page
- [ ] Language switch - All pages translate correctly
- [ ] 404 page - Shows on invalid route
- [ ] Dark mode - All pages render correctly

## Notes

- Basic markdown parser is used. Consider adding `react-markdown` for production
- AI functionality is UI shell only. Backend integration pending
- Blog slugs are hardcoded in loader. Consider generating dynamically
- Lorem-picsum for random background. Can be replaced with specific images
