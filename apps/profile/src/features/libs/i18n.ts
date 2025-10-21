import { createFeatureI18n } from '@nx-playground/i18n';

import enLibs from './locales/en/libs.json';
import zhTWLibs from './locales/zh-TW/libs.json';

const i18n = createFeatureI18n({
  namespace: 'profile-libs',
  resources: {
    'zh-TW': zhTWLibs,
    en: enLibs,
  },
});

export default i18n;

