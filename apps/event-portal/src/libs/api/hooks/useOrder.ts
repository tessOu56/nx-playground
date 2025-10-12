import { useQuery } from '@tanstack/react-query';

import { mockOrders } from '../../mock/orders';

// 獲取所有訂單
export function useOrders() {
  return useQuery({
    queryKey: ['orders'],
    queryFn: () => mockOrders,
    staleTime: 5 * 60 * 1000,
  });
}

// 根據用戶 ID 獲取訂單
export function useOrdersByUser(userId: string) {
  return useQuery({
    queryKey: ['orders', 'user', userId],
    queryFn: () => mockOrders.filter(order => order.userId === userId),
    staleTime: 5 * 60 * 1000,
    enabled: !!userId,
  });
}

// 根據 ID 獲取訂單
export function useOrder(orderId: string) {
  return useQuery({
    queryKey: ['order', orderId],
    queryFn: () => {
      console.log('useOrder queryFn called for orderId:', orderId);

      // 從 mock 資料中查找訂單
      const order = mockOrders.find(order => order.id === orderId);
      if (!order) {
        console.error(
          `Order with id ${orderId} not found in mockOrders:`,
          mockOrders
        );
        throw new Error(`Order with id ${orderId} not found`);
      }

      // 只返回純粹的 order 資料
      return order;
    },
    staleTime: 5 * 60 * 1000,
    enabled: !!orderId,
  });
}
