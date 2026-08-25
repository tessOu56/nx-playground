import { createFeatureI18n } from '@nx-playground/i18n';

import enOps from './locales/en/ops.json';
import zhTWOps from './locales/zh-TW/ops.json';

const i18n = createFeatureI18n({
  namespace: 'ops',
  resources: {
    'zh-TW': zhTWOps,
    en: enOps,
  },
});

export default i18n;
