'use client';

import { forwardRef, type HTMLAttributes } from 'react';

import { cn } from '../../../utils';

import { Skeleton, type SkeletonProps } from './Skeleton';

export interface SkeletonTextProps
  extends Omit<SkeletonProps, 'height'>,
    HTMLAttributes<HTMLDivElement> {
  lines?: number;
}

export const SkeletonText = forwardRef<HTMLDivElement, SkeletonTextProps>(
  ({ lines = 1, className, ...props }, ref) => {
    if (lines === 1) {
      return (
        <Skeleton ref={ref} className={cn('h-4 w-full', className)} {...props} />
      );
    }

    return (
      <div className={cn('space-y-2', className)}>
        {Array.from({ length: lines }, (_, index) => (
          <Skeleton
            key={`skeleton-line-${index}`}
            className={cn('h-4', index === lines - 1 ? 'w-3/4' : 'w-full')}
          />
        ))}
      </div>
    );
  }
);

SkeletonText.displayName = 'SkeletonText';
