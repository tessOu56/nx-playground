import { useQuery } from '@tanstack/react-query';
import { getOrder } from '@nx-playground/api-client/event-stack';

import { toPortalOrder } from '../map-event-stack-order';
import { mockOrders } from '../../mock/orders';

/** All-orders list remains mock (stats / leftover screens). Live list is useOrdersListByUser. */
export function useOrders() {
  return useQuery({
    queryKey: ['orders'],
    queryFn: () => mockOrders,
    staleTime: 5 * 60 * 1000,
  });
}

/** User-filtered mock list. Live `/orders` uses useOrdersListByUser. */
export function useOrdersByUser(userId: string) {
  return useQuery({
    queryKey: ['orders', 'user', userId],
    queryFn: () => mockOrders.filter(order => order.userId === userId),
    staleTime: 5 * 60 * 1000,
    enabled: !!userId,
  });
}

/** Live detail: GET /orders/{id}. Do not use mockOrders as queryFn. */
export function useOrder(orderId: string) {
  return useQuery({
    queryKey: ['event-stack', 'order', orderId],
    queryFn: async () => toPortalOrder(await getOrder(orderId)),
    staleTime: 5 * 60 * 1000,
    enabled: !!orderId,
  });
}
