import { createFeatureI18n } from '@nx-playground/i18n';
import commonEn from '../../locales/en/common.json';
import blogsEn from '../../locales/en/blogs.json';
import commonZhTW from '../../locales/zh-TW/common.json';
import blogsZhTW from '../../locales/zh-TW/blogs.json';

const i18n = createFeatureI18n({
  namespace: 'blogs',
  resources: {
    en: { ...commonEn, ...blogsEn },
    'zh-TW': { ...commonZhTW, ...blogsZhTW },
  },
});

export default i18n;
export { i18n as blogsI18n };
