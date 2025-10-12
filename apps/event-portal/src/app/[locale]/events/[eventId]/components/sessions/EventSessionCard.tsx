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
      canSellTicket(event.date, ticket.availableQuantity)
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

          <div className='space-y-1 text-sm text-gray-600'>
            <p className='flex items-center'>
              <span className='w-4 h-4 mr-2' role='img' aria-label='日曆'>
                📅
              </span>
              {session.date} {session.time}
            </p>
          </div>
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

      {/* 票券選擇 - 只在選中的場次顯示 */}
      {isSelected && session.tickets && session.tickets.length > 0 && (
        <div className='mb-4'>
          <h4 className='text-md font-medium text-gray-900 mb-3'>選擇票券</h4>
          <div className='space-y-3'>
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

      {/* 場次報名按鈕 - 只在選中的場次顯示 */}
      {isSelected && (
        <div className='pt-4 border-t border-gray-200'>
          <Button
            onClick={() => onRegisterClick(session.id)}
            variant='primary'
            className='w-full h-12'
            disabled={!hasAvailableTickets}
          >
            {hasAvailableTickets ? '場次報名' : '暫無可售票券'}
          </Button>
          {!hasAvailableTickets && (
            <p className='text-sm text-gray-500 text-center mt-2'>
              此場次目前沒有可售票券
            </p>
          )}
        </div>
      )}
    </div>
  );
}
