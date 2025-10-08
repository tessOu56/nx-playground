import type { RegistrationForm } from '@/types';

// 導出模板生成器
export * from './templates';

/**
 * 生成 Mock RegistrationForm 資料
 *
 * @param id - RegistrationForm ID
 * @param templateId - 表單模版 ID
 * @param templateName - 表單模版名稱
 * @param orderId - 訂單 ID
 * @param ticketId - 票券 ID
 * @param status - 報名表狀態
 * @param formData - 表單資料
 * @returns 生成的 RegistrationForm 物件
 */
export function generateRegistrationForm(
  id: string,
  templateId: string,
  templateName: string,
  orderId: string,
  orderItemId: string,
  ticketId: string,
  status: 'pending' | 'completed' = 'pending',
  formData: Record<string, any> = {}
): RegistrationForm {
  const now = new Date().toISOString();

  return {
    id,
    templateId,
    templateName,
    orderId,
    orderItemId,
    ticketId,
    status,
    formData,
    ...(status === 'completed' && { submittedAt: now }),
  };
}

/**
 * 生成多個 Mock RegistrationForms
 *
 * @param count - 生成數量
 * @param baseId - 基礎 ID
 * @returns 生成的 RegistrationForm 陣列
 */
export function generateMultipleRegistrationForms(
  count: number,
  baseId = 'form'
): RegistrationForm[] {
  const templates = [
    { id: 'default-template', name: '標準報名表' },
    { id: 'detailed-template', name: '詳細報名表' },
    { id: 'simple-template', name: '簡易報名表' },
  ];

  const sampleFormData = [
    {
      name: '張小明',
      email: 'zhang@example.com',
      phone: '0912345678',
      emergencyContact: '0918765432',
      dietaryRequirements: '無',
    },
    {
      name: '李美華',
      email: 'li@example.com',
      phone: '0987654321',
      emergencyContact: '0923456789',
      dietaryRequirements: '素食',
    },
    {
      name: '王大雄',
      email: 'wang@example.com',
      phone: '0956789012',
      emergencyContact: '0934567890',
      dietaryRequirements: '無',
    },
  ];

  return Array.from({ length: count }, (_, index) => {
    const id = `${baseId}-${String(index + 1).padStart(3, '0')}`;
    const orderId = `order-${String(index + 1).padStart(3, '0')}`;
    const ticketId = `ticket-${String(index + 1).padStart(3, '0')}`;
    const template = templates[index % templates.length];
    const statuses: Array<'pending' | 'completed'> = ['pending', 'completed'];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const formData =
      status === 'completed'
        ? sampleFormData[index % sampleFormData.length]
        : {};

    return generateRegistrationForm(
      id,
      template.id,
      template.name,
      orderId,
      `${orderId}-item-${index + 1}`,
      ticketId,
      status,
      formData
    );
  });
}

/**
 * 根據訂單生成對應的報名表
 *
 * @param orderId - 訂單 ID
 * @param ticketIds - 票券 ID 陣列
 * @param templateId - 表單模版 ID
 * @param templateName - 表單模版名稱
 * @returns 生成的 RegistrationForm 陣列
 */
export function generateRegistrationFormsForOrder(
  orderId: string,
  ticketIds: string[],
  templateId = 'default-template',
  templateName = '標準報名表'
): RegistrationForm[] {
  return ticketIds.map((ticketId, index) => {
    const formId = `${orderId}-form-${index + 1}`;
    return generateRegistrationForm(
      formId,
      templateId,
      templateName,
      orderId,
      `${orderId}-item-${index + 1}`,
      ticketId,
      'pending'
    );
  });
}

/**
 * 生成表單資料範本
 *
 * @param type - 表單類型
 * @returns 表單資料物件
 */
export function generateFormData(
  type: 'basic' | 'detailed' | 'custom' = 'basic'
): Record<string, any> {
  const baseData = {
    name: '張小明',
    email: 'zhang@example.com',
    phone: '0912345678',
  };

  switch (type) {
    case 'detailed':
      return {
        ...baseData,
        emergencyContact: '0918765432',
        emergencyPhone: '0918765432',
        dietaryRequirements: '無',
        medicalConditions: '無',
        tShirtSize: 'M',
        experience: '初級',
      };

    case 'custom':
      return {
        ...baseData,
        company: 'ABC 公司',
        position: '軟體工程師',
        interests: ['程式設計', '戶外活動'],
        motivation: '想要學習新技能',
      };

    default:
      return baseData;
  }
}
