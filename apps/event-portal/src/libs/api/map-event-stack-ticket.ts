import type { EventStackTicket } from '@nx-playground/api-client/event-stack';

import type { Ticket, TicketStatus } from '../../types/ticket';

export function toPortalTicket(api: EventStackTicket): Ticket {
  const status: TicketStatus =
    api.status === 'used' || api.status === 'cancelled' ? api.status : 'issued';
  return {
    id: api.id,
    orderId: api.orderId,
    eventId: api.eventId,
    type: api.type,
    status,
    createdAt: api.createdAt,
    updatedAt: api.updatedAt,
    usedAt: api.checkedInAt,
  };
}
