import { z } from 'zod';

/**
 * 表單欄位驗證 schema
 */
const formFieldValidationSchema = z.object({
  required: z.boolean().optional(),
  minLength: z.number().optional(),
  maxLength: z.number().optional(),
  pattern: z.string().optional(),
});

/**
 * 表單欄位 schema
 */
const formFieldSchema = z.object({
  id: z.string(),
  type: z.string(),
  label: z.string().min(1, '欄位標籤為必填'),
  placeholder: z.string().optional(),
  validation: formFieldValidationSchema.optional(),
  order: z.number(),
});

/**
 * 表單模板編輯 schema
 */
export const formTemplateSchema = z.object({
  name: z
    .string()
    .min(1, '模板名稱為必填欄位')
    .max(100, '模板名稱不能超過 100 字元'),
  description: z.string().optional(),
  fields: z.array(formFieldSchema),
  submitText: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type FormTemplateFormData = z.infer<typeof formTemplateSchema>;
