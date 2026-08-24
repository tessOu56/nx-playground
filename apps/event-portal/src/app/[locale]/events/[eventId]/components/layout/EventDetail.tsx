'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

import {
  EventInfoHeader,
  EventSessionList,
  EventContent,
  EventFAQ,
  EventInfoHeaderSkeleton,
  EventInfoHeaderError,
} from '..';

import { Button, Card } from '@/components';
import {
  useEvent,
  useCurrentVendor,
  useVendorData,
  useVendorStoreActions,
} from '@/libs';
import { useLocalizedRouter } from '@/libs/i18n';
import { canSellTicket } from '@/libs/utils/eventUtils';

interface EventDetailProps {
  eventId: string;
}

export function EventDetail({ eventId }: EventDetailProps) {
  const router = useLocalizedRouter();
  const searchParams = useSearchParams();
  const [selectedSessionId, setSelectedSessionId] = useState<string>('');

  // 使用 React Query 獲取活動資料
  const { data: event, isLoading, error } = useEvent(eventId);

  // 從 store 獲取當前 vendor 資料
  const { vendor: currentVendor } = useCurrentVendor();

  // 獲取 vendor 資料和 store 操作函數
  const { vendor, vendorLoading } = useVendorData(event?.vendorId ?? '');
  const { setCurrentVendor } = useVendorStoreActions();

  // 當 vendor 資料載入完成時，更新 store
  useEffect(() => {
    if (vendor && (!currentVendor || currentVendor.id !== vendor.id)) {
      setCurrentVendor(vendor);
    }
  }, [vendor, currentVendor?.id, setCurrentVendor]);

  // 從 URL 參數中獲取預選的場次
  useEffect(() => {
    const sessionParam = searchParams.get('session');
    if (sessionParam && event?.sessions?.some(s => s.id === sessionParam)) {
      setSelectedSessionId(sessionParam);
    } else if (event?.sessions?.[0]?.id) {
      setSelectedSessionId(event.sessions[0].id);
    }
  }, [searchParams, event?.sessions]);

  // 初始化選中的場次
  const currentSessionId = selectedSessionId ?? event?.sessions?.[0]?.id ?? '';

  const handleEventNotFound = () => {
    router.push('/events');
  };

  const handleSessionSelect = (sessionId: string) => {
    setSelectedSessionId(sessionId);
  };

  const handleTicketClick = (
    eventId: string,
    sessionId: string,
    ticketId: string
  ) => {
    router.push(
      `/events/${eventId}/checkout?session=${sessionId}&ticket=${ticketId}&quantity=1`
    );
  };

  const handleRegisterClick = (sessionId: string) => {
    if (!event) return;
    const session = event.sessions?.find(s => s.id === sessionId);
    if (session) {
      const availableTicket = session.tickets?.find(ticket =>
        canSellTicket(event.date, ticket.availableQuantity, ticket)
      );

      if (availableTicket) {
        router.push(
          `/events/${eventId}/checkout?session=${sessionId}&ticket=${availableTicket.id}&quantity=1`
        );
      }
    }
  };

  const sessionList =
    event && !isLoading ? (
      <EventSessionList
        event={event}
        eventId={eventId}
        selectedSessionId={currentSessionId}
        onSessionSelect={handleSessionSelect}
        onTicketClick={handleTicketClick}
        onRegisterClick={handleRegisterClick}
      />
    ) : null;

  return (
    <div className='space-y-6'>
      {isLoading ? (
        <EventInfoHeaderSkeleton />
      ) : error ? (
        <EventInfoHeaderError kind='api' />
      ) : !event ? (
        <EventInfoHeaderError kind='not-found' />
      ) : (
        <div className='lg:grid lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start lg:gap-8'>
          <div className='space-y-6'>
            <EventInfoHeader event={event} eventId={eventId} />
            <p className='text-sm text-gray-500'>
              示範身分即可報名，無需登入。
            </p>
            <div className='lg:hidden'>{sessionList}</div>
            <EventContent content={event.content} />
            <EventFAQ faq={event.faq} />
          </div>
          <aside className='hidden lg:block lg:sticky lg:top-24'>
            {sessionList}
          </aside>
        </div>
      )}

      {error || (!event && !isLoading) ? (
        <Card className='p-6 text-center'>
          <Button onClick={handleEventNotFound} variant='primary' size='lg'>
            瀏覽其他活動
          </Button>
        </Card>
      ) : null}
    </div>
  );
}
