'use client';

import { Button, useToast } from '@/components';
import { useCreateOrder } from '@/libs/api/hooks/useOrders';
import { useCreatePaymentIntent } from '@/libs/api/hooks/usePayments';
import { useLocalizedRouter } from '@/libs/i18n';
import { useAttendeeUserId } from '@/libs/line/useAttendeeUserId';
import { useCheckoutStore } from '@/stores/checkoutStore';
import { useOrderStore } from '@/stores/orderStore';
import type { Event, PaymentMethod } from '@/types';

interface OrderSummaryProps {
  event: Event;
}

export function OrderSummary({ event }: OrderSummaryProps) {
  const router = useLocalizedRouter();
  const { addToast } = useToast();
  const createOrderMutation = useCreateOrder();
  const createPaymentIntent = useCreatePaymentIntent();
  const { isReady, isLiffIdentity } = useAttendeeUserId();
  const { setSelectedOrderId } = useOrderStore();

  // 使用 store 方法獲取所有需要的狀態和計算
  const {
    getSelectedSessionData,
    getSelectedTicketDetails,
    getTotalAmount,
    getTotalTickets,
    canProceed,
    clearCheckoutData,
  } = useCheckoutStore();

  const selectedSessionData = getSelectedSessionData(event) as {
    name: string;
    time: string;
  } | null;
  const selectedTicketDetails = getSelectedTicketDetails(event);
  const totalAmount = getTotalAmount(event);
  const totalTickets = getTotalTickets();
  const canProceedToNext = canProceed();

  // 檢查是否有錯誤狀態
  const hasError = !event?.sessions || event.sessions.length === 0;

  // 處理下一步導航
  const handleNextStep = async () => {
    if (!canProceedToNext) return;

    // 從 store 獲取當前狀態
    const { selectedSession, selectedTickets, selectedPaymentMethod } =
      useCheckoutStore.getState();

    // 創建訂單資料
    const orderData = {
      eventId: event.id,
      sessionId: selectedSession ?? '',
      tickets: selectedTickets,
      paymentMethod: selectedPaymentMethod as PaymentMethod,
      totalAmount,
      totalTickets,
    };

    try {
      // 使用 React Query mutation 創建訂單和帳單
      const result = await createOrderMutation.mutateAsync(orderData);

      setSelectedOrderId(result.order.id);
      clearCheckoutData();

      if (orderData.paymentMethod === 'third_party' && totalAmount > 0) {
        const intent = await createPaymentIntent.mutateAsync(result.order.id);
        window.location.assign(intent.checkoutUrl);
        return;
      }

      router.push(`/orders/${result.order.id}`);
    } catch (error) {
      console.error('創建訂單失敗:', error);
      addToast({
        message: '創建訂單失敗，請重試',
        type: 'error',
        duration: 5000,
      });
    }
  };

  return (
    <div className='sticky bottom-0 z-50 bg-white border-t shadow-lg p-4'>
      <div className='max-w-4xl mx-auto'>
        {/* 訂單詳情 */}
        <div className='mb-3'>
          <h3 className='text-lg font-semibold text-gray-900 mb-2'>訂單總計</h3>

          {/* 場次資訊 */}
          {selectedSessionData && (
            <div className='text-sm text-gray-600 mb-2'>
              <span className='font-medium'>{selectedSessionData.name}</span>
              <span className='mx-2'>•</span>
              <span>{selectedSessionData.time}</span>
            </div>
          )}

          {/* 票券詳情 */}
          {selectedTicketDetails.length > 0 && (
            <div className='space-y-1 mb-2'>
              {selectedTicketDetails.map(ticket => (
                <div
                  key={`${ticket.name}-${ticket.quantity}`}
                  className='text-sm text-gray-600 flex justify-between'
                >
                  <span>
                    {ticket.name} × {ticket.quantity}
                  </span>
                  <span className='font-medium'>
                    NT$ {(ticket.price * ticket.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* 總計 */}
          <div className='flex items-center justify-between pt-2 border-t border-gray-200'>
            <div className='text-sm text-gray-600'>
              {totalTickets > 0 ? `共 ${totalTickets} 張票卷` : '尚未選擇票卷'}
            </div>
            <div className='text-xl font-bold text-blue-600'>
              NT$ {totalAmount.toLocaleString()}
            </div>
          </div>
        </div>

        {/* 按鈕 */}
        <Button
          onClick={handleNextStep}
          disabled={!canProceedToNext || hasError || !isReady}
          variant='primary'
          className='w-full h-11 text-base font-semibold'
        >
          {hasError ? '無法結帳' : !isReady ? '載入身分中…' : '參加'}
        </Button>

        {hasError ? (
          <p className='text-xs text-red-500 mt-2 text-center'>
            活動資料異常，無法進行結帳
          </p>
        ) : !isReady ? (
          <p className='text-xs text-gray-500 mt-2 text-center'>
            正在確認參加者身分
          </p>
        ) : !isLiffIdentity ? (
          <p className='text-xs text-amber-700 mt-2 text-center' data-testid='attendee-demo-identity'>
            示範身分（未綁 LINE）
          </p>
        ) : !canProceedToNext ? (
          <p className='text-xs text-gray-500 mt-2 text-center'>
            請先選擇場次、票卷和付款方式
          </p>
        ) : null}
      </div>
    </div>
  );
}
