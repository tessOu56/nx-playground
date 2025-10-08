import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

// Import translation files
import enCommon from '../locales/en/common.json';
import enUI from '../locales/en/ui.json';
import zhTWCommon from '../locales/zh-TW/common.json';
import zhTWUI from '../locales/zh-TW/ui.json';

// Define available languages
export const SUPPORTED_LANGUAGES = {
  'zh-TW': '繁體中文',
  en: 'English',
} as const;

export type SupportedLanguage = keyof typeof SUPPORTED_LANGUAGES;

// Define default language (支援環境變數)
export const DEFAULT_LANGUAGE: SupportedLanguage =
  (typeof process !== 'undefined' &&
    (process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE as SupportedLanguage)) ||
  'zh-TW';

// Define fallback language (支援環境變數)
export const FALLBACK_LANGUAGE: SupportedLanguage =
  (typeof process !== 'undefined' &&
    (process.env.NEXT_PUBLIC_FALLBACK_LANGUAGE as SupportedLanguage)) ||
  'en';

// Configure i18next
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    // Default language
    lng: DEFAULT_LANGUAGE,

    // Fallback language
    fallbackLng: FALLBACK_LANGUAGE,

    // Supported languages
    supportedLngs: Object.keys(SUPPORTED_LANGUAGES),

    // Language detection options
    detection: {
      // Order and from where user language should be detected
      order: [
        'localStorage',
        'sessionStorage',
        'navigator',
        'htmlTag',
        'path',
        'subdomain',
      ],

      // Keys or params to lookup language from
      lookupLocalStorage: 'i18nextLng',
      lookupSessionStorage: 'i18nextLng',
      lookupFromPathIndex: 0,
      lookupFromSubdomainIndex: 0,

      // Cache user language on
      caches: ['localStorage', 'sessionStorage'],
    },

    // Interpolation options
    interpolation: {
      escapeValue: false, // React already escapes values
    },

    // Resources (translations)
    resources: {
      'zh-TW': {
        common: zhTWCommon,
        ui: zhTWUI,
      },
      en: {
        common: enCommon,
        ui: enUI,
      },
    },

    // Namespace options
    defaultNS: 'common',
    ns: ['common', 'ui'],

    // React options
    react: {
      useSuspense: false, // Disable Suspense for better error handling
    },
  });

export default i18n;
