import { createFeatureI18n } from '@nx-playground/i18n';
import commonEn from '../../locales/en/common.json';
import projectsEn from '../../locales/en/projects.json';
import commonZhTW from '../../locales/zh-TW/common.json';
import projectsZhTW from '../../locales/zh-TW/projects.json';

const i18n = createFeatureI18n({
  namespace: 'projects',
  resources: {
    en: { ...commonEn, ...projectsEn },
    'zh-TW': { ...commonZhTW, ...projectsZhTW },
  },
});

export default i18n;
export { i18n as projectsI18n };

