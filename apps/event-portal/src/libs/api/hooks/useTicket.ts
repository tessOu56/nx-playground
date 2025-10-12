import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { ENV_CONFIG } from '../../constants';
import { mockEvents } from '../../mock/events';
import { mockOrders } from '../../mock/orders';
import { mockTickets } from '../../mock/tickets';

import type { TicketVerificationDetails } from '@/types';

// 根據票券 ID 獲取單一票券
export function useTicket(ticketId: string) {
  return useQuery({
    queryKey: ['ticket', ticketId],
    queryFn: () => {
      const ticket = mockTickets.find(t => t.id === ticketId);
      if (!ticket) {
        throw new Error(`Ticket with id ${ticketId} not found`);
      }
      return ticket;
    },
    staleTime: 5 * 60 * 1000,
    enabled: !!ticketId,
  });
}

// 根據訂單 ID 獲取票券
export function useOrderTickets(orderId: string) {
  return useQuery({
    queryKey: ['tickets', 'order', orderId],
    queryFn: () => {
      console.log('useOrderTickets queryFn called for orderId:', orderId);
      return mockTickets.filter(t => t.orderId === orderId);
    },
    staleTime: 5 * 60 * 1000,
    enabled: !!orderId,
  });
}

// 票券驗證 API 函數
const getTicketVerification = async (
  ticketId: string
): Promise<TicketVerificationDetails> => {
  try {
    const response = await fetch(
      `${ENV_CONFIG.API_BASE_URL}/api/tickets/${ticketId}/verify`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch {
    // 使用 mock 資料
    const ticket = mockTickets.find(t => t.id === ticketId);
    if (!ticket) {
      throw new Error(`Ticket with id ${ticketId} not found`);
    }

    const order = mockOrders.find(o => o.id === ticket.orderId);
    if (!order) {
      throw new Error(`Order for ticket ${ticketId} not found`);
    }

    const event = mockEvents.find(e => e.id === ticket.eventId);
    if (!event) {
      throw new Error(`Event for ticket ${ticketId} not found`);
    }

    return {
      ticket,
      event,
      order,
      isValid: true,
      verificationTime: new Date().toISOString(),
    };
  }
};

// 票券驗證 Hook
export function useTicketVerification(ticketId: string) {
  return useQuery({
    queryKey: ['ticket-verification', ticketId],
    queryFn: () => getTicketVerification(ticketId),
    staleTime: 1 * 60 * 1000, // 1 分鐘
    enabled: !!ticketId,
  });
}

// 票券銷票 Mutation
export function useTicketCheckIn() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ticketId: string) => {
      const response = await fetch(
        `${ENV_CONFIG.API_BASE_URL}/api/tickets/${ticketId}/check-in`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    },
    onSuccess: (data, ticketId) => {
      // 更新票券狀態
      queryClient.setQueryData(
        ['ticket-verification', ticketId],
        (oldData: TicketVerificationDetails) => {
          if (oldData) {
            return {
              ...oldData,
              ticket: { ...oldData.ticket, status: 'used' as const },
            };
          }
          return oldData;
        }
      );

      // 更新相關訂單資料
      const orderId = mockTickets.find(t => t.id === ticketId)?.orderId;
      if (orderId) {
        queryClient.invalidateQueries({
          queryKey: ['order', orderId],
        });
      }
    },
  });
}
