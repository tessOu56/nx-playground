'use client';

import { useLocalizedRouter } from '@/libs/i18n';
import type { OrderItem, Order, Event } from '@/types';

interface OrderItemInfoHeadProps {
  orderItem: OrderItem;
  orderItemId: string;
  order: Order;
  event: Event;
}

export function OrderItemInfoHead({
  orderItem,
  orderItemId,
  order,
  event,
}: OrderItemInfoHeadProps) {
  const router = useLocalizedRouter();

  // 如果找不到對應的 OrderItem
  if (!orderItem || !orderItemId || !order || !event) {
    return (
      <div className='bg-white rounded-lg shadow-md p-6'>
        <div className='text-center'>
          <h3 className='text-xl font-semibold text-gray-900 mb-2'>
            找不到對應的訂單項目
          </h3>
          <p className='text-gray-600 mb-4'>
            無法找到訂單項目 {orderItemId}
            ，請回到訂單頁面選擇正確的活動票券報名表
          </p>
          <button
            onClick={() => router.push(`/orders/${order.id}`)}
            className='w-full h-12 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors'
          >
            返回訂單詳情
          </button>
        </div>
      </div>
    );
  }

  // 如果訂單未付款
  if (order.status !== 'confirmed') {
    return (
      <div className='bg-white rounded-lg shadow-md p-6'>
        <div className='text-center'>
          <h3 className='text-xl font-semibold text-gray-900 mb-2'>
            訂單尚未付款
          </h3>
          <p className='text-gray-600 mb-4'>只有已付款的訂單才能填寫報名表</p>
          <button
            onClick={() => router.push(`/orders/${order.id}`)}
            className='w-full h-12 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors'
          >
            查看訂單詳情
          </button>
        </div>
      </div>
    );
  }

  // 獲取 OrderItem 中現有的報名表資料
  const existingRegistrationData = orderItem.registrationFormData;
  const hasExistingForm =
    !!existingRegistrationData &&
    Object.keys(existingRegistrationData).length > 0;

  return (
    <div className='bg-white rounded-lg shadow-md p-6'>
      <h2 className='text-xl font-semibold text-gray-900 mb-4'>訂單項目資訊</h2>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div>
          <p className='text-sm text-gray-600'>訂單項目編號</p>
          <p className='font-medium text-gray-900'>{orderItemId}</p>
        </div>
        <div>
          <p className='text-sm text-gray-600'>票券類型</p>
          <p className='font-medium text-gray-900'>
            {orderItem.ticketTypeName}
          </p>
        </div>
        <div>
          <p className='text-sm text-gray-600'>活動名稱</p>
          <p className='font-medium text-gray-900'>{event.title}</p>
        </div>
        <div>
          <p className='text-sm text-gray-600'>項目狀態</p>
          <p className='font-medium text-gray-900'>{orderItem.status}</p>
        </div>
        <div>
          <p className='text-sm text-gray-600'>報名表狀態</p>
          <p
            className={`font-medium ${
              hasExistingForm ? 'text-green-600' : 'text-yellow-600'
            }`}
          >
            {hasExistingForm ? '已填寫' : '尚未填寫'}
          </p>
        </div>
        {orderItem.ticketId && (
          <div>
            <p className='text-sm text-gray-600'>關聯票券ID</p>
            <p className='font-medium text-gray-900'>{orderItem.ticketId}</p>
          </div>
        )}
      </div>
    </div>
  );
}
