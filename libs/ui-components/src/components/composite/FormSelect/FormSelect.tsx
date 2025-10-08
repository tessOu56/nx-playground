'use client';

import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues,
} from 'react-hook-form';

import { cn } from '../../../utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../core/Select/Select';
import { type SelectOption } from '../SimpleSelect/SimpleSelect';

export interface FormSelectProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> {
  name: TName;
  control: Control<TFieldValues, any, TFieldValues>;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outline';
  label?: string;
  error?: string;
  required?: boolean;
  description?: string;
}

export const FormSelect = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  name,
  control,
  options,
  placeholder = '請選擇...',
  disabled = false,
  className,
  size = 'md',
  variant = 'default',
  label,
  error,
  required = false,
  description,
}: FormSelectProps<TFieldValues, TName>) => {
  // Size classes
  const sizeClasses = {
    sm: 'h-8 px-2 text-sm',
    md: 'h-10 px-3 text-sm',
    lg: 'h-12 px-4 text-base',
  };

  // Variant classes
  const variantClasses = {
    default: 'bg-background border-input',
    outline: 'bg-transparent border-border',
  };

  // Error classes
  const errorClasses = error
    ? 'border-destructive focus:border-destructive'
    : '';

  const triggerClassName = cn(
    sizeClasses[size],
    variantClasses[variant],
    errorClasses,
    className
  );
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
          <Select value={value} onValueChange={onChange} disabled={disabled}>
            <SelectTrigger ref={ref} className={triggerClassName}>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map(option => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {description && (
            <p className='text-sm text-muted-foreground'>{description}</p>
          )}
          {error && <p className='text-sm text-destructive'>{error}</p>}
        </div>
      )}
    />
  );
};

FormSelect.displayName = 'FormSelect';
