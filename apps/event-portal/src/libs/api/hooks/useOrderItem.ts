import { useQuery } from '@tanstack/react-query';

import { mockOrderItems } from '../../mock/orderItems';
import { mockRegistrationForms } from '../../mock/registrationForms';

// 根據訂單 ID 獲取訂單項目
export function useOrderItems(orderId: string) {
  return useQuery({
    queryKey: ['orderItems', orderId],
    queryFn: () => {
      console.log('useOrderItems queryFn called for orderId:', orderId);

      const orderItems = mockOrderItems.filter(
        item => item.orderId === orderId
      );

      // 為每個 orderItem 添加對應的報名表
      const enhancedOrderItems = orderItems.map(orderItem => {
        const registrationForm = mockRegistrationForms.find(
          form => form.orderItemId === orderItem.id
        );
        return {
          ...orderItem,
          registrationForm,
        };
      });

      return enhancedOrderItems;
    },
    staleTime: 5 * 60 * 1000,
    enabled: !!orderId,
  });
}
