import type { Bill } from '@/types';

/**
 * 生成 Mock Bill 資料
 *
 * @param id - Bill ID
 * @param orderId - Order ID
 * @param eventId - Event ID
 * @param userId - User ID
 * @param amount - 金額
 * @param status - 狀態
 * @param paymentMethod - 付款方式
 * @returns 生成的 Bill 物件
 */
export function generateBill(
  id: string,
  orderId: string,
  eventId: string,
  userId: string,
  amount: number,
  status: 'pending' | 'paid' | 'cancelled' = 'pending',
  paymentMethod: 'cash' | 'atm' = 'cash'
): Bill {
  const now = new Date().toISOString();
  const dueDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(); // 7天後到期

  return {
    id,
    orderId,
    eventId,
    userId,
    amount,
    status,
    paymentMethod,
    dueDate,
    createdAt: now,
    updatedAt: now,
    qrCode: `qr-code-${id}`,
    ...(status === 'paid' && { paidAt: now }),
  };
}

/**
 * 生成多個 Mock Bills
 *
 * @param count - 生成數量
 * @param baseId - 基礎 ID
 * @returns 生成的 Bill 陣列
 */
export function generateMultipleBills(count: number, baseId = 'bill'): Bill[] {
  return Array.from({ length: count }, (_, index) => {
    const id = `${baseId}-${String(index + 1).padStart(3, '0')}`;
    const orderId = `order-${String(index + 1).padStart(3, '0')}`;
    const eventId = `event-${(index % 4) + 1}`;
    const userId = `line-user-${String((index % 10) + 1).padStart(2, '0')}`;
    const amount = Math.floor(Math.random() * 3000) + 500; // 500-3500
    const statuses: Array<'pending' | 'paid' | 'cancelled'> = [
      'pending',
      'paid',
      'cancelled',
    ];
    const paymentMethods: Array<'cash' | 'atm'> = ['cash', 'atm'];

    return generateBill(
      id,
      orderId,
      eventId,
      userId,
      amount,
      statuses[Math.floor(Math.random() * statuses.length)],
      paymentMethods[Math.floor(Math.random() * paymentMethods.length)]
    );
  });
}
