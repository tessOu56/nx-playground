'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

import {
  SessionSelector,
  TicketSelector,
  PaymentMethodSelector,
  OrderSummary,
  SessionSkeleton,
  TicketSkeleton,
  OrderSkeleton,
  PaymentSkeleton,
  SessionError,
  TicketError,
  PaymentError,
  OrderError,
} from '..';

import { useToast } from '@/components';
import { useEvent } from '@/libs/api/hooks';
import { useCheckoutStore } from '@/stores/checkoutStore';
import type { Session, SessionTicket, PaymentMethod } from '@/types';

interface CheckoutClientProps {
  eventId: string;
  paymentMethods: Array<{
    value: PaymentMethod;
    label: string;
    description: string;
    disabled?: boolean;
  }>;
}

export function CheckoutClient({
  eventId,
  paymentMethods,
}: CheckoutClientProps) {
  const searchParams = useSearchParams();
  const { addToast } = useToast();

  // 使用 checkout store
  const { setSelectedSession, setSelectedTickets } = useCheckoutStore();

  // 從快取讀取事件資料
  const { data: event, isLoading, error } = useEvent(eventId);

  // 從 URL 參數中獲取預選的場次和票券
  useEffect(() => {
    const sessionParam = searchParams.get('session');
    const ticketParam = searchParams.get('ticket');
    const quantityParam = searchParams.get('quantity');

    if (
      sessionParam &&
      event?.sessions?.some((s: Session) => s.id === sessionParam)
    ) {
      setSelectedSession(sessionParam);

      // 如果有預選的票券，設置初始數量
      if (ticketParam && quantityParam) {
        const quantity = parseInt(quantityParam, 10);
        if (quantity > 0) {
          // 檢查票券是否存在且數量不超過可用數量
          const ticket = event.sessions
            ?.flatMap((s: Session) => s.tickets)
            .find((t: SessionTicket) => t.id === ticketParam);

          if (ticket) {
            const maxQuantity = ticket.availableQuantity;
            const finalQuantity = Math.min(quantity, maxQuantity);
            setSelectedTickets({ [ticketParam]: finalQuantity });

            // 如果預選數量超過可用數量，顯示提示
            if (quantity > maxQuantity) {
              addToast({
                message: `${ticket.name} 最多只能選擇 ${maxQuantity} 張，已自動調整`,
                type: 'warning',
                duration: 5000,
              });
            }
          }
        }
      }
    }
  }, [
    searchParams,
    event?.sessions,
    addToast,
    setSelectedSession,
    setSelectedTickets,
  ]);

  // 載入中狀態 - 顯示各個組件的 skeleton
  if (isLoading) {
    return (
      <div className='space-y-6'>
        <SessionSkeleton />
        <TicketSkeleton />
        <PaymentSkeleton />
        <OrderSkeleton />
      </div>
    );
  }

  // 錯誤狀態 - 使用專用錯誤組件
  if (error || !event) {
    return (
      <div className='space-y-6'>
        <SessionError
          type='loading-error'
          eventTitle={event?.title}
          eventLocation={event?.location}
        />
        <TicketError type='loading-error' />
        <PaymentError type='loading-error' />
        <OrderError type={error ? 'loading-error' : 'no-event-data'} />
      </div>
    );
  }

  return (
    <div className='space-y-6 pb-24'>
      {/* 場次選擇 */}
      <SessionSelector event={event} />

      {/* 票卷選擇 */}
      <TicketSelector event={event} />

      {/* 付款方式選擇 */}
      <PaymentMethodSelector paymentMethods={paymentMethods} />

      {/* 訂單總計 */}
      <OrderSummary event={event} />
    </div>
  );
}
