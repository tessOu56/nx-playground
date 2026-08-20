'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  checkInTicket,
  getTicket,
  listOrderTickets,
  verifyTicket,
} from '@nx-playground/api-client/event-stack';

import { toPortalTicket } from '../map-event-stack-ticket';

import type { TicketVerificationDetails } from '@/types';

export function useTicket(ticketId: string) {
  return useQuery({
    queryKey: ['event-stack', 'ticket', ticketId],
    queryFn: async () => toPortalTicket(await getTicket(ticketId)),
    staleTime: 5 * 60 * 1000,
    enabled: !!ticketId,
  });
}

export function useOrderTickets(orderId: string) {
  return useQuery({
    queryKey: ['event-stack', 'tickets', 'order', orderId],
    queryFn: async () => {
      const listed = await listOrderTickets(orderId);
      return listed.items.map(toPortalTicket);
    },
    staleTime: 5 * 60 * 1000,
    enabled: !!orderId,
  });
}

export function useTicketVerification(ticketId: string) {
  return useQuery({
    queryKey: ['event-stack', 'ticket-verification', ticketId],
    queryFn: async (): Promise<TicketVerificationDetails> => {
      const verified = await verifyTicket(ticketId);
      return {
        ticket: toPortalTicket(verified.ticket),
        event: {
          id: verified.event.id,
          title: verified.event.title,
          date: verified.event.startDate,
          location: verified.event.location ?? '',
        },
        order: {
          id: verified.order.id,
          eventId: verified.order.eventId,
          userId: verified.order.userId,
          quantity: Number(verified.order.data.totalTickets ?? 1) || 1,
          totalAmount: Number(verified.order.data.totalAmount ?? 0) || 0,
          status: verified.order.status,
          createdAt: verified.order.createdAt,
          updatedAt: verified.order.updatedAt,
        },
        isValid: verified.isValid,
        verificationTime: verified.verificationTime,
      } as TicketVerificationDetails;
    },
    staleTime: 1 * 60 * 1000,
    enabled: !!ticketId,
  });
}

export function useTicketCheckIn() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ticketId: string) => checkInTicket(ticketId),
    onSuccess: (_data, ticketId) => {
      queryClient.invalidateQueries({
        queryKey: ['event-stack', 'ticket', ticketId],
      });
      queryClient.invalidateQueries({
        queryKey: ['event-stack', 'ticket-verification', ticketId],
      });
      queryClient.invalidateQueries({
        queryKey: ['event-stack', 'tickets'],
      });
    },
  });
}
