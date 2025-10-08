'use client';

import { type InputHTMLAttributes } from 'react';
import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues,
} from 'react-hook-form';

import { cn } from '../../../utils';
import { Input } from '../../core/Input/Input';

export interface FormInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> {
  name: TName;
  control: Control<TFieldValues, any, TFieldValues>;
  label?: string;
  error?: string;
  className?: string;
  type?: InputHTMLAttributes<HTMLInputElement>['type'];
  placeholder?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  required?: boolean;
  description?: string;
}

export const FormInput = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  name,
  control,
  label,
  error,
  className = '',
  type = 'text',
  placeholder,
  disabled = false,
  size = 'md',
  required = false,
  description,
}: FormInputProps<TFieldValues, TName>) => {
  const sizeClasses = {
    sm: 'h-8 px-2 text-sm',
    md: 'h-10 px-3 text-sm',
    lg: 'h-12 px-4 text-base',
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { value, onChange, ref } }) => (
        <div className='space-y-2'>
          {label && (
            <label className='block text-sm font-medium text-foreground'>
              {label}
              {required && <span className='text-destructive ml-1'>*</span>}
            </label>
          )}
          <Input
            ref={ref}
            type={type}
            value={value ?? ''}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            className={cn(
              sizeClasses[size],
              error && 'border-destructive focus:border-destructive',
              className
            )}
          />
          {description && (
            <p className='text-sm text-muted-foreground'>{description}</p>
          )}
          {error && <p className='text-sm text-destructive'>{error}</p>}
        </div>
      )}
    />
  );
};

FormInput.displayName = 'FormInput';
