import { useQuery } from '@tanstack/react-query';

import { mockBills } from '../../mock/bills';
import { mockEvents } from '../../mock/events';
import { mockOrderItems } from '../../mock/orderItems';
import { mockOrders } from '../../mock/orders';
import { mockPayments } from '../../mock/payments';

import type { OrderListItem, OrdersStats } from '@/types/orderList';

// 根據用戶 ID 獲取訂單列表（包含聚合資料）
export function useOrdersListByUser(userId: string) {
  return useQuery({
    queryKey: ['ordersList', 'user', userId],
    queryFn: (): OrderListItem[] => {
      // 獲取用戶的訂單並聚合相關資料

      // 1. 獲取用戶的訂單
      const userOrders = mockOrders.filter(order => order.userId === userId);

      // 2. 為每個訂單聚合相關資料
      const ordersWithDetails: OrderListItem[] = userOrders.map(order => {
        // 獲取訂單項目
        const orderItems = mockOrderItems.filter(
          item => item.orderId === order.id
        );

        // 獲取活動資訊
        const event = mockEvents.find(e => e.id === order.eventId);

        // 獲取帳單資訊
        const bills = mockBills.filter(b => b.orderId === order.id);
        const [primaryBill] = bills; // 主要帳單

        // 獲取付款記錄
        const payments =
          mockPayments?.filter(p => p.orderId === order.id) || [];

        // 統計訂單項目
        const ticketTypes = [
          ...new Set(orderItems.map(item => item.ticketTypeName)),
        ];

        return {
          ...order,
          // 統計資料
          itemsCount: orderItems.length,
          eventTitle: event?.title,
          eventDate: event?.date,

          // 帳單和付款狀態
          billStatus: primaryBill?.status ?? 'unknown',
          paymentRecords: payments.length,

          // 訂單項目摘要
          orderItemsSummary: {
            totalItems: orderItems.length,
            ticketTypes,
          },
        };
      });

      return ordersWithDetails;
    },
    staleTime: 5 * 60 * 1000,
    enabled: !!userId,
  });
}

// 獲取訂單統計資料
export function useOrdersStats(userId: string) {
  return useQuery<OrdersStats>({
    queryKey: ['ordersStats', 'user', userId],
    queryFn: (): OrdersStats => {
      // 計算用戶的訂單統計資料

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
