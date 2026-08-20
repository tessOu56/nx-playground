'use client';

import type { EventStackPaymentIntent } from '@nx-playground/api-client/event-stack';

import { useCreatePaymentIntent } from '@/libs/api/hooks/usePayments';

interface PaymentIntentPanelProps {
  orderId: string;
  intent?: EventStackPaymentIntent;
}

export function PaymentIntentPanel({
  orderId,
  intent,
}: PaymentIntentPanelProps) {
  const createIntent = useCreatePaymentIntent();

  const goToCheckout = async () => {
    if (intent?.status === 'created' && intent.checkoutUrl) {
      window.location.assign(intent.checkoutUrl);
      return;
    }
    const created = await createIntent.mutateAsync(orderId);
    window.location.assign(created.checkoutUrl);
  };

  if (intent?.status === 'paid') {
    return (
      <div
        className='bg-white rounded-lg shadow-md p-6 text-center'
        data-testid='event-stack-payment-paid'
      >
        <h3 className='text-lg font-semibold text-gray-900 mb-2'>付款完成</h3>
        <p className='text-gray-600'>
          金流回調已入帳（模擬或綠界 sandbox），票券會在確認訂單後發出。
        </p>
      </div>
    );
  }

  return (
    <div
      className='bg-white rounded-lg shadow-md p-6 text-center'
      data-testid='event-stack-payment-intent'
    >
      <h3 className='text-lg font-semibold text-gray-900 mb-2'>
        {intent?.status === 'failed' ? '付款未完成' : '前往付款'}
      </h3>
      <p className='text-gray-600 mb-4'>
        {intent?.status === 'failed'
          ? '金流回報失敗。可再試一次，本站不會收集卡號。'
          : '將導向模擬金流或綠界 sandbox，本站不會收集卡號。'}
      </p>
      <button
        type='button'
        onClick={() => {
          void goToCheckout();
        }}
        disabled={createIntent.isPending}
        className='px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50'
      >
        {createIntent.isPending ? '準備中…' : '前往付款'}
      </button>
    </div>
  );
}
