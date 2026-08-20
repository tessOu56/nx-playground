'use client';

import { Image } from '@/components';
import {
  eventDisplayLabel,
  eventListKind,
} from '@/libs/api/event-stack-map';
import type { EventDetail } from '@/types';

interface EventInfoHeaderProps {
  event: EventDetail;
  eventId: string;
}

export function EventInfoHeader({ event }: EventInfoHeaderProps) {
  const kind = eventListKind(event);

  return (
    <div className='space-y-6'>
      <div className='bg-white rounded-lg shadow-md overflow-hidden'>
        <div className='h-64 relative'>
          <Image
            src={event.image}
            alt={event.title}
            width={800}
            height={256}
            className='w-full h-full object-cover'
            fallback='/placeholder-event.jpg'
          />
          <div className='absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full'>
            <span className='text-sm font-medium text-gray-700'>
              {event.category}
            </span>
          </div>
          <div className='absolute top-4 right-4 bg-black/70 px-3 py-1 rounded-full'>
            <span className='text-sm font-medium text-white'>
              {eventDisplayLabel(kind)}
            </span>
          </div>
        </div>

        <div className='p-6'>
          <h1 className='text-3xl font-bold text-gray-900 mb-4'>
            {event.title}
          </h1>
          <p className='text-gray-600 mb-6 text-lg leading-relaxed'>
            {event.description}
          </p>
          <p className='flex items-center text-gray-600'>
            <span className='w-4 h-4 mr-2' role='img' aria-label='地點'>
              📍
            </span>
            {event.location}
          </p>
        </div>
      </div>
    </div>
  );
}
