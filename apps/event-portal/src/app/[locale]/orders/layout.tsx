import { type Metadata } from 'next';

import { PageConfigs } from '@/libs';

// 使用動態頁面配置，訂單列表需要即時數據
export const { dynamic, revalidate, fetchCache, ssr } = PageConfigs.dynamic;

export const metadata: Metadata = {
  title: '我的訂單 - NX Playground Events',
  description: '查看您的所有活動訂單',
  keywords: ['訂單', '我的訂單', '活動訂單', 'NX Playground'],
};

export default function OrdersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='page-container'>{children}</div>
    </div>
  );
}
