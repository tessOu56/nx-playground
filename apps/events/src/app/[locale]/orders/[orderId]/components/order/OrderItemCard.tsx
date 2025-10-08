'use client';

import { Button } from '@nx-playground/ui-components';

import { useOrderTickets, shareQRCodeToVendor } from '@/libs';
import { useLocalizedRouter } from '@/libs/i18n';
import { getOrderItemStatusLabel, getOrderItemStatusColor } from '@/libs/utils';
import type { OrderItem } from '@/types';

interface OrderItemCardProps {
  item: OrderItem;
}

export function OrderItemCard({ item }: OrderItemCardProps) {
  const router = useLocalizedRouter();

  // 獲取訂單的所有票券
  const { data: tickets } = useOrderTickets(item.orderId);

  // 根據 OrderItem 查找對應的 Ticket
  const ticket = tickets?.find(t => t.id === item.ticketId);

  // 獲取報名表狀況
  const { registrationFormData } = item;
  const getRegistrationStatus = () => {
    const hasRegistrationForm =
      registrationFormData && Object.keys(registrationFormData).length > 0;

    if (!hasRegistrationForm) {
      // 尚未填寫報名表
      return '尚未填寫';
    }

    if (item.status === 'pending') {
      // 報名表已填寫，但票券未出（等待付款核准）
      return '已填寫，待核准';
    }

    if (item.status === 'issued') {
      // 票券已出，報名表不可修改
      return '已確認，不可修改';
    }

    if (item.status === 'cancelled') {
      return '已取消';
    }

    return '未知狀態';
  };

  const getRegistrationStatusColor = () => {
    const status = getRegistrationStatus();
    switch (status) {
      case '已確認，不可修改':
        return 'text-green-600';
      case '已填寫，待核准':
        return 'text-blue-600';
      case '尚未填寫':
        return 'text-yellow-600';
      case '已取消':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const handleRegistrationClick = () => {
    router.push(`/orders/${item.orderId}/items/${item.id}/registration`);
  };

  const handleCheckInClick = () => {
    if (item.ticketId) {
      router.push(`/orders/${item.orderId}/tickets/${item.ticketId}/check-in`);
    }
  };

  const handleShareRegistrationForm = async () => {
    const registrationUrl = `${window.location.origin}/orders/${item.orderId}/items/${item.id}/registration`;
    await shareQRCodeToVendor(registrationUrl, 'registration', {
      orderItemId: item.id,
      orderId: item.orderId,
      ticketType: item.ticketTypeName,
    });
  };

  const handleShareTicket = async () => {
    if (ticket) {
      const ticketUrl = `${window.location.origin}/tickets/verify/${ticket.id}`;
      await shareQRCodeToVendor(ticketUrl, 'ticket', {
        ticketId: ticket.id,
        orderId: item.orderId,
        ticketType: item.ticketTypeName,
      });
    }
  };

  // 檢查是否可以填寫/修改報名表（只要訂單項目存在就可以填寫）
  const canFillRegistration = true;
  // 檢查是否可以報到（已出票且有實際票券）
  const canCheckIn = item.status === 'issued' && ticket;
  // 檢查是否可以分享報名表（訂單項目存在即可分享連結）
  const canShareRegistration = true;
  // 檢查是否可以分享票券（已出票且有實際票券）
  const canShareTicket =
    item.status === 'issued' && ticket && registrationFormData;

  return (
    <div className='border rounded-lg p-4'>
      <div className='flex items-center justify-between mb-3'>
        <div className='flex-1'>
          <h4 className='font-medium text-gray-900'>
            {item?.ticketTypeName ?? ''}
          </h4>
          <p className={`text-sm ${getRegistrationStatusColor()}`}>
            報名表填寫狀況: {getRegistrationStatus()}
          </p>
        </div>
        <div className='text-right'>
          <p className='text-sm text-gray-600'>
            數量: {item?.quantity ?? 0} 張 • 單價: NT${' '}
            {item?.unitPrice?.toLocaleString() ?? 0}
          </p>
          <p className={`text-sm ${getOrderItemStatusColor(item.status)}`}>
            {ticket
              ? `${new Date(ticket.createdAt).toLocaleDateString(
                  'zh-TW'
                )} - ${getOrderItemStatusLabel(item.status)}`
              : getOrderItemStatusLabel(item.status)}
          </p>
        </div>
      </div>

      <div className='flex items-center justify-between mt-3 gap-2'>
        <div className='flex gap-2'>
          {/* 填寫報名表按鈕 */}
          <Button
            onClick={handleRegistrationClick}
            variant='outline'
            size='sm'
            className='text-purple-600 border-purple-600 hover:bg-purple-50'
            disabled={!canFillRegistration}
          >
            填寫報名表
          </Button>

          {/* 分享報名表按鈕 */}
          <Button
            onClick={handleShareRegistrationForm}
            variant='outline'
            size='sm'
            className='text-blue-600 border-blue-600 hover:bg-blue-50'
            disabled={!canFillRegistration}
          >
            分享報名表
          </Button>
        </div>

        <div className='flex gap-2'>
          {/* 分享票券按鈕 */}
          <Button
            onClick={handleShareTicket}
            variant='outline'
            size='sm'
            className='text-orange-600 border-orange-600 hover:bg-orange-50'
            disabled={!canShareTicket}
          >
            分享票券
          </Button>

          {/* 前往報到按鈕 */}
          <Button
            onClick={handleCheckInClick}
            variant='primary'
            size='sm'
            className='bg-green-600 hover:bg-green-700 text-white'
            disabled={!canShareTicket}
          >
            前往報到
          </Button>
        </div>
      </div>
    </div>
  );
}
