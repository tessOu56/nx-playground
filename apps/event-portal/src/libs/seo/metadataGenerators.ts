/**
 * 頁面 metadata 生成器
 */

import type { Metadata } from 'next';
import { getEvent, getOrder } from '@nx-playground/api-client';

export async function generateEventMetadata({
  params,
}: {
  params: Promise<{ eventId: string }>;
}): Promise<Metadata> {
  const { eventId } = await params;
  try {
    const event = await getEvent(eventId);
    return {
      title: `${event.title} - 活動詳情 - NX Playground Events`,
      description: `查看 ${event.title} 活動詳情和報名資訊`,
      keywords: ['活動詳情', '活動報名', event.title, 'NX Playground', 'Events'],
      openGraph: {
        title: `${event.title} - 活動詳情`,
        description: `查看 ${event.title} 活動詳情和報名資訊`,
        type: 'website',
      },
    };
  } catch {
    return {
      title: '活動未找到 - NX Playground Events',
      description: '您要查找的活動不存在或已被移除。',
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
    const event = await getEvent(order.eventId);
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

export async function generateVendorMetadata({
  params,
}: {
  params: Promise<{ vendorId: string }>;
}): Promise<Metadata> {
  const { vendorId } = await params;

  return {
    title: `主辦方 ${vendorId} - NX Playground Events`,
    description: '查看主辦方詳情和相關活動',
    keywords: ['主辦方', '活動', 'NX Playground', 'Events'],
    openGraph: {
      title: `主辦方 ${vendorId} - NX Playground Events`,
      description: '查看主辦方詳情和相關活動',
      type: 'website',
    },
  };
}
