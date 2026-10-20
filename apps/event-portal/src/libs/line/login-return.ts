import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from '../constants/i18n';

const RETURN_KEY = 'nx-playground_line_login_return';
const LOCALE_PREFIX = SUPPORTED_LOCALES.join('|');
const SAFE_PATH = new RegExp(
  `^/(?:${LOCALE_PREFIX})(?:/[A-Za-z0-9._~-]+)*\\/?$`
);

export function safeLineLoginReturnPath(
  raw: unknown,
  locale: string = DEFAULT_LOCALE
): string {
  const fallbackLocale = SUPPORTED_LOCALES.includes(
    locale as (typeof SUPPORTED_LOCALES)[number]
  )
    ? locale
    : DEFAULT_LOCALE;
  const fallback = `/${fallbackLocale}/events`;
  if (typeof raw !== 'string') return fallback;
  const path = raw.trim().split('#')[0]?.split('?')[0] ?? '';
  if (
    !path.startsWith('/') ||
    path.startsWith('//') ||
    path.includes('\\') ||
    path.includes('..')
  ) {
    return fallback;
  }
  if (!SAFE_PATH.test(path)) return fallback;
  return path;
}

export function saveLineLoginReturnPath(path: string): void {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem(
      RETURN_KEY,
      safeLineLoginReturnPath(path, DEFAULT_LOCALE)
    );
  } catch {
    /* private mode */
  }
}

export function takeLineLoginReturnPath(locale: string = DEFAULT_LOCALE): string {
  const fallback = safeLineLoginReturnPath(null, locale);
  if (typeof window === 'undefined') return fallback;
  try {
    const stored = sessionStorage.getItem(RETURN_KEY);
    sessionStorage.removeItem(RETURN_KEY);
    return safeLineLoginReturnPath(stored, locale);
  } catch {
    return fallback;
  }
}

export const LINE_OAUTH_CALLBACK_PARAMS = [
  'code',
  'state',
  'friendship_status_changed',
] as const;

export function stripLineOauthCallbackParams(
  search: string | URLSearchParams
): string {
  const params =
    typeof search === 'string'
      ? new URLSearchParams(search.startsWith('?') ? search.slice(1) : search)
      : new URLSearchParams(search);
  for (const key of LINE_OAUTH_CALLBACK_PARAMS) {
    params.delete(key);
  }
  return params.toString();
}

export function isLineLoginCancelledError(error: string | null): boolean {
  return error === 'access_denied';
}
