/**
 * Blog feature exports
 */

// Pages
export { BlogListPage } from './pages/BlogListPage';
export { BlogPostPage } from './pages/BlogPostPage';

// Components
export { BlogCard } from './components/BlogCard';
export { BlogPost as BlogPostComponent } from './components/BlogPost';
export { TagList } from './components/TagList';

// Hooks
export {
  useBlogsTranslation,
  useBlogTranslation,
} from './hooks/useBlogsTranslation';

// Types
export type { BlogPost, BlogCategory, SupportedLocale } from './types';

// i18n
export { default as blogsI18n } from './i18n';
