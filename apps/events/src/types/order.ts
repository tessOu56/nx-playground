// 導入相關類型
import type { Bill, PaymentMethod } from './bill';
import type { OrderItem } from './orderItem';
import type { Ticket } from './ticket';

// 基本訂單類型（核心欄位）
export interface Order {
  id: string;
  eventId: string;
  userId: string;
  quantity: number; // 總購買數量
  totalAmount: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod; // 用戶選擇的付款方式
  createdAt: string;
  updatedAt: string;
  confirmedBy?: string;
  confirmedAt?: string;
}

// 完整訂單資料（包含關聯資料）
export interface OrderWithDetails extends Order {
  orderItems: OrderItem[];
  tickets: Ticket[];
  bill: Bill;
  bills: Bill[];
}

export type OrderStatus =
  | 'pending' // 待付款
  | 'confirmed' // 已確認
  | 'completed' // 已完成
  | 'cancelled'; // 已取消
