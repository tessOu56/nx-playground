/**
 * Blog feature exports
 */

// Pages
export { BlogListPage } from './pages/BlogListPage';
export { BlogPostPage } from './pages/BlogPostPage';

// Components
export { BlogCard } from './components/BlogCard';
export { BlogPost } from './components/BlogPost';
export { CategoryFilter } from './components/CategoryFilter';
export { LanguageToggle } from './components/LanguageToggle';
export { SearchBar } from './components/SearchBar';
export { ShareButtons } from './components/ShareButtons';
export { TableOfContents } from './components/TableOfContents';
export { TagFilter } from './components/TagFilter';
export { TagList } from './components/TagList';

// Hooks
export {
  useBlogsTranslation,
  useBlogTranslation,
} from './hooks/useBlogsTranslation';

// Utils
export { loadAllPosts, loadPostBySlug, getAllTags } from './utils/loadDocs';

// Types
export type { BlogPost, BlogCategory, SupportedLocale } from './types';

// i18n
export { default as blogsI18n } from './i18n';
