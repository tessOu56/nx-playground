import { useQuery } from '@tanstack/react-query';

import { mockEvents, mockEventDetails } from '../../mock/events';

// 獲取所有活動
export function useEvents() {
  return useQuery({
    queryKey: ['events'],
    queryFn: () => mockEvents,
    staleTime: 5 * 60 * 1000, // 5分鐘
  });
}

// 根據 ID 獲取特定活動（返回完整 EventDetail）
export function useEvent(eventId: string) {
  return useQuery({
    queryKey: ['event', eventId],
    queryFn: () => mockEventDetails.find(event => event.id === eventId),
    staleTime: 5 * 60 * 1000, // 5分鐘
    enabled: !!eventId,
  });
}

// 根據主辦方 ID 獲取活動
export function useEventsByVendor(vendorId: string) {
  return useQuery({
    queryKey: ['events', 'vendor', vendorId],
    queryFn: () => mockEvents.filter(event => event.vendorId === vendorId),
    staleTime: 5 * 60 * 1000, // 5分鐘
    enabled: !!vendorId,
  });
}
