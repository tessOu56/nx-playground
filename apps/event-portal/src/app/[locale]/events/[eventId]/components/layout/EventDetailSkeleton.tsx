'use client';

import { EventInfoHeaderSkeleton, EventSessionListSkeleton } from '..';

export function EventDetailSkeleton() {
  return (
    <div className='space-y-6'>
      <EventInfoHeaderSkeleton />
      <EventSessionListSkeleton />
    </div>
  );
}
