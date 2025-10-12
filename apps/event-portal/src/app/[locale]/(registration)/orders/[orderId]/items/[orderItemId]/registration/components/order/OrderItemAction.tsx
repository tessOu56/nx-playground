'use client';

import { Button } from '@nx-playground/ui-components';

import { shareToLine } from '@/libs';
import { useLocalizedRouter } from '@/libs/i18n';
import type { Event } from '@/types';

interface OrderItemActionProps {
  orderId: string;
  orderItemId: string;
  event: Event;
  hasExistingForm: boolean;
  readOnly?: boolean;
}

export function OrderItemAction({
  orderId,
  orderItemId,
  event,
  hasExistingForm,
  readOnly: _readOnly,
}: OrderItemActionProps) {
  const router = useLocalizedRouter();

  return (
    <div className='bg-white rounded-lg shadow-md p-6'>
      <div className='flex flex-col sm:flex-row gap-3 mb-4'>
        <Button
          onClick={() => router.push(`/orders/${orderId}`)}
          variant='secondary'
          className='flex-1'
        >
          返回訂單詳情
        </Button>
        <Button
          onClick={() => router.push('/orders')}
          variant='secondary'
          className='flex-1'
        >
          查看所有訂單
        </Button>
      </div>

      {/* 分享報名表按鈕 */}
      <div className='border-t pt-4'>
        <Button
          onClick={() =>
            shareToLine(
              `活動報名表：${
                event.registrationFormTemplate?.name ?? '報名表'
              }\n\n訂單編號：${orderId}\n活動：${event.title}\n\n報名表${
                hasExistingForm ? '已填寫完成' : '等待填寫'
              }！`,
              `${window.location.origin}/orders/${orderId}/items/${orderItemId}/registration`
            )
          }
          variant='primary'
          className='w-full bg-green-600 hover:bg-green-700 text-white font-semibold'
        >
          分享報名表到 LINE
        </Button>
      </div>
    </div>
  );
}
