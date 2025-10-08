'use client';

import { Button } from '@/components';
import { canSellTicket } from '@/libs/utils/eventUtils';
import type { Event, SessionTicket } from '@/types';

interface TicketCardProps {
  event: Event;
  ticket: SessionTicket;
  quantity: number;
  onQuantityChange: (ticketId: string, change: number) => void;
}

export function TicketCard({
  event,
  ticket,
  quantity,
  onQuantityChange,
}: TicketCardProps) {
  const canSell = canSellTicket(event.date, ticket.availableQuantity);

  return (
    <div
      className={`border rounded-lg p-4 transition-colors ${
        quantity > 0 ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
      }`}
    >
      <div className='flex items-center justify-between mb-4'>
        <div className='flex-1'>
          <h4 className='font-medium text-gray-900 text-lg'>{ticket.name}</h4>
          <p className='text-sm text-gray-600'>
            {ticket.description ?? '標準票卷'}
          </p>
        </div>
        <div className='text-right'>
          <p className='text-xl font-bold text-blue-600'>
            NT$ {ticket.price.toLocaleString()}
          </p>
          <p className='text-sm text-gray-500'>
            剩餘 {ticket.availableQuantity} 張
          </p>
        </div>
      </div>

      <div className='flex items-center justify-between'>
        <div className='flex items-center space-x-4'>
          <Button
            variant='secondary'
            size='sm'
            onClick={() => onQuantityChange(ticket.id, -1)}
            disabled={quantity === 0}
            className='w-10 h-10 rounded-full p-0 flex items-center justify-center'
          >
            -
          </Button>
          <span className='w-16 text-center font-medium text-lg text-blue-600'>
            {quantity}
          </span>
          <Button
            variant='secondary'
            size='sm'
            onClick={() => onQuantityChange(ticket.id, 1)}
            disabled={!canSell || quantity >= ticket.availableQuantity}
            className='w-10 h-10 rounded-full p-0 flex items-center justify-center'
          >
            +
          </Button>
        </div>
        <div
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            !canSell
              ? 'bg-gray-100 text-gray-500'
              : ticket.availableQuantity === 0
              ? 'bg-red-100 text-red-800'
              : 'bg-green-100 text-green-800'
          }`}
        >
          {!canSell
            ? '活動已結束'
            : ticket.availableQuantity === 0
            ? '已售完'
            : '可購買'}
        </div>
      </div>
    </div>
  );
}
