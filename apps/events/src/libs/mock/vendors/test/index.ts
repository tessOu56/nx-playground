/* eslint-disable no-console */
import { mockVendors } from '../data';

import type { Vendor } from '@/types';

/**
 * Mock Vendors 資料測試模組
 *
 * 此模組負責測試 mock vendors 資料的完整性和正確性，包括：
 * - 基本資料結構驗證
 * - 必要欄位完整性檢查
 * - 資料格式驗證 (email, lineOfficialAccountId)
 * - 銀行帳戶資訊驗證
 * - 特定業務邏輯驗證
 * - ID 唯一性檢查
 * - 與其他 mock 資料的關聯性驗證
 *
 * @fileoverview 提供 mock vendors 資料的全面測試功能
 * @author NX Playground Team
 * @since 1.0.0
 */
/**
 * 測試 Mock Vendors 資料的完整性和正確性
 *
 * 執行以下測試項目：
 * 1. 基本結構檢查 - 驗證 vendors 陣列長度和基本格式
 * 2. 欄位完整性檢查 - 確保所有必要欄位都存在
 * 3. 格式驗證 - 檢查 email 和 lineOfficialAccountId 格式
 * 4. 銀行帳戶驗證 - 檢查 defaultBankAccount 結構
 * 5. 業務邏輯驗證 - 確認特定 vendor 的業務資料正確
 * 6. 生成資料驗證 - 檢查隨機生成的 vendor 資料
 * 7. 唯一性檢查 - 確保所有 ID 都是唯一的
 *
 * @returns {boolean} 測試是否全部通過
 * @throws {Error} 當測試過程中發生嚴重錯誤時拋出
 *
 * @example
 * ```typescript
 * const result = testMockVendors();
 * if (result) {
 *   console.log('所有 vendor 測試通過');
 * }
 * ```
 */
export function testMockVendors() {
  console.log('=== 測試 Mock Vendors ===');

  // 1. 檢查基本結構
  console.log('\n基本統計:');
  console.log(`- 總 vendor 數量: ${mockVendors.length}`);
  console.log(`- 預期數量: 4 (3個特定 + 1個生成)`);

  if (mockVendors.length !== 4) {
    console.error('ERROR: Vendor 數量不符合預期');
    return false;
  }

  // 2. 檢查每個 vendor 的完整性
  console.log('\n檢查 Vendor 完整性:');
  const requiredFields: (keyof Vendor)[] = [
    'id',
    'events',
    'email',
    'lineOfficialAccountId',
    'defaultBankAccount',
  ];

  let allValid = true;
  mockVendors.forEach((vendor, index) => {
    console.log(`\nVendor ${index + 1} (${vendor.id}):`);

    // 檢查必要欄位
    const missingFields = requiredFields.filter(field => !(field in vendor));
    if (missingFields.length > 0) {
      console.error(`  ERROR: 缺少欄位: ${missingFields.join(', ')}`);
      allValid = false;
    } else {
      console.log(`  PASS: 必要欄位完整`);
    }

    // 檢查 lineOfficialAccountId 格式
    if (!vendor.lineOfficialAccountId.startsWith('@')) {
      console.error(
        `  ERROR: lineOfficialAccountId 格式錯誤: ${vendor.lineOfficialAccountId}`
      );
      allValid = false;
    } else {
      console.log(
        `  PASS: lineOfficialAccountId 格式正確: ${vendor.lineOfficialAccountId}`
      );
    }

    // 檢查 email 格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(vendor.email)) {
      console.error(`  ERROR: Email 格式錯誤: ${vendor.email}`);
      allValid = false;
    } else {
      console.log(`  PASS: Email 格式正確: ${vendor.email}`);
    }

    // 檢查銀行帳戶資訊
    const bankAccount = vendor.defaultBankAccount;
    if (
      !bankAccount.bankCode ||
      !bankAccount.accountNumber ||
      !bankAccount.accountName
    ) {
      console.error(`  ERROR: 銀行帳戶資訊不完整`);
      allValid = false;
    } else {
      console.log(
        `  PASS: 銀行帳戶資訊完整: ${bankAccount.bankCode} - ${bankAccount.accountName}`
      );
    }

    // 檢查 events 數量
    if (typeof vendor.events !== 'number' || vendor.events < 0) {
      console.error(`  ERROR: Events 數量無效: ${vendor.events}`);
      allValid = false;
    } else {
      console.log(`  PASS: Events 數量: ${vendor.events}`);
    }
  });

  // 3. 檢查特定 vendor 的業務邏輯
  console.log('\n檢查特定 Vendor 的業務邏輯:');

  const vendor1 = mockVendors.find(v => v.id === 'vendor-1');
  if (vendor1) {
    const expectedEmail = 'hello@oosa.life';
    const expectedLineId = '@oosa_life';
    if (
      vendor1.email === expectedEmail &&
      vendor1.lineOfficialAccountId === expectedLineId
    ) {
      console.log(
        `  PASS: vendor-1 業務邏輯正確: ${vendor1.email} -> ${vendor1.lineOfficialAccountId}`
      );
    } else {
      console.error(
        `  ERROR: vendor-1 業務邏輯錯誤: 預期 ${expectedEmail} -> ${expectedLineId}, 實際 ${vendor1.email} -> ${vendor1.lineOfficialAccountId}`
      );
      allValid = false;
    }
  } else {
    console.error('  ERROR: 找不到 vendor-1');
    allValid = false;
  }

  // 4. 檢查生成的 vendor
  console.log('\n檢查生成的 Vendor:');
  const generatedVendor = mockVendors.find(v => v.id === 'vendor-4');
  if (generatedVendor) {
    console.log(
      `  PASS: 找到生成的 vendor-4: ${generatedVendor.lineOfficialAccountId}`
    );
    console.log(`  INFO: Email: ${generatedVendor.email}`);
    console.log(
      `  INFO: 銀行帳戶: ${generatedVendor.defaultBankAccount.accountName}`
    );
  } else {
    console.error('  ERROR: 找不到生成的 vendor-4');
    allValid = false;
  }

  // 5. 檢查唯一性
  console.log('\n檢查唯一性:');
  const ids = mockVendors.map(v => v.id);
  const uniqueIds = new Set(ids);
  if (ids.length === uniqueIds.size) {
    console.log('  PASS: 所有 vendor ID 都是唯一的');
  } else {
    console.error('  ERROR: 發現重複的 vendor ID');
    allValid = false;
  }

  const lineIds = mockVendors.map(v => v.lineOfficialAccountId);
  const uniqueLineIds = new Set(lineIds);
  if (lineIds.length === uniqueLineIds.size) {
    console.log('  PASS: 所有 lineOfficialAccountId 都是唯一的');
  } else {
    console.error('  ERROR: 發現重複的 lineOfficialAccountId');
    allValid = false;
  }

  console.log('\n測試結果:', allValid ? 'PASS: 全部通過' : 'ERROR: 有錯誤');
  return allValid;
}
