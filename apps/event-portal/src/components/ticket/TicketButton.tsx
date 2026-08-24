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
  const canSell = canSellTicket(eventDate, ticket.availableQuantity, ticket);
  const isSoldOut = ticket.availableQuantity === 0;
  const isEventCompleted = !canSell && !isSoldOut;

  const handleClick = () => {
    onTicketClick(eventId, sessionId, ticket.id);
  };

  const getStatusText = () => {
    if (ticket.status === 'stopped') return '報名截止';
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
        <div className='flex justify-between items-baseline gap-3 mb-1'>
          <span className='text-sm font-medium text-gray-800'>
            {ticket.name}
          </span>
          <span className='shrink-0 text-sm font-semibold tabular-nums text-gray-900'>
            NT$ {ticket.price.toLocaleString()}
          </span>
        </div>
        <div className='flex justify-between items-center text-xs'>
          <span className='rounded-full bg-gray-200 px-2 py-0.5 font-medium text-gray-700'>
            剩 {ticket.availableQuantity}
          </span>
          <span className={cn('font-medium', getStatusColor())}>
            {getStatusText()}
          </span>
        </div>
      </div>
    </Button>
  );
}
