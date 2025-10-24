import { createFeatureI18n } from '@nx-playground/i18n';
import commonEn from '../../locales/en/common.json';
import detailEn from '../../locales/en/detail.json';
import projectsEn from '../../locales/en/projects.json';
import commonZhTW from '../../locales/zh-TW/common.json';
import detailZhTW from '../../locales/zh-TW/detail.json';
import projectsZhTW from '../../locales/zh-TW/projects.json';

const i18n = createFeatureI18n({
  namespace: 'projects',
  resources: {
    en: { ...commonEn, ...projectsEn, ...detailEn },
    'zh-TW': { ...commonZhTW, ...projectsZhTW, ...detailZhTW },
  },
});

export default i18n;
export { i18n as projectsI18n };

