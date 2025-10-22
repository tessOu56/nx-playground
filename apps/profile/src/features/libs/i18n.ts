import { createFeatureI18n } from '@nx-playground/i18n';

import commonEn from '../../locales/en/common.json';
import libsEn from '../../locales/en/libs.json';
import commonZhTW from '../../locales/zh-TW/common.json';
import libsZhTW from '../../locales/zh-TW/libs.json';

const i18n = createFeatureI18n({
  namespace: 'libs',
  resources: {
    en: { ...commonEn, ...libsEn },
    'zh-TW': { ...commonZhTW, ...libsZhTW },
  },
});

export default i18n;
export { i18n as libsI18n };
