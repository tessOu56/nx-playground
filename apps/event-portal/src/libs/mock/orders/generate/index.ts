import type { Order } from '@/types';

/**
 * 生成 Mock Order 資料
 *
 * @param id - Order ID
 * @param eventId - Event ID
 * @param userId - User ID
 * @param quantity - 票券數量
 * @param totalAmount - 總金額
 * @param status - 訂單狀態
 * @param paymentMethod - 付款方式
 * @returns 生成的 Order 物件
 */
export function generateOrder(
  id: string,
  eventId: string,
  userId: string,
  quantity: number,
  totalAmount: number,
  status: 'pending' | 'confirmed' | 'cancelled' = 'pending',
  paymentMethod: 'cash' | 'atm' = 'cash'
): Order {
  const now = new Date().toISOString();

  return {
    id,
    eventId,
    userId,
    quantity,
    totalAmount,
    status,
    paymentMethod,
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * 生成多個 Mock Orders
 *
 * @param count - 生成數量
 * @param baseId - 基礎 ID
 * @returns 生成的 Order 陣列
 */
export function generateMultipleOrders(
  count: number,
  baseId = 'order'
): Order[] {
  return Array.from({ length: count }, (_, index) => {
    const id = `${baseId}-${String(index + 1).padStart(3, '0')}`;
    const eventId = `event-${(index % 4) + 1}`;
    const userId = `line-user-${String((index % 10) + 1).padStart(2, '0')}`;
    const quantity = Math.floor(Math.random() * 5) + 1; // 1-5 張票
    const basePrice = Math.floor(Math.random() * 2000) + 500; // 500-2500 基礎價格
    const totalAmount = basePrice * quantity;

    const statuses: Array<'pending' | 'confirmed' | 'cancelled'> = [
      'pending',
      'confirmed',
      'cancelled',
    ];
    const paymentMethods: Array<'cash' | 'atm'> = ['cash', 'atm'];

    return generateOrder(
      id,
      eventId,
      userId,
      quantity,
      totalAmount,
      statuses[Math.floor(Math.random() * statuses.length)],
      paymentMethods[Math.floor(Math.random() * paymentMethods.length)]
    );
  });
}

/**
 * 根據訂單生成相關的 Bills 和 Payments ID
 *
 * @param order - 訂單物件
 * @returns 包含 billId 的訂單物件
 */
export function generateOrderWithBill(
  order: Order
): Order & { billId: string } {
  return {
    ...order,
    billId: `bill-${order.id}`,
  };
}
