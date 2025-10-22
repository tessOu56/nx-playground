import { createFeatureI18n } from '@nx-playground/i18n';
import appsEn from './locales/en/apps.json';
import appsZhTW from './locales/zh-TW/apps.json';

const i18n = createFeatureI18n({
  namespace: 'apps',
  resources: {
    en: { apps: appsEn },
    'zh-TW': { apps: appsZhTW },
  },
});

export const appsI18n = {
  init: () => i18n,
};
