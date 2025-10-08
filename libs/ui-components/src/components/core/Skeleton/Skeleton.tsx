'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef, type HTMLAttributes } from 'react';

import { cn } from '../../../utils';

const skeletonVariants = cva('animate-pulse bg-muted rounded-md', {
  variants: {
    variant: {
      default: '',
      circular: 'rounded-full',
      rectangular: 'rounded-none',
    },
    size: {
      sm: 'h-4',
      md: 'h-6',
      lg: 'h-8',
      xl: 'h-12',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'md',
  },
});

export interface SkeletonProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof skeletonVariants> {
  width?: string;
  height?: string;
}

export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ variant, size, className, width, height, style, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(skeletonVariants({ variant, size }), className)}
        style={{
          width: width ?? undefined,
          height: height ?? undefined,
          ...style,
        }}
        {...props}
      />
    );
  }
);

Skeleton.displayName = 'Skeleton';
