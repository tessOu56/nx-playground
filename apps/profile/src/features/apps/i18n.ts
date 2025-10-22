import { createFeatureI18n } from '@nx-playground/i18n';

import appsEn from '../../locales/en/apps.json';
import commonEn from '../../locales/en/common.json';
import appsZhTW from '../../locales/zh-TW/apps.json';
import commonZhTW from '../../locales/zh-TW/common.json';

const i18n = createFeatureI18n({
  namespace: 'apps',
  resources: {
    en: { ...commonEn, ...appsEn },
    'zh-TW': { ...commonZhTW, ...appsZhTW },
  },
});

export default i18n;
export { i18n as appsI18n };
