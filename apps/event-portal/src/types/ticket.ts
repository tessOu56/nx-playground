// 票券類型定義

export interface Ticket {
  id: string;
  orderId: string;
  eventId: string;
  orderItemId?: string; // 關聯的訂單項目 ID
  type: string; // 票券類型
  status: TicketStatus;
  createdAt: string;
  updatedAt: string;
  usedAt?: string; // 使用時間
  cancelledAt?: string; // 取消時間
}

export type TicketStatus =
  | 'issued' // 已出票
  | 'used' // 已使用
  | 'cancelled'; // 已取消

export interface TicketWithDetails extends Ticket {
  orderItem?: import('./orderItem').OrderItem;
  registrationForm?: import('./registrationForm').RegistrationForm;
}

// 票券驗證詳情類型
export interface TicketVerificationDetails {
  ticket: Ticket;
  event: any; // TODO: 應該使用 Event 類型
  order: import('./order').Order;
  isValid: boolean;
  verificationTime: string;
}
