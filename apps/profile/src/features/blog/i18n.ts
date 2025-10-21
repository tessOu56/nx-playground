/**
 * Blog feature i18n configuration
 */

import i18n from 'i18next';

import blogEn from './locales/en/blog.json';
import blogZhTW from './locales/zh-TW/blog.json';

// Register blog namespace
i18n.addResourceBundle('en', 'blog', blogEn);
i18n.addResourceBundle('zh-TW', 'blog', blogZhTW);

export default i18n;


