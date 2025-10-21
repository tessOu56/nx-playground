import { createFeatureI18n } from '@nx-playground/i18n';

import enApps from './locales/en/apps.json';
import zhTWApps from './locales/zh-TW/apps.json';

const i18n = createFeatureI18n({
  namespace: 'profile-apps',
  resources: {
    'zh-TW': zhTWApps,
    en: enApps,
  },
});

export default i18n;

