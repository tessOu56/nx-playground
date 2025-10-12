import { useMutation, useQueryClient } from '@tanstack/react-query';

import { ENV_CONFIG } from '../../constants';
import { mockEvents } from '../../mock/events';
import { updateMultipleTicketQuantities } from '../../mock/tickets/utils';

import type {
  Order,
  Bill,
  OrderItem,
  Ticket,
  PaymentMethod,
  OrderConfirmationRequest,
  OrderConfirmationResponse,
} from '@/types';

const confirmOrder = async (
  request: OrderConfirmationRequest
): Promise<OrderConfirmationResponse> => {
  const response = await fetch(
    `${ENV_CONFIG.API_BASE_URL}/api/orders/${request.orderId}/confirm`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to confirm order: ${response.statusText}`);
  }

  return await response.json();
};

// 創建訂單和帳單 (mutation)
export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderData: {
      eventId: string;
      sessionId: string;
      tickets: { [key: string]: number };
      paymentMethod: PaymentMethod;
      totalAmount: number;
      totalTickets: number;
    }) => {
      const orderId = `order-${Date.now()}`;
      const billId = `bill-${Date.now()}`;
      const now = new Date().toISOString();
      const dueDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

      // 更新票券數量
      const ticketUpdates = Object.entries(orderData.tickets).map(
        ([ticketId, quantity]) => ({
          sessionId: orderData.sessionId,
          ticketId,
          soldQuantity: quantity,
        })
      );

      const updateResult = updateMultipleTicketQuantities(ticketUpdates);
      if (!updateResult.success) {
        throw new Error(`更新票券數量失敗: ${updateResult.errors.join(', ')}`);
      }

      const order: Order = {
        id: orderId,
        eventId: orderData.eventId,
        userId: 'line-user-01', // 暫時使用固定用戶ID
        quantity: orderData.totalTickets,
        totalAmount: orderData.totalAmount,
        status: 'pending',
        paymentMethod: orderData.paymentMethod,
        createdAt: now,
        updatedAt: now,
      };

      const bill: Bill = {
        id: billId,
        orderId,
        eventId: orderData.eventId,
        userId: 'line-user-01',
        amount: orderData.totalAmount,
        status: 'pending',
        paymentMethod: orderData.paymentMethod,
        dueDate,
        createdAt: now,
        updatedAt: now,
        ...(orderData.paymentMethod === 'cash' && {
          qrCode: `qr-code-${Date.now()}`,
        }),
        ...(orderData.paymentMethod === 'atm' && {
          transferAccount: '12345',
          transferAmount: orderData.totalAmount,
        }),
      };

      // 在實際應用中，這裡會調用 API
      // const response = await api.post('/orders', { order, bill });
      // return response.data;

      return { order, bill };
    },
    onSuccess: ({ order, bill }, variables) => {
      console.log('useCreateOrder onSuccess:', { order, bill });

      // 更新訂單 cache
      queryClient.setQueryData(['orders'], (oldOrders: Order[] = []) => [
        ...oldOrders,
        order,
      ]);

      // 為新創建的訂單生成票券和訂單項目
      const orderItems: OrderItem[] = [];
      const tickets: Ticket[] = [];

      // 根據購買的票券類型生成訂單項目和票券
      Object.entries(variables.tickets).forEach(([ticketTypeId, quantity]) => {
        const qty = quantity as number;

        // 從活動資料獲取票券類型的實際資訊
        const event = mockEvents.find(e => e.id === variables.eventId);
        const session = event?.sessions.find(s => s.id === variables.sessionId);
        const ticketType = session?.tickets?.find(
          (t: any) => t.id === ticketTypeId
        );

        // 生成訂單項目
        const orderItem: OrderItem = {
          id: `${order.id}-item-${ticketTypeId}`,
          orderId: order.id,
          eventId: variables.eventId,
          sessionId: variables.sessionId,
          ticketTypeId,
          ticketTypeName: ticketType?.name ?? `票券類型 ${ticketTypeId}`,
          quantity: qty,
          unitPrice: ticketType?.price ?? 0,
          totalPrice: (ticketType?.price ?? 0) * qty,
          status: 'issued', // 直接出票
          createdAt: order.createdAt,
          updatedAt: order.updatedAt,
          // ticketId 會在生成票券時設置
        };

        // 生成票券 - 根據數量生成對應的 OrderItems 和 Tickets
        for (let i = 1; i <= qty; i++) {
          const ticketId = `${order.id}-ticket-${ticketTypeId}-${i}`;
          const ticket: Ticket = {
            id: ticketId,
            orderId: order.id,
            eventId: variables.eventId,
            type: ticketTypeId,
            status: 'issued',
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
          };

          // 為每張票建立一個 OrderItem
          const itemForTicket: OrderItem = {
            ...orderItem,
            id: `${orderItem.id}-${i}`,
            quantity: 1, // 每個 OrderItem 都是 1 張票
            totalPrice: ticketType?.price ?? 0,
            ticketId,
          };

          tickets.push(ticket);
          orderItems.push(itemForTicket);
        }
      });

      // 更新訂單狀態為已確認（因為已出票）
      const updatedOrder = {
        ...order,
        status: 'confirmed' as const,
        orderItems,
        tickets,
      };

      queryClient.setQueryData(['order', order.id], updatedOrder);
      queryClient.setQueryData(['orderItems', order.id], orderItems);
      queryClient.setQueryData(['tickets', 'order', order.id], tickets);
      queryClient.setQueryData(['bill', 'order', order.id], bill);

      console.log('Order stored in cache with key:', ['order', order.id]);

      queryClient.setQueryData(
        ['orders', 'user', order.userId],
        (oldOrders: Order[] = []) => [...oldOrders, order]
      );

      // 更新帳單 cache
      queryClient.setQueryData(['bills'], (oldBills: Bill[] = []) => [
        ...oldBills,
        bill,
      ]);

      queryClient.setQueryData(
        ['bills', 'user', bill.userId],
        (oldBills: Bill[] = []) => [...oldBills, bill]
      );
    },
  });
}

// 更新訂單狀態 (mutation)
export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      orderId,
      status,
    }: {
      orderId: string;
      status?: Order['status'];
    }) => {
      // 模擬 API 調用
      // const response = await api.put(`/orders/${orderId}`, { status });
      // return response.data;

      return { orderId, status };
    },
    onSuccess: ({ orderId, status }) => {
      // 更新訂單 cache
      queryClient.setQueryData(
        ['order', orderId],
        (oldOrder: Order | undefined) => {
          if (!oldOrder) return oldOrder;
          return {
            ...oldOrder,
            status: status ?? oldOrder.status,
            updatedAt: new Date().toISOString(),
          };
        }
      );

      // 更新所有訂單列表
      queryClient.setQueryData(['orders'], (oldOrders: Order[] = []) =>
        oldOrders.map(order =>
          order.id === orderId
            ? {
                ...order,
                status: status ?? order.status,
                updatedAt: new Date().toISOString(),
              }
            : order
        )
      );

      // 更新用戶相關的訂單
      queryClient.invalidateQueries({
        queryKey: ['orders', 'user'],
      });
    },
  });
}

// 確認訂單 (mutation)
export function useConfirmOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: confirmOrder,
    onSuccess: (response, variables) => {
      // 更新訂單狀態
      queryClient.setQueryData(
        ['order', variables.orderId],
        (oldOrder: Order | undefined) => {
          if (!oldOrder) return oldOrder;
          return {
            ...oldOrder,
            status: 'confirmed',
            updatedAt: new Date().toISOString(),
          };
        }
      );

      // 更新所有訂單列表
      queryClient.setQueryData(['orders'], (oldOrders: Order[] = []) =>
        oldOrders.map(order =>
          order.id === variables.orderId
            ? {
                ...order,
                status: 'confirmed',
                updatedAt: new Date().toISOString(),
              }
            : order
        )
      );

      // 更新相關查詢
      queryClient.invalidateQueries({
        queryKey: ['orders', 'user'],
      });
    },
  });
}
