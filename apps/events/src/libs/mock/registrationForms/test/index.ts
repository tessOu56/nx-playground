/* eslint-disable no-console */
import { mockRegistrationForms } from '../data';

import type { RegistrationForm } from '@/types';

/**
 * Mock RegistrationForms 資料測試模組
 *
 * 此模組負責測試 mock registration forms 資料的完整性和正確性，包括：
 * - 基本資料結構驗證
 * - 必要欄位完整性檢查
 * - 資料格式驗證 (日期、狀態等)
 * - ID 唯一性檢查
 * - 狀態邏輯驗證
 * - 與其他模組的關聯性檢查
 *
 * @fileoverview 提供 mock registration forms 資料的全面測試功能
 * @author NX Playground Team
 * @since 1.0.0
 */

/**
 * 測試 Mock RegistrationForms 資料的完整性和正確性
 *
 * 執行以下測試項目：
 * 1. 基本結構檢查 - 驗證 registration forms 陣列長度和基本格式
 * 2. 欄位完整性檢查 - 確保所有必要欄位都存在
 * 3. 格式驗證 - 檢查日期、狀態等格式
 * 4. 狀態邏輯驗證 - 確認狀態邏輯正確
 * 5. ID 唯一性檢查 - 確保所有 ID 都是唯一的
 * 6. 關聯性檢查 - 檢查與 orders 和 tickets 的關聯關係
 *
 * @returns {boolean} 測試是否全部通過
 * @throws {Error} 當測試過程中發生嚴重錯誤時拋出
 *
 * @example
 * ```typescript
 * const result = testMockRegistrationForms();
 * if (result) {
 *   console.log('所有 registration forms 測試通過');
 * }
 * ```
 */
export function testMockRegistrationForms() {
  console.log('=== 測試 Mock RegistrationForms ===');

  // 1. 檢查基本結構
  console.log('\n基本統計:');
  console.log(`- 總 registration forms 數量: ${mockRegistrationForms.length}`);

  let allValid = true;

  // 2. 檢查每個 registration form 的完整性
  console.log('\n檢查 RegistrationForm 完整性:');
  const requiredFields: (keyof RegistrationForm)[] = [
    'id',
    'templateId',
    'templateName',
    'orderId',
    'ticketId',
    'status',
    'formData',
  ];

  mockRegistrationForms.forEach((form, index) => {
    console.log(`\nRegistrationForm ${index + 1} (${form.id}):`);

    // 檢查必要欄位
    const missingFields = requiredFields.filter(field => !(field in form));
    if (missingFields.length > 0) {
      console.error(`  ERROR: 缺少欄位: ${missingFields.join(', ')}`);
      allValid = false;
    } else {
      console.log(`  PASS: 必要欄位完整`);
    }

    // 檢查表單狀態
    const validStatuses = ['pending', 'completed'];
    if (!validStatuses.includes(form.status)) {
      console.error(`  ERROR: 表單狀態無效: ${form.status}`);
      allValid = false;
    } else {
      console.log(`  PASS: 表單狀態: ${form.status}`);
    }

    // 檢查模版 ID 和名稱
    if (typeof form.templateId !== 'string' || form.templateId.length === 0) {
      console.error(`  ERROR: 模版 ID 無效: ${form.templateId}`);
      allValid = false;
    } else if (
      typeof form.templateName !== 'string' ||
      form.templateName.length === 0
    ) {
      console.error(`  ERROR: 模版名稱無效: ${form.templateName}`);
      allValid = false;
    } else {
      console.log(
        `  PASS: 模版資訊正確 (${form.templateId}: ${form.templateName})`
      );
    }

    // 檢查關聯 ID 格式
    if (!form.orderId.startsWith('order-')) {
      console.error(`  ERROR: Order ID 格式錯誤: ${form.orderId}`);
      allValid = false;
    } else if (
      !form.ticketId?.startsWith('order-') ||
      !form.ticketId.startsWith('order-') ||
      !form.ticketId.includes('-ticket-')
    ) {
      console.error(`  ERROR: Ticket ID 格式錯誤: ${form.ticketId}`);
      allValid = false;
    } else {
      console.log(`  PASS: 關聯 ID 格式正確`);
    }

    // 檢查表單資料
    if (typeof form.formData !== 'object' || form.formData === null) {
      console.error(`  ERROR: 表單資料格式錯誤: ${form.formData}`);
      allValid = false;
    } else {
      console.log(`  PASS: 表單資料格式正確`);
    }

    // 檢查狀態邏輯
    if (form.status === 'completed' && !form.submittedAt) {
      console.error(`  ERROR: 已完成狀態但缺少 submittedAt`);
      allValid = false;
    } else if (form.status === 'pending' && form.submittedAt) {
      console.error(`  ERROR: 待處理狀態但有 submittedAt`);
      allValid = false;
    } else {
      console.log(`  PASS: 狀態邏輯正確`);
    }

    // 檢查日期格式
    if (form.submittedAt) {
      if (isNaN(Date.parse(form.submittedAt))) {
        console.error(`  ERROR: submittedAt 日期格式錯誤: ${form.submittedAt}`);
        allValid = false;
      } else {
        console.log(`  PASS: submittedAt 日期格式正確`);
      }
    }

    // 檢查 ID 格式
    if (!form.id.includes('-form-')) {
      console.error(`  ERROR: RegistrationForm ID 格式錯誤: ${form.id}`);
      allValid = false;
    } else {
      console.log(`  PASS: RegistrationForm ID 格式正確`);
    }
  });

  // 3. 檢查唯一性
  console.log('\n檢查唯一性:');
  const ids = mockRegistrationForms.map(f => f.id);
  const uniqueIds = new Set(ids);
  if (ids.length === uniqueIds.size) {
    console.log('  PASS: 所有 registration form ID 都是唯一的');
  } else {
    console.error('  ERROR: 發現重複的 registration form ID');
    allValid = false;
  }

  // 4. 檢查與其他模組的關聯性
  console.log('\n檢查關聯性:');
  const orderIds = mockRegistrationForms.map(f => f.orderId);
  const uniqueOrderIds = new Set(orderIds);
  const ticketIds = mockRegistrationForms.map(f => f.ticketId);
  const uniqueTicketIds = new Set(ticketIds);

  console.log(`- 涉及的 Order 數量: ${uniqueOrderIds.size}`);
  console.log(`- 涉及的 Ticket 數量: ${uniqueTicketIds.size}`);

  // 檢查 Order 和 Ticket 的關聯性
  const orderTicketMapping: Record<string, string[]> = {};
  mockRegistrationForms.forEach(form => {
    if (!orderTicketMapping[form.orderId]) {
      orderTicketMapping[form.orderId] = [];
    }
    if (form.ticketId) {
      orderTicketMapping[form.orderId].push(form.ticketId);
    }
  });

  console.log(`- Order-Ticket 映射關係:`);
  Object.entries(orderTicketMapping).forEach(([orderId, ticketIds]) => {
    console.log(`  ${orderId}: ${ticketIds.length} 張票券`);
  });

  // 檢查表單資料完整性
  const completedForms = mockRegistrationForms.filter(
    f => f.status === 'completed'
  );
  const pendingForms = mockRegistrationForms.filter(
    f => f.status === 'pending'
  );

  console.log(`- 已完成表單: ${completedForms.length}`);
  console.log(`- 待處理表單: ${pendingForms.length}`);

  // 檢查已完成的表單是否有資料
  const emptyCompletedForms = completedForms.filter(
    f => f.formData && Object.keys(f.formData).length === 0
  );
  if (emptyCompletedForms.length === 0) {
    console.log('  PASS: 所有已完成的表單都有資料');
  } else {
    console.error(
      `  ERROR: 發現 ${emptyCompletedForms.length} 個已完成但無資料的表單`
    );
    allValid = false;
  }

  // 5. 檢查表單資料格式
  console.log('\n檢查表單資料格式:');
  const formDataFields = new Set<string>();
  completedForms.forEach(form => {
    if (form.formData) {
      Object.keys(form.formData).forEach(key => formDataFields.add(key));
    }
  });

  console.log(`- 表單資料欄位: ${Array.from(formDataFields).join(', ')}`);

  // 檢查必要欄位是否存在
  const commonFields = ['name', 'email', 'phone'];
  const missingCommonFields = commonFields.filter(
    field => !formDataFields.has(field)
  );

  if (missingCommonFields.length === 0) {
    console.log('  PASS: 所有表單都包含基本欄位');
  } else {
    console.error(`  ERROR: 缺少基本欄位: ${missingCommonFields.join(', ')}`);
    allValid = false;
  }

  // 檢查電子郵件格式
  const invalidEmails = completedForms.filter(form => {
    const { email } = form.formData ?? {};
    return (
      typeof email === 'string' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    );
  });

  if (invalidEmails.length === 0) {
    console.log('  PASS: 所有電子郵件格式正確');
  } else {
    console.error(`  ERROR: 發現 ${invalidEmails.length} 個格式錯誤的電子郵件`);
    allValid = false;
  }

  console.log('\n測試結果:', allValid ? 'PASS: 全部通過' : 'ERROR: 有錯誤');
  return allValid;
}
