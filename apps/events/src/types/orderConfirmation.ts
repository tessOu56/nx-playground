import type { Order } from './order';

// 訂單確認相關類型定義

export interface OrderConfirmationRequest {
  orderId: string;
  staffId: string;
  staffName: string;
  confirmationTime: string;
}

export interface OrderConfirmationResponse {
  success: boolean;
  order: Order;
  message?: string;
}

export interface OrderConfirmationDetails {
  order: Order;
  confirmedBy: string;
  confirmedAt: string;
  confirmationMethod: 'manual' | 'auto';
}
