'use client';

import type { Session } from '@/types';

interface SessionCardProps {
  session: Session;
  isSelected: boolean;
  isAvailable: boolean;
  remainingTickets: number;
  onSelect: () => void;
}

export function SessionCard({
  session,
  isSelected,
  isAvailable,
  remainingTickets,
  onSelect,
}: SessionCardProps) {
  return (
    <div
      className={`border rounded-lg p-3 transition-all duration-200 min-w-[200px]${
        isAvailable ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'
      } ${
        isSelected
          ? 'border-blue-500 bg-blue-50 shadow-md'
          : isAvailable
          ? 'border-gray-200 hover:border-blue-300 hover:shadow-sm'
          : 'border-gray-200 bg-gray-50'
      }`}
      onClick={() => isAvailable && onSelect()}
    >
      <div className='space-y-2'>
        {/* 場次名稱 */}
        <div className='flex items-center justify-between'>
          <h4 className='font-medium text-gray-900 text-sm truncate'>
            {session.name}
          </h4>
          {isAvailable && (
            <div
              className={`w-3 h-3 border-2 rounded-full flex-shrink-0 ${
                isSelected ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
              }`}
            />
          )}
        </div>

        {/* 時間和地點 */}
        <div className='space-y-1'>
          <p className='text-xs text-gray-600 font-medium'>{session.time}</p>
        </div>

        {/* 票券狀態 */}
        <div className='pt-1 border-t border-gray-100'>
          {isAvailable ? (
            <p className='text-xs text-green-600 font-medium'>
              剩餘 {remainingTickets} 張
            </p>
          ) : (
            <p className='text-xs text-red-500 font-medium'>已售完</p>
          )}
        </div>
      </div>
    </div>
  );
}
