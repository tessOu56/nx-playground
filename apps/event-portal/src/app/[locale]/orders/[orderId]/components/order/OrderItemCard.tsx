'use client';

import { Button } from '@nx-playground/ui-components';

import { useOrderTickets, shareQRCodeToVendor } from '@/libs';
import { useLocalizedRouter } from '@/libs/i18n';
import { getOrderItemStatusLabel, getOrderItemStatusColor } from '@/libs/utils';
import type { OrderItem, Ticket } from '@/types';

interface OrderItemCardProps {
  item: OrderItem;
}

export function OrderItemCard({ item }: OrderItemCardProps) {
  const router = useLocalizedRouter();
  const { data: tickets } = useOrderTickets(item.orderId);
  const ticket = tickets?.find((t: Ticket) => t.id === item.ticketId);
  const { registrationFormData } = item;

  const getRegistrationStatus = () => {
    const hasRegistrationForm =
      registrationFormData && Object.keys(registrationFormData).length > 0;

    if (!hasRegistrationForm) return '尚未填寫';
    if (item.status === 'pending') return '已填寫，待核准';
    if (item.status === 'issued') return '已確認，不可修改';
    if (item.status === 'cancelled') return '已取消';
    return '未知狀態';
  };

  const getRegistrationStatusColor = () => {
    switch (getRegistrationStatus()) {
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

  const handleVerifyClick = () => {
    const ticketId = ticket?.id ?? item.ticketId;
    if (ticketId) {
      router.push(`/tickets/verify/${ticketId}`);
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

  const canCheckIn =
    item.status === 'issued' && Boolean(ticket?.id ?? item.ticketId);
  const canVerify = canCheckIn;
  const canShareTicket =
    item.status === 'issued' && ticket && registrationFormData;

  return (
    <div className='rounded-lg border border-gray-200 p-4'>
      <div className='flex flex-wrap items-start justify-between gap-2'>
        <div>
          <h4 className='font-semibold text-gray-900'>
            {item.ticketTypeName || '票券'}
          </h4>
          <p className={`mt-0.5 text-sm ${getRegistrationStatusColor()}`}>
            報名表：{getRegistrationStatus()}
          </p>
        </div>
        <div className='text-right'>
          <p className={`text-sm font-medium ${getOrderItemStatusColor(item.status)}`}>
            {getOrderItemStatusLabel(item.status)}
          </p>
          <p className='text-xs text-gray-500 tabular-nums'>
            {item.quantity} 張
            {item.unitPrice > 0
              ? ` · NT$ ${item.unitPrice.toLocaleString()}`
              : ''}
          </p>
        </div>
      </div>

      <div className='mt-3 flex flex-wrap gap-2'>
        <Button
          onClick={handleRegistrationClick}
          variant='outline'
          size='sm'
          className='text-purple-700 border-purple-300'
        >
          填寫報名表
        </Button>
        <Button
          onClick={handleShareRegistrationForm}
          variant='outline'
          size='sm'
        >
          分享報名表
        </Button>
        {canVerify ? (
          <Button onClick={handleVerifyClick} variant='outline' size='sm'>
            核銷／驗證
          </Button>
        ) : null}
        <Button
          onClick={handleShareTicket}
          variant='outline'
          size='sm'
          disabled={!canShareTicket}
        >
          分享票券
        </Button>
        <Button
          onClick={handleCheckInClick}
          variant='primary'
          size='sm'
          className='bg-green-600 hover:bg-green-700 text-white'
          disabled={!canCheckIn}
        >
          前往報到
        </Button>
      </div>
    </div>
  );
}
