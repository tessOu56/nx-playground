'use client';

import type { PaymentMethod } from '@/types';

interface PaymentMethodOption {
  value: PaymentMethod;
  label: string;
  description: string;
  disabled?: boolean;
}

interface PaymentCardProps {
  method: PaymentMethodOption;
  isSelected: boolean;
  onSelect: (method: string) => void;
}

export function PaymentCard({
  method,
  isSelected,
  onSelect,
}: PaymentCardProps) {
  return (
    <div
      className={`border rounded-lg p-4 transition-colors ${
        method.disabled
          ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-50'
          : isSelected
          ? 'border-blue-500 bg-blue-50 cursor-pointer'
          : 'border-gray-200 hover:border-blue-300 cursor-pointer'
      }`}
      onClick={() => !method.disabled && onSelect(method.value)}
    >
      <div className='flex items-center justify-between'>
        <div className='flex-1'>
          <h3 className='font-medium text-gray-900'>{method.label}</h3>
          <p className='text-sm text-gray-600'>{method.description}</p>
          {method.disabled && (
            <p className='text-sm text-red-600 mt-1'>此活動不支援此付款方式</p>
          )}
        </div>
        <div className='text-right'>
          <div
            className={`w-4 h-4 border-2 rounded-full ${
              method.disabled
                ? 'border-gray-300'
                : isSelected
                ? 'border-blue-500 bg-blue-500'
                : 'border-gray-300'
            }`}
          />
        </div>
      </div>
    </div>
  );
}
