import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef, type HTMLAttributes } from 'react';

import { cn } from '../../../utils';

const loadingSpinnerVariants = cva(
  'animate-spin rounded-full border-2 border-muted border-t-primary',
  {
    variants: {
      size: {
        sm: 'h-4 w-4',
        md: 'h-8 w-8',
        lg: 'h-12 w-12',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

const loadingSpinnerContainerVariants = cva(
  'flex flex-col items-center justify-center gap-2',
  {
    variants: {
      variant: {
        default: 'p-8',
        compact: 'p-4',
        minimal: 'p-2',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface LoadingSpinnerProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof loadingSpinnerVariants> {
  text?: string;
  containerVariant?: VariantProps<
    typeof loadingSpinnerContainerVariants
  >['variant'];
}

export const LoadingSpinner = forwardRef<HTMLDivElement, LoadingSpinnerProps>(
  ({ size, containerVariant, className, text, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          loadingSpinnerContainerVariants({ variant: containerVariant }),
          className
        )}
        {...props}
      >
        <div className={loadingSpinnerVariants({ size })} />
        {text && <p className='text-sm text-muted-foreground'>{text}</p>}
      </div>
    );
  }
);

LoadingSpinner.displayName = 'LoadingSpinner';

// 頁面級別的載入組件
export const PageLoadingSpinner = forwardRef<
  HTMLDivElement,
  Omit<LoadingSpinnerProps, 'size' | 'text' | 'containerVariant'>
>((props, ref) => (
  <LoadingSpinner
    ref={ref}
    size='lg'
    containerVariant='default'
    className={cn('min-h-[16rem]', props.className)}
    text='載入頁面中...'
    {...props}
  />
));

PageLoadingSpinner.displayName = 'PageLoadingSpinner';

// 組件級別的載入組件
export const ComponentLoadingSpinner = forwardRef<
  HTMLDivElement,
  Omit<LoadingSpinnerProps, 'size' | 'text' | 'containerVariant'>
>((props, ref) => (
  <LoadingSpinner
    ref={ref}
    size='md'
    containerVariant='compact'
    className={cn('min-h-[8rem]', props.className)}
    text='載入組件中...'
    {...props}
  />
));

ComponentLoadingSpinner.displayName = 'ComponentLoadingSpinner';
