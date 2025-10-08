import type { PaymentMethod } from './bill';

// 支付記錄類型定義
export interface Payment {
  id: string;
  billId: string; // 關聯的帳單 ID
  orderId: string; // 關聯的訂單 ID
  eventId: string; // 關聯的活動 ID
  userId: string; // 付款用戶 ID
  amount: number; // 支付金額
  status: PaymentRecordStatus;
  paymentMethod: PaymentMethod;
  paymentProvider?: string; // 支付服務提供商
  transactionId?: string; // 第三方交易 ID
  createdAt: string;
  updatedAt: string;
  processedAt?: string; // 處理完成時間
  failedAt?: string; // 失敗時間
  failureReason?: string; // 失敗原因
  refundAmount?: number; // 退款金額
  refundedAt?: string; // 退款時間
  refundReason?: string; // 退款原因
}

export type PaymentRecordStatus =
  | 'pending' // 待處理
  | 'processing' // 處理中
  | 'completed' // 已完成
  | 'failed' // 失敗
  | 'cancelled' // 已取消
  | 'refunded' // 已退款
  | 'partial_refunded'; // 部分退款

export type PaymentStatus =
  | 'pending' // 待付款
  | 'verifying' // 核帳中
  | 'paid' // 已付款
  | 'failed' // 付款失敗
  | 'refunded' // 已退款
  | 'expired' // 已過期
  | 'cancelled'; // 已取消
