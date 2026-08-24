'use client';

import { OrderItemCard } from './OrderItemCard';

import { useUser } from '@/libs';
import { getBillStatusLabel } from '@/libs/utils';
import type { Order, OrderItem, Bill } from '@/types';

interface OrderInfoHeaderProps {
  order: Order;
  scenario: string;
  orderItems: OrderItem[];
  bill?: Bill;
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
      case 'third_party':
        return '第三方支付';
      default:
        return '未知付款方式';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
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
      case 'confirmed':
        return '已確認';
      case 'completed':
        return '已完成';
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

  const totalQuantity =
    orderItems.reduce((sum, item) => sum + item.quantity, 0) || order.quantity;
  const totalAmount =
    orderItems.reduce((sum, item) => sum + item.totalPrice, 0) ||
    order.totalAmount;

  const nextStepMessage = (() => {
    if (order.status === 'cancelled') {
      return '此訂單已取消，無需進一步動作。';
    }
    if (order.status === 'completed') {
      return '活動當天請出示票券 QR 或訂單編號報到。';
    }
    if (bill?.status === 'pending' || bill?.status === 'verifying') {
      return '請依帳單指示完成 mock 付款；核帳後票券會出現在訂單明細。';
    }
    if (order.status === 'confirmed' || bill?.status === 'paid') {
      return '付款已確認。若尚未填寫報名表，請從票券明細進入；活動前會收到提醒（示範）。';
    }
    return '這是示範訂單：選擇票券後可在本頁追蹤狀態，不會實際扣款。';
  })();

  return (
    <div className='bg-white rounded-lg shadow-md p-5 space-y-5'>
      <div
        className='rounded-lg border border-blue-100 bg-blue-50 px-4 py-3'
        role='status'
        data-testid='order-next-steps'
      >
        <p className='text-xs font-semibold uppercase tracking-wide text-blue-800'>
          接下來
        </p>
        <p className='mt-1 text-sm text-blue-900'>{nextStepMessage}</p>
      </div>

      <div className='flex flex-wrap items-center justify-between gap-2'>
        <div>
          <p className='text-xs uppercase tracking-wide text-gray-500'>
            訂單編號
          </p>
          <h2 className='text-lg font-semibold text-gray-900'>{order.id}</h2>
        </div>
        <div className='flex items-center gap-2'>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
              order.status
            )}`}
          >
            {getStatusText(order.status)}
          </span>
          {scenario !== 'unknown' ? (
            <span className='px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full'>
              {scenario}
            </span>
          ) : null}
        </div>
      </div>

      <div className='grid grid-cols-2 gap-3 text-sm'>
        <div>
          <p className='text-xs text-gray-500'>客戶</p>
          <p className='font-medium text-gray-900'>
            {user?.name ?? order.userId}
          </p>
        </div>
        <div>
          <p className='text-xs text-gray-500'>付款方式</p>
          <p className='font-medium text-gray-900'>
            {getPaymentMethodText(order.paymentMethod)}
          </p>
        </div>
        <div>
          <p className='text-xs text-gray-500'>繳款狀況</p>
          <p className='font-medium text-gray-900'>
            {bill?.id
              ? getBillStatusLabel(bill.status)
              : '付款仍是示範殼（mock）'}
          </p>
        </div>
        <div>
          <p className='text-xs text-gray-500'>付款時間</p>
          <p className='font-medium text-gray-900'>
            {bill?.paidAt ? new Date(bill.paidAt).toLocaleString('zh-TW') : '—'}
          </p>
        </div>
      </div>

      <div>
        <div className='mb-3 flex items-center justify-between'>
          <h3 className='text-base font-semibold text-gray-900'>票券明細</h3>
          <p className='text-sm text-blue-700'>
            {orderItems.length > 0
              ? `${orderItems.length} 張`
              : `${totalQuantity} 張`}
          </p>
        </div>

        {orderItems.length === 0 ? (
          <div
            className='rounded-md border border-dashed border-gray-200 bg-gray-50 px-4 py-6 text-center'
            data-testid='order-tickets-empty'
          >
            <p className='text-sm font-medium text-gray-800'>尚無票券明細</p>
            <p className='mt-1 text-xs text-gray-500'>
              確認付款或出票後，票券與報到／核銷 CTA 會出現在此。
            </p>
          </div>
        ) : (
          <div className='space-y-3'>
            {orderItems.map(item => (
              <OrderItemCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>

      <div className='flex items-center justify-between border-t border-gray-100 pt-4'>
        <p className='text-sm text-gray-600'>應付金額</p>
        <p className='text-2xl font-bold tabular-nums text-blue-900'>
          NT$ {totalAmount.toLocaleString()}
        </p>
      </div>
    </div>
  );
}
