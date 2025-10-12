import type { EventRegistrationTemplate } from '@/types';

/**
 * 生成標準報名表模板
 */
export function generateStandardTemplate(): EventRegistrationTemplate {
  return {
    id: 'default-template',
    name: '標準報名表',
    description: '適用於大多數活動的基本報名表',
    fields: [
      {
        id: 'name',
        name: 'name',
        type: 'text',
        label: '姓名',
        required: true,
        placeholder: '請輸入您的真實姓名',
      },
      {
        id: 'email',
        name: 'email',
        type: 'email',
        label: '電子郵件',
        required: true,
        placeholder: 'example@email.com',
      },
      {
        id: 'phone',
        name: 'phone',
        type: 'tel',
        label: '電話號碼',
        required: true,
        placeholder: '0912-345-678',
      },
      {
        id: 'emergency_contact',
        name: 'emergency_contact',
        type: 'text',
        label: '緊急聯絡人',
        required: false,
        placeholder: '緊急聯絡人姓名及電話',
      },
    ],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  };
}

/**
 * 生成詳細報名表模板
 */
export function generateDetailedTemplate(): EventRegistrationTemplate {
  return {
    id: 'detailed-template',
    name: '詳細報名表',
    description: '包含更多資訊的詳細報名表，適用於戶外活動或特殊需求活動',
    fields: [
      {
        id: 'name',
        name: 'name',
        type: 'text',
        label: '姓名',
        required: true,
        placeholder: '請輸入您的真實姓名',
      },
      {
        id: 'email',
        name: 'email',
        type: 'email',
        label: '電子郵件',
        required: true,
        placeholder: 'example@email.com',
      },
      {
        id: 'phone',
        name: 'phone',
        type: 'tel',
        label: '電話號碼',
        required: true,
        placeholder: '0912-345-678',
      },
      {
        id: 'emergency_contact',
        name: 'emergency_contact',
        type: 'text',
        label: '緊急聯絡人',
        required: true,
        placeholder: '緊急聯絡人姓名及電話',
      },
      {
        id: 'dietary_restrictions',
        name: 'dietary_restrictions',
        type: 'textarea',
        label: '飲食限制',
        required: false,
        placeholder: '如有素食、過敏等特殊飲食需求請說明',
      },
      {
        id: 'medical_conditions',
        name: 'medical_conditions',
        type: 'textarea',
        label: '健康狀況',
        required: false,
        placeholder: '如有心臟病、高血壓等需要注意的健康狀況請說明',
      },
      {
        id: 'experience_level',
        name: 'experience_level',
        type: 'select',
        label: '經驗程度',
        required: true,
        options: [
          { id: 'beginner', value: 'beginner', label: '初學者' },
          { id: 'intermediate', value: 'intermediate', label: '中級' },
          { id: 'advanced', value: 'advanced', label: '高級' },
        ],
      },
    ],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  };
}

/**
 * 生成簡易報名表模板
 */
export function generateSimpleTemplate(): EventRegistrationTemplate {
  return {
    id: 'simple-template',
    name: '簡易報名表',
    description: '最基本的報名資訊，適用於簡單的活動',
    fields: [
      {
        id: 'name',
        name: 'name',
        type: 'text',
        label: '姓名',
        required: true,
        placeholder: '請輸入您的真實姓名',
      },
      {
        id: 'phone',
        name: 'phone',
        type: 'tel',
        label: '電話號碼',
        required: true,
        placeholder: '0912-345-678',
      },
    ],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  };
}

/**
 * 生成企業活動報名表模板
 */
export function generateCorporateTemplate(): EventRegistrationTemplate {
  return {
    id: 'corporate-template',
    name: '企業活動報名表',
    description: '適用於企業培訓、會議等商務活動',
    fields: [
      {
        id: 'name',
        name: 'name',
        type: 'text',
        label: '姓名',
        required: true,
        placeholder: '請輸入您的真實姓名',
      },
      {
        id: 'email',
        name: 'email',
        type: 'email',
        label: '電子郵件',
        required: true,
        placeholder: 'example@email.com',
      },
      {
        id: 'phone',
        name: 'phone',
        type: 'tel',
        label: '電話號碼',
        required: true,
        placeholder: '0912-345-678',
      },
      {
        id: 'company',
        name: 'company',
        type: 'text',
        label: '公司名稱',
        required: true,
        placeholder: '請輸入您的公司名稱',
      },
      {
        id: 'position',
        name: 'position',
        type: 'text',
        label: '職位',
        required: true,
        placeholder: '請輸入您的職位',
      },
      {
        id: 'industry',
        name: 'industry',
        type: 'select',
        label: '行業別',
        required: false,
        options: [
          { id: 'tech', value: 'tech', label: '科技業' },
          { id: 'finance', value: 'finance', label: '金融業' },
          { id: 'manufacturing', value: 'manufacturing', label: '製造業' },
          { id: 'retail', value: 'retail', label: '零售業' },
          { id: 'other', value: 'other', label: '其他' },
        ],
      },
    ],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  };
}

/**
 * 根據活動類型生成適合的報名表模板
 */
export function generateTemplateByEventType(
  eventType:
    | 'outdoor'
    | 'cultural'
    | 'corporate'
    | 'simple'
    | 'standard' = 'standard'
): EventRegistrationTemplate {
  switch (eventType) {
    case 'outdoor':
      return generateDetailedTemplate();
    case 'cultural':
      return generateStandardTemplate();
    case 'corporate':
      return generateCorporateTemplate();
    case 'simple':
      return generateSimpleTemplate();
    default:
      return generateStandardTemplate();
  }
}

/**
 * 獲取所有可用的報名表模板
 */
export function getAllRegistrationTemplates(): EventRegistrationTemplate[] {
  return [
    generateStandardTemplate(),
    generateDetailedTemplate(),
    generateSimpleTemplate(),
    generateCorporateTemplate(),
  ];
}
