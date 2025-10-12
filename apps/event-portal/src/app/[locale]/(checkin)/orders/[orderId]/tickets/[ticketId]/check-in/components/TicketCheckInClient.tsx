'use client';

import { Button } from '@nx-playground/ui-components';
import { useState, useEffect } from 'react';

import { CheckInSkeleton } from './layout';
import { CheckInQRCodeSection } from './qrcode';

import { useOrder, useEvent, useTicket } from '@/libs/api/hooks';
import { useLocalizedRouter } from '@/libs/i18n';
import { getTicketCheckInStatus, validateTicketForCheckIn } from '@/libs/utils';

interface TicketCheckInClientProps {
  params: Promise<{ orderId: string; ticketId: string }>;
}

export function TicketCheckInClient({ params }: TicketCheckInClientProps) {
  const [orderId, setOrderId] = useState<string>('');
  const [ticketId, setTicketId] = useState<string>('');

  useEffect(() => {
    params.then(({ orderId, ticketId }) => {
      setOrderId(orderId);
      setTicketId(ticketId);
    });
  }, [params]);

  const router = useLocalizedRouter();

  // 從快取讀取訂單和事件資料
  const {
    data: orderData,
    isLoading: orderLoading,
    error: orderError,
  } = useOrder(orderId);

  const order = orderData;

  const {
    data: ticket,
    isLoading: ticketLoading,
    error: ticketError,
  } = useTicket(ticketId);

  const {
    data: event,
    isLoading: eventLoading,
    error: eventError,
  } = useEvent(order?.eventId ?? '');

  const isLoading =
    orderLoading ?? eventLoading ?? ticketLoading ?? !orderId ?? !ticketId;
  const hasError = orderError ?? eventError ?? ticketError;

  // 載入中狀態
  if (isLoading) {
    return <CheckInSkeleton />;
  }

  // 錯誤狀態
  if (hasError) {
    return (
      <div className='bg-white rounded-lg shadow-md p-6'>
        <div className='text-center'>
          <h3 className='text-xl font-semibold text-gray-900 mb-2'>載入失敗</h3>
          <p className='text-gray-600 mb-4'>無法載入票券資訊</p>
          <Button
            onClick={() => router.push(`/orders/${orderId}`)}
            variant='primary'
            className='w-full'
          >
            返回訂單詳情
          </Button>
        </div>
      </div>
    );
  }

  // 生成簡化的 QR Code 資料
  const qrCodeData = ticket?.id
    ? `${window.location.origin}/tickets/verify/${ticket.id}`
    : 'loading...';

  // 綜合檢查票券報到資格
  const ticketValidation = validateTicketForCheckIn(
    ticket,
    order?.status ?? 'pending'
  );
  const canCheckIn = ticketValidation.isValid;

  return (
    <div className='bg-white rounded-lg shadow-md p-6'>
      <div className='text-center'>
        {/* 票券驗證錯誤狀態 */}
        {!ticketValidation.isValid && (
          <div className='bg-white rounded-lg shadow-md p-6 mb-6'>
            <div className='text-center'>
              <h3 className='text-xl font-semibold text-gray-900 mb-2'>
                {ticketValidation.title}
              </h3>
              <p className='text-gray-600 mb-4'>{ticketValidation.message}</p>
            </div>
          </div>
        )}

        {/* 票券資訊 */}
        <div className='bg-gray-50 rounded-lg p-4 mb-6 text-gray-600'>
          <div className='grid grid-cols-2 gap-4 text-sm'>
            <div>
              <span className='text-gray-500'>活動：</span>
              <span>{event?.title ?? '-'}</span>
            </div>
            <div>
              <span className='text-gray-500'>訂單編號：</span>
              <span className='font-mono'>{order?.id ?? '-'}</span>
            </div>
            <div>
              <span className='text-gray-500'>票券編號：</span>
              <span className='font-mono'>{ticket?.id ?? '-'}</span>
            </div>
            <div>
              <span className='text-gray-500'>狀態：</span>
              {(() => {
                const status = getTicketCheckInStatus(
                  ticket?.status ?? 'issued',
                  order?.status ?? 'pending'
                );
                return (
                  <span className={`font-semibold ${status.color}`}>
                    {status.text}
                  </span>
                );
              })()}
            </div>
          </div>
        </div>
        <CheckInQRCodeSection
          qrCodeData={qrCodeData}
          canCheckIn={canCheckIn}
          orderId={orderId}
        />
      </div>
    </div>
  );
}
