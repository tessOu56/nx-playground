import { createFeatureI18n } from '@nx-playground/i18n';

import commonEn from '../../locales/en/common.json';
import detailEn from '../../locales/en/detail.json';
import commonZhTW from '../../locales/zh-TW/common.json';
import detailZhTW from '../../locales/zh-TW/detail.json';

const i18n = createFeatureI18n({
  namespace: 'detail',
  resources: {
    en: { ...commonEn, ...detailEn },
    'zh-TW': { ...commonZhTW, ...detailZhTW },
  },
});

export default i18n;
export { i18n as detailI18n };
