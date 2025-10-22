import { createFeatureI18n } from '@nx-playground/i18n';

import enBlogs from './locales/en/blogs.json';
import zhTWBlogs from './locales/zh-TW/blogs.json';

export const blogsI18n = createFeatureI18n({
  namespace: 'blogs',
  resources: {
    en: enBlogs,
    'zh-TW': zhTWBlogs,
  },
});

export default blogsI18n;
