import type { SessionTicket, Ticket } from '@/types';

// 票卷類型配置
const ticketTypes = [
  { name: '早鳥票', priceRatio: 0.8, quantityRatio: 0.5 },
  { name: '一般票', priceRatio: 1.0, quantityRatio: 0.5 },
  { name: 'VIP票', priceRatio: 1.5, quantityRatio: 0.2 },
  { name: '學生票', priceRatio: 0.7, quantityRatio: 0.3 },
  { name: '團體票', priceRatio: 0.9, quantityRatio: 0.4 },
];

// 售票狀態配置
const ticketStatuses: Array<'selling' | 'sold_out' | 'stopped'> = [
  'selling',
  'selling',
  'selling',
  'sold_out',
  'stopped',
]; // 80% 在販售，15% 售完，5% 停售

/**
 * 生成隨機的 SessionTicket
 */
export function generateSessionTicket(
  sessionId: string,
  ticketId: string,
  basePrice: number,
  totalCapacity: number
): SessionTicket {
  const ticketType =
    ticketTypes[Math.floor(Math.random() * ticketTypes.length)];
  const price = Math.round(basePrice * ticketType.priceRatio);
  const quantity = Math.max(
    1,
    Math.round(totalCapacity * ticketType.quantityRatio)
  );
  const availableQuantity = Math.floor(quantity * (0.3 + Math.random() * 0.7)); // 30-100% 可售
  const status =
    ticketStatuses[Math.floor(Math.random() * ticketStatuses.length)];

  // 根據狀態調整可售票數
  const finalAvailableQuantity = status === 'sold_out' ? 0 : availableQuantity;

  // 生成售票時間範圍
  const now = new Date();
  const saleStart = new Date(
    now.getTime() + Math.random() * 60 * 24 * 60 * 60 * 1000
  ); // 60天內開始
  const saleEnd = new Date(
    saleStart.getTime() + (30 + Math.random() * 60) * 24 * 60 * 60 * 1000
  ); // 30-90天後結束

  return {
    id: ticketId,
    sessionId,
    name: ticketType.name,
    description: `${ticketType.name} - 限量發售`,
    price,
    totalQuantity: quantity,
    availableQuantity: finalAvailableQuantity,
    status,
    saleStartTime: saleStart.toISOString(),
    saleEndTime: saleEnd.toISOString(),
    type: ticketType.name.includes('早鳥')
      ? 'early-bird'
      : ticketType.name.includes('VIP')
      ? 'vip'
      : ticketType.name.includes('學生')
      ? 'student'
      : 'regular',
  };
}

/**
 * 為場次生成多張票卷
 */
export function generateTicketsForSession(
  sessionId: string,
  basePrice: number,
  totalCapacity: number,
  ticketCount = 2
): SessionTicket[] {
  const tickets: SessionTicket[] = [];

  for (let i = 1; i <= ticketCount; i++) {
    const ticketId = `${sessionId}-ticket-${i}`;
    const ticket = generateSessionTicket(
      sessionId,
      ticketId,
      basePrice,
      totalCapacity
    );
    tickets.push(ticket);
  }

  return tickets;
}

/**
 * 生成 Mock Ticket 資料
 */
export function generateTicket(
  id: string,
  orderId: string,
  eventId: string,
  type = 'general',
  status: 'issued' | 'used' | 'cancelled' = 'issued'
): Ticket {
  const now = new Date().toISOString();

  return {
    id,
    orderId,
    eventId,
    type,
    status,
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * 批量生成多個 Ticket
 */
export function generateMultipleTickets(
  count: number,
  baseId = 'ticket'
): Ticket[] {
  const types = ['general', 'vip', 'early_bird', 'standard'];
  const statuses: Array<'issued' | 'used' | 'cancelled'> = [
    'issued',
    'used',
    'cancelled',
  ];

  const tickets: Ticket[] = [];

  for (let i = 1; i <= count; i++) {
    const ticketId = `${baseId}-${i}`;
    const orderId = `order-${String(i).padStart(3, '0')}`;
    const eventId = `event-${String(i).padStart(3, '0')}`;
    const type = types[Math.floor(Math.random() * types.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];

    const ticket = generateTicket(ticketId, orderId, eventId, type, status);
    tickets.push(ticket);
  }

  return tickets;
}
