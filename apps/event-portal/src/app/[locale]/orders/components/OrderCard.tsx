'use client';

import { Button } from '@nx-playground/ui-components';

import { useLocalizedRouter } from '@/libs';
import type { OrderListItem } from '@/types';

interface OrderCardProps {
  order: OrderListItem;
  getUserName: (userId: string) => string;
}

export function OrderCard({ order }: OrderCardProps) {
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

  return (
    <div className='rounded-lg border border-gray-200 p-4 hover:border-gray-300 transition-colors'>
      <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
        <div className='min-w-0 flex-1'>
          <div className='flex flex-wrap items-center gap-2'>
            <h3 className='truncate text-base font-semibold text-gray-900'>
              {order.eventTitle ?? order.eventId}
            </h3>
            {getStatusBadge(order.status)}
          </div>
          <p className='mt-1 text-sm text-gray-600'>
            <span className='tabular-nums'>
              NT$ {order.totalAmount.toLocaleString()}
            </span>
            <span className='mx-2 text-gray-300'>·</span>
            <span>
              {order.itemsCount} 項 / {order.quantity} 張
            </span>
            <span className='mx-2 text-gray-300'>·</span>
            <span className='text-xs text-gray-500'>{order.id}</span>
          </p>
        </div>
        <Button
          onClick={() => router.push(`/orders/${order.id}`)}
          variant='primary'
          size='sm'
          className='w-full sm:w-auto shrink-0'
        >
          查看詳情
        </Button>
      </div>
    </div>
  );
}
