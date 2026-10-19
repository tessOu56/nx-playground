import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from '../constants/i18n';

function matchLocalePrefix(cleanPath: string): string | null {
  for (const locale of SUPPORTED_LOCALES) {
    if (cleanPath === locale || cleanPath.startsWith(`${locale}/`)) {
      return locale;
    }
  }
  return null;
}

/**
 * 為路徑加上 locale 前綴
 * @param path 原始路徑
 * @param locale 語言代碼，如果不提供則使用當前 locale
 * @returns 包含 locale 的完整路徑
 */
export function withLocale(path: string, locale?: string): string {
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;

  if (matchLocalePrefix(cleanPath)) {
    return `/${cleanPath}`;
  }

  const localePrefix = locale ?? DEFAULT_LOCALE;
  return `/${localePrefix}/${cleanPath}`;
}

/**
 * 從路徑中移除 locale 前綴
 * @param path 包含 locale 的完整路徑
 * @returns 移除 locale 後的原始路徑
 */
export function withoutLocale(path: string): string {
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  const locale = matchLocalePrefix(cleanPath);
  if (!locale) return `/${cleanPath}`;
  const rest = cleanPath.slice(locale.length);
  return rest.startsWith('/') ? rest : `/${rest}`;
}

/**
 * 檢查路徑是否包含 locale
 * @param path 路徑
 * @returns 是否包含 locale
 */
export function hasLocale(path: string): boolean {
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return matchLocalePrefix(cleanPath) !== null;
}

/**
 * 從路徑中提取 locale
 * @param path 包含 locale 的完整路徑
 * @returns locale 代碼或 null
 */
export function extractLocale(path: string): string | null {
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return matchLocalePrefix(cleanPath);
}

/** Swap the locale prefix while keeping the rest of the path. */
export function replaceLocale(path: string, locale: string): string {
  const rest = withoutLocale(path);
  if (rest === '/') {
    return `/${locale}`;
  }
  return withLocale(rest, locale);
}
