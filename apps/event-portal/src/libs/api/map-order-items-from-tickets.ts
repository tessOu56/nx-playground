import type { EventStackTicket } from '@nx-playground/api-client/event-stack';

import type { OrderItem, OrderItemStatus } from '@/types';

function ticketStatusToOrderItemStatus(status: string): OrderItemStatus {
  if (status === 'cancelled') return 'cancelled';
  if (status === 'pending') return 'pending';
  return 'issued';
}

/** One Nest ticket → one portal order line (refresh-safe; no mock cache). */
export function mapTicketToOrderItem(ticket: EventStackTicket): OrderItem {
  return {
    id: ticket.id,
    orderId: ticket.orderId,
    eventId: ticket.eventId,
    sessionId: 'default',
    ticketTypeId: ticket.type,
    ticketTypeName: ticket.type,
    quantity: 1,
    unitPrice: 0,
    totalPrice: 0,
    status: ticketStatusToOrderItemStatus(ticket.status),
    createdAt: ticket.createdAt,
    updatedAt: ticket.updatedAt,
    ticketId: ticket.id,
  };
}
