'use client';

import { useState, useEffect } from 'react';

import { RegistrationDynamicForm } from '../form';
import { OrderItemInfoHead, OrderItemAction } from '../order';

import { RegistrationSkeleton } from './RegistrationSkeleton';

import { Button, useToast } from '@/components';
import { useOrder, useEvent, useOrderItems } from '@/libs/api/hooks';
import { useLocalizedRouter } from '@/libs/i18n';
import type { OrderItem, EventRegistrationTemplate } from '@/types';

interface RegistrationClientProps {
  params: Promise<{ orderId: string; orderItemId: string }>;
}

export function RegistrationClient({ params }: RegistrationClientProps) {
  const { addToast } = useToast();
  const [orderId, setOrderId] = useState<string>('');
  const [orderItemId, setOrderItemId] = useState<string>('');

  useEffect(() => {
    params.then(({ orderId, orderItemId }) => {
      setOrderId(orderId);
      setOrderItemId(orderItemId);
    });
  }, [params]);

  const router = useLocalizedRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 從快取讀取訂單和事件資料
  const {
    data: orderData,
    isLoading: orderLoading,
    error: orderError,
  } = useOrder(orderId);
  const { data: orderItems, isLoading: orderItemsLoading } =
    useOrderItems(orderId);
  const order = orderData;
  const {
    data: event,
    isLoading: eventLoading,
    error: eventError,
  } = useEvent(order?.eventId ?? '');

  const isLoading =
    orderLoading ||
    eventLoading ||
    orderItemsLoading ||
    !orderId ||
    !orderItemId;
  const hasError = orderError ?? eventError;

  // 載入中狀態
  if (isLoading) {
    return <RegistrationSkeleton />;
  }

  // 錯誤狀態
  if (hasError || !order || !event) {
    return (
      <div className='bg-white rounded-lg shadow-md p-6'>
        <div className='text-center'>
          <h3 className='text-xl font-semibold text-gray-900 mb-2'>載入失敗</h3>
          <p className='text-gray-600 mb-4'>無法載入訂單或活動資料</p>
          <Button
            onClick={() => router.push('/orders')}
            variant='primary'
            className='w-full'
          >
            返回訂單列表
          </Button>
        </div>
      </div>
    );
  }

  // 根據 orderItemId 找到對應的 OrderItem
  const targetOrderItem = orderItems?.find(
    (item: OrderItem) => item.id === orderItemId
  );

  // 從 Event 獲取報名表模板
  const formTemplate: EventRegistrationTemplate | undefined =
    event.registrationFormTemplate;

  // 獲取 OrderItem 中現有的報名表資料
  const existingRegistrationData = targetOrderItem?.registrationFormData;
  const hasExistingForm =
    !!existingRegistrationData &&
    Object.keys(existingRegistrationData).length > 0;

  const handleFormSubmit = async (formData: Record<string, any>) => {
    setIsSubmitting(true);
    try {
      // TODO: 調用 API 更新 OrderItem 的 registrationFormData
      console.log('提交報名表資料:', {
        orderId: order.id,
        orderItemId: targetOrderItem?.id ?? '',
        formTemplateId: formTemplate?.id ?? '',
        formData,
      });

      await new Promise(resolve => setTimeout(resolve, 1000)); // 模擬 API 調用

      addToast({
        message: '報名表提交成功！',
        type: 'success',
        duration: 3000,
      });

      // 提交成功後返回訂單詳情頁面
      router.push(`/orders/${order.id}`);
    } catch (_error) {
      addToast({
        message: '提交失敗，請重試',
        type: 'error',
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='space-y-6'>
      {/* 頁面標題 */}
      <div className='bg-white rounded-lg shadow-md p-6'>
        <h1 className='text-2xl font-bold text-gray-900 mb-2'>活動報名表</h1>
        <p className='text-gray-600'>
          訂單 #{order.id} • 訂單項目 #{targetOrderItem?.id ?? ''}
        </p>
      </div>

      {/* 訂單項目資訊 */}
      <OrderItemInfoHead
        orderItem={targetOrderItem ?? ({} as OrderItem)}
        orderItemId={orderItemId}
        order={order}
        event={event}
      />
      {/* 報名表顯示 */}
      {formTemplate && (
        <div className='bg-white rounded-lg shadow-md p-6'>
          {/* 表單標題和描述 */}
          <div>
            <h3 className='text-lg font-semibold text-gray-900 mb-2'>
              {formTemplate?.name ?? '無報名表模板'}
            </h3>
            <p className='text-sm text-gray-600 mb-4'>
              {formTemplate?.description ?? '此活動沒有設定報名表模板'}
            </p>
          </div>
          <RegistrationDynamicForm
            template={formTemplate}
            existingFormData={existingRegistrationData}
            onFormSubmit={handleFormSubmit}
            isSubmitting={isSubmitting}
            readOnly={false}
          />
        </div>
      )}

      {/* 操作按鈕 */}
      <OrderItemAction
        orderId={order.id}
        orderItemId={orderItemId}
        event={event}
        hasExistingForm={hasExistingForm}
        readOnly={false}
      />
    </div>
  );
}
