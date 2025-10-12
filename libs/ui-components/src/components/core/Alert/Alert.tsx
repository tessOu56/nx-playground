'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import { AlertCircle, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { forwardRef, type HTMLAttributes } from 'react';

import { cn } from '../../../utils';

const alertVariants = cva(
  'relative w-full rounded-lg border p-4 [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg+div]:pl-7',
  {
    variants: {
      variant: {
        default: 'bg-white border-gray-200 text-gray-900 [&>svg]:text-gray-900',
        info: 'bg-blue-50 border-blue-200 text-blue-900 [&>svg]:text-blue-600',
        success:
          'bg-green-50 border-green-200 text-green-900 [&>svg]:text-green-600',
        warning:
          'bg-yellow-50 border-yellow-200 text-yellow-900 [&>svg]:text-yellow-600',
        destructive:
          'bg-red-50 border-red-200 text-red-900 [&>svg]:text-red-600',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

const alertIcons = {
  default: Info,
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  destructive: AlertCircle,
};

export interface AlertProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  showIcon?: boolean;
}

const Alert = forwardRef<HTMLDivElement, AlertProps>(
  (
    { className, variant = 'default', showIcon = true, children, ...props },
    ref
  ) => {
    const Icon = alertIcons[variant || 'default'];

    return (
      <div
        ref={ref}
        role='alert'
        className={cn(alertVariants({ variant }), className)}
        {...props}
      >
        {showIcon && <Icon className='h-5 w-5' />}
        <div>{children}</div>
      </div>
    );
  }
);
Alert.displayName = 'Alert';

const AlertTitle = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn('mb-1 font-semibold leading-none tracking-tight', className)}
    {...props}
  />
));
AlertTitle.displayName = 'AlertTitle';

const AlertDescription = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('text-sm [&_p]:leading-relaxed', className)}
    {...props}
  />
));
AlertDescription.displayName = 'AlertDescription';

export { Alert, AlertTitle, AlertDescription };
