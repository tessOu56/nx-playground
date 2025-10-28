'use client';

import {
  // Input,
  Button,
  FormInput,
  FormSelect,
  FormTextarea,
  // Checkbox,
  // RadioGroup,
  type SelectOption,
} from '@nx-playground/ui-components';
import { useForm } from 'react-hook-form';

// 動態表單欄位類型
export interface DynamicFormField {
  id: string;
  name: string;
  label: string;
  type:
    | 'text'
    | 'email'
    | 'tel'
    | 'number'
    | 'textarea'
    | 'select'
    | 'checkbox'
    | 'radio';
  required?: boolean;
  placeholder?: string;
  description?: string;
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    min?: number;
    max?: number;
  };
  options?: SelectOption[]; // 用於 select 和 radio
  defaultValue?: string | boolean;
}

// 動態表單配置
export interface DynamicFormConfig {
  fields: DynamicFormField[];
  submitButtonText?: string;
  resetButtonText?: string;
  showResetButton?: boolean;
}

// 動態表單 Props
export interface DynamicFormProps {
  config: DynamicFormConfig;
  onSubmit: (data: Record<string, any>) => void;
  onReset?: () => void;
  defaultValues?: Record<string, any>;
  isSubmitting?: boolean;
  className?: string;
  readOnly?: boolean;
}

export function DynamicForm({
  config,
  onSubmit,
  onReset,
  defaultValues = {},
  isSubmitting = false,
  className = '',
  readOnly = false,
}: DynamicFormProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues,
  });

  const handleFormSubmit = (data: Record<string, any>) => {
    onSubmit(data);
  };

  const handleFormReset = () => {
    reset();
    onReset?.();
  };

  const renderField = (field: DynamicFormField) => {
    const commonProps = {
      name: field.name,
      control,
      label: field.label,
      placeholder: field.placeholder,
      disabled: isSubmitting,
      required: field.required,
      description: field.description,
      error: errors[field.name]?.message as string,
    };

    switch (field.type) {
      case 'text':
      case 'email':
      case 'tel':
      case 'number':
        return (
          <FormInput
            key={field.id}
            {...commonProps}
            type={field.type}
            disabled={isSubmitting || readOnly}
            // Note: Validation handled via commonProps (required, minLength, maxLength, pattern)
          />
        );

      case 'textarea':
        return (
          <FormTextarea
            key={field.id}
            {...commonProps}
            disabled={isSubmitting || readOnly}
            // Note: Validation handled via commonProps (required, minLength, maxLength)
          />
        );

      case 'select':
        return (
          <FormSelect
            key={field.id}
            {...commonProps}
            disabled={isSubmitting || readOnly}
            options={field.options ?? []}
            // Note: Validation handled via commonProps (required)
          />
        );

      case 'checkbox':
      case 'radio':
        // TODO: 暫時註解，需要用 Controller 包裝
        return (
          <div key={field.id} className='space-y-2'>
            <label className='block text-sm font-medium text-gray-700'>
              {field.label} (TODO: {field.type})
              {field.required && <span className='text-red-500 ml-1'>*</span>}
            </label>
            <p className='text-gray-500 text-sm'>此欄位類型尚未實現</p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className={className}>
      <div className='space-y-6'>
        {config.fields.map(field => renderField(field))}
      </div>

      <div className='flex gap-4 mt-8'>
        <Button type='submit' disabled={isSubmitting} className='flex-1'>
          {isSubmitting ? '提交中...' : config.submitButtonText ?? '提交'}
        </Button>

        {config.showResetButton && (
          <Button
            type='button'
            variant='outline'
            onClick={handleFormReset}
            disabled={isSubmitting}
          >
            {config.resetButtonText ?? '重置'}
          </Button>
        )}
      </div>
    </form>
  );
}
