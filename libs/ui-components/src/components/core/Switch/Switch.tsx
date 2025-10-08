'use client';

import { forwardRef, type InputHTMLAttributes } from 'react';

import { cn } from '../../../utils';

export interface SwitchProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  description?: string;
}

const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, label, description, ...props }, ref) => {
    return (
      <label className='flex items-center space-x-3 cursor-pointer'>
        <div className='relative'>
          <input type='checkbox' className='sr-only' ref={ref} {...props} />
          <div
            className={cn(
              'w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[""] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600',
              className
            )}
          />
        </div>
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

Switch.displayName = 'Switch';

export { Switch };
