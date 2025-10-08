'use client';

import { useEffect } from 'react';

import {
  VendorInfoHeader,
  EventCard,
  VendorHeaderSkeleton,
  VendorHeaderError,
  EventListSkeleton,
  EventListError,
  NoEvents,
} from '..';

import {
  useEventsByVendor,
  useVendorData,
  useCurrentVendor,
  useVendorStoreActions,
} from '@/libs';
import { useLocalizedRouter } from '@/libs/i18n';
import {
  shouldUpdateVendor,
  shouldUpdateLineSettings,
} from '@/libs/utils/vendorUtils';
import { useCurrentStore } from '@/stores/currentStore';

interface VendorDetailProps {
  vendorId: string;
}

export function VendorDetail({ vendorId }: VendorDetailProps) {
  const router = useLocalizedRouter();
  const { currentVendor } = useCurrentStore();

  // 獲取 store 操作函數
  const {
    setCurrentVendor,
    setCurrentLineSettings,
    setLoadingVendor,
    setLoadingLineSettings,
  } = useVendorStoreActions();

  // 獲取資料（不包含 side effects）
  const {
    vendor,
    vendorLoading,
    vendorError,
    lineSettings,
    lineSettingsLoading,
    lineSettingsError,
  } = useVendorData(vendorId);

  // 從 store 獲取當前 vendor 資料用於 UI 渲染
  const { vendor: currentVendorData, lineSettings: currentLineSettings } =
    useCurrentVendor();

  // 使用 React Query 獲取主辦方的活動
  const {
    data: events,
    isLoading: eventsLoading,
    error: eventsError,
  } = useEventsByVendor(vendorId);

  // 當主辦方資料載入完成時，更新 store
  useEffect(() => {
    if (shouldUpdateVendor(vendor, currentVendor)) {
      setCurrentVendor(vendor!);
    }
  }, [vendor, currentVendor?.id, setCurrentVendor]);

  // 當 LINE 設定載入完成時，更新 store
  useEffect(() => {
    if (shouldUpdateLineSettings(lineSettings, vendor)) {
      setCurrentLineSettings(lineSettings!);
    }
  }, [lineSettings, vendor?.id, setCurrentLineSettings]);

  // 更新載入狀態
  useEffect(() => {
    setLoadingVendor(vendorLoading);
  }, [vendorLoading, setLoadingVendor]);

  useEffect(() => {
    setLoadingLineSettings(lineSettingsLoading);
  }, [lineSettingsLoading, setLoadingLineSettings]);

  // 使用 store 中的資料進行 UI 渲染
  const displayVendor = currentVendorData ?? vendor;
  const displayLineSettings = currentLineSettings ?? lineSettings;

  const handleEventClick = (eventId: string, sessionId?: string) => {
    const url = sessionId
      ? `/events/${eventId}?session=${sessionId}`
      : `/events/${eventId}`;
    router.push(url);
  };

  const handleTicketClick = async (
    eventId: string,
    sessionId: string,
    ticketId: string
  ) => {
    // 添加小延遲以顯示 loading 狀態
    await new Promise(resolve => setTimeout(resolve, 100));
    // 前往 P04 結帳頁面，預設選擇該票券一張
    router.push(
      `/events/${eventId}/checkout?session=${sessionId}&ticket=${ticketId}&quantity=1`
    );
  };

  const handleOrderClick = async (eventId: string) => {
    // 添加小延遲以顯示 loading 狀態
    await new Promise(resolve => setTimeout(resolve, 100));
    // TODO: 從實際的用戶訂單中查找對應活動的訂單
    // 目前使用 mock 訂單 ID，假設用戶已經有該活動的訂單
    const mockOrderId = `order-${eventId}`;
    router.push(`/orders/${mockOrderId}`);
  };

  return (
    <div className='space-y-6'>
      {/* 主辦方資訊頭部 - 根據狀態顯示內容 */}
      {vendorError || lineSettingsError ? (
        <VendorHeaderError />
      ) : !displayVendor ? (
        <VendorHeaderError />
      ) : vendorLoading || lineSettingsLoading || !displayLineSettings ? (
        <VendorHeaderSkeleton />
      ) : (
        <VendorInfoHeader
          vendor={displayVendor}
          lineSettings={displayLineSettings}
        />
      )}

      {/* 活動列表 - 根據狀態顯示內容 */}
      <div className='bg-white rounded-lg shadow-md p-6'>
        <h3 className='text-lg font-semibold text-gray-900 mb-4'>
          {displayLineSettings?.displayName ?? '主辦方'} 的活動
        </h3>
        {eventsError ? (
          <EventListError />
        ) : eventsLoading ? (
          <EventListSkeleton />
        ) : events && events.length > 0 ? (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {events.flatMap(event =>
              event.sessions.map(session => (
                <EventCard
                  key={`${event.id}-${session.id}`}
                  event={event}
                  session={session}
                  onEventClick={handleEventClick}
                  onTicketClick={handleTicketClick}
                  onOrderClick={handleOrderClick}
                  isLoggedIn={false} // TODO: 從 auth context 獲取登入狀態
                />
              ))
            )}
          </div>
        ) : (
          <NoEvents />
        )}
      </div>
    </div>
  );
}
