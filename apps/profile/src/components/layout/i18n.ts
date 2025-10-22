import { createFeatureI18n } from '@nx-playground/i18n';

import enLayout from './locales/en/layout.json';
import zhTWLayout from './locales/zh-TW/layout.json';

const i18n = createFeatureI18n({
  namespace: 'layout',
  resources: {
    'zh-TW': zhTWLayout,
    en: enLayout,
  },
});

export default i18n;

