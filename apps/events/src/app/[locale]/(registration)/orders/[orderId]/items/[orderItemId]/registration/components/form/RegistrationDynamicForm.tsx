'use client';

import {
  DynamicForm,
  type DynamicFormField,
  type DynamicFormConfig,
} from '@/components';
import type { EventRegistrationTemplate } from '@/types';

interface RegistrationDynamicFormProps {
  template: EventRegistrationTemplate;
  existingFormData?: Record<string, unknown>;
  onFormSubmit?: (formData: Record<string, unknown>) => void;
  isSubmitting?: boolean;
  readOnly?: boolean;
}

export function RegistrationDynamicForm({
  template,
  existingFormData,
  onFormSubmit,
  isSubmitting = false,
  readOnly = false,
}: RegistrationDynamicFormProps) {
  const dynamicFormFields: DynamicFormField[] = template.fields.map(field => ({
    id: field.id,
    name: field.name,
    label: field.label,
    type: field.type as DynamicFormField['type'],
    required: field.required,
    placeholder: field.placeholder,
    options: field.options?.map(option => ({
      value: option.value,
      label: option.label,
    })),
    defaultValue: existingFormData?.[field.name] as
      | string
      | boolean
      | undefined,
  }));

  const formConfig: DynamicFormConfig = {
    fields: dynamicFormFields,
    submitButtonText: isSubmitting ? '提交中...' : '提交報名表',
    showResetButton: false,
  };

  const handleFormSubmit = (formData: Record<string, unknown>) => {
    onFormSubmit?.(formData);
  };

  // 編輯模式：使用 DynamicForm
  return (
    <div className='space-y-6'>
      {/* 使用 DynamicForm */}
      <DynamicForm
        config={formConfig}
        onSubmit={handleFormSubmit}
        defaultValues={existingFormData}
        isSubmitting={isSubmitting}
        className='space-y-6'
        readOnly={readOnly}
      />
    </div>
  );
}
