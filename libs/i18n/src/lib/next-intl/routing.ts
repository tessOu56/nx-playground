// next-intl routing configuration
export const locales = ['zh-TW', 'en', 'ja'] as const;
export const defaultLocale = 'zh-TW' as const;

export type Locale = (typeof locales)[number];

// 支援的語言顯示名稱
export const SUPPORTED_LANGUAGES = {
  'zh-TW': '繁體中文',
  en: 'English',
  ja: '日本語',
} as const;

export type SupportedLanguage = keyof typeof SUPPORTED_LANGUAGES;
