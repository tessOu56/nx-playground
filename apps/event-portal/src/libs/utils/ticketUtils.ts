import type { OrderItemStatus, TicketStatus } from '@/types';

/**
 * OrderItem 狀態對照表
 */
export const ORDER_ITEM_STATUS_LABELS = {
  pending: '待出票',
  issued: '已出票',
  cancelled: '已取消',
} as const;

/**
 * Ticket 狀態對照表
 */
export const TICKET_STATUS_LABELS = {
  issued: '已出票',
  used: '已使用',
  cancelled: '已取消',
} as const;

/**
 * 獲取 OrderItem 狀態標籤
 *
 * @param status - OrderItem 狀態
 * @returns 狀態標籤
 */
export function getOrderItemStatusLabel(status: OrderItemStatus): string {
  return ORDER_ITEM_STATUS_LABELS[status] ?? '未知狀態';
}

/**
 * 獲取 Ticket 狀態標籤
 *
 * @param status - Ticket 狀態
 * @returns 狀態標籤
 */
export function getTicketStatusLabel(status: TicketStatus): string {
  return TICKET_STATUS_LABELS[status] ?? '未知狀態';
}

/**
 * 獲取 OrderItem 狀態顏色樣式
 *
 * @param status - OrderItem 狀態
 * @returns CSS 類名
 */
export function getOrderItemStatusColor(status: OrderItemStatus): string {
  switch (status) {
    case 'pending':
      return 'text-yellow-600';
    case 'issued':
      return 'text-green-600';
    case 'cancelled':
      return 'text-red-600';
    default:
      return 'text-gray-600';
  }
}

/**
 * 獲取 Ticket 狀態顏色樣式
 *
 * @param status - Ticket 狀態
 * @returns CSS 類名
 */
export function getTicketStatusColor(status: TicketStatus): string {
  switch (status) {
    case 'issued':
      return 'text-green-600';
    case 'used':
      return 'text-blue-600';
    case 'cancelled':
      return 'text-red-600';
    default:
      return 'text-gray-600';
  }
}

/**
 * 判斷票券是否可以報到
 *
 * @param ticketStatus - 票券狀態
 * @param orderStatus - 訂單狀態
 * @returns 是否可以報到
 */
export function canTicketCheckIn(
  ticketStatus: TicketStatus,
  orderStatus: string
): boolean {
  return ticketStatus === 'issued' && orderStatus === 'confirmed';
}

/**
 * 獲取票券報到狀態顯示文字
 *
 * @param ticketStatus - 票券狀態
 * @param orderStatus - 訂單狀態
 * @returns 狀態顯示文字和樣式
 */
export function getTicketCheckInStatus(
  ticketStatus: TicketStatus,
  orderStatus: string
): { text: string; color: string } {
  if (orderStatus !== 'confirmed') {
    return { text: '尚未付款', color: 'text-yellow-600' };
  }

  switch (ticketStatus) {
    case 'issued':
      return { text: '可報到', color: 'text-green-600' };
    case 'used':
      return { text: '已報到', color: 'text-blue-600' };
    case 'cancelled':
      return { text: '已取消', color: 'text-red-600' };
    default:
      return { text: '未知狀態', color: 'text-gray-600' };
  }
}

/**
 * 票券檢查結果類型
 */
export interface TicketCheckResult {
  isValid: boolean;
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning';
}

/**
 * 檢查票券是否存在
 *
 * @param ticket - 票券資料
 * @returns 檢查結果
 */
export function checkTicketExists(ticket: any): TicketCheckResult {
  if (!ticket) {
    return {
      isValid: false,
      title: '票券不存在',
      message: '找不到指定的票券',
      type: 'error',
    };
  }

  return {
    isValid: true,
    title: '票券有效',
    message: '票券資料載入成功',
    type: 'success',
  };
}

/**
 * 檢查訂單付款狀態
 *
 * @param orderStatus - 訂單狀態
 * @returns 檢查結果
 */
export function checkOrderPaymentStatus(
  orderStatus: string
): TicketCheckResult {
  if (orderStatus !== 'confirmed') {
    return {
      isValid: false,
      title: '尚未付款',
      message: '請先完成付款後才能使用報到功能',
      type: 'warning',
    };
  }

  return {
    isValid: true,
    title: '已付款',
    message: '訂單付款已確認',
    type: 'success',
  };
}

/**
 * 檢查票券報到狀態
 *
 * @param ticketStatus - 票券狀態
 * @returns 檢查結果
 */
export function checkTicketCheckInStatus(
  ticketStatus: TicketStatus
): TicketCheckResult {
  switch (ticketStatus) {
    case 'used':
      return {
        isValid: false,
        title: '已報到',
        message: '此票券已經報到過了',
        type: 'warning',
      };
    case 'cancelled':
      return {
        isValid: false,
        title: '票券已取消',
        message: '此票券已被取消，無法使用',
        type: 'error',
      };
    case 'issued':
      return {
        isValid: true,
        title: '可報到',
        message: '票券狀態正常，可以進行報到',
        type: 'success',
      };
    default:
      return {
        isValid: false,
        title: '未知狀態',
        message: '票券狀態異常，請聯繫客服',
        type: 'error',
      };
  }
}

/**
 * 綜合檢查票券報到資格
 *
 * @param ticket - 票券資料
 * @param orderStatus - 訂單狀態
 * @returns 檢查結果
 */
export function validateTicketForCheckIn(
  ticket: any,
  orderStatus: string
): TicketCheckResult {
  // 檢查票券是否存在
  const ticketExistsCheck = checkTicketExists(ticket);
  if (!ticketExistsCheck.isValid) {
    return ticketExistsCheck;
  }

  // 檢查訂單付款狀態
  const paymentCheck = checkOrderPaymentStatus(orderStatus);
  if (!paymentCheck.isValid) {
    return paymentCheck;
  }

  // 檢查票券報到狀態
  const checkInCheck = checkTicketCheckInStatus(ticket.status);
  return checkInCheck;
}
