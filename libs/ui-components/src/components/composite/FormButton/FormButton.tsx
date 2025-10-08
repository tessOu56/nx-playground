'use client';

import { type MouseEvent, type ReactNode, forwardRef } from 'react';

import { Button } from '../../core/Button/Button';

export interface FormButtonProps {
  children: ReactNode;
  variant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link'
    | 'primary';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  disabled?: boolean;
  loading?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  className?: string;
}

export const FormButton = forwardRef<HTMLButtonElement, FormButtonProps>(
  (
    {
      children,
      variant = 'default',
      size = 'default',
      disabled = false,
      loading = false,
      type = 'button',
      onClick,
      className = '',
      ...props
    },
    ref
  ) => {
    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        disabled={disabled || loading}
        type={type}
        onClick={onClick}
        className={className}
        {...props}
      >
        {loading && (
          <svg
            className='mr-2 h-4 w-4 animate-spin'
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
          >
            <circle
              className='opacity-25'
              cx='12'
              cy='12'
              r='10'
              stroke='currentColor'
              strokeWidth='4'
            />
            <path
              className='opacity-75'
              fill='currentColor'
              d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
            />
          </svg>
        )}
        {children}
      </Button>
    );
  }
);

FormButton.displayName = 'FormButton';
