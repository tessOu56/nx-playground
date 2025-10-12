'use client';

import { Button } from '@nx-playground/ui-components';

import { useLocalizedRouter } from '@/libs';
import type { OrderListItem } from '@/types';

interface OrderCardProps {
  order: OrderListItem;
  getUserName: (userId: string) => string;
}

export function OrderCard({ order, getUserName }: OrderCardProps) {
  const router = useLocalizedRouter();

  const getStatusBadge = (status: string) => {
    const statusMap = {
      pending: { text: '待付款', color: 'bg-yellow-100 text-yellow-800' },
      confirmed: { text: '已確認', color: 'bg-blue-100 text-blue-800' },
      completed: { text: '已完成', color: 'bg-green-100 text-green-800' },
      cancelled: { text: '已取消', color: 'bg-gray-100 text-gray-800' },
    };

    const statusInfo = statusMap[status as keyof typeof statusMap] || {
      text: status,
      color: 'bg-gray-100 text-gray-800',
    };
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}
      >
        {statusInfo.text}
      </span>
    );
  };

  const getPaymentMethodText = (method: string) => {
    return method === 'cash' ? '現金付款' : 'ATM 轉帳';
  };

  const getBillStatusText = (status: string) => {
    const statusMap = {
      pending: '待付款',
      verifying: '核帳中',
      paid: '已付款',
      overdue: '逾期',
      cancelled: '已取消',
    };
    return statusMap[status as keyof typeof statusMap] || status;
  };

  const handleOrderClick = (orderId: string) => {
    router.push(`/orders/${orderId}`);
  };

  const handleCheckinClick = (orderId: string) => {
    router.push(`/orders/${orderId}/check-in`);
  };

  const handleRegistrationClick = (orderId: string) => {
    // 導向訂單詳情頁面，用戶可以從那裡選擇要填寫的票券報名表
    router.push(`/orders/${orderId}`);
  };

  return (
    <div className='border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors'>
      <div className='flex flex-col lg:flex-row lg:items-center justify-between gap-4'>
        {/* 訂單基本資訊 */}
        <div className='flex-1'>
          <div className='flex items-center justify-between mb-2'>
            <h3 className='text-lg font-semibold text-gray-900'>
              訂單 #{order.id}
            </h3>
            {getStatusBadge(order.status)}
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm'>
            <div>
              <span className='text-gray-600'>活動:</span>
              <span className='ml-2 font-medium'>
                {order.eventTitle ?? order.eventId}
              </span>
            </div>
            <div>
              <span className='text-gray-600'>客戶姓名:</span>
              <span className='ml-2 font-medium'>
                {getUserName(order.userId)}
              </span>
            </div>
            <div>
              <span className='text-gray-600'>票券項目:</span>
              <span className='ml-2 font-medium'>
                {order.itemsCount} 項 ({order.quantity} 張票)
              </span>
            </div>
            <div>
              <span className='text-gray-600'>票券類型:</span>
              <span className='ml-2 font-medium'>
                {order.orderItemsSummary.ticketTypes.join(', ') ?? '無'}
              </span>
            </div>
            <div>
              <span className='text-gray-600'>付款金額:</span>
              <span className='ml-2 font-medium text-red-600'>
                NT$ {order.totalAmount.toLocaleString()}
              </span>
            </div>
            <div>
              <span className='text-gray-600'>付款方式:</span>
              <span className='ml-2 font-medium'>
                {getPaymentMethodText(order.paymentMethod)}
              </span>
            </div>
            <div>
              <span className='text-gray-600'>帳單狀態:</span>
              <span className='ml-2 font-medium'>
                {getBillStatusText(order.billStatus)}
              </span>
            </div>
            <div>
              <span className='text-gray-600'>建立時間:</span>
              <span className='ml-2 font-medium'>
                {new Date(order.createdAt).toLocaleDateString('zh-TW')}
              </span>
            </div>
            {order.eventDate && (
              <div>
                <span className='text-gray-600'>活動日期:</span>
                <span className='ml-2 font-medium'>
                  {new Date(order.eventDate).toLocaleDateString('zh-TW')}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* 操作按鈕 */}
        <div className='flex flex-col sm:flex-row gap-2 lg:flex-col lg:w-48'>
          <Button
            onClick={() => handleOrderClick(order.id)}
            variant='primary'
            size='sm'
            className='w-full'
          >
            查看詳情
          </Button>

          <Button
            onClick={() => handleCheckinClick(order.id)}
            variant='primary'
            size='sm'
            className='w-full bg-green-600 hover:bg-green-700'
            disabled={
              !(order.status === 'confirmed' || order.billStatus === 'paid')
            }
          >
            報到
          </Button>

          <Button
            onClick={() => handleRegistrationClick(order.id)}
            variant='primary'
            size='sm'
            className='w-full bg-purple-600 hover:bg-purple-700'
            disabled={
              !(order.status === 'confirmed' || order.billStatus === 'paid') ||
              order.itemsCount === 0
            }
          >
            報名表
          </Button>
        </div>
      </div>
    </div>
  );
}
