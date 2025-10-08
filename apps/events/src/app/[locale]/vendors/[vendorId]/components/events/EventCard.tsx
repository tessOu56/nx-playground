'use client';

import { EventTagGroup } from './EventTagGroup';

import { Image, Button } from '@/components';
import { TicketButton } from '@/components/ticket';
import type { Event, Session } from '@/types';

interface EventCardProps {
  event: Event;
  session: Session;
  onEventClick: (eventId: string, sessionId?: string) => void;
  onTicketClick: (eventId: string, sessionId: string, ticketId: string) => void;
  onOrderClick: (eventId: string) => void;
  isLoggedIn?: boolean;
}

export function EventCard({
  event,
  session,
  onEventClick,
  onTicketClick,
  onOrderClick,
  isLoggedIn = false,
}: EventCardProps) {
  return (
    <div className='bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow'>
      {/* 活動封面 */}
      <div
        className='h-48 relative cursor-pointer'
        onClick={() => onEventClick(event.id, session.id)}
      >
        <Image
          src={event.image}
          alt={event.title}
          width={400}
          height={192}
          className='w-full h-full object-cover'
          fallback='/placeholder-event.jpg'
        />
        <EventTagGroup event={event} />
      </div>

      {/* 活動資訊 */}
      <div className='p-4'>
        {/* 活動名稱 */}
        <div className='mb-2'>
          <h3
            className='font-bold text-lg text-gray-900 cursor-pointer hover:text-blue-600 transition-colors'
            onClick={() => onEventClick(event.id, session.id)}
          >
            {event.title}
          </h3>
          <p className='text-sm text-gray-600'>{event.location}</p>
        </div>

        {/* 場次資訊 */}
        <div className='mb-3'>
          <div className='mb-2'>
            <span className='text-sm font-medium text-gray-800'>
              {session.name}
            </span>
          </div>
          <p className='text-sm text-gray-600 flex items-center mb-2'>
            <span className='w-4 h-4 mr-2' role='img' aria-label='日曆'>
              📅
            </span>
            {session.date} {session.time}
          </p>
        </div>

        {/* 票券選擇 */}
        <div className='mb-3'>
          {/* <h4 className='text-sm font-medium text-gray-700 mb-2'>選擇票券</h4> */}
          <div className='space-y-2'>
            {session.tickets.map(ticket => (
              <TicketButton
                key={ticket.id}
                ticket={ticket}
                eventDate={event.date}
                eventId={event.id}
                sessionId={session.id}
                onTicketClick={onTicketClick}
              />
            ))}
          </div>
        </div>

        {/* 按鈕區域 */}
        <div className='space-y-2'>
          {/* 查看活動按鈕 */}
          <Button
            onClick={() => onEventClick(event.id, session.id)}
            variant='primary'
            className='w-full'
          >
            活動詳情
          </Button>

          {/* 用戶訂單按鈕 - 前往 P05 */}
          <Button
            onClick={() => onOrderClick(event.id)}
            // disabled={!isLoggedIn}
            disabled={session.tickets.some(
              ticket => ticket.availableQuantity < 1
            )}
            variant={isLoggedIn ? 'primary' : 'secondary'}
            className='w-full'
          >
            報名紀錄
          </Button>
        </div>
      </div>
    </div>
  );
}
