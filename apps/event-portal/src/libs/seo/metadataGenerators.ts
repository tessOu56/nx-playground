/**
 * 頁面 metadata 生成器
 */

import type { Metadata } from 'next';

import { mockEvents } from '../mock/events';
import { mockOrders } from '../mock/orders';

/**
 * 活動詳情頁面 metadata 生成器
 */
export async function generateEventMetadata({
  params,
}: {
  params: Promise<{ eventId: string }>;
}): Promise<Metadata> {
  const { eventId } = await params;
  const event = mockEvents.find(e => e.id === eventId);

  if (!event) {
    return {
      title: '活動未找到 - NX Playground Events',
      description: '您要查找的活動不存在或已被移除。',
    };
  }

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
}

/**
 * 訂單詳情頁面 metadata 生成器
 */
export async function generateOrderMetadata({
  params,
}: {
  params: Promise<{ orderId: string }>;
}): Promise<Metadata> {
  const { orderId } = await params;
  const order = mockOrders.find(o => o.id === orderId);
  const event = order ? mockEvents.find(e => e.id === order.eventId) : null;

  let description = '查看訂單詳情和付款資訊';
  let keywords = ['訂單', '付款', 'NX Playground', 'Events'];

  if (order && event) {
    description = `訂單 ${orderId} - ${event.title}，購買 ${
      order.quantity
    } 張票券，總金額 NT$ ${order.totalAmount.toLocaleString()}`;
    keywords = [
      '訂單',
      '付款',
      '活動',
      event.title,
      '票券',
      'NX Playground',
      'Events',
    ];
  }

  return {
    title: `訂單 ${orderId} - NX Playground Events`,
    description,
    keywords,
    openGraph: {
      title: `訂單 ${orderId} - NX Playground Events`,
      description,
      type: 'website',
    },
  };
}

/**
 * 主辦方詳情頁面 metadata 生成器
 */
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
