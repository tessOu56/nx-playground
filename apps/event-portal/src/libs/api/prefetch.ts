import { type QueryClient } from '@tanstack/react-query';

import { fetchPortalEvent, fetchPortalEvents } from './hooks/useEvents';
import { ENV_CONFIG } from '../constants';
import { mockBills } from '../mock/bills';
import { mockOrders } from '../mock/orders';
import { mockUsers } from '../mock/users';
import { mockVendors } from '../mock/vendors';

import type { Vendor, User, Order, Bill } from '@/types';

/**
 * Server-side 資料預取函數
 * 用於在 Server Components 中初始化 query cache
 * 實現 SSR + React Query 的無閃爍渲染
 */

export async function prefetchEvents(queryClient: QueryClient) {
  await queryClient.prefetchQuery({
    queryKey: ['events'],
    queryFn: fetchPortalEvents,
    staleTime: 5 * 60 * 1000,
  });
}

export async function prefetchEvent(queryClient: QueryClient, eventId: string) {
  await queryClient.prefetchQuery({
    queryKey: ['event', eventId],
    queryFn: () => fetchPortalEvent(eventId),
    staleTime: 5 * 60 * 1000,
  });
}

export async function prefetchEventsByVendor(
  queryClient: QueryClient,
  vendorId: string
) {
  await queryClient.prefetchQuery({
    queryKey: ['events', 'vendor', vendorId],
    queryFn: async () => {
      const events = await fetchPortalEvents();
      return events.filter(event => event.vendorId === vendorId);
    },
    staleTime: 5 * 60 * 1000,
  });
}

export async function prefetchVendors(queryClient: QueryClient) {
  if (!ENV_CONFIG.ENABLE_MOCK_DATA) return;

  await queryClient.prefetchQuery({
    queryKey: ['vendors'],
    queryFn: () => mockVendors,
    staleTime: 5 * 60 * 1000,
  });
}

export async function prefetchVendor(
  queryClient: QueryClient,
  vendorId: string
) {
  if (!ENV_CONFIG.ENABLE_MOCK_DATA) return;

  await queryClient.prefetchQuery({
    queryKey: ['vendor', vendorId],
    queryFn: () => mockVendors.find((vendor: Vendor) => vendor.id === vendorId),
    staleTime: 5 * 60 * 1000,
  });
}

export async function prefetchUsers(queryClient: QueryClient) {
  if (!ENV_CONFIG.ENABLE_MOCK_DATA) return;

  await queryClient.prefetchQuery({
    queryKey: ['users'],
    queryFn: () => mockUsers,
    staleTime: 5 * 60 * 1000,
  });
}

export async function prefetchUser(queryClient: QueryClient, userId: string) {
  if (!ENV_CONFIG.ENABLE_MOCK_DATA) return;

  await queryClient.prefetchQuery({
    queryKey: ['user', userId],
    queryFn: () => mockUsers.find((user: User) => user.id === userId),
    staleTime: 5 * 60 * 1000,
  });
}

export async function prefetchOrdersByUser(
  queryClient: QueryClient,
  userId: string
) {
  if (!ENV_CONFIG.ENABLE_MOCK_DATA) return;

  await queryClient.prefetchQuery({
    queryKey: ['orders', 'user', userId],
    queryFn: () => mockOrders.filter((order: Order) => order.userId === userId),
    staleTime: 5 * 60 * 1000,
  });
}

export async function prefetchOrder(queryClient: QueryClient, orderId: string) {
  if (!ENV_CONFIG.ENABLE_MOCK_DATA) return;

  await queryClient.prefetchQuery({
    queryKey: ['order', orderId],
    queryFn: () => mockOrders.find((order: Order) => order.id === orderId),
    staleTime: 5 * 60 * 1000,
  });
}

export async function prefetchBillsByUser(
  queryClient: QueryClient,
  userId: string
) {
  if (!ENV_CONFIG.ENABLE_MOCK_DATA) return;

  await queryClient.prefetchQuery({
    queryKey: ['bills', 'user', userId],
    queryFn: () => mockBills.filter((bill: Bill) => bill.userId === userId),
    staleTime: 5 * 60 * 1000,
  });
}

export async function prefetchBillByOrder(
  queryClient: QueryClient,
  orderId: string
) {
  if (!ENV_CONFIG.ENABLE_MOCK_DATA) return;

  await queryClient.prefetchQuery({
    queryKey: ['bill', 'order', orderId],
    queryFn: () => mockBills.find((bill: Bill) => bill.orderId === orderId),
    staleTime: 5 * 60 * 1000,
  });
}

export async function prefetchEventPage(
  queryClient: QueryClient,
  eventId: string
) {
  await Promise.all([
    prefetchEvent(queryClient, eventId),
    prefetchEvents(queryClient),
  ]);
}

export async function prefetchVendorPage(
  queryClient: QueryClient,
  vendorId: string
) {
  await Promise.all([
    prefetchVendor(queryClient, vendorId),
    prefetchEventsByVendor(queryClient, vendorId),
  ]);
}

export async function prefetchOrderPage(
  queryClient: QueryClient,
  orderId: string
) {
  await Promise.all([
    prefetchOrder(queryClient, orderId),
    prefetchBillByOrder(queryClient, orderId),
  ]);
}

export async function prefetchUserDashboard(
  queryClient: QueryClient,
  userId: string
) {
  await Promise.all([
    prefetchUser(queryClient, userId),
    prefetchOrdersByUser(queryClient, userId),
    prefetchBillsByUser(queryClient, userId),
  ]);
}
