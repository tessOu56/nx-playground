'use client';

import { SessionCard } from './SessionCard';
import { SessionError } from './SessionError';

import { SessionCarousel } from '@/components/carousel';
import { useCheckoutStore } from '@/stores/checkoutStore';
import type { Event, Session } from '@/types';

interface SessionSelectorProps {
  event: Event;
}

export function SessionSelector({ event }: SessionSelectorProps) {
  const { selectedSession, setSelectedSession } = useCheckoutStore();

  // 處理場次選擇
  const handleSessionSelect = (sessionId: string) => {
    setSelectedSession(sessionId);

    // 滑動到票券選擇區域
    setTimeout(() => {
      const ticketSelector = document.querySelector('[data-ticket-selector]');
      ticketSelector?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }, 100);
  };
  // Calculate remaining tickets for each session
  const getRemainingTickets = (session: Session) => {
    return (
      session.tickets?.reduce(
        (total, ticket) => total + ticket.availableQuantity,
        0
      ) ?? 0
    );
  };

  // Check if session has any available tickets
  const hasAvailableTickets = (session: Session) => {
    return getRemainingTickets(session) > 0;
  };

  // Group sessions by region (assuming sessions have a region property, or group by date as fallback)
  const groupSessionsByRegion = (sessions: Session[]) => {
    const groups: { [key: string]: Session[] } = {};

    sessions.forEach(session => {
      // Use region if available, otherwise group by date
      const region =
        (session as Session & { region?: string }).region ?? session.date;
      if (!groups[region]) {
        groups[region] = [];
      }
      groups[region].push(session);
    });

    return groups;
  };

  const sessionGroups = groupSessionsByRegion(event.sessions ?? []);

  // 檢查是否有場次資料
  const hasSessions = event.sessions && event.sessions.length > 0;
  const hasSessionGroups = Object.keys(sessionGroups).length > 0;

  // 顯示錯誤狀態
  if (!hasSessions) {
    return (
      <SessionError
        type='no-sessions'
        eventTitle={event.title}
        eventLocation={event.location}
      />
    );
  }

  if (!hasSessionGroups) {
    return (
      <SessionError
        type='invalid-sessions'
        eventTitle={event.title}
        eventLocation={event.location}
      />
    );
  }

  return (
    <div className='bg-white rounded-lg shadow-md p-6'>
      <h2 className='text-xl font-semibold text-gray-900 mb-4'>
        {event.title} - 選擇場次
        <span className='text-sm text-gray-600 mx-2'>{event.location}</span>
      </h2>

      {Object.entries(sessionGroups).map(([region, sessions]) => (
        <div key={region} className='mb-6 last:mb-0'>
          <h3 className='text-lg font-medium text-gray-800 mb-3 border-b border-gray-200 pb-2'>
            {region}
          </h3>
          <SessionCarousel>
            {sessions.map((session: Session) => {
              const remainingTickets = getRemainingTickets(session);
              const isAvailable = hasAvailableTickets(session);
              const isSelected = selectedSession === session.id;

              return (
                <SessionCard
                  key={session.id}
                  session={session}
                  isSelected={isSelected}
                  isAvailable={isAvailable}
                  remainingTickets={remainingTickets}
                  onSelect={() => handleSessionSelect(session.id)}
                />
              );
            })}
          </SessionCarousel>
        </div>
      ))}
    </div>
  );
}
