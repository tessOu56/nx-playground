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
  EventContentSkeleton,
  EventFAQSkeleton,
} from '..';

import { Button, Card } from '@/components';
import {
  useEvent,
  useCurrentVendor,
  useVendorData,
  useVendorStoreActions,
} from '@/libs';
import { useLocalizedRouter } from '@/libs/i18n';

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
    const session = event?.sessions?.find(s => s.id === sessionId);
    if (session) {
      // 找到第一個可用的票券
      const availableTicket = session.tickets?.find(
        ticket => ticket.availableQuantity > 0
      );

      if (availableTicket) {
        router.push(
          `/events/${eventId}/checkout?session=${sessionId}&ticket=${availableTicket.id}&quantity=1`
        );
      }
    }
  };

  return (
    <div className='space-y-6'>
      {/* 活動資訊頭部 - 根據狀態顯示內容 */}
      {error || !event ? (
        <EventInfoHeaderError />
      ) : isLoading ? (
        <EventInfoHeaderSkeleton />
      ) : (
        <EventInfoHeader event={event} eventId={eventId} />
      )}

      {/* 活動內容 */}
      {isLoading ? (
        <EventContentSkeleton />
      ) : event ? (
        <EventContent content={event.content} />
      ) : null}

      {/* 常見問題 */}
      {isLoading ? (
        <EventFAQSkeleton />
      ) : event ? (
        <EventFAQ faq={event.faq} />
      ) : null}

      {/* 活動場次列表 */}
      {event && !isLoading && (
        <EventSessionList
          event={event}
          eventId={eventId}
          selectedSessionId={currentSessionId}
          onSessionSelect={handleSessionSelect}
          onTicketClick={handleTicketClick}
          onRegisterClick={handleRegisterClick}
        />
      )}

      {/* 活動不存在時顯示返回按鈕 */}
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
