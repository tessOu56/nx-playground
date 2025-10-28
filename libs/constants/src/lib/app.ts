/**
 * Application constants
 */

/**
 * Supported locales
 */
export const LOCALE = {
  EN: 'en',
  ZH_TW: 'zh-TW',
} as const;

export type Locale = (typeof LOCALE)[keyof typeof LOCALE];

export const SUPPORTED_LOCALES: Locale[] = [LOCALE.EN, LOCALE.ZH_TW];

/**
 * Theme modes
 */
export const THEME = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
} as const;

export type Theme = (typeof THEME)[keyof typeof THEME];

/**
 * Storage keys
 */
export const STORAGE_KEY = {
  THEME: 'theme',
  LOCALE: 'locale',
  USER: 'user',
  TOKEN: 'token',
  REFRESH_TOKEN: 'refresh_token',
  SEARCH_HISTORY: 'search_history',
  RECENT_SEARCHES: 'recent_searches',
} as const;

/**
 * Time constants (in milliseconds)
 */
export const TIME = {
  SECOND: 1000,
  MINUTE: 60 * 1000,
  HOUR: 60 * 60 * 1000,
  DAY: 24 * 60 * 60 * 1000,
  WEEK: 7 * 24 * 60 * 60 * 1000,
  MONTH: 30 * 24 * 60 * 60 * 1000,
  YEAR: 365 * 24 * 60 * 60 * 1000,
} as const;

/**
 * Debounce/throttle delays
 */
export const DELAY = {
  DEBOUNCE_SEARCH: 300,
  DEBOUNCE_INPUT: 500,
  THROTTLE_SCROLL: 100,
  THROTTLE_RESIZE: 200,
  TOAST_DURATION: 3000,
  LOADING_MIN: 500,
} as const;

/**
 * Environment names
 */
export const ENVIRONMENT = {
  DEVELOPMENT: 'development',
  STAGING: 'staging',
  PRODUCTION: 'production',
  TEST: 'test',
} as const;

export type Environment = (typeof ENVIRONMENT)[keyof typeof ENVIRONMENT];

/**
 * Date formats
 */
export const DATE_FORMAT = {
  ISO: 'YYYY-MM-DD',
  ISO_DATETIME: 'YYYY-MM-DD HH:mm:ss',
  DISPLAY: 'MMM DD, YYYY',
  DISPLAY_DATETIME: 'MMM DD, YYYY HH:mm',
  TIME: 'HH:mm:ss',
} as const;

