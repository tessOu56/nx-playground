// 帳單類型定義

export interface Bill {
  id: string;
  orderId: string;
  eventId: string;
  userId: string;
  amount: number;
  status: BillStatus;
  paymentMethod: PaymentMethod;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  paidAt?: string;
  qrCode?: string;
  transferAccount?: string; // ATM 轉帳帳號
  transferAmount?: number; // 轉帳金額
}

export type BillStatus =
  | 'pending' // 待付款
  | 'verifying' // 核帳中
  | 'paid' // 已付款
  | 'overdue' // 逾期
  | 'cancelled'; // 已取消

export type PaymentMethod =
  | 'cash' // 現金付款
  | 'atm'; // ATM 轉帳

export interface BillWithDetails extends Bill {
  order?: import('./order').Order;
  payments?: import('./payment').Payment[];
}
