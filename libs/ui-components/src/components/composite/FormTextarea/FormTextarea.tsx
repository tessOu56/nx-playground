'use client';

import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues,
} from 'react-hook-form';

import { cn } from '../../../utils';
import { Textarea } from '../../core/Textarea/Textarea';

export interface FormTextareaProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> {
  name: TName;
  control: Control<TFieldValues, any, TFieldValues>;
  label?: string;
  error?: string;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
  rows?: number;
  required?: boolean;
  description?: string;
}

export const FormTextarea = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  name,
  control,
  label,
  error,
  className = '',
  placeholder,
  disabled = false,
  rows = 4,
  required = false,
  description,
}: FormTextareaProps<TFieldValues, TName>) => {
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
          <Textarea
            ref={ref}
            value={value ?? ''}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            rows={rows}
            className={cn(
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

FormTextarea.displayName = 'FormTextarea';
