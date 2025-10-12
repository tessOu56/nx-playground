import type { BillStatus } from '@/types';

/**
 * Bill 狀態對照表
 */
export const BILL_STATUS_LABELS = {
  pending: '待付款',
  verifying: '核帳中',
  paid: '已付款',
  overdue: '逾期',
  cancelled: '已取消',
} as const;

/**
 * 獲取 Bill 狀態標籤
 *
 * @param status - Bill 狀態
 * @returns 狀態標籤
 */
export function getBillStatusLabel(status: BillStatus): string {
  return BILL_STATUS_LABELS[status] || '未知狀態';
}

/**
 * 獲取 Bill 狀態顏色樣式
 *
 * @param status - Bill 狀態
 * @returns CSS 類名
 */
export function getBillStatusColor(status: BillStatus): string {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'verifying':
      return 'bg-blue-100 text-blue-800';
    case 'paid':
      return 'bg-green-100 text-green-800';
    case 'overdue':
      return 'bg-red-100 text-red-800';
    case 'cancelled':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

/**
 * 獲取 Bill 狀態文字顏色樣式（不含背景）
 *
 * @param status - Bill 狀態
 * @returns CSS 類名
 */
export function getBillStatusTextColor(status: BillStatus): string {
  switch (status) {
    case 'pending':
      return 'text-yellow-600';
    case 'verifying':
      return 'text-blue-600';
    case 'paid':
      return 'text-green-600';
    case 'overdue':
      return 'text-red-600';
    case 'cancelled':
      return 'text-gray-600';
    default:
      return 'text-gray-600';
  }
}
