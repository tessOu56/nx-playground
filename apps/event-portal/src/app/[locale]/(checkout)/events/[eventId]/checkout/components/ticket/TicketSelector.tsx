'use client';

import { TicketCard } from './TicketCard';
import { TicketError } from './TicketError';

import { useToast } from '@/components';
import { useCheckoutStore } from '@/stores/checkoutStore';
import type { Event, Session, SessionTicket } from '@/types';

interface TicketSelectorProps {
  event: Event;
}

export function TicketSelector({ event }: TicketSelectorProps) {
  const { selectedSession, selectedTickets, updateTicketQuantity } =
    useCheckoutStore();
  const { addToast } = useToast();

  if (!selectedSession) {
    return <TicketError type='no-session-selected' />;
  }

  // 處理票券數量變更
  const handleTicketQuantityChange = (ticketId: string, change: number) => {
    const currentQuantity = selectedTickets[ticketId] ?? 0;
    const newQuantity = Math.max(0, currentQuantity + change);

    // 找到對應的票券資訊
    const ticket = event.sessions
      ?.flatMap((s: Session) => s.tickets)
      .find((t: SessionTicket) => t.id === ticketId);

    if (!ticket) return;

    // 檢查是否超過可用數量
    const maxQuantity = ticket.availableQuantity;
    const finalQuantity = Math.min(newQuantity, maxQuantity);

    // 使用 store 方法更新票券數量
    updateTicketQuantity(ticketId, finalQuantity);

    // 如果嘗試超過可用數量，顯示提示
    if (newQuantity > maxQuantity) {
      addToast({
        message: `${ticket.name} 最多只能選擇 ${maxQuantity} 張`,
        type: 'warning',
        duration: 3000,
      });
    }
  };

  // 找到選中的場次
  const selectedSessionData = event.sessions?.find(
    (session: Session) => session.id === selectedSession
  );

  // 檢查是否有票券資料
  const hasTickets =
    selectedSessionData?.tickets && selectedSessionData.tickets.length > 0;

  if (!hasTickets) {
    return <TicketError type='no-tickets' />;
  }

  return (
    <div className='bg-white rounded-lg shadow-md p-6' data-ticket-selector>
      <h2 className='text-xl font-semibold text-gray-900 mb-4'>選擇票卷</h2>

      <div className='space-y-4'>
        {selectedSessionData.tickets.map(ticket => {
          const quantity = selectedTickets[ticket.id] ?? 0;

          return (
            <TicketCard
              key={ticket.id}
              event={event}
              ticket={ticket}
              quantity={quantity}
              onQuantityChange={handleTicketQuantityChange}
            />
          );
        })}
      </div>
    </div>
  );
}
