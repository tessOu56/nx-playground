'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  confirmOrder as confirmOrderApi,
  createOrder,
  listOrderTickets,
} from '@nx-playground/api-client/event-stack';

import { toPortalTicket } from '../map-event-stack-ticket';

import { useAttendeeUserId } from '@/libs/line/useAttendeeUserId';

import type {
  Order,
  Bill,
  OrderItem,
  Ticket,
  PaymentMethod,
  OrderConfirmationRequest,
  OrderConfirmationResponse,
  Event,
} from '@/types';

const confirmOrder = async (
  request: OrderConfirmationRequest
): Promise<OrderConfirmationResponse> => {
  const order = await confirmOrderApi(request.orderId);
  return {
    success: true,
    order: { id: order.id } as Order,
  };
};

// 創建訂單和帳單 (mutation)
export function useCreateOrder() {
  const queryClient = useQueryClient();
  const { userId, isReady } = useAttendeeUserId();

  return useMutation({
    mutationFn: async (orderData: {
      eventId: string;
      sessionId: string;
      tickets: { [key: string]: number };
      paymentMethod: PaymentMethod;
      totalAmount: number;
      totalTickets: number;
    }) => {
      if (!isReady) {
        throw new Error('Attendee identity is not ready');
      }
      const apiOrder = await createOrder({
        eventId: orderData.eventId,
        userId,
        data: {
          sessionId: orderData.sessionId,
          tickets: orderData.tickets,
          paymentMethod: orderData.paymentMethod,
          totalAmount: orderData.totalAmount,
          totalTickets: orderData.totalTickets,
        },
      });

      const skipPsp =
        orderData.paymentMethod === 'cash' || orderData.totalAmount === 0;
      const confirmed = skipPsp
        ? await confirmOrderApi(apiOrder.id)
        : apiOrder;
      const listed = skipPsp
        ? await listOrderTickets(confirmed.id)
        : { items: [] };

      const orderId = confirmed.id;
      const billId = `bill-${confirmed.id}`;
      const now = confirmed.createdAt;
      const dueDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

      const order: Order = {
        id: orderId,
        eventId: orderData.eventId,
        userId: confirmed.userId,
        quantity: orderData.totalTickets,
        totalAmount: orderData.totalAmount,
        status: skipPsp ? 'confirmed' : 'pending',
        paymentMethod: orderData.paymentMethod,
        createdAt: now,
        updatedAt: confirmed.updatedAt,
      };

      const bill: Bill = {
        id: billId,
        orderId,
        eventId: orderData.eventId,
        userId: confirmed.userId,
        amount: orderData.totalAmount,
        status: skipPsp ? 'paid' : 'pending',
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

      return { order, bill, tickets: listed.items.map(toPortalTicket) };
    },
    onSuccess: ({ order, bill, tickets }, variables) => {
      console.log('useCreateOrder onSuccess:', { order, bill });
      const skipPsp =
        variables.paymentMethod === 'cash' || variables.totalAmount === 0;

      // 更新訂單 cache
      queryClient.setQueryData(['orders'], (oldOrders: Order[] = []) => [
        ...oldOrders,
        order,
      ]);

      // 為新創建的訂單生成訂單項目；票券來自 confirm 契約
      const orderItems: OrderItem[] = [];

      // 根據購買的票券類型生成訂單項目和票券
      Object.entries(variables.tickets).forEach(([ticketTypeId, quantity]) => {
        const qty = quantity as number;

        // 從活動資料獲取票券類型的實際資訊
        const event = queryClient.getQueryData(['event', variables.eventId]) as
          | Event
          | undefined;
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

        // 對齊 API 出票；不另造 mock ticket id
        for (let i = 1; i <= qty; i++) {
          const issued = tickets[orderItems.length];
          const ticketId = issued?.id ?? `${order.id}-ticket-${ticketTypeId}-${i}`;
          const itemForTicket: OrderItem = {
            ...orderItem,
            id: `${orderItem.id}-${i}`,
            quantity: 1,
            totalPrice: ticketType?.price ?? 0,
            ticketId,
          };

          orderItems.push(itemForTicket);
        }
      });

      // 更新訂單狀態為已確認（因為已出票）
      const updatedOrder = {
        ...order,
        status: skipPsp ? ('confirmed' as const) : order.status,
        orderItems,
        tickets,
      };

      queryClient.setQueryData(['order', order.id], updatedOrder);
      queryClient.setQueryData(['orderItems', order.id], orderItems);
      queryClient.setQueryData(['tickets', 'order', order.id], tickets);
      queryClient.setQueryData(
        ['event-stack', 'tickets', 'order', order.id],
        tickets
      );
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
