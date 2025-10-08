import type { Order, Bill, OrderItem } from '@/types';

/**
 * 根據訂單和帳單狀態決定訂單場景
 *
 * @param order - 訂單資料
 * @param bill - 帳單資料
 * @param orderItems - 訂單項目（用於判斷出票狀態）
 * @returns 訂單場景代碼 (P05a-P05f) 或 'unknown'
 */
export function getOrderScenario(
  order: Order,
  bill?: Bill,
  orderItems?: OrderItem[]
): string {
  if (!bill) return 'unknown';

  // 使用訂單的付款方式（用戶選擇）和帳單的付款狀態（實際狀態）
  if (order.paymentMethod === 'cash') {
    if (bill.status === 'pending') return 'P05a'; // 現場付款待付款
    if (bill.status === 'paid') {
      // 檢查是否所有票券都已出票
      const allTicketsIssued =
        orderItems?.every(item => item.status === 'issued') ?? false;
      if (allTicketsIssued) {
        return 'P05c'; // 現場付款完成已出票
      } else {
        return 'P05b'; // 現場付款完成出票中
      }
    }
  } else if (order.paymentMethod === 'atm') {
    if (bill.status === 'pending') return 'P05d'; // ATM轉帳待付款
    if (bill.status === 'verifying') return 'P05e'; // ATM轉帳核帳中
    if (bill.status === 'paid') {
      // 檢查是否所有票券都已出票
      const allTicketsIssued =
        orderItems?.every(item => item.status === 'issued') ?? false;
      if (allTicketsIssued) {
        return 'P05g'; // ATM轉帳完成已出票
      } else {
        return 'P05f'; // ATM轉帳完成出票中
      }
    }
  }

  return 'unknown';
}

/**
 * 訂單場景描述對照表
 */
export const ORDER_SCENARIO_DESCRIPTIONS = {
  // 現場付款流程
  P05a: '現場付款待付款',
  P05b: '現場付款完成出票中',
  P05c: '現場付款完成已出票',

  // ATM 轉帳流程
  P05d: 'ATM轉帳待付款',
  P05e: 'ATM轉帳核帳中',
  P05f: 'ATM轉帳完成出票中',
  P05g: 'ATM轉帳完成已出票',

  unknown: '未知狀態',
} as const;

/**
 * 獲取訂單場景描述
 *
 * @param scenario - 訂單場景代碼
 * @returns 場景描述
 */
export function getOrderScenarioDescription(scenario: string): string {
  return (
    ORDER_SCENARIO_DESCRIPTIONS[
      scenario as keyof typeof ORDER_SCENARIO_DESCRIPTIONS
    ] || '未知狀態'
  );
}
