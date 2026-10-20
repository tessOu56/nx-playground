/** Local fallback used when a listing image is missing or fails to load. */
export const PLACEHOLDER_EVENT_IMAGE = '/placeholder-event.svg';

/** Hosts Next/Image is allowed to optimize — keep in sync with next.config remotePatterns. */
export const OPTIMIZED_IMAGE_HOSTS = [
  'picsum.photos',
  'i.picsum.photos',
  'fastly.picsum.photos',
  'images.unsplash.com',
  'cloud.culture.tw',
] as const;

export function catalogImageSrc(value: unknown): string {
  if (typeof value !== 'string') return PLACEHOLDER_EVENT_IMAGE;
  const trimmed = value.trim();
  if (!trimmed || trimmed === PLACEHOLDER_EVENT_IMAGE) {
    return PLACEHOLDER_EVENT_IMAGE;
  }
  if (trimmed.startsWith('/') && !trimmed.startsWith('//') && !trimmed.includes('\\')) {
    return trimmed;
  }
  try {
    const url = new URL(trimmed);
    if (url.protocol !== 'https:' || url.username || url.password) {
      return PLACEHOLDER_EVENT_IMAGE;
    }
    return url.toString();
  } catch {
    return PLACEHOLDER_EVENT_IMAGE;
  }
}

export function shouldOptimizeCatalogImage(src: string): boolean {
  if (src.startsWith('/') && !src.startsWith('//')) {
    return !src.toLowerCase().endsWith('.svg');
  }
  try {
    const url = new URL(src);
    return (
      url.protocol === 'https:' &&
      OPTIMIZED_IMAGE_HOSTS.includes(
        url.hostname.toLowerCase() as (typeof OPTIMIZED_IMAGE_HOSTS)[number]
      )
    );
  } catch {
    return false;
  }
}
