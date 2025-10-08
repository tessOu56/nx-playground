// 訂單項目類型定義

export interface OrderItem {
  id: string;
  orderId: string;
  eventId: string;
  sessionId: string; // 活動場次 ID
  ticketTypeId: string; // 票券類型 ID
  ticketTypeName: string; // 票券類型名稱
  quantity: number; // 購買數量（通常為 1，一個 OrderItem = 一張票）
  unitPrice: number; // 單價
  totalPrice: number; // 小計
  status: OrderItemStatus; // 訂單項目狀態
  createdAt: string;
  updatedAt: string;
  ticketId?: string; // 出票後的票券 ID
  registrationFormId?: string; // 報名表 ID（如果已填寫）
  registrationFormData?: Record<string, any>; // 報名表資料
}

export type OrderItemStatus =
  | 'pending' // 待出票
  | 'issued' // 已出票
  | 'cancelled'; // 已取消

export interface OrderItemWithDetails extends OrderItem {
  ticket?: import('./ticket').Ticket;
  registrationForm?: import('./registrationForm').RegistrationForm;
}

// 報名表相關介面
export interface OrderItemRegistration {
  orderItemId: string;
  formTemplateId: string;
  formData: Record<string, any>;
  status: 'draft' | 'submitted' | 'confirmed';
  createdAt: string;
  updatedAt: string;
}
