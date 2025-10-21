import { createFeatureI18n } from '@nx-playground/i18n';

import enHome from './locales/en/home.json';
import zhTWHome from './locales/zh-TW/home.json';

const i18n = createFeatureI18n({
  namespace: 'profile-home',
  resources: {
    'zh-TW': zhTWHome,
    en: enHome,
  },
});

export default i18n;

