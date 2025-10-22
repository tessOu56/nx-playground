import { createFeatureI18n } from '@nx-playground/i18n';

import commonEn from '../../locales/en/common.json';
import layoutEn from '../../locales/en/layout.json';
import commonZhTW from '../../locales/zh-TW/common.json';
import layoutZhTW from '../../locales/zh-TW/layout.json';

const i18n = createFeatureI18n({
  namespace: 'layout',
  resources: {
    en: { ...commonEn, ...layoutEn },
    'zh-TW': { ...commonZhTW, ...layoutZhTW },
  },
});

export default i18n;
export { i18n as layoutI18n };
