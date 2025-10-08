/* eslint-disable no-console */
import { mockBills } from '../data';

import type { Bill } from '@/types';

/**
 * Mock Bills 資料測試模組
 *
 * 此模組負責測試 mock bills 資料的完整性和正確性，包括：
 * - 基本資料結構驗證
 * - 必要欄位完整性檢查
 * - 資料格式驗證 (日期、金額、狀態等)
 * - ID 唯一性檢查
 * - 狀態邏輯驗證
 *
 * @fileoverview 提供 mock bills 資料的全面測試功能
 * @author NX Playground Team
 * @since 1.0.0
 */

/**
 * 測試 Mock Bills 資料的完整性和正確性
 *
 * 執行以下測試項目：
 * 1. 基本結構檢查 - 驗證 bills 陣列長度和基本格式
 * 2. 欄位完整性檢查 - 確保所有必要欄位都存在
 * 3. 格式驗證 - 檢查日期、金額、狀態等格式
 * 4. 狀態邏輯驗證 - 確認狀態邏輯正確
 * 5. ID 唯一性檢查 - 確保所有 ID 都是唯一的
 * 6. 資料一致性檢查 - 檢查相關欄位的邏輯一致性
 *
 * @returns {boolean} 測試是否全部通過
 * @throws {Error} 當測試過程中發生嚴重錯誤時拋出
 *
 * @example
 * ```typescript
 * const result = testMockBills();
 * if (result) {
 *   console.log('所有 bills 測試通過');
 * }
 * ```
 */
export function testMockBills() {
  console.log('=== 測試 Mock Bills ===');

  // 1. 檢查基本結構
  console.log('\n基本統計:');
  console.log(`- 總 bills 數量: ${mockBills.length}`);

  let allValid = true;

  // 2. 檢查每個 bill 的完整性
  console.log('\n檢查 Bill 完整性:');
  const requiredFields: (keyof Bill)[] = [
    'id',
    'orderId',
    'eventId',
    'userId',
    'amount',
    'status',
    'paymentMethod',
    'dueDate',
    'createdAt',
    'updatedAt',
    'qrCode',
  ];

  mockBills.forEach((bill, index) => {
    console.log(`\nBill ${index + 1} (${bill.id}):`);

    // 檢查必要欄位
    const missingFields = requiredFields.filter(field => !(field in bill));
    if (missingFields.length > 0) {
      console.error(`  ERROR: 缺少欄位: ${missingFields.join(', ')}`);
      allValid = false;
    } else {
      console.log(`  PASS: 必要欄位完整`);
    }

    // 檢查金額
    if (typeof bill.amount !== 'number' || bill.amount < 0) {
      console.error(`  ERROR: 金額無效: ${bill.amount}`);
      allValid = false;
    } else {
      console.log(`  PASS: 金額: ${bill.amount}`);
    }

    // 檢查狀態
    const validStatuses = ['pending', 'paid', 'cancelled'];
    if (!validStatuses.includes(bill.status)) {
      console.error(`  ERROR: 狀態無效: ${bill.status}`);
      allValid = false;
    } else {
      console.log(`  PASS: 狀態: ${bill.status}`);
    }

    // 檢查付款方式
    const validPaymentMethods = ['cash', 'atm', 'credit'];
    if (!validPaymentMethods.includes(bill.paymentMethod)) {
      console.error(`  ERROR: 付款方式無效: ${bill.paymentMethod}`);
      allValid = false;
    } else {
      console.log(`  PASS: 付款方式: ${bill.paymentMethod}`);
    }

    // 檢查日期格式
    const dateFields = ['dueDate', 'createdAt', 'updatedAt'];
    dateFields.forEach(field => {
      const dateValue = bill[field as keyof Bill] as string;
      if (!dateValue || isNaN(Date.parse(dateValue))) {
        console.error(`  ERROR: ${field} 日期格式錯誤: ${dateValue}`);
        allValid = false;
      } else {
        console.log(`  PASS: ${field} 格式正確`);
      }
    });

    // 檢查狀態邏輯
    if (bill.status === 'paid' && !bill.paidAt) {
      console.error(`  ERROR: 已付款狀態但缺少 paidAt`);
      allValid = false;
    } else if (bill.status !== 'paid' && bill.paidAt) {
      console.error(`  ERROR: 未付款狀態但有 paidAt`);
      allValid = false;
    } else {
      console.log(`  PASS: 狀態邏輯正確`);
    }
  });

  // 3. 檢查唯一性
  console.log('\n檢查唯一性:');
  const ids = mockBills.map(b => b.id);
  const uniqueIds = new Set(ids);
  if (ids.length === uniqueIds.size) {
    console.log('  PASS: 所有 bill ID 都是唯一的');
  } else {
    console.error('  ERROR: 發現重複的 bill ID');
    allValid = false;
  }

  const orderIds = mockBills.map(b => b.orderId);
  const uniqueOrderIds = new Set(orderIds);
  if (orderIds.length === uniqueOrderIds.size) {
    console.log('  PASS: 所有 order ID 都是唯一的');
  } else {
    console.error('  ERROR: 發現重複的 order ID');
    allValid = false;
  }

  const qrCodes = mockBills.map(b => b.qrCode);
  const uniqueQrCodes = new Set(qrCodes);
  if (qrCodes.length === uniqueQrCodes.size) {
    console.log('  PASS: 所有 QR Code 都是唯一的');
  } else {
    console.error('  ERROR: 發現重複的 QR Code');
    allValid = false;
  }

  console.log('\n測試結果:', allValid ? 'PASS: 全部通過' : 'ERROR: 有錯誤');
  return allValid;
}
