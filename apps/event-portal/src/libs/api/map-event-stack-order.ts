import type { EventStackOrder } from '@nx-playground/api-client/event-stack';

import type { PaymentMethod } from '../../types/bill';
import type { Order, OrderStatus } from '../../types/order';
import type { OrderListItem } from '../../types/orderList';

export function paymentMethodFromData(
  data: Record<string, unknown>
): PaymentMethod {
  if (data.paymentMethod === 'atm') return 'atm';
  if (data.paymentMethod === 'third_party') return 'third_party';
  return 'cash';
}

export function orderStatusFromApi(status: string): OrderStatus {
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

export function toPortalOrder(api: EventStackOrder): Order {
  const quantity =
    Number(api.data.totalTickets ?? api.data.quantity ?? 1) || 1;
  const totalAmount = Number(api.data.totalAmount ?? 0) || 0;
  return {
    id: api.id,
    eventId: api.eventId,
    userId: api.userId,
    quantity,
    totalAmount,
    status: orderStatusFromApi(api.status),
    paymentMethod: paymentMethodFromData(api.data),
    createdAt: api.createdAt,
    updatedAt: api.updatedAt,
  };
}

export function toPortalOrderListItem(
  api: EventStackOrder,
  event?: { title?: string; startDate?: string }
): OrderListItem {
  const order = toPortalOrder(api);
  return {
    ...order,
    itemsCount: order.quantity,
    eventTitle: event?.title,
    eventDate: event?.startDate,
    billStatus: api.status,
    paymentRecords: 0,
    orderItemsSummary: {
      totalItems: order.quantity,
      ticketTypes: [],
    },
  };
}
