const LOCAL_ORIGINS = new Set([
  'http://localhost:3000',
  'http://localhost:3002',
  'http://localhost:3004',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:3002',
  'http://127.0.0.1:3004',
]);

export function safeAuthReturnTo(
  raw: string | null | undefined,
  origin: string,
  fallbackPath = '/zh-TW/events'
): string {
  const fallback = `${origin.replace(/\/$/, '')}${fallbackPath}`;
  if (!raw) return fallback;
  try {
    const url = new URL(raw, origin);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      return fallback;
    }
    if (url.origin === origin.replace(/\/$/, '')) {
      return url.toString();
    }
    if (LOCAL_ORIGINS.has(url.origin)) {
      return url.toString();
    }
    return fallback;
  } catch {
    return fallback;
  }
}
