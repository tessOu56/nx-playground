import type { Payment } from '@/types';

// Mock 支付記錄數據
export const mockPayments: Payment[] = [
  // order-001 的支付記錄 - 現金付款待處理
  {
    id: 'payment-001',
    billId: 'bill-001',
    orderId: 'order-001',
    eventId: 'event-1',
    userId: 'line-user-01',
    amount: 1500,
    status: 'pending',
    paymentMethod: 'cash',
    paymentProvider: 'on-site',
    createdAt: '2024-02-15T10:30:00Z',
    updatedAt: '2024-02-15T10:30:00Z',
  },
  // order-002 的支付記錄 - 現金付款已完成
  {
    id: 'payment-002',
    billId: 'bill-002',
    orderId: 'order-002',
    eventId: 'event-1',
    userId: 'line-user-01',
    amount: 750,
    status: 'completed',
    paymentMethod: 'cash',
    paymentProvider: 'on-site',
    transactionId: 'cash-20240214-001',
    createdAt: '2024-02-14T09:15:00Z',
    updatedAt: '2024-02-14T09:20:00Z',
    processedAt: '2024-02-14T09:20:00Z',
  },
  // order-003 的支付記錄 - ATM 轉帳已完成
  {
    id: 'payment-003',
    billId: 'bill-003',
    orderId: 'order-003',
    eventId: 'event-1',
    userId: 'line-user-01',
    amount: 2250,
    status: 'completed',
    paymentMethod: 'atm',
    paymentProvider: 'bank-transfer',
    transactionId: 'ATM-20240213-001',
    createdAt: '2024-02-13T14:20:00Z',
    updatedAt: '2024-02-13T14:25:00Z',
    processedAt: '2024-02-13T14:25:00Z',
  },
];
