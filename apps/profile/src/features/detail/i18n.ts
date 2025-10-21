import { createFeatureI18n } from '@nx-playground/i18n';

import enDetail from './locales/en/detail.json';
import zhTWDetail from './locales/zh-TW/detail.json';

export const detailI18n = createFeatureI18n({
  namespace: 'detail',
  resources: {
    en: enDetail,
    'zh-TW': zhTWDetail,
  },
});

export default detailI18n;
