'use client';

import { forwardRef, type HTMLAttributes } from 'react';

import { cn } from '../../../utils';

import { Skeleton, type SkeletonProps } from './Skeleton';
import { SkeletonAvatar } from './SkeletonAvatar';
import { SkeletonText } from './SkeletonText';

export interface SkeletonCardProps
  extends Omit<SkeletonProps, 'variant' | 'size'>,
    HTMLAttributes<HTMLDivElement> {
  showAvatar?: boolean;
  titleLines?: number;
  contentLines?: number;
}

export const SkeletonCard = forwardRef<HTMLDivElement, SkeletonCardProps>(
  (
    {
      className,
      showAvatar = false,
      titleLines = 1,
      contentLines = 3,
      ...props
    },
    ref
  ) => (
    <div ref={ref} className={cn('p-6 space-y-4', className)} {...props}>
      {showAvatar && (
        <div className='flex items-center space-x-4'>
          <SkeletonAvatar />
          <div className='space-y-2 flex-1'>
            <Skeleton className='h-4 w-1/4' />
            <Skeleton className='h-3 w-1/6' />
          </div>
        </div>
      )}
      <div className='space-y-2'>
        <SkeletonText lines={titleLines} />
        <SkeletonText lines={contentLines} />
      </div>
    </div>
  )
);

SkeletonCard.displayName = 'SkeletonCard';
