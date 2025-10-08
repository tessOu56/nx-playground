import { type Metadata } from 'next';
import { Suspense } from 'react';

import { RegistrationClient } from './components/layout/RegistrationClient';
import { RegistrationSkeleton } from './components/layout/RegistrationSkeleton';

import { PageConfigs } from '@/libs';
import { mockOrderItems } from '@/libs/mock/orderItems';
import { mockOrders } from '@/libs/mock/orders';

// 使用表單頁面配置，避免預渲染問題
export const { dynamic, revalidate, fetchCache, ssr } = PageConfigs.form;

// 生成靜態參數
export async function generateStaticParams() {
  const params: { orderId: string; orderItemId: string }[] = [];

  mockOrders.forEach(order => {
    const orderItemsForOrder = mockOrderItems.filter(
      item => item.orderId === order.id
    );
    orderItemsForOrder.forEach(item => {
      params.push({
        orderId: order.id,
        orderItemId: item.id,
      });
    });
  });

  return params;
}

// 固定 metadata
export const metadata: Metadata = {
  title: '活動報名表 | NX Playground',
  description: '填寫活動報名表',
  robots: 'noindex, nofollow',
};

interface OrderItemRegistrationPageProps {
  params: Promise<{ orderId: string; orderItemId: string }>;
}

export default function OrderItemRegistrationPage({
  params,
}: OrderItemRegistrationPageProps) {
  return (
    <Suspense fallback={<RegistrationSkeleton />}>
      <RegistrationClient params={params} />
    </Suspense>
  );
}
