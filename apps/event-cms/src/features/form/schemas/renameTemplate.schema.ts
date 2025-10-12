import { z } from 'zod';

// 重新命名模板表單驗證 schema
export const renameTemplateSchema = z.object({
  name: z
    .string()
    .min(1, '模板名稱為必填欄位')
    .max(100, '模板名稱不能超過 100 字元'),
});

export type RenameTemplateFormData = z.infer<typeof renameTemplateSchema>;
