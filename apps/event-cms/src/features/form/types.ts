// 表單字段類型
export type FormFieldType =
  | 'text'
  | 'email'
  | 'tel'
  | 'number'
  | 'date'
  | 'textarea'
  | 'select'
  | 'checkbox'
  | 'radio';

// 欄位類型定義
export interface FieldType {
  id: string;
  name: string;
  description: string;
  icon: string;
}

// 表單字段驗證規則
export interface FormFieldValidation {
  required?: boolean;
  min?: number;
  max?: number;
  pattern?: string;
  message?: string;
}

// 表單字段配置
export interface FormField {
  id: string;
  type: FormFieldType;
  label: string;
  placeholder?: string;
  options?: string[]; // 用於 select 和 radio
  validation?: FormFieldValidation;
  order: number;
}

// 表單模板
export interface FormTemplate {
  id: string;
  name: string;
  fields: FormField[];
  submitText?: string;
  createdAt: string;
  updatedAt: string;
}

// 表單模板列表項
export interface FormTemplateListItem {
  id: string;
  name: string;
  fields: FormField[];
  createdAt: string;
  updatedAt: string;
}

// 表單模板創建/編輯請求
export interface FormTemplateRequest {
  name: string;
  fields: FormField[];
  submitText?: string;
}
