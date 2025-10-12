import type { Ticket } from '@/types';

// Mock 票券數據
export const mockTickets: Ticket[] = [
  // P05b - order-001 的票券 (現場付款且已付款，已出票)
  {
    id: 'order-001-ticket-1',
    orderId: 'order-001',
    eventId: 'event-1',
    type: 'standard',
    status: 'issued',
    createdAt: '2024-02-15T10:30:00Z',
    updatedAt: '2024-02-15T10:30:00Z',
  },
  {
    id: 'order-001-ticket-2',
    orderId: 'order-001',
    eventId: 'event-1',
    type: 'standard',
    status: 'issued',
    createdAt: '2024-02-15T10:30:00Z',
    updatedAt: '2024-02-15T10:30:00Z',
  },
  // P05f - order-005 出票中，所以還沒有票券資料
  // P05g - order-006 的票券 (ATM轉帳完成已出票)
  {
    id: 'order-006-ticket-1',
    orderId: 'order-006',
    eventId: 'event-1',
    type: 'standard',
    status: 'issued',
    createdAt: '2024-02-10T08:20:00Z',
    updatedAt: '2024-02-10T08:20:00Z',
  },
  {
    id: 'order-006-ticket-2',
    orderId: 'order-006',
    eventId: 'event-1',
    type: 'standard',
    status: 'issued',
    createdAt: '2024-02-10T08:20:00Z',
    updatedAt: '2024-02-10T08:20:00Z',
  },
  {
    id: 'order-006-ticket-3',
    orderId: 'order-006',
    eventId: 'event-1',
    type: 'standard',
    status: 'issued',
    createdAt: '2024-02-10T08:20:00Z',
    updatedAt: '2024-02-10T08:20:00Z',
  },
  {
    id: 'order-006-ticket-4',
    orderId: 'order-006',
    eventId: 'event-1',
    type: 'standard',
    status: 'used',
    createdAt: '2024-02-10T08:20:00Z',
    updatedAt: '2024-02-10T18:00:00Z',
  },
];
