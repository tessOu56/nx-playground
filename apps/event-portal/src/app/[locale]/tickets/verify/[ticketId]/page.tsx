import { type Metadata } from 'next';
import { Suspense } from 'react';

import { TicketVerifyClient } from './components/TicketVerifyClient';
import { VerifySkeleton } from './components/VerifySkeleton';

import { PageConfigs } from '@/libs';
import { mockTickets } from '@/libs/mock/tickets';

// 使用動態頁面配置，票券驗證需要即時數據
export const { dynamic, revalidate, fetchCache, ssr } = PageConfigs.dynamic;

// 生成靜態參數
export async function generateStaticParams() {
  return mockTickets.map(ticket => ({
    ticketId: ticket.id,
  }));
}

// 固定 metadata
export const metadata: Metadata = {
  title: '票券驗證 | NX Playground',
  description: '驗證票券有效性',
  robots: 'noindex, nofollow',
};

export default function TicketVerifyPage({
  params,
}: {
  params: Promise<{ ticketId: string }>;
}) {
  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='page-container'>
        <Suspense fallback={<VerifySkeleton />}>
          <TicketVerifyClient params={params} />
        </Suspense>
      </div>
    </div>
  );
}
