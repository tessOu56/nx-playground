'use client';

import { Card } from '@/components';

export function EventFAQSkeleton() {
  return (
    <Card className='p-6'>
      <div className='animate-pulse'>
        <div className='h-6 bg-gray-200 rounded w-1/4 mb-4' />
        <div className='space-y-3'>
          <div className='h-12 bg-gray-200 rounded' />
          <div className='h-12 bg-gray-200 rounded' />
          <div className='h-12 bg-gray-200 rounded' />
        </div>
      </div>
    </Card>
  );
}
