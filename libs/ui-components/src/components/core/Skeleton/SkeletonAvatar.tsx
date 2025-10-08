'use client';

import { forwardRef, type HTMLAttributes } from 'react';

import { cn } from '../../../utils';

import { Skeleton, type SkeletonProps } from './Skeleton';

export interface SkeletonAvatarProps
  extends Omit<SkeletonProps, 'variant' | 'size'>,
    HTMLAttributes<HTMLDivElement> {}

export const SkeletonAvatar = forwardRef<HTMLDivElement, SkeletonAvatarProps>(
  ({ className, ...props }, ref) => (
    <Skeleton
      ref={ref}
      variant='circular'
      size='lg'
      className={cn('w-12 h-12', className)}
      {...props}
    />
  )
);

SkeletonAvatar.displayName = 'SkeletonAvatar';
