'use client';

import { PaymentQRCode } from './PaymentQRCode';
import { TransferAction } from './TransferAction';

import {
  getBillStatusColor,
  getBillStatusLabel,
  getPaymentScenarioLabel,
  getPaymentScenarioDescription,
} from '@/libs';
import type { Order, Bill } from '@/types';

interface PaymentStatusProps {
  order: Order;
  bill?: Bill;
  scenario: string;
}

export function PaymentStatus({ order, bill, scenario }: PaymentStatusProps) {
  return (
    <div className='bg-white rounded-lg shadow-md p-6'>
      {/* 付款追蹤 */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center space-x-3'>
          <div>
            <h3 className='text-lg font-semibold text-gray-900'>付款追蹤</h3>
            <p className='text-sm text-gray-600'>
              {order.paymentMethod === 'cash' ? '現金付款' : 'ATM 轉帳'}
            </p>
          </div>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${getBillStatusColor(
            bill?.status ?? 'pending'
          )}`}
        >
          {getBillStatusLabel(bill?.status ?? 'pending')}
        </span>
      </div>

      <div className='text-center'>
        <h4 className='text-lg font-semibold text-gray-900 mb-4'>
          {getPaymentScenarioLabel(scenario)}
        </h4>
        <p className='text-gray-600 mb-6'>
          {getPaymentScenarioDescription(scenario)}
        </p>

        {/* 現場付款待付款 */}
        {scenario === 'P05a' && <PaymentQRCode order={order} />}

        {/* ATM 轉帳待付款 */}
        {scenario === 'P05d' && <TransferAction order={order} bill={bill} />}
      </div>
    </div>
  );
}
