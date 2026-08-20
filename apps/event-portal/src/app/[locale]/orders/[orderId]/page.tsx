import { Suspense } from 'react';

import { OrderSkeleton, OrderDetail } from './components';

import { orderStaticParams } from '@/libs/api/order-static-params';

export const dynamicParams = true;

export async function generateStaticParams() {
  return orderStaticParams();
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
