/**
 * Payment scenario 對照表
 */
export const PAYMENT_SCENARIO_LABELS = {
  // 現場付款流程
  P05a: '現場付款待付款',
  P05b: '現場付款完成出票中',
  P05c: '現場付款完成已出票',

  // ATM 轉帳流程
  P05d: 'ATM 轉帳待付款',
  P05e: 'ATM 轉帳核帳中',
  P05f: 'ATM 轉帳完成出票中',
  P05g: 'ATM 轉帳完成已出票',

  // 第三方支付流程 (預留)
  P05h: '第三方支付完成出票中',
  P05i: '第三方支付完成已出票',

  // 退費流程 (預留)
  P05j: '部分票券核准退費中',
  P05k: '部分票券退費中',
  P05l: '部分票券已退費',

  // 訂單取消流程 (預留)
  P05m: '訂單取消核准中',
  P05n: '訂單取消確認退費中',
  P05o: '訂單取消已退費',

  unknown: '未知付款狀態',
} as const;

/**
 * Payment scenario 描述對照表
 */
export const PAYMENT_SCENARIO_DESCRIPTIONS = {
  // 現場付款流程
  P05a: '請到活動現場出示此 QR Code 進行付款',
  P05b: '付款已完成，正在為您出票，請稍候',
  P05c: '付款已完成，您的票券已生效',

  // ATM 轉帳流程
  P05d: '請完成 ATM 轉帳並填寫確認表單',
  P05e: '我們正在核對您的轉帳資訊，請耐心等候',
  P05f: '轉帳已確認，正在為您出票，請稍候',
  P05g: '轉帳已完成，您的票券已生效',

  // 第三方支付流程 (預留)
  P05h: '第三方支付已完成，正在為您出票，請稍候',
  P05i: '第三方支付已完成，您的票券已生效',

  // 退費流程 (預留)
  P05j: '部分票券退費申請已提交，等待核准',
  P05k: '部分票券退費核准中，請耐心等候',
  P05l: '部分票券退費已完成',

  // 訂單取消流程 (預留)
  P05m: '訂單取消申請已提交，等待核准',
  P05n: '訂單取消核准，正在處理退費',
  P05o: '訂單已取消，退費已完成',

  unknown: '付款狀態異常，請聯絡客服',
} as const;

/**
 * 獲取付款場景標題
 *
 * @param scenario - 付款場景代碼
 * @returns 場景標題
 */
export function getPaymentScenarioLabel(scenario: string): string {
  return (
    PAYMENT_SCENARIO_LABELS[scenario as keyof typeof PAYMENT_SCENARIO_LABELS] ||
    '未知付款狀態'
  );
}

/**
 * 獲取付款場景描述
 *
 * @param scenario - 付款場景代碼
 * @returns 場景描述
 */
export function getPaymentScenarioDescription(scenario: string): string {
  return (
    PAYMENT_SCENARIO_DESCRIPTIONS[
      scenario as keyof typeof PAYMENT_SCENARIO_DESCRIPTIONS
    ] || '付款狀態異常，請聯絡客服'
  );
}

/**
 * 獲取付款場景顏色樣式
 *
 * @param scenario - 付款場景代碼
 * @returns CSS 類名
 */
export function getPaymentScenarioColor(scenario: string): string {
  switch (scenario) {
    case 'P05a': // 現場付款待付款
    case 'P05d': // ATM 轉帳待付款
      return 'text-yellow-600';
    case 'P05e': // ATM 轉帳核帳中
    case 'P05j': // 部分票券核准退費中
    case 'P05m': // 訂單取消核准中
      return 'text-blue-600';
    case 'P05b': // 現場付款完成出票中
    case 'P05f': // ATM 轉帳完成出票中
    case 'P05h': // 第三方支付完成出票中
    case 'P05k': // 部分票券退費中
    case 'P05n': // 訂單取消確認退費中
      return 'text-orange-600';
    case 'P05c': // 現場付款完成已出票
    case 'P05g': // ATM 轉帳完成已出票
    case 'P05i': // 第三方支付完成已出票
    case 'P05l': // 部分票券已退費
    case 'P05o': // 訂單取消已退費
      return 'text-green-600';
    default:
      return 'text-gray-600';
  }
}

/**
 * 檢查是否為待付款狀態
 *
 * @param scenario - 付款場景代碼
 * @returns 是否為待付款狀態
 */
export function isPendingPayment(scenario: string): boolean {
  return scenario === 'P05a' || scenario === 'P05d';
}

/**
 * 檢查是否為處理中狀態
 *
 * @param scenario - 付款場景代碼
 * @returns 是否為處理中狀態
 */
export function isProcessingPayment(scenario: string): boolean {
  return (
    scenario === 'P05e' ||
    scenario === 'P05j' ||
    scenario === 'P05k' ||
    scenario === 'P05m' ||
    scenario === 'P05n'
  );
}

/**
 * 檢查是否為出票中狀態
 *
 * @param scenario - 付款場景代碼
 * @returns 是否為出票中狀態
 */
export function isIssuingTickets(scenario: string): boolean {
  return scenario === 'P05b' || scenario === 'P05f' || scenario === 'P05h';
}

/**
 * 檢查是否為已完成狀態
 *
 * @param scenario - 付款場景代碼
 * @returns 是否為已完成狀態
 */
export function isCompletedPayment(scenario: string): boolean {
  return scenario === 'P05c' || scenario === 'P05g' || scenario === 'P05i';
}

/**
 * 檢查是否為退費相關狀態
 *
 * @param scenario - 付款場景代碼
 * @returns 是否為退費相關狀態
 */
export function isRefundRelated(scenario: string): boolean {
  return (
    scenario === 'P05j' ||
    scenario === 'P05k' ||
    scenario === 'P05l' ||
    scenario === 'P05m' ||
    scenario === 'P05n' ||
    scenario === 'P05o'
  );
}
