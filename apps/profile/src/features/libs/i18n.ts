import { createFeatureI18n } from '@nx-playground/i18n';
import libsEn from './locales/en/libs.json';
import libsZhTW from './locales/zh-TW/libs.json';

export const libsI18n = createFeatureI18n('libs', {
  en: { libs: libsEn },
  'zh-TW': { libs: libsZhTW },
});
