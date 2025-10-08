import { createFeatureI18n } from '@nx-playground/i18n';

import enSettings from './locales/en/settings.json';
import zhTWSettings from './locales/zh-TW/settings.json';

const i18n = createFeatureI18n({
  namespace: 'settings',
  resources: {
    'zh-TW': zhTWSettings,
    en: enSettings,
  },
});

export default i18n;
