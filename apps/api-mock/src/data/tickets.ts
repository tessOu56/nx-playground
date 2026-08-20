export interface TicketRecord {
  id: string;
  orderId: string;
  eventId: string;
  type: string;
  status: string;
  checkedInAt?: string;
  createdAt: string;
  updatedAt: string;
}

export function ticketSpecsFromOrderData(
  data: Record<string, unknown>
): { type: string; quantity: number }[] {
  const raw = data.tickets;
  if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
    const specs = Object.entries(raw as Record<string, unknown>)
      .map(([type, qty]) => ({
        type,
        quantity: Math.floor(Number(qty) || 0),
      }))
      .filter(spec => spec.type.length > 0 && spec.quantity > 0);
    if (specs.length > 0) return specs;
  }
  const total = Math.max(1, Math.floor(Number(data.totalTickets ?? 1) || 1));
  return [{ type: 'general', quantity: total }];
}

export function ticketIsValidForCheckIn(
  ticket: TicketRecord,
  orderStatus: string
): boolean {
  return ticket.status === 'issued' && orderStatus === 'confirmed';
}
