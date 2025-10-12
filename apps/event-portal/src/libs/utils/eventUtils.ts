/**
 * 檢查活動是否即將到來（10天內）
 */
export function isEventUpcoming(eventDate: string): boolean {
  const eventDateTime = new Date(eventDate);
  const now = new Date();
  const diffTime = eventDateTime.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays > 0 && diffDays <= 10;
}

/**
 * 檢查活動是否已過舉辦時間
 */
export function isEventCompleted(eventDate: string): boolean {
  const eventDateTime = new Date(eventDate);
  const now = new Date();

  return eventDateTime < now;
}

/**
 * 檢查票券是否可以販售
 * 已過舉辦時間的活動即使票券有剩也無法販售
 */
export function canSellTicket(
  eventDate: string,
  availableQuantity: number
): boolean {
  if (isEventCompleted(eventDate)) {
    return false;
  }

  return availableQuantity > 0;
}
