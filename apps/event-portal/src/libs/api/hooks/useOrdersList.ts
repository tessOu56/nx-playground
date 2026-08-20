import { useQuery } from '@tanstack/react-query';
import { listEvents, listOrders } from '@nx-playground/api-client/event-stack';
import type { EventStackOrder } from '@nx-playground/api-client/event-stack';

import { mockBills } from '../../mock/bills';
import { mockOrders } from '../../mock/orders';
import { mockPayments } from '../../mock/payments';

import type { OrderListItem, OrdersStats } from '@/types/orderList';
import type { PaymentMethod } from '@/types/bill';
import type { OrderStatus } from '@/types/order';

const DEMO_USER_ID = 'user_demo';

function paymentMethodFromData(data: Record<string, unknown>): PaymentMethod {
  return data.paymentMethod === 'atm' ? 'atm' : 'cash';
}

function orderStatusFromApi(status: string): OrderStatus {
  if (
    status === 'pending' ||
    status === 'confirmed' ||
    status === 'completed' ||
    status === 'cancelled'
  ) {
    return status;
  }
  return 'pending';
}

function toListItem(
  order: EventStackOrder,
  event?: { title?: string; startDate?: string }
): OrderListItem {
  const quantity =
    Number(order.data.totalTickets ?? order.data.quantity ?? 1) || 1;
  const totalAmount = Number(order.data.totalAmount ?? 0) || 0;
  return {
    id: order.id,
    eventId: order.eventId,
    userId: order.userId,
    quantity,
    totalAmount,
    status: orderStatusFromApi(order.status),
    paymentMethod: paymentMethodFromData(order.data),
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
    itemsCount: quantity,
    eventTitle: event?.title,
    eventDate: event?.startDate,
    billStatus: order.status,
    paymentRecords: 0,
    orderItemsSummary: {
      totalItems: quantity,
      ticketTypes: [],
    },
  };
}

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
        toListItem(order, eventsById.get(order.eventId))
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
