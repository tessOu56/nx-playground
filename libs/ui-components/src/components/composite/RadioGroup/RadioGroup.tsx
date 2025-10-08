'use client';

import { forwardRef } from 'react';

import { cn } from '../../../utils';
import { Radio } from '../../core/Radio/Radio';

export interface RadioOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface RadioGroupProps {
  options: RadioOption[];
  value?: string;
  onChange?: (value: string) => void;
  name: string;
  className?: string;
  disabled?: boolean;
}

const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(
  ({ options, value, onChange, name, className, disabled = false }, ref) => {
    const handleChange = (optionValue: string) => {
      if (!disabled && onChange) {
        onChange(optionValue);
      }
    };

    return (
      <div ref={ref} className={cn('space-y-2', className)} role='radiogroup'>
        {options.map(option => (
          <Radio
            key={option.value}
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={() => handleChange(option.value)}
            disabled={disabled || option.disabled}
            label={option.label}
            description={option.description}
          />
        ))}
      </div>
    );
  }
);

RadioGroup.displayName = 'RadioGroup';

export { RadioGroup };
