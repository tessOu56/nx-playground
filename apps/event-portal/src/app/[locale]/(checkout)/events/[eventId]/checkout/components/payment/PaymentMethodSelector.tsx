'use client';

import { PaymentCard } from './PaymentCard';
import { PaymentError } from './PaymentError';

import { useCheckoutStore } from '@/stores/checkoutStore';
import type { PaymentMethod } from '@/types';

interface PaymentMethodOption {
  value: PaymentMethod;
  label: string;
  description: string;
  disabled?: boolean;
}

interface PaymentMethodSelectorProps {
  paymentMethods: PaymentMethodOption[];
}

export function PaymentMethodSelector({
  paymentMethods,
}: PaymentMethodSelectorProps) {
  const { selectedPaymentMethod, setSelectedPaymentMethod } =
    useCheckoutStore();

  const handlePaymentMethodSelect = (method: string) => {
    setSelectedPaymentMethod(method);
  };
  // 檢查是否有可用的付款方式
  const availableMethods = paymentMethods.filter(method => !method.disabled);
  const hasAvailableMethods = availableMethods.length > 0;

  if (!hasAvailableMethods) {
    return <PaymentError type='no-payment-methods' />;
  }

  return (
    <div className='bg-white rounded-lg shadow-md p-6'>
      <h2 className='text-xl font-semibold text-gray-900 mb-4'>選擇付款方式</h2>

      <div className='space-y-4'>
        {paymentMethods.map(method => (
          <PaymentCard
            key={method.value}
            method={method}
            isSelected={selectedPaymentMethod === method.value}
            onSelect={handlePaymentMethodSelect}
          />
        ))}
      </div>
    </div>
  );
}
