'use client';

import { Card } from '@/components';

export function EventContentSkeleton() {
  return (
    <Card className='p-6'>
      <div className='animate-pulse'>
        <div className='h-6 bg-gray-200 rounded w-1/4 mb-4' />
        <div className='space-y-3'>
          <div className='h-4 bg-gray-200 rounded' />
          <div className='h-4 bg-gray-200 rounded w-5/6' />
          <div className='h-4 bg-gray-200 rounded w-4/6' />
        </div>
      </div>
    </Card>
  );
}
