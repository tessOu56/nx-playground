/**
 * 頁面 metadata 生成器
 */

import type { Metadata } from 'next';

import { fetchPortalEvent } from '@/libs/api/event-stack-fetch';
import { demoCopy } from '@/libs/i18n/demo-copy';
import { getOrder } from '@nx-playground/api-client/event-stack';

export async function generateEventMetadata({
  params,
}: {
  params: Promise<{ eventId: string; locale?: string }>;
}): Promise<Metadata> {
  const { eventId, locale = 'zh-TW' } = await params;
  const copy = demoCopy(locale);
  try {
    const event = await fetchPortalEvent(eventId);
    const ogLocale =
      locale === 'en' ? 'en_US' : locale === 'ja' ? 'ja_JP' : 'zh_TW';
    return {
      title: `${event.title} — ${copy.navEvents}`,
      description: event.description || copy.metaDescription,
      keywords: [copy.navEvents, event.title, 'Taipei', 'Tokyo', 'LINE'],
      openGraph: {
        title: event.title,
        description: event.description || copy.metaDescription,
        type: 'website',
        locale: ogLocale,
        images: event.image
          ? [{ url: event.image, alt: event.title }]
          : undefined,
      },
      twitter: {
        card: 'summary_large_image',
        title: event.title,
        description: event.description || copy.metaDescription,
        images: event.image ? [event.image] : undefined,
      },
    };
  } catch {
    return {
      title: `${copy.notFound} — NX Playground`,
      description: copy.notFoundHint,
      robots: { index: false, follow: true },
    };
  }
}

export async function generateOrderMetadata({
  params,
}: {
  params: Promise<{ orderId: string }>;
}): Promise<Metadata> {
  const { orderId } = await params;
  try {
    const order = await getOrder(orderId);
    const event = await fetchPortalEvent(order.eventId);
    return {
      title: `訂單 ${orderId} - NX Playground Events`,
      description: `訂單 ${orderId} - ${event.title}`,
      keywords: ['訂單', '付款', event.title, 'NX Playground', 'Events'],
      openGraph: {
        title: `訂單 ${orderId} - NX Playground Events`,
        description: `訂單 ${orderId} - ${event.title}`,
        type: 'website',
      },
    };
  } catch {
    return {
      title: '訂單 - NX Playground Events',
      description: '查看訂單詳情和付款資訊',
    };
  }
}
