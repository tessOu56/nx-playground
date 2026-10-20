import { publicSiteUrl } from '../seo/public-site-url';

export function exhibitionShareUrl(
  locale: string,
  eventId: string,
  origin = publicSiteUrl()
): string {
  const safeLocale = locale.trim() || 'zh-TW';
  const safeId = encodeURIComponent(eventId.trim());
  return `${origin.replace(/\/$/, '')}/${safeLocale}/events/${safeId}`;
}

export function exhibitionShareText(title: string, url: string): string {
  const trimmed = title.trim() || url;
  return `${trimmed}\n${url}`;
}

export function lineTextShareHref(text: string): string {
  return `https://line.me/R/msg/text/?${encodeURIComponent(text)}`;
}
