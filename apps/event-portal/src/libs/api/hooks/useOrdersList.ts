import { useQuery } from '@tanstack/react-query';
import { listEvents, listOrders } from '@nx-playground/api-client/event-stack';

import { toPortalOrderListItem } from '../map-event-stack-order';
import { mockBills } from '../../mock/bills';
import { mockOrders } from '../../mock/orders';
import { mockPayments } from '../../mock/payments';

import type { OrderListItem, OrdersStats } from '@/types/orderList';

const DEMO_USER_ID = 'user_demo';

export function useOrdersListByUser(userId: string = DEMO_USER_ID) {
  return useQuery({
    queryKey: ['event-stack', 'ordersList', 'user', userId],
    queryFn: async (): Promise<OrderListItem[]> => {
      const [orders, events] = await Promise.all([
        listOrders({ userId, limit: 50 }),
        listEvents({ limit: 50 }),
      ]);
      const eventsById = new Map(events.items.map(event => [event.id, event]));
      return orders.items.map(order =>
        toPortalOrderListItem(order, eventsById.get(order.eventId))
      );
    },
    staleTime: 5 * 60 * 1000,
    enabled: !!userId,
  });
}

export function useOrdersStats(userId: string) {
  return useQuery<OrdersStats>({
    queryKey: ['ordersStats', 'user', userId],
    queryFn: (): OrdersStats => {
      const userOrders = mockOrders.filter(order => order.userId === userId);
      const userBills = mockBills.filter(bill => bill.userId === userId);
      const userPayments = mockPayments?.filter(p => p.userId === userId) || [];

      return {
        totalOrders: userOrders.length,
        totalAmount: userOrders.reduce(
          (sum, order) => sum + order.totalAmount,
          0
        ),
        statusBreakdown: {
          pending: userOrders.filter(o => o.status === 'pending').length,
          confirmed: userOrders.filter(o => o.status === 'confirmed').length,
          completed: userOrders.filter(o => o.status === 'completed').length,
          cancelled: userOrders.filter(o => o.status === 'cancelled').length,
        },
        billStatusBreakdown: {
          pending: userBills.filter(b => b.status === 'pending').length,
          verifying: userBills.filter(b => b.status === 'verifying').length,
          paid: userBills.filter(b => b.status === 'paid').length,
          overdue: userBills.filter(b => b.status === 'overdue').length,
        },
        paymentMethodBreakdown: {
          cash: userOrders.filter(o => o.paymentMethod === 'cash').length,
          atm: userOrders.filter(o => o.paymentMethod === 'atm').length,
        },
        totalPaymentRecords: userPayments.length,
      };
    },
    staleTime: 5 * 60 * 1000,
    enabled: !!userId,
  });
}
