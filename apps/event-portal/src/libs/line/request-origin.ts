import type { NextRequest } from 'next/server';

function normalizeOrigin(value: string | undefined | null): string {
  return (value ?? '').trim().replace(/\/$/, '');
}

/**
 * Browser fetch sends Origin. Reject cross-site calls to the LINE token proxy.
 * Missing Origin (non-browser) is allowed so unit tests and same-origin
 * server tools still work; PKCE + pinned redirect_uri remain required.
 */
export function isAllowedPortalOrigin(request: NextRequest): boolean {
  const origin = normalizeOrigin(request.headers.get('origin'));
  if (!origin) return true;

  const allowed = new Set(
    [
      request.nextUrl.origin,
      process.env.NEXT_PUBLIC_SITE_URL,
      process.env.NEXT_PUBLIC_LINE_REDIRECT_URI,
    ]
      .map(normalizeOrigin)
      .filter(Boolean)
  );
  return allowed.has(origin);
}
