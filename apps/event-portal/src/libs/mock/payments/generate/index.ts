import type { Payment, PaymentRecordStatus } from '@/types';

/**
 * 生成 Mock Payment 資料
 *
 * @param id - Payment ID
 * @param billId - Bill ID
 * @param orderId - Order ID
 * @param eventId - Event ID
 * @param userId - User ID
 * @param amount - 支付金額
 * @param status - 支付狀態
 * @param paymentMethod - 付款方式
 * @param paymentProvider - 支付服務提供商
 * @returns 生成的 Payment 物件
 */
export function generatePayment(
  id: string,
  billId: string,
  orderId: string,
  eventId: string,
  userId: string,
  amount: number,
  status: PaymentRecordStatus = 'pending',
  paymentMethod: 'cash' | 'atm' = 'cash',
  paymentProvider?: string
): Payment {
  const now = new Date().toISOString();
  const processedTime = status === 'completed' ? now : undefined;
  const failedTime = status === 'failed' ? now : undefined;

  return {
    id,
    billId,
    orderId,
    eventId,
    userId,
    amount,
    status,
    paymentMethod,
    paymentProvider:
      paymentProvider ??
      (paymentMethod === 'cash' ? 'on-site' : 'bank-transfer'),
    transactionId:
      status === 'completed'
        ? `${paymentMethod.toUpperCase()}-${Date.now()}-${Math.floor(
            Math.random() * 1000
          )}`
        : undefined,
    createdAt: now,
    updatedAt: now,
    processedAt: processedTime,
    failedAt: failedTime,
    failureReason:
      status === 'failed' ? 'Payment processing failed' : undefined,
  };
}

/**
 * 生成多個 Mock Payments
 *
 * @param count - 生成數量
 * @param baseId - 基礎 ID
 * @returns 生成的 Payment 陣列
 */
export function generateMultiplePayments(
  count: number,
  baseId = 'payment'
): Payment[] {
  return Array.from({ length: count }, (_, index) => {
    const id = `${baseId}-${String(index + 1).padStart(3, '0')}`;
    const billId = `bill-${String(index + 1).padStart(3, '0')}`;
    const orderId = `order-${String(index + 1).padStart(3, '0')}`;
    const eventId = `event-${(index % 4) + 1}`;
    const userId = `line-user-${String((index % 10) + 1).padStart(2, '0')}`;
    const amount = Math.floor(Math.random() * 3000) + 500; // 500-3500

    const statuses: Array<
      | 'pending'
      | 'processing'
      | 'completed'
      | 'failed'
      | 'cancelled'
      | 'refunded'
      | 'partial_refunded'
    > = [
      'pending',
      'processing',
      'completed',
      'failed',
      'cancelled',
      'refunded',
    ];
    const paymentMethods: Array<'cash' | 'atm'> = ['cash', 'atm'];
    const providers = ['on-site', 'bank-transfer', 'third-party'];

    return generatePayment(
      id,
      billId,
      orderId,
      eventId,
      userId,
      amount,
      statuses[Math.floor(Math.random() * statuses.length)],
      paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
      providers[Math.floor(Math.random() * providers.length)]
    );
  });
}

/**
 * 根據 Bill 生成對應的 Payment
 *
 * @param billId - Bill ID
 * @param orderId - Order ID
 * @param eventId - Event ID
 * @param userId - User ID
 * @param amount - 支付金額
 * @param paymentMethod - 付款方式
 * @returns 生成的 Payment 物件
 */
export function generatePaymentFromBill(
  billId: string,
  orderId: string,
  eventId: string,
  userId: string,
  amount: number,
  paymentMethod: 'cash' | 'atm'
): Payment {
  const paymentId = `payment-${billId.replace('bill-', '')}`;

  return generatePayment(
    paymentId,
    billId,
    orderId,
    eventId,
    userId,
    amount,
    'pending',
    paymentMethod
  );
}
