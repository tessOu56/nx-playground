import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { mockBills } from '../../mock/bills';

import type { Bill } from '@/types';

// 獲取所有帳單
export function useBills() {
  return useQuery({
    queryKey: ['bills'],
    queryFn: () => mockBills,
    staleTime: 5 * 60 * 1000,
  });
}

// 根據用戶 ID 獲取帳單
export function useBillsByUser(userId: string) {
  return useQuery({
    queryKey: ['bills', 'user', userId],
    queryFn: () => mockBills.filter((bill: Bill) => bill.userId === userId),
    staleTime: 5 * 60 * 1000,
    enabled: !!userId,
  });
}

// 根據訂單 ID 獲取帳單
export function useBillByOrder(orderId: string) {
  return useQuery({
    queryKey: ['bill', 'order', orderId],
    queryFn: () => mockBills.find((bill: Bill) => bill.orderId === orderId),
    staleTime: 5 * 60 * 1000,
    enabled: !!orderId,
  });
}

// 更新帳單狀態 (mutation)
export function useUpdateBillStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      billId,
      status,
    }: {
      billId: string;
      status: Bill['status'];
    }) => {
      // 模擬 API 調用
      // const response = await api.put(`/bills/${billId}`, { status });
      // return response.data;

      return { billId, status };
    },
    onSuccess: ({ billId, status }) => {
      // 更新帳單 cache
      queryClient.setQueryData(['bills'], (oldBills: Bill[] = []) =>
        oldBills.map(bill =>
          bill.id === billId
            ? {
                ...bill,
                status,
                updatedAt: new Date().toISOString(),
                ...(status === 'paid' && { paidAt: new Date().toISOString() }),
              }
            : bill
        )
      );

      // 更新特定帳單
      queryClient.setQueryData(
        ['bill', 'order'],
        (oldBill: Bill | undefined) => {
          if (!oldBill || oldBill.id !== billId) return oldBill;
          return {
            ...oldBill,
            status,
            updatedAt: new Date().toISOString(),
            ...(status === 'paid' && { paidAt: new Date().toISOString() }),
          };
        }
      );

      // 更新用戶相關的帳單
      queryClient.invalidateQueries({
        queryKey: ['bills', 'user'],
      });
    },
  });
}
