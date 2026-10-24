import { randomBytes } from 'node:crypto';

/**
 * Event-portal security headers.
 *
 * CSP is report-only so we can watch LIFF / OAuth / analytics without
 * blocking the hosted demo. Discord digest posts are server-side only
 * and are not allowlisted.
 */

export const PERMISSIONS_POLICY = [
  'accelerometer=()',
  'autoplay=()',
  'bluetooth=()',
  'camera=()',
  'display-capture=()',
  'geolocation=()',
  'gyroscope=()',
  'hid=()',
  'idle-detection=()',
  'magnetometer=()',
  'microphone=()',
  'midi=()',
  'payment=()',
  'picture-in-picture=()',
  'publickey-credentials-create=(self)',
  'publickey-credentials-get=(self)',
  'screen-wake-lock=()',
  'serial=()',
  'usb=()',
  'xr-spatial-tracking=()',
].join(', ');

const VERCEL_ANALYTICS_SCRIPT = ['https://va.vercel-scripts.com'] as const;

const VERCEL_ANALYTICS_CONNECT = [
  'https://va.vercel-scripts.com',
  'https://vitals.vercel-insights.com',
  'https://va.vercel-insights.com',
] as const;

/** LINE Login / LIFF — Better Auth + in-client LIFF. */
const LINE_OAUTH = [
  'https://access.line.me',
  'https://api.line.me',
  'https://liff.line.me',
] as const;

const LINE_SCRIPT = [
  'https://static.line-scdn.net',
  'https://d.line-scdn.net',
  'https://liff.line.me',
] as const;

const LINE_IMAGES = [
  'https://profile.line-scdn.net',
  'https://sprofile.line-scdn.net',
] as const;

/** Google OAuth — Better Auth social provider. */
const GOOGLE_OAUTH = [
  'https://accounts.google.com',
  'https://oauth2.googleapis.com',
  'https://www.googleapis.com',
] as const;

const GOOGLE_IMAGES = ['https://lh3.googleusercontent.com'] as const;

/** Keep in sync with next.config `images.remotePatterns`. */
export const CSP_IMAGE_HOSTS = [
  'https://picsum.photos',
  'https://i.picsum.photos',
  'https://fastly.picsum.photos',
  'https://images.unsplash.com',
  'https://cloud.culture.tw',
] as const;

export function createCspNonce(): string {
  return randomBytes(16).toString('base64');
}

function join(...origins: readonly (string | readonly string[])[]): string {
  return origins.flat().join(' ');
}

export function contentSecurityPolicyReportOnly(nonce: string): string {
  const isDev = process.env.NODE_ENV !== 'production';
  const scriptSrc = [
    "'self'",
    `'nonce-${nonce}'`,
    ...VERCEL_ANALYTICS_SCRIPT,
    ...LINE_SCRIPT,
    ...(isDev ? ["'unsafe-eval'"] : []),
  ].join(' ');

  const connectSrc = [
    "'self'",
    ...VERCEL_ANALYTICS_CONNECT,
    ...LINE_OAUTH,
    ...GOOGLE_OAUTH,
    ...(isDev ? ['ws:', 'wss:'] : []),
  ].join(' ');

  return [
    "default-src 'self'",
    `script-src ${scriptSrc}`,
    "style-src 'self' 'unsafe-inline'",
    `img-src 'self' data: blob: ${join(CSP_IMAGE_HOSTS, LINE_IMAGES, GOOGLE_IMAGES)}`,
    "font-src 'self' data:",
    `connect-src ${connectSrc}`,
    `form-action 'self' ${join(LINE_OAUTH[0], GOOGLE_OAUTH[0])}`,
    `frame-src 'self' ${join(LINE_OAUTH, GOOGLE_OAUTH[0])}`,
    "worker-src 'self' blob:",
    "object-src 'none'",
    "base-uri 'self'",
    "frame-ancestors 'none'",
  ].join('; ');
}

export function applySecurityHeaders(headers: Headers, nonce: string): void {
  headers.set(
    'Content-Security-Policy-Report-Only',
    contentSecurityPolicyReportOnly(nonce)
  );
  headers.set('Permissions-Policy', PERMISSIONS_POLICY);
}
