import { Suspense } from 'react';

import { OrdersList } from './components/OrdersList';
import { OrdersSkeleton } from './components/OrdersSkeleton';

export default function OrdersPage() {
  return (
    <Suspense fallback={<OrdersSkeleton />}>
      <OrdersList />
    </Suspense>
  );
}
