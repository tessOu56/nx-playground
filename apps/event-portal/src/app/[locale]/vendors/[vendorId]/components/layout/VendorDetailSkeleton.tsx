import { EventListSkeleton } from '../events';
import { VendorHeaderSkeleton } from '../header';

import { Skeleton } from '@/components/core';

export function VendorDetailSkeleton() {
  return (
    <div className='space-y-6'>
      <VendorHeaderSkeleton />
      <div className='bg-white rounded-lg shadow-md p-6'>
        {/* 活動列表標題 skeleton */}
        <Skeleton className='h-6 w-1/4 mb-4' />
        <EventListSkeleton />
      </div>
    </div>
  );
}
