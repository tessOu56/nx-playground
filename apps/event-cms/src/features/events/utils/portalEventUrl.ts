const portalBaseUrl =
  (import.meta.env.VITE_EVENT_PORTAL_URL as string | undefined)?.replace(
    /\/$/,
    ''
  ) ?? 'http://localhost:3000';

export function getPortalBaseUrl(): string {
  return portalBaseUrl;
}

export function portalEventUrl(eventId: string, locale = 'zh-TW'): string {
  return `${portalBaseUrl}/${locale}/events/${eventId}`;
}
