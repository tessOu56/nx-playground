'use client';

import { ChevronDown } from 'lucide-react';
import { forwardRef, type ChangeEvent } from 'react';

import { cn } from '../../../utils';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SimpleSelectProps {
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outline';
}

export const SimpleSelect = forwardRef<HTMLSelectElement, SimpleSelectProps>(
  (
    {
      options,
      value,
      onChange,
      placeholder = '請選擇...',
      disabled = false,
      error = false,
      className = '',
      size = 'md',
      variant = 'default',
      ...props
    },
    ref
  ) => {
    const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
      onChange?.(e.target.value);
    };

    const sizeClasses = {
      sm: 'h-8 px-2 text-sm',
      md: 'h-10 px-3 text-sm',
      lg: 'h-12 px-4 text-base',
    };

    const variantClasses = {
      default: 'bg-background border-input',
      outline: 'bg-transparent border-border',
    };

    const errorClasses = error
      ? 'border-destructive focus:border-destructive'
      : '';

    return (
      <div className='relative'>
        <select
          ref={ref}
          value={value ?? ''}
          onChange={handleChange}
          disabled={disabled}
          className={cn(
            'w-full appearance-none rounded-md border bg-background px-3 py-2 text-sm text-gray-600 ring-offset-background',
            'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50',
            sizeClasses[size],
            variantClasses[variant],
            errorClasses,
            className
          )}
          {...props}
        >
          {placeholder && (
            <option value='' disabled>
              {placeholder}
            </option>
          )}
          {options.map(option => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className='absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 transform opacity-50 pointer-events-none' />
      </div>
    );
  }
);

SimpleSelect.displayName = 'SimpleSelect';
