import { useQuery } from '@tanstack/react-query';

import { mockVendors } from '../../mock/vendors';

// 獲取所有主辦方
export function useVendors() {
  return useQuery({
    queryKey: ['vendors'],
    queryFn: () => mockVendors,
    staleTime: 5 * 60 * 1000,
  });
}

// 根據 ID 獲取主辦方
export function useVendor(vendorId: string) {
  return useQuery({
    queryKey: ['vendor', vendorId],
    queryFn: () => mockVendors.find(vendor => vendor.id === vendorId),
    staleTime: 5 * 60 * 1000,
    enabled: !!vendorId,
  });
}
