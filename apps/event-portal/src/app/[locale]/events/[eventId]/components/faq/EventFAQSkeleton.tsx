'use client';

import { Card } from '@/components';

export function EventFAQSkeleton() {
  return (
    <Card className='p-6'>
      <div className='animate-pulse'>
        <div className='h-6 bg-muted rounded w-1/4 mb-4' />
        <div className='space-y-3'>
          <div className='h-12 bg-muted rounded' />
          <div className='h-12 bg-muted rounded' />
          <div className='h-12 bg-muted rounded' />
        </div>
      </div>
    </Card>
  );
}
