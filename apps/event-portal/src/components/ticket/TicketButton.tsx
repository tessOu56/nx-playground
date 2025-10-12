'use client';

import { Button } from '@/components';
import { cn } from '@/libs/css';
import { canSellTicket } from '@/libs/utils/eventUtils';
import type { SessionTicket } from '@/types';

interface TicketButtonProps {
  ticket: SessionTicket;
  eventDate: string;
  eventId: string;
  sessionId: string;
  onTicketClick: (eventId: string, sessionId: string, ticketId: string) => void;
  className?: string;
}

export function TicketButton({
  ticket,
  eventDate,
  eventId,
  sessionId,
  onTicketClick,
  className,
}: TicketButtonProps) {
  const canSell = canSellTicket(eventDate, ticket.availableQuantity);
  const isSoldOut = ticket.availableQuantity === 0;
  const isEventCompleted = !canSell && !isSoldOut;

  const handleClick = () => {
    onTicketClick(eventId, sessionId, ticket.id);
  };

  const getStatusText = () => {
    if (isEventCompleted) return '活動已結束';
    if (isSoldOut) return '已售完';
    return '可購買';
  };

  const getStatusColor = () => {
    if (isEventCompleted) return 'text-gray-500';
    if (isSoldOut) return 'text-gray-500';
    return 'text-green-600';
  };

  return (
    <Button
      onClick={handleClick}
      disabled={!canSell}
      variant='secondary'
      className={cn(
        'w-full h-auto p-3 text-left bg-gray-50 hover:bg-gray-100 border-gray-200',
        !canSell ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
        className
      )}
    >
      <div className='flex flex-col w-full'>
        <div className='flex justify-between items-center mb-2'>
          <span className='text-sm font-medium text-gray-800'>
            {ticket.name}
          </span>
          <span className='text-sm text-gray-600'>
            NT$ {ticket.price.toLocaleString()}
          </span>
        </div>
        <div className='flex justify-between items-center text-xs'>
          <span className='text-gray-500'>
            剩餘 {ticket.availableQuantity} 張
          </span>
          <span className={cn('font-medium', getStatusColor())}>
            {getStatusText()}
          </span>
        </div>
      </div>
    </Button>
  );
}
