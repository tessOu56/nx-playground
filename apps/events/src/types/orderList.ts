import type { Order } from './order';

// 訂單列表的聚合資料類型
export interface OrderListItem extends Order {
  // 統計資料
  itemsCount: number; // 訂單項目數量
  eventTitle?: string; // 活動名稱
  eventDate?: string; // 活動日期

  // 帳單和付款狀態
  billStatus: string; // 帳單狀態
  paymentRecords: number; // 付款記錄數量

  // 訂單項目摘要
  orderItemsSummary: {
    totalItems: number;
    ticketTypes: string[]; // 票券類型列表
  };
}

// 訂單統計資料類型
export interface OrdersStats {
  totalOrders: number;
  totalAmount: number;
  statusBreakdown: {
    pending: number;
    confirmed: number;
    completed: number;
    cancelled: number;
  };
  billStatusBreakdown: {
    pending: number;
    verifying: number;
    paid: number;
    overdue: number;
  };
  paymentMethodBreakdown: {
    cash: number;
    atm: number;
  };
  totalPaymentRecords: number;
}
