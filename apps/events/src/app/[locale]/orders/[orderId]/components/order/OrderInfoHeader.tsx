'use client';

import { OrderItemCard } from './OrderItemCard';

import { useUser } from '@/libs';
import { getBillStatusLabel } from '@/libs/utils';
import type { Order, OrderItem, Bill } from '@/types';

interface OrderInfoHeaderProps {
  order: Order;
  scenario: string;
  orderItems: OrderItem[];
  bill: Bill;
}

export function OrderInfoHeader({
  order,
  scenario,
  orderItems,
  bill,
}: OrderInfoHeaderProps) {
  const { data: user } = useUser(order.userId);
  const getPaymentMethodText = (paymentMethod: string) => {
    switch (paymentMethod) {
      case 'cash':
        return '現金付款';
      case 'atm':
        return 'ATM 轉帳';
      case 'session':
        return '第三第三方';
      default:
        return '未知付款方式';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'verifying':
        return 'bg-blue-100 text-blue-800';
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return '待付款';
      case 'verifying':
        return '核帳中';
      case 'paid':
        return '已付款';
      case 'failed':
        return '付款失敗';
      case 'cancelled':
        return '已取消';
      default:
        return '未知狀態';
    }
  };

  const totalQuantity = orderItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );
  const totalAmount = orderItems.reduce(
    (sum, item) => sum + item.totalPrice,
    0
  );

  return (
    <div className='bg-white rounded-lg shadow-md p-6'>
      <div className='flex items-center justify-between mb-4'>
        <h2 className='text-xl font-semibold text-gray-900'>
          訂單編號: {order.id}
        </h2>
        <span className='px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full'>
          {scenario}
        </span>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
        <div>
          <p className='text-sm text-gray-600'>客戶姓名</p>
          <p className='font-medium text-gray-900'>
            {user?.name ?? '載入中...'}
          </p>
        </div>
        <div>
          <p className='text-sm text-gray-600'>訂單狀態</p>
          <p className='font-medium text-gray-900'>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                order.status
              )}`}
            >
              {getStatusText(order.status)}
            </span>
          </p>
        </div>
        <div>
          <p className='text-sm text-gray-600'>付款方式</p>
          <p className='font-medium text-gray-900'>
            {getPaymentMethodText(order.paymentMethod)}
          </p>
        </div>

        <div>
          <p className='text-sm text-gray-600'>轉帳帳號</p>
          <p className='font-medium text-gray-900'>
            {order.paymentMethod === 'atm' ? bill?.transferAccount : '-'}
          </p>
        </div>

        <div>
          <p className='text-sm text-gray-600'>繳款期限</p>
          <p className='font-medium text-gray-900'>
            {new Date(bill.dueDate).toLocaleDateString('zh-TW')}
          </p>
        </div>

        <div>
          <p className='text-sm text-gray-600'>繳款狀況</p>
          <p className='font-medium text-gray-900'>
            {bill.id} -{getBillStatusLabel(bill.status)}
          </p>
        </div>

        <div>
          <p className='text-sm text-gray-600'>付款時間</p>
          <p className='font-medium text-gray-900'>
            {bill.paidAt ? new Date(bill.paidAt).toLocaleString('zh-TW') : '-'}
          </p>
        </div>
      </div>

      <h3 className='text-lg font-semibold text-gray-600 pb-4'>票券明細</h3>

      {/* 訂單明細 */}
      <div className='space-y-3'>
        {orderItems.map(item => (
          <OrderItemCard key={item.id} item={item} />
        ))}
      </div>

      {/* 總計 */}
      <div className='flex items-center justify-between pt-4'>
        <div>
          <p className='text-sm text-blue-700'>
            共 {orderItems.length} 種票券，總計 {totalQuantity} 張
          </p>
        </div>
        <div className='text-right'>
          <p className='text-2xl font-bold text-blue-900'>
            NT$ {totalAmount.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}
