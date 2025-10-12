import { mockEvents } from '../events';

/**
 * 更新指定場次票券的可售數量
 *
 * @param sessionId - 場次 ID
 * @param ticketId - 票券 ID
 * @param soldQuantity - 售出數量
 * @returns 是否更新成功
 */
export function updateTicketQuantity(
  sessionId: string,
  ticketId: string,
  soldQuantity: number
): boolean {
  // 找到對應的活動
  const event = mockEvents.find(e => e.sessions.some(s => s.id === sessionId));

  if (!event) {
    console.error(`找不到場次 ${sessionId} 對應的活動`);
    return false;
  }

  // 找到對應的場次
  const session = event.sessions.find(s => s.id === sessionId);
  if (!session) {
    console.error(`找不到場次 ${sessionId}`);
    return false;
  }

  // 找到對應的票券
  const ticket = session.tickets.find(t => t.id === ticketId);
  if (!ticket) {
    console.error(`找不到票券 ${ticketId}`);
    return false;
  }

  // 檢查可售數量是否足夠
  if (ticket.availableQuantity < soldQuantity) {
    console.error(
      `票券 ${ticketId} 可售數量不足: ${ticket.availableQuantity} < ${soldQuantity}`
    );
    return false;
  }

  // 更新可售數量
  ticket.availableQuantity -= soldQuantity;

  // 如果可售數量為 0，更新狀態為售完
  if (ticket.availableQuantity === 0) {
    ticket.status = 'sold_out';
  }

  // 更新場次的當前參加人數
  session.currentAttendees += soldQuantity;

  console.log(
    `成功更新票券 ${ticketId}: 售出 ${soldQuantity} 張，剩餘 ${ticket.availableQuantity} 張`
  );
  return true;
}

/**
 * 批量更新多張票券的可售數量
 *
 * @param ticketUpdates - 票券更新資料陣列
 * @returns 更新結果
 */
export function updateMultipleTicketQuantities(
  ticketUpdates: Array<{
    sessionId: string;
    ticketId: string;
    soldQuantity: number;
  }>
): { success: boolean; errors: string[] } {
  const errors: string[] = [];
  let allSuccess = true;

  for (const update of ticketUpdates) {
    const success = updateTicketQuantity(
      update.sessionId,
      update.ticketId,
      update.soldQuantity
    );

    if (!success) {
      allSuccess = false;
      errors.push(`更新票券 ${update.ticketId} 失敗`);
    }
  }

  return {
    success: allSuccess,
    errors,
  };
}
