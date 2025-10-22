import { createFeatureI18n } from '@nx-playground/i18n';
import appsEn from './locales/en/apps.json';
import appsZhTW from './locales/zh-TW/apps.json';

export const appsI18n = createFeatureI18n('apps', {
  en: { apps: appsEn },
  'zh-TW': { apps: appsZhTW },
});
