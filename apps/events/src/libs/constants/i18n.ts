/**
 * i18n 相關配置
 */

export const SUPPORTED_LOCALES = ['zh-TW', 'en'] as const;
export const DEFAULT_LOCALE = 'zh-TW' as const;

export type SupportedLocale = typeof SUPPORTED_LOCALES[number];

/**
 * 檢查是否為支援的 locale
 */
export function isSupportedLocale(locale: string): locale is SupportedLocale {
  return SUPPORTED_LOCALES.includes(locale as SupportedLocale);
}

/**
 * 獲取有效的 locale，如果不是支援的 locale 則返回預設值
 */
export function getValidLocale(locale?: string): SupportedLocale {
  if (locale && isSupportedLocale(locale)) {
    return locale;
  }
  return DEFAULT_LOCALE;
}
