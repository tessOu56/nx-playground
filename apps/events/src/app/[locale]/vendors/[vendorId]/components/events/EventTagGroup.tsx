'use client';

import { isEventUpcoming, isEventCompleted } from '@/libs/utils/eventUtils';
import type { Event } from '@/types';

interface EventTagGroupProps {
  event: Event;
  className?: string;
}

export function EventTagGroup({ event, className = '' }: EventTagGroupProps) {
  return (
    <div className={`absolute top-3 left-3 flex gap-2 ${className}`}>
      {/* 分類標籤 */}
      <div className='bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full'>
        <span className='text-xs font-medium text-gray-700'>
          {event.category}
        </span>
      </div>

      {/* 即將到來標籤 */}
      {isEventUpcoming(event.date) && (
        <div className='bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full'>
          <span className='text-xs font-medium text-orange-800'>即將到來</span>
        </div>
      )}

      {/* 已結束標籤 */}
      {isEventCompleted(event.date) && (
        <div className='bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full'>
          <span className='text-xs font-medium text-gray-600'>已結束</span>
        </div>
      )}
    </div>
  );
}
