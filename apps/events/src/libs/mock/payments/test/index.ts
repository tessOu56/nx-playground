/* eslint-disable no-console */
import { mockPayments } from '../data';

import type { Payment } from '@/types';

/**
 * Mock Payments 資料測試模組
 *
 * 此模組負責測試 mock payments 資料的完整性和正確性，包括：
 * - 基本資料結構驗證
 * - 必要欄位完整性檢查
 * - 資料格式驗證 (日期、金額、狀態等)
 * - ID 唯一性檢查
 * - 狀態邏輯驗證
 * - 與其他模組的關聯性檢查
 *
 * @fileoverview 提供 mock payments 資料的全面測試功能
 * @author NX Playground Team
 * @since 1.0.0
 */

/**
 * 測試 Mock Payments 資料的完整性和正確性
 *
 * 執行以下測試項目：
 * 1. 基本結構檢查 - 驗證 payments 陣列長度和基本格式
 * 2. 欄位完整性檢查 - 確保所有必要欄位都存在
 * 3. 格式驗證 - 檢查日期、金額、狀態等格式
 * 4. 狀態邏輯驗證 - 確認狀態邏輯正確
 * 5. ID 唯一性檢查 - 確保所有 ID 都是唯一的
 * 6. 關聯性檢查 - 檢查與 bills 和 orders 的關聯關係
 *
 * @returns {boolean} 測試是否全部通過
 * @throws {Error} 當測試過程中發生嚴重錯誤時拋出
 *
 * @example
 * ```typescript
 * const result = testMockPayments();
 * if (result) {
 *   console.log('所有 payments 測試通過');
 * }
 * ```
 */
export function testMockPayments() {
  console.log('=== 測試 Mock Payments ===');

  // 1. 檢查基本結構
  console.log('\n基本統計:');
  console.log(`- 總 payments 數量: ${mockPayments.length}`);

  let allValid = true;

  // 2. 檢查每個 payment 的完整性
  console.log('\n檢查 Payment 完整性:');
  const requiredFields: (keyof Payment)[] = [
    'id',
    'billId',
    'orderId',
    'eventId',
    'userId',
    'amount',
    'status',
    'paymentMethod',
    'createdAt',
    'updatedAt',
  ];

  mockPayments.forEach((payment, index) => {
    console.log(`\nPayment ${index + 1} (${payment.id}):`);

    // 檢查必要欄位
    const missingFields = requiredFields.filter(field => !(field in payment));
    if (missingFields.length > 0) {
      console.error(`  ERROR: 缺少欄位: ${missingFields.join(', ')}`);
      allValid = false;
    } else {
      console.log(`  PASS: 必要欄位完整`);
    }

    // 檢查金額
    if (typeof payment.amount !== 'number' || payment.amount < 0) {
      console.error(`  ERROR: 金額無效: ${payment.amount}`);
      allValid = false;
    } else {
      console.log(`  PASS: 金額: ${payment.amount}`);
    }

    // 檢查支付狀態
    const validStatuses = [
      'pending',
      'processing',
      'completed',
      'failed',
      'cancelled',
      'refunded',
      'partial_refunded',
    ];
    if (!validStatuses.includes(payment.status)) {
      console.error(`  ERROR: 支付狀態無效: ${payment.status}`);
      allValid = false;
    } else {
      console.log(`  PASS: 支付狀態: ${payment.status}`);
    }

    // 檢查付款方式
    const validPaymentMethods = ['cash', 'atm'];
    if (!validPaymentMethods.includes(payment.paymentMethod)) {
      console.error(`  ERROR: 付款方式無效: ${payment.paymentMethod}`);
      allValid = false;
    } else {
      console.log(`  PASS: 付款方式: ${payment.paymentMethod}`);
    }

    // 檢查日期格式
    const dateFields = ['createdAt', 'updatedAt'];
    dateFields.forEach(field => {
      const dateValue = payment[field as keyof Payment] as string;
      if (!dateValue || isNaN(Date.parse(dateValue))) {
        console.error(`  ERROR: ${field} 日期格式錯誤: ${dateValue}`);
        allValid = false;
      } else {
        console.log(`  PASS: ${field} 格式正確`);
      }
    });

    // 檢查狀態邏輯
    if (payment.status === 'completed' && !payment.processedAt) {
      console.error(`  ERROR: 已完成狀態但缺少 processedAt`);
      allValid = false;
    } else if (payment.status === 'failed' && !payment.failedAt) {
      console.error(`  ERROR: 失敗狀態但缺少 failedAt`);
      allValid = false;
    } else if (payment.status === 'completed' && !payment.transactionId) {
      console.error(`  ERROR: 已完成狀態但缺少 transactionId`);
      allValid = false;
    } else {
      console.log(`  PASS: 狀態邏輯正確`);
    }

    // 檢查 ID 格式
    if (!payment.id.startsWith('payment-')) {
      console.error(`  ERROR: Payment ID 格式錯誤: ${payment.id}`);
      allValid = false;
    } else {
      console.log(`  PASS: Payment ID 格式正確`);
    }

    // 檢查關聯 ID 格式
    if (!payment.billId.startsWith('bill-')) {
      console.error(`  ERROR: Bill ID 格式錯誤: ${payment.billId}`);
      allValid = false;
    } else if (!payment.orderId.startsWith('order-')) {
      console.error(`  ERROR: Order ID 格式錯誤: ${payment.orderId}`);
      allValid = false;
    } else {
      console.log(`  PASS: 關聯 ID 格式正確`);
    }
  });

  // 3. 檢查唯一性
  console.log('\n檢查唯一性:');
  const ids = mockPayments.map(p => p.id);
  const uniqueIds = new Set(ids);
  if (ids.length === uniqueIds.size) {
    console.log('  PASS: 所有 payment ID 都是唯一的');
  } else {
    console.error('  ERROR: 發現重複的 payment ID');
    allValid = false;
  }

  const transactionIds = mockPayments.map(p => p.transactionId).filter(Boolean);
  const uniqueTransactionIds = new Set(transactionIds);
  if (transactionIds.length === uniqueTransactionIds.size) {
    console.log('  PASS: 所有 transaction ID 都是唯一的');
  } else {
    console.error('  ERROR: 發現重複的 transaction ID');
    allValid = false;
  }

  // 4. 檢查與其他模組的關聯性
  console.log('\n檢查關聯性:');
  const billIds = mockPayments.map(p => p.billId);
  const uniqueBillIds = new Set(billIds);
  const orderIds = mockPayments.map(p => p.orderId);
  const uniqueOrderIds = new Set(orderIds);

  console.log(`- 涉及的 Bill 數量: ${uniqueBillIds.size}`);
  console.log(`- 涉及的 Order 數量: ${uniqueOrderIds.size}`);

  // 檢查一對一關係 (一個 bill 對應一個 payment)
  const billPaymentCounts: Record<string, number> = {};
  mockPayments.forEach(payment => {
    billPaymentCounts[payment.billId] =
      (billPaymentCounts[payment.billId] || 0) + 1;
  });

  const duplicateBillPayments = Object.entries(billPaymentCounts).filter(
    ([, count]) => count > 1
  );
  if (duplicateBillPayments.length === 0) {
    console.log('  PASS: 每個 Bill 對應唯一的 Payment');
  } else {
    console.error(
      `  ERROR: 發現 ${duplicateBillPayments.length} 個 Bill 對應多個 Payment`
    );
    allValid = false;
  }

  // 5. 檢查狀態分佈
  console.log('\n檢查狀態分佈:');
  const statusCounts: Record<string, number> = {};
  mockPayments.forEach(payment => {
    statusCounts[payment.status] = (statusCounts[payment.status] || 0) + 1;
  });

  Object.entries(statusCounts).forEach(([status, count]) => {
    console.log(`- ${status}: ${count} 筆`);
  });

  // 檢查退款邏輯
  const refundedPayments = mockPayments.filter(
    p => p.status === 'refunded' || p.status === 'partial_refunded'
  );
  const invalidRefundedPayments = refundedPayments.filter(p => !p.refundedAt);

  if (invalidRefundedPayments.length === 0) {
    console.log('  PASS: 退款記錄時間邏輯正確');
  } else {
    console.error(
      `  ERROR: 發現 ${invalidRefundedPayments.length} 筆退款記錄缺少退款時間`
    );
    allValid = false;
  }

  console.log('\n測試結果:', allValid ? 'PASS: 全部通過' : 'ERROR: 有錯誤');
  return allValid;
}
