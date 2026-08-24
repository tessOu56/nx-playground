'use client';

import { Button } from '@/components';
import { TicketButton } from '@/components/ticket';
import { canSellTicket, isEventUpcoming } from '@/libs/utils/eventUtils';
import type { EventDetail, Session } from '@/types';

interface EventSessionCardProps {
  event: EventDetail;
  session: Session;
  eventId: string;
  isSelected?: boolean;
  onSessionSelect?: (sessionId: string) => void;
  onTicketClick: (eventId: string, sessionId: string, ticketId: string) => void;
  onRegisterClick: (sessionId: string) => void;
}

export function EventSessionCard({
  event,
  session,
  eventId,
  isSelected = false,
  onSessionSelect,
  onTicketClick,
  onRegisterClick,
}: EventSessionCardProps) {
  const hasAvailableTickets =
    session.tickets?.some(ticket =>
      canSellTicket(event.date, ticket.availableQuantity, ticket)
    ) ?? false;

  return (
    <div
      className={`border rounded-lg p-4 transition-all ${
        isSelected
          ? 'border-blue-500 bg-blue-50 shadow-md'
          : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
      }`}
    >
      <div className='flex items-start justify-between mb-4'>
        <div className='flex-1'>
          <div className='flex items-center gap-3 mb-2'>
            <h3 className='text-lg font-semibold text-gray-900'>
              {session.name}
            </h3>
            {isSelected && (
              <span className='inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium'>
                已選擇
              </span>
            )}
            {isEventUpcoming(event.date) && (
              <span className='inline-block bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full font-medium'>
                即將到來
              </span>
            )}
          </div>

          <p className='text-sm text-gray-600'>
            {session.date} {session.time}
          </p>
        </div>

        {/* 場次選擇按鈕 - 只在未選中且有 onSessionSelect 時顯示 */}
        {!isSelected && onSessionSelect && (
          <Button
            onClick={() => onSessionSelect(session.id)}
            variant='secondary'
            className='ml-4'
          >
            選擇此場次
          </Button>
        )}
      </div>

      {session.tickets && session.tickets.length > 0 && (
        <div className='mb-4'>
          <h4 className='text-sm font-medium text-gray-900 mb-2'>票種</h4>
          <div className='space-y-2'>
            {session.tickets.map(ticket => (
              <TicketButton
                key={ticket.id}
                ticket={ticket}
                eventDate={event.date}
                eventId={eventId}
                sessionId={session.id}
                onTicketClick={onTicketClick}
              />
            ))}
          </div>
        </div>
      )}

      <div className='pt-3 border-t border-gray-200'>
        <Button
          onClick={() => onRegisterClick(session.id)}
          variant='primary'
          className='w-full h-11'
          disabled={!hasAvailableTickets}
        >
          {hasAvailableTickets ? '立即報名' : '無法報名'}
        </Button>
        {!hasAvailableTickets && (
          <p className='text-sm text-gray-500 text-center mt-2'>
            此場次已舉辦、已下架或報名截止
          </p>
        )}
      </div>
    </div>
  );
}
