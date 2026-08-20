'use client';

import { useEffect, useRef } from 'react';

import { OrderInfoHeader } from '../order';
import { PaymentIntentPanel, PaymentStatus } from '../payment';

import {
  useOrder,
  useOrderItems,
  useOrderTickets,
  useBillByOrder,
} from '@/libs';
import { usePaymentIntents } from '@/libs/api/hooks/usePayments';
import { getOrderScenario } from '@/libs/utils/orderUtils';

interface OrderDetailProps {
  orderId: string;
}

export function OrderDetail({ orderId }: OrderDetailProps) {
  const paymentSectionRef = useRef<HTMLDivElement>(null);

  const {
    data: order,
    isLoading: orderLoading,
    error: orderError,
  } = useOrder(orderId);
  const { data: orderItems, isLoading: itemsLoading } = useOrderItems(orderId);
  const { data: tickets, isLoading: ticketsLoading } = useOrderTickets(orderId);
  const { data: bill, isLoading: billLoading } = useBillByOrder(orderId);
  const usesPsp = order?.paymentMethod === 'third_party';
  const { data: intents, isLoading: intentsLoading } = usePaymentIntents(
    orderId,
    Boolean(usesPsp)
  );
  const latestIntent = intents?.items[0];

  const isLoading =
    orderLoading ||
    itemsLoading ||
    ticketsLoading ||
    billLoading ||
    (usesPsp && intentsLoading);
  const error = orderError;

  const scenario =
    order && bill ? getOrderScenario(order, bill, orderItems) : 'unknown';

  useEffect(() => {
    if (order && bill && !isLoading) {
      const isUnpaid = bill.status === 'pending' || bill.status === 'verifying';

      if (isUnpaid && paymentSectionRef.current) {
        setTimeout(() => {
          paymentSectionRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }, 300);
      }
    }
  }, [order, bill, isLoading]);

  if (isLoading) {
    return null;
  }

  if (error) {
    return (
      <div
        className='text-center'
        role='alert'
        data-testid='event-stack-api-error'
      >
        <div className='bg-red-50 border border-red-200 rounded-lg p-6'>
          <h3 className='text-xl font-semibold text-red-900 mb-2'>載入失敗</h3>
          <p className='text-red-700 mb-4'>無法載入訂單資訊：{error.message}</p>
          <button
            onClick={() => window.location.reload()}
            className='px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors'
          >
            重新載入
          </button>
        </div>
      </div>
    );
  }

  if (!order?.id) {
    return (
      <div className='text-center'>
        <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-6'>
          <h3 className='text-xl font-semibold text-yellow-900 mb-2'>
            訂單不存在
          </h3>
          <p className='text-yellow-700 mb-4'>
            {`找不到指定的訂單，請檢查訂單編號 ${orderId} 是否正確`}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <div className='space-y-4'>
        <OrderInfoHeader
          order={order}
          scenario={scenario}
          orderItems={orderItems ?? []}
          bill={bill}
        />
      </div>

      {usesPsp ? (
        <div ref={paymentSectionRef} className='space-y-4'>
          <PaymentIntentPanel orderId={order.id} intent={latestIntent} />
        </div>
      ) : bill ? (
        <div ref={paymentSectionRef} className='space-y-4'>
          <PaymentStatus order={order} bill={bill} scenario={scenario} />
        </div>
      ) : order.paymentMethod === 'cash' || order.status === 'confirmed' ? null : (
        <div
          className='bg-white rounded-lg shadow-md p-6 text-center'
          role='note'
          data-testid='event-stack-payment-shell'
        >
          <h3 className='text-lg font-semibold text-gray-900 mb-2'>
            付款仍是示範殼
          </h3>
          <p className='text-gray-600'>
            這張訂單的編號來自 GET /orders/&#123;id&#125;。付款／ATM／對帳沒有接金流，也不會出現 mock
            帳單。
          </p>
        </div>
      )}
    </div>
  );
}
