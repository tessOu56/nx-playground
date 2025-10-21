/**
 * Blogs feature i18n configuration
 */

import i18n from 'i18next';

import blogsEn from './locales/en/blogs.json';
import blogsZhTW from './locales/zh-TW/blogs.json';

// Register blogs namespace
i18n.addResourceBundle('en', 'blogs', blogsEn);
i18n.addResourceBundle('zh-TW', 'blogs', blogsZhTW);

export default i18n;


