import { type Metadata } from 'next';
import { Suspense } from 'react';

import { CheckInSkeleton } from './components/layout/CheckInSkeleton';
import { TicketCheckInClient } from './components/TicketCheckInClient';

import { PageConfigs } from '@/libs';
import { mockOrders } from '@/libs/mock/orders';
import { mockTickets } from '@/libs/mock/tickets';

// 使用表單頁面配置，避免預渲染問題
export const { dynamic, revalidate, fetchCache, ssr } = PageConfigs.form;

// 生成靜態參數
export async function generateStaticParams() {
  const params: { orderId: string; ticketId: string }[] = [];

  mockOrders.forEach(order => {
    const orderTickets = mockTickets.filter(
      ticket => ticket.orderId === order.id
    );
    orderTickets.forEach(ticket => {
      params.push({
        orderId: order.id,
        ticketId: ticket.id,
      });
    });
  });

  return params;
}

// 固定 metadata
export const metadata: Metadata = {
  title: '票券報到 | NX Playground',
  description: '生成票券報到 QR Code',
  robots: 'noindex, nofollow',
};

export default function TicketCheckInPage({
  params,
}: {
  params: Promise<{ orderId: string; ticketId: string }>;
}) {
  return (
    <Suspense fallback={<CheckInSkeleton />}>
      <TicketCheckInClient params={params} />
    </Suspense>
  );
}
