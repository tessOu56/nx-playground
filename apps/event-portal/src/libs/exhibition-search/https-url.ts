/** Public https image/source URLs only — drop localhost, credentials, and raw IPs. */
export function publicHttpsUrl(value: unknown): string | null {
  if (typeof value !== 'string' || !value.startsWith('https://')) return null;
  try {
    const url = new URL(value);
    if (url.username || url.password) return null;
    if (url.protocol !== 'https:') return null;
    const host = url.hostname.toLowerCase();
    if (
      host === 'localhost' ||
      host.endsWith('.local') ||
      host.endsWith('.internal') ||
      host === '::1'
    ) {
      return null;
    }
    if (/^(?:\d{1,3}\.){3}\d{1,3}$/.test(host)) return null;
    if (host.includes(':')) return null;
    return url.toString();
  } catch {
    return null;
  }
}

/** Same-origin path or public https — blocks javascript:/data: phishing hrefs. */
export function publicHref(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (
    trimmed.startsWith('/') &&
    !trimmed.startsWith('//') &&
    !trimmed.includes('\\')
  ) {
    return trimmed;
  }
  return publicHttpsUrl(trimmed);
}
