/**
 * 頁面 metadata 生成器
 */

import type { Metadata } from 'next';

import { catalogImageSrc, PLACEHOLDER_EVENT_IMAGE } from '@/libs/api/catalog-image';
import { resolvePortalExhibition } from '@/libs/exhibition-search/load-portal';
import { demoCopy } from '@/libs/i18n/demo-copy';
import { exhibitionShareUrl } from '@/libs/line/exhibition-share';

export async function generateEventMetadata({
  params,
}: {
  params: Promise<{ eventId: string; locale?: string }>;
}): Promise<Metadata> {
  const { eventId, locale = 'zh-TW' } = await params;
  const copy = demoCopy(locale);
  const resolved = await resolvePortalExhibition(eventId);

  // Missing listings 404 from the page, not metadata — a layout-level
  // notFound() skipped the exhibition not-found UI.
  if (resolved.status === 'missing') {
    return {
      title: `${copy.notFound} — NX Playground`,
      description: copy.notFoundHint,
      robots: { index: false, follow: true },
    };
  }

  if (resolved.status === 'error') {
    return {
      title: `${copy.loadError} — NX Playground`,
      description: copy.loadErrorHint,
      robots: { index: false, follow: true },
    };
  }

  const event = resolved.event;
  const ogLocale =
    locale === 'en' ? 'en_US' : locale === 'ja' ? 'ja_JP' : 'zh_TW';
  const canonical = exhibitionShareUrl(locale, event.id);
  const image = catalogImageSrc(event.image);
  const ogImages =
    image !== PLACEHOLDER_EVENT_IMAGE
      ? [{ url: image, alt: event.title }]
      : undefined;

  return {
    title: `${event.title} — ${copy.navEvents}`,
    description: event.description || copy.metaDescription,
    keywords: [copy.navEvents, event.title, 'Taipei', 'Tokyo', 'LINE'],
    alternates: { canonical },
    openGraph: {
      title: event.title,
      description: event.description || copy.metaDescription,
      type: 'website',
      locale: ogLocale,
      url: canonical,
      images: ogImages,
    },
    twitter: {
      card: ogImages ? 'summary_large_image' : 'summary',
      title: event.title,
      description: event.description || copy.metaDescription,
      images: ogImages?.map(item => item.url),
    },
  };
}
