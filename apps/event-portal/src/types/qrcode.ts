// QR Code 類型定義
export type QRCodeType = 'order' | 'ticket' | 'payment';

// 基礎 QR Code 資料介面
export interface BaseQRCodeData {
  type: QRCodeType;
  timestamp: number;
  signature: string;
}

// 訂單 QR Code 資料
export interface OrderQRCodeData extends BaseQRCodeData {
  type: 'order';
  orderId: string;
  eventId: string;
  amount: number;
}

// 票券 QR Code 資料
export interface TicketQRCodeData extends BaseQRCodeData {
  type: 'ticket';
  ticketId: string;
  orderId: string;
  eventId: string;
}

// 付款 QR Code 資料
export interface PaymentQRCodeData extends BaseQRCodeData {
  type: 'payment';
  orderId: string;
  eventId: string;
  amount: number;
}

// 聯合類型
export type QRCodeData = OrderQRCodeData | TicketQRCodeData | PaymentQRCodeData;

// 兼容舊版 OrderQRCode 介面
export interface OrderQRCode {
  orderId: string;
  eventId: string;
  amount: number;
  timestamp: number;
  signature: string;
}

// QR Code 生成器配置
export interface QRCodeGeneratorConfig {
  signature: string;
  timestamp?: number;
}
