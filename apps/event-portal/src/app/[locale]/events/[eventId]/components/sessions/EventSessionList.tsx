'use client';

import { EventSessionCard } from './EventSessionCard';

import { Card } from '@/components';
import type { EventDetail } from '@/types';

interface EventSessionListProps {
  event: EventDetail;
  eventId: string;
  selectedSessionId?: string;
  onSessionSelect?: (sessionId: string) => void;
  onTicketClick: (eventId: string, sessionId: string, ticketId: string) => void;
  onRegisterClick: (sessionId: string) => void;
}

export function EventSessionList({
  event,
  eventId,
  selectedSessionId,
  onSessionSelect,
  onTicketClick,
  onRegisterClick,
}: EventSessionListProps) {
  if (!event.sessions || event.sessions.length === 0) {
    return (
      <Card className='p-6'>
        <h2 className='text-xl font-semibold text-gray-900 mb-4'>活動場次</h2>
        <div className='text-center py-8'>
          <span
            className='text-gray-400 text-4xl mb-4 block'
            role='img'
            aria-label='日曆'
          >
            📅
          </span>
          <p className='text-gray-500'>暫無場次資訊</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className='p-6'>
      <h2 className='text-xl font-semibold text-gray-900 mb-6'>活動場次</h2>
      <div className='space-y-6'>
        {event.sessions.map(session => (
          <EventSessionCard
            key={session.id}
            event={event}
            session={session}
            eventId={eventId}
            isSelected={selectedSessionId === session.id}
            onSessionSelect={onSessionSelect}
            onTicketClick={onTicketClick}
            onRegisterClick={onRegisterClick}
          />
        ))}
      </div>
    </Card>
  );
}
