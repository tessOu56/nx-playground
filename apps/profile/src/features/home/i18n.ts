import { createFeatureI18n } from '@nx-playground/i18n';

import commonEn from '../../locales/en/common.json';
import homeEn from '../../locales/en/home.json';
import commonZhTW from '../../locales/zh-TW/common.json';
import homeZhTW from '../../locales/zh-TW/home.json';

const i18n = createFeatureI18n({
  namespace: 'home',
  resources: {
    en: { ...commonEn, ...homeEn },
    'zh-TW': { ...commonZhTW, ...homeZhTW },
  },
});

export default i18n;
export { i18n as homeI18n };
