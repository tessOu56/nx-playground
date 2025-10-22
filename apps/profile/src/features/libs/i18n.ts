import { createFeatureI18n } from '@nx-playground/i18n';
import libsEn from './locales/en/libs.json';
import libsZhTW from './locales/zh-TW/libs.json';

const i18n = createFeatureI18n({
  namespace: 'libs',
  resources: {
    en: { libs: libsEn },
    'zh-TW': { libs: libsZhTW },
  },
});

export const libsI18n = {
  init: () => i18n,
};
