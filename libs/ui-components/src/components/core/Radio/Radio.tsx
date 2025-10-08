'use client';

import { forwardRef, type InputHTMLAttributes } from 'react';

import { cn } from '../../../utils';

export interface RadioProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  description?: string;
}

const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ className, label, description, ...props }, ref) => {
    return (
      <label className='flex items-center space-x-3 cursor-pointer'>
        <input
          type='radio'
          className={cn(
            'h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded-full',
            className
          )}
          ref={ref}
          {...props}
        />
        <div className='flex flex-col'>
          {label && <span className='text-gray-900 font-medium'>{label}</span>}
          {description && (
            <span className='text-gray-500 text-sm'>{description}</span>
          )}
        </div>
      </label>
    );
  }
);

Radio.displayName = 'Radio';

export { Radio };
