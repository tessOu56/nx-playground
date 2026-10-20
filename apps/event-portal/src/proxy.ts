import createMiddleware from 'next-intl/middleware';

import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from './libs/constants/i18n';

const routing = {
  locales: [...SUPPORTED_LOCALES],
  defaultLocale: DEFAULT_LOCALE,
};

export default createMiddleware(routing);

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(zh-TW|en|ja)/:path*'],
};
