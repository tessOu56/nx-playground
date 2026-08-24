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
      <Card className='p-5'>
        <h2 className='text-base font-semibold text-gray-900'>
          選擇場次與票種
        </h2>
        <p className='mt-3 rounded-md border border-dashed border-gray-200 bg-gray-50 px-3 py-6 text-center text-sm text-gray-500'>
          尚無場次。請稍後再試，或聯絡主辦。
        </p>
      </Card>
    );
  }

  return (
    <Card className='p-5'>
      <h2 className='text-base font-semibold text-gray-900 mb-4'>
        選擇場次與票種
      </h2>
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
