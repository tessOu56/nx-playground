import { useQuery } from '@tanstack/react-query';
import { listOrderTickets } from '@nx-playground/api-client/event-stack';

import { mapTicketToOrderItem } from '../map-order-items-from-tickets';

export function useOrderItems(orderId: string) {
  return useQuery({
    queryKey: ['event-stack', 'orderItems', orderId],
    queryFn: async () => {
      const listed = await listOrderTickets(orderId);
      return listed.items.map(mapTicketToOrderItem);
    },
    staleTime: 5 * 60 * 1000,
    enabled: !!orderId,
  });
}
