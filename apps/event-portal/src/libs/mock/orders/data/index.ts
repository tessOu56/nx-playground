import type { Order } from '@/types';

// Mock 訂單數據
export const mockOrders: Order[] = [
  // P05a - 選擇現場付款且還未付款
  {
    id: 'order-002',
    eventId: 'event-1',
    userId: 'user-001',
    quantity: 1,
    totalAmount: 750,
    status: 'pending',
    paymentMethod: 'cash',
    createdAt: '2024-02-14T09:15:00Z',
    updatedAt: '2024-02-14T09:15:00Z',
  },
  // P05b - 選擇現場付款且已付款(當付款時等同於出票, 也是麵包屑主要流程展示的)
  {
    id: 'order-001',
    eventId: 'event-1',
    userId: 'user-001',
    quantity: 2,
    totalAmount: 1500,
    status: 'confirmed',
    paymentMethod: 'cash',
    createdAt: '2024-02-15T10:30:00Z',
    updatedAt: '2024-02-15T10:30:00Z',
  },
  // P05c - 選擇atm轉帳且還未付款
  {
    id: 'order-003',
    eventId: 'event-1',
    userId: 'user-001',
    quantity: 3,
    totalAmount: 2250,
    status: 'pending',
    paymentMethod: 'atm',
    createdAt: '2024-02-13T14:20:00Z',
    updatedAt: '2024-02-13T14:20:00Z',
  },
  // P05d - 選擇atm轉帳、用戶已匯款回報且主辦方核帳中
  {
    id: 'order-004',
    eventId: 'event-1',
    userId: 'user-001',
    quantity: 2,
    totalAmount: 1500,
    status: 'pending',
    paymentMethod: 'atm',
    createdAt: '2024-02-12T16:45:00Z',
    updatedAt: '2024-02-12T16:45:00Z',
  },
  // P05f - ATM轉帳完成出票中（帳單已付款但票券還在出票中）
  {
    id: 'order-005',
    eventId: 'event-1',
    userId: 'user-001',
    quantity: 1,
    totalAmount: 750,
    status: 'confirmed',
    paymentMethod: 'atm',
    createdAt: '2024-02-11T11:30:00Z',
    updatedAt: '2024-02-11T11:30:00Z',
  },
  // P05g - ATM轉帳完成已出票（帳單已付款且所有票券都已出票）
  {
    id: 'order-006',
    eventId: 'event-1',
    userId: 'user-001',
    quantity: 4,
    totalAmount: 3000,
    status: 'confirmed',
    paymentMethod: 'atm',
    createdAt: '2024-02-10T08:20:00Z',
    updatedAt: '2024-02-10T08:20:00Z',
  },
  // P05b - 現場付款完成出票中（帳單已付款但票券還在出票中）
  {
    id: 'order-007',
    eventId: 'event-1',
    userId: 'user-001',
    quantity: 2,
    totalAmount: 1500,
    status: 'confirmed',
    paymentMethod: 'cash',
    createdAt: '2024-02-16T09:15:00Z',
    updatedAt: '2024-02-16T09:15:00Z',
  },
];
