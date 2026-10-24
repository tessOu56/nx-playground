import createMiddleware from 'next-intl/middleware';
import { NextRequest } from 'next/server';

import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from './libs/constants/i18n';
import {
  applySecurityHeaders,
  contentSecurityPolicyReportOnly,
  createCspNonce,
} from './libs/http/security-headers';

const routing = {
  locales: [...SUPPORTED_LOCALES],
  defaultLocale: DEFAULT_LOCALE,
};

const intlMiddleware = createMiddleware(routing);

export default function proxy(request: NextRequest) {
  const nonce = createCspNonce();
  const csp = contentSecurityPolicyReportOnly(nonce);
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);
  // Next.js reads the nonce from this request header and stamps its scripts.
  requestHeaders.set('Content-Security-Policy-Report-Only', csp);

  const response = intlMiddleware(
    new NextRequest(request, { headers: requestHeaders })
  );
  applySecurityHeaders(response.headers, nonce);
  return response;
}

export const config = {
  matcher: ['/', '/(zh-TW|en|ja)/:path*'],
};
