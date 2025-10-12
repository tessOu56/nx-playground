'use client';

import { SimpleSelect } from '@nx-playground/ui-components';
import type { SelectOption } from '@nx-playground/ui-components';

interface CoreSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outline';
}

export function CoreSelect({
  value,
  onValueChange,
  options,
  placeholder = '請選擇...',
  disabled = false,
  className,
  size = 'md',
  variant = 'default',
}: CoreSelectProps) {
  return (
    <SimpleSelect
      value={value}
      onChange={onValueChange}
      options={options}
      placeholder={placeholder}
      disabled={disabled}
      className={className}
      size={size}
      variant={variant}
    />
  );
}
