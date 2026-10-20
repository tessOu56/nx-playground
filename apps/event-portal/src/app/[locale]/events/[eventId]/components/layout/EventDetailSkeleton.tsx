'use client';

import { EventInfoHeaderSkeleton } from '..';
import { Skeleton } from '@/components/core';
import { demoCopy } from '@/libs/i18n/demo-copy';

export function EventDetailSkeleton({ locale = 'zh-TW' }: { locale?: string }) {
  const copy = demoCopy(locale);
  return (
    <div className='space-y-6' aria-busy='true' aria-live='polite'>
      <span className='sr-only'>{copy.loadingLabel}</span>
      <div className='lg:grid lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start lg:gap-8'>
        <div className='space-y-6'>
          <EventInfoHeaderSkeleton />
          <div className='rounded-xl border border-gray-200 bg-white p-5 lg:hidden'>
            <Skeleton className='mb-3 h-5 w-32' />
            <Skeleton className='mb-4 h-4 w-full' />
            <Skeleton className='mb-2 h-10 w-full' />
            <Skeleton className='h-10 w-full' />
          </div>
        </div>
        <div className='hidden rounded-xl border border-gray-200 bg-white p-5 lg:block'>
          <Skeleton className='mb-3 h-5 w-32' />
          <Skeleton className='mb-4 h-4 w-full' />
          <Skeleton className='mb-2 h-10 w-full' />
          <Skeleton className='mb-2 h-10 w-full' />
          <Skeleton className='h-10 w-full' />
        </div>
      </div>
    </div>
  );
}
