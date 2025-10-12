import { Suspense } from 'react';

import { OrderSkeleton, OrderDetail } from './components';

import { mockOrders } from '@/libs/mock/orders';

// 生成靜態參數
export async function generateStaticParams() {
  return mockOrders.map(order => ({
    orderId: order.id,
  }));
}

export default async function OrderPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;

  return (
    <Suspense fallback={<OrderSkeleton />}>
      <OrderDetail orderId={orderId} />
    </Suspense>
  );
}
