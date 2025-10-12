import { z } from 'zod';

// 表單欄位驗證規則 schema
export const formFieldValidationSchema = z.object({
  required: z.boolean().optional(),
  min: z.number().min(0).optional(),
  max: z.number().min(0).optional(),
  pattern: z.string().optional(),
  message: z.string().max(200, '驗證訊息不能超過 200 字元').optional(),
});

// 表單欄位 schema
export const formFieldSchema = z.object({
  id: z.string().optional(), // 新增時為可選，編輯時為必填
  type: z.enum(
    [
      'text',
      'email',
      'tel',
      'number',
      'date',
      'textarea',
      'select',
      'checkbox',
      'radio',
    ],
    {
      required_error: '請選擇欄位類型',
    }
  ),
  label: z
    .string()
    .min(1, '欄位標籤為必填')
    .max(100, '欄位標籤不能超過 100 字元'),
  placeholder: z.string().max(200, '佔位符不能超過 200 字元').optional(),
  options: z.array(z.string().min(1, '選項不能為空')).optional(),
  validation: formFieldValidationSchema.optional(),
  order: z.number().min(0, '排序必須大於等於 0'),
});

// 表單欄位列表 schema
export const formFieldsSchema = z.array(formFieldSchema);

// 類型推斷
export type FormFieldFormData = z.infer<typeof formFieldSchema>;
export type FormFieldValidationFormData = z.infer<
  typeof formFieldValidationSchema
>;
export type FormFieldsFormData = z.infer<typeof formFieldsSchema>;
