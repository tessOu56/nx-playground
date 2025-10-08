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
    (process.env.VITE_DEFAULT_LANGUAGE as SupportedLanguage)) ||
  'zh-TW';

// Define fallback language (支援環境變數)
export const FALLBACK_LANGUAGE: SupportedLanguage =
  (typeof process !== 'undefined' &&
    (process.env.VITE_FALLBACK_LANGUAGE as SupportedLanguage)) ||
  'en';

// SSR 友好的 i18n 配置
const createI18nConfig = (initialLanguage?: SupportedLanguage) => {
  const config = {
    // Default language
    lng: initialLanguage ?? DEFAULT_LANGUAGE,

    // Fallback language
    fallbackLng: FALLBACK_LANGUAGE,

    // Supported languages
    supportedLngs: Object.keys(SUPPORTED_LANGUAGES),

    // 在 SSR 環境中禁用語言檢測
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

    // SSR 特定配置
    initImmediate: false, // 延遲初始化以支援 SSR
  };

  return config;
};

// 初始化 i18n
export const initI18n = (initialLanguage?: SupportedLanguage) => {
  // 只在客戶端初始化
  if (typeof window === 'undefined') {
    return i18n;
  }

  if (!i18n.isInitialized) {
    i18n
      .use(LanguageDetector)
      .use(initReactI18next)
      .init(createI18nConfig(initialLanguage));
  }
  return i18n;
};

// 導出預設實例 - 只在客戶端初始化
export default typeof window !== 'undefined' ? initI18n() : null;
