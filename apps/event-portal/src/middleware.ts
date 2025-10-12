import createMiddleware from 'next-intl/middleware';

const routing = {
  locales: ['zh-TW', 'en'],
  defaultLocale: 'zh-TW',
};

export default createMiddleware(routing);

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(zh-TW|en)/:path*'],
  runtime: 'nodejs',
};
