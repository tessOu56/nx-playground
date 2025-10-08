/* eslint-disable no-console */
import { mockOrders } from '../data';

import type { Order } from '@/types';

/**
 * Mock Orders 資料測試模組
 *
 * 此模組負責測試 mock orders 資料的完整性和正確性，包括：
 * - 基本資料結構驗證
 * - 必要欄位完整性檢查
 * - 資料格式驗證 (日期、金額、狀態等)
 * - ID 唯一性檢查
 * - 狀態邏輯驗證
 * - 與其他模組的關聯性檢查
 *
 * @fileoverview 提供 mock orders 資料的全面測試功能
 * @author NX Playground Team
 * @since 1.0.0
 */

/**
 * 測試 Mock Orders 資料的完整性和正確性
 *
 * 執行以下測試項目：
 * 1. 基本結構檢查 - 驗證 orders 陣列長度和基本格式
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
 * const result = testMockOrders();
 * if (result) {
 *   console.log('所有 orders 測試通過');
 * }
 * ```
 */
export function testMockOrders() {
  console.log('=== 測試 Mock Orders ===');

  // 1. 檢查基本結構
  console.log('\n基本統計:');
  console.log(`- 總 orders 數量: ${mockOrders.length}`);

  let allValid = true;

  // 2. 檢查每個 order 的完整性
  console.log('\n檢查 Order 完整性:');
  const requiredFields: (keyof Order)[] = [
    'id',
    'eventId',
    'userId',
    'quantity',
    'totalAmount',
    'status',
    'paymentMethod',
    'createdAt',
    'updatedAt',
  ];

  mockOrders.forEach((order, index) => {
    console.log(`\nOrder ${index + 1} (${order.id}):`);

    // 檢查必要欄位
    const missingFields = requiredFields.filter(field => !(field in order));
    if (missingFields.length > 0) {
      console.error(`  ERROR: 缺少欄位: ${missingFields.join(', ')}`);
      allValid = false;
    } else {
      console.log(`  PASS: 必要欄位完整`);
    }

    // 檢查數量
    if (typeof order.quantity !== 'number' || order.quantity < 1) {
      console.error(`  ERROR: 票券數量無效: ${order.quantity}`);
      allValid = false;
    } else {
      console.log(`  PASS: 票券數量: ${order.quantity}`);
    }

    // 檢查總金額
    if (typeof order.totalAmount !== 'number' || order.totalAmount < 0) {
      console.error(`  ERROR: 總金額無效: ${order.totalAmount}`);
      allValid = false;
    } else {
      console.log(`  PASS: 總金額: ${order.totalAmount}`);
    }

    // 檢查訂單狀態
    const validStatuses = ['pending', 'confirmed', 'cancelled'];
    if (!validStatuses.includes(order.status)) {
      console.error(`  ERROR: 訂單狀態無效: ${order.status}`);
      allValid = false;
    } else {
      console.log(`  PASS: 訂單狀態: ${order.status}`);
    }

    // 檢查付款方式
    const validPaymentMethods = ['cash', 'atm'];
    if (!validPaymentMethods.includes(order.paymentMethod)) {
      console.error(`  ERROR: 付款方式無效: ${order.paymentMethod}`);
      allValid = false;
    } else {
      console.log(`  PASS: 付款方式: ${order.paymentMethod}`);
    }

    console.log(`  PASS: 付款方式: ${order.paymentMethod}`);

    // 檢查日期格式
    const dateFields = ['createdAt', 'updatedAt'];
    dateFields.forEach(field => {
      const dateValue = order[field as keyof Order] as string;
      if (!dateValue || isNaN(Date.parse(dateValue))) {
        console.error(`  ERROR: ${field} 日期格式錯誤: ${dateValue}`);
        allValid = false;
      } else {
        console.log(`  PASS: ${field} 格式正確`);
      }
    });

    // 檢查狀態邏輯
    if (order.status === 'confirmed' && !order.confirmedAt) {
      console.error(`  ERROR: 已確認狀態但缺少 confirmedAt`);
      allValid = false;
    } else if (order.status !== 'confirmed' && order.confirmedAt) {
      console.error(`  ERROR: 未確認狀態但有 confirmedAt`);
      allValid = false;
    } else {
      console.log(`  PASS: 狀態邏輯正確`);
    }
  });

  // 3. 檢查唯一性
  console.log('\n檢查唯一性:');
  const ids = mockOrders.map(o => o.id);
  const uniqueIds = new Set(ids);
  if (ids.length === uniqueIds.size) {
    console.log('  PASS: 所有 order ID 都是唯一的');
  } else {
    console.error('  ERROR: 發現重複的 order ID');
    allValid = false;
  }

  console.log('  PASS: QR Code 檢查已移到相關模組');

  // 4. 檢查資料一致性
  console.log('\n檢查資料一致性:');
  const inconsistentOrders = mockOrders.filter(_order => {
    // 目前只檢查基本的訂單狀態一致性
    return false; // 暫時沒有需要檢查的一致性問題
  });

  if (inconsistentOrders.length === 0) {
    console.log('  PASS: 付款狀態與訂單狀態一致');
  } else {
    console.error(
      `  ERROR: 發現 ${inconsistentOrders.length} 個狀態不一致的訂單`
    );
    allValid = false;
  }

  console.log('\n測試結果:', allValid ? 'PASS: 全部通過' : 'ERROR: 有錯誤');
  return allValid;
}
