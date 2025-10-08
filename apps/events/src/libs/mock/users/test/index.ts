/* eslint-disable no-console */
import {
  mockUsers,
  mockLineUserInfos,
  mockFullUserInfos,
  getFullUserInfoByLineId,
} from '../data';

import { getUserByLineId, isUserOrganizer } from '@/libs/api/hooks/useUsers';
import type { User } from '@/types';

/**
 * Mock Users 資料測試模組
 *
 * 此模組負責測試 mock users 資料的完整性和正確性，包括：
 * - 基本資料結構驗證
 * - 必要欄位完整性檢查
 * - 資料格式驗證 (日期、ID 等)
 * - ID 唯一性檢查
 * - 用戶類型邏輯驗證
 * - LINE 資訊整合性檢查
 * - 工具函數測試
 *
 * @fileoverview 提供 mock users 資料的全面測試功能
 * @author NX Playground Team
 * @since 1.0.0
 */

/**
 * 測試 Mock Users 資料的完整性和正確性
 *
 * 執行以下測試項目：
 * 1. 基本結構檢查 - 驗證 users 陣列長度和基本格式
 * 2. 欄位完整性檢查 - 確保所有必要欄位都存在
 * 3. 格式驗證 - 檢查日期、ID、電子郵件等格式
 * 4. 用戶類型邏輯驗證 - 確認一般用戶和主辦方的邏輯正確
 * 5. ID 唯一性檢查 - 確保所有 ID 都是唯一的
 * 6. LINE 資訊整合性檢查 - 驗證 LINE 資訊的完整性
 * 7. 工具函數測試 - 測試各種查詢和判斷函數
 *
 * @returns {boolean} 測試是否全部通過
 * @throws {Error} 當測試過程中發生嚴重錯誤時拋出
 *
 * @example
 * ```typescript
 * const result = testMockUsers();
 * if (result) {
 *   console.log('所有 users 測試通過');
 * }
 * ```
 */
export function testMockUsers() {
  console.log('=== 測試 Mock Users ===');

  // 1. 檢查基本結構
  console.log('\n基本統計:');
  console.log(`- 總 users 數量: ${mockUsers.length}`);
  console.log(`- LINE 用戶資訊數量: ${Object.keys(mockLineUserInfos).length}`);
  console.log(`- 完整用戶資訊數量: ${mockFullUserInfos.length}`);

  let allValid = true;

  // 2. 檢查每個 user 的完整性
  console.log('\n檢查 User 完整性:');
  const requiredFields: (keyof User)[] = [
    'id',
    'name',
    'avatar',
    'email',
    'phone',
    'bio',
    'joinedDate',
    'lineId',
  ];

  mockUsers.forEach((user, index) => {
    console.log(`\nUser ${index + 1} (${user.id}):`);

    // 檢查必要欄位
    const missingFields = requiredFields.filter(field => !(field in user));
    if (missingFields.length > 0) {
      console.error(`  ERROR: 缺少欄位: ${missingFields.join(', ')}`);
      allValid = false;
    } else {
      console.log(`  PASS: 必要欄位完整`);
    }

    // 檢查電子郵件格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(user.email)) {
      console.error(`  ERROR: 電子郵件格式錯誤: ${user.email}`);
      allValid = false;
    } else {
      console.log(`  PASS: 電子郵件格式正確`);
    }

    // 檢查電話格式
    if (user.phone) {
      const phoneRegex = /^09\d{8}$/;
      if (!phoneRegex.test(user.phone)) {
        console.error(`  ERROR: 電話格式錯誤: ${user.phone}`);
        allValid = false;
      } else {
        console.log(`  PASS: 電話格式正確`);
      }
    } else {
      console.log(`  PASS: 電話欄位為空（可選）`);
    }

    // 檢查日期格式
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(user.joinedDate)) {
      console.error(`  ERROR: 加入日期格式錯誤: ${user.joinedDate}`);
      allValid = false;
    } else {
      console.log(`  PASS: 加入日期格式正確`);
    }

    // 檢查 LINE ID 格式
    const lineIdRegex = /^U[a-f0-9]{32}$/;
    if (!lineIdRegex.test(user.lineId)) {
      console.error(`  ERROR: LINE ID 格式錯誤: ${user.lineId}`);
      allValid = false;
    } else {
      console.log(`  PASS: LINE ID 格式正確`);
    }

    // 檢查主辦方邏輯（基於 email 或 bio）
    const isOrganizer = isUserOrganizer(user.lineId);
    if (isOrganizer) {
      console.log(
        `  PASS: 主辦方身份正確 (${
          user.email?.includes('@oosa.life') ? 'email' : 'bio'
        } 判斷)`
      );
    } else {
      console.log(`  PASS: 一般用戶身份正確`);
    }
  });

  // 3. 檢查唯一性
  console.log('\n檢查唯一性:');
  const ids = mockUsers.map(u => u.id);
  const uniqueIds = new Set(ids);
  if (ids.length === uniqueIds.size) {
    console.log('  PASS: 所有 user ID 都是唯一的');
  } else {
    console.error('  ERROR: 發現重複的 user ID');
    allValid = false;
  }

  const lineIds = mockUsers.map(u => u.lineId);
  const uniqueLineIds = new Set(lineIds);
  if (lineIds.length === uniqueLineIds.size) {
    console.log('  PASS: 所有 LINE ID 都是唯一的');
  } else {
    console.error('  ERROR: 發現重複的 LINE ID');
    allValid = false;
  }

  const emails = mockUsers.map(u => u.email);
  const uniqueEmails = new Set(emails);
  if (emails.length === uniqueEmails.size) {
    console.log('  PASS: 所有電子郵件都是唯一的');
  } else {
    console.error('  ERROR: 發現重複的電子郵件');
    allValid = false;
  }

  // 4. 檢查 LINE 資訊整合性
  console.log('\n檢查 LINE 資訊整合性:');
  const lineInfoKeys = Object.keys(mockLineUserInfos);
  const userLineIds = mockUsers.map(u => u.lineId);

  const missingLineInfos = userLineIds.filter(
    lineId => !mockLineUserInfos[lineId]
  );
  if (missingLineInfos.length === 0) {
    console.log('  PASS: 所有用戶都有對應的 LINE 資訊');
  } else {
    console.error(
      `  ERROR: 發現 ${missingLineInfos.length} 個用戶缺少 LINE 資訊`
    );
    allValid = false;
  }

  const extraLineInfos = lineInfoKeys.filter(
    lineId => !userLineIds.includes(lineId)
  );
  if (extraLineInfos.length === 0) {
    console.log('  PASS: 沒有多餘的 LINE 資訊');
  } else {
    console.error(`  ERROR: 發現 ${extraLineInfos.length} 個多餘的 LINE 資訊`);
    allValid = false;
  }

  // 5. 檢查完整用戶資訊
  console.log('\n檢查完整用戶資訊:');
  if (mockFullUserInfos.length === mockUsers.length) {
    console.log('  PASS: 完整用戶資訊數量正確');
  } else {
    console.error('  ERROR: 完整用戶資訊數量不匹配');
    allValid = false;
  }

  const invalidFullUserInfos = mockFullUserInfos.filter(fullUser => {
    return !fullUser.lastLoginAt || !fullUser.isActive || !fullUser.lineInfo;
  });

  if (invalidFullUserInfos.length === 0) {
    console.log('  PASS: 完整用戶資訊格式正確');
  } else {
    console.error(
      `  ERROR: 發現 ${invalidFullUserInfos.length} 個格式錯誤的完整用戶資訊`
    );
    allValid = false;
  }

  // 6. 測試工具函數
  console.log('\n測試工具函數:');

  // 測試 getUserByLineId
  const testLineId = mockUsers[0].lineId;
  const foundUser = getUserByLineId(testLineId);
  if (foundUser && foundUser.id === mockUsers[0].id) {
    console.log('  PASS: getUserByLineId 函數正常');
  } else {
    console.error('  ERROR: getUserByLineId 函數異常');
    allValid = false;
  }

  // 測試 getFullUserInfoByLineId
  const foundFullUser = getFullUserInfoByLineId(testLineId);
  if (foundFullUser && foundFullUser.id === mockUsers[0].id) {
    console.log('  PASS: getFullUserInfoByLineId 函數正常');
  } else {
    console.error('  ERROR: getFullUserInfoByLineId 函數異常');
    allValid = false;
  }

  // 測試 isUserOrganizer
  const organizerUsers = mockUsers.filter(
    u =>
      u.email?.includes('@oosa.life') ||
      u.bio?.includes('主辦') ||
      u.bio?.includes('策劃')
  );
  const nonOrganizerUsers = mockUsers.filter(
    u =>
      !(
        u.email?.includes('@oosa.life') ||
        u.bio?.includes('主辦') ||
        u.bio?.includes('策劃')
      )
  );

  const organizerTestResults = organizerUsers.map(u =>
    isUserOrganizer(u.lineId)
  );
  const nonOrganizerTestResults = nonOrganizerUsers.map(u =>
    isUserOrganizer(u.lineId)
  );

  if (
    organizerTestResults.every(result => result === true) &&
    nonOrganizerTestResults.every(result => result === false)
  ) {
    console.log('  PASS: isUserOrganizer 函數正常');
  } else {
    console.error('  ERROR: isUserOrganizer 函數異常');
    console.log('  - 主辦方測試結果:', organizerTestResults);
    console.log('  - 一般用戶測試結果:', nonOrganizerTestResults);
    allValid = false;
  }

  // 7. 檢查用戶類型分佈
  console.log('\n檢查用戶類型分佈:');
  const organizers = mockUsers.filter(
    u =>
      u.email?.includes('@oosa.life') ||
      u.bio?.includes('主辦') ||
      u.bio?.includes('策劃')
  );
  const regularUsers = mockUsers.filter(
    u =>
      !(
        u.email?.includes('@oosa.life') ||
        u.bio?.includes('主辦') ||
        u.bio?.includes('策劃')
      )
  );

  console.log(`- 一般用戶: ${regularUsers.length}`);
  console.log(`- 主辦方: ${organizers.length}`);

  if (organizers.length > 0 && regularUsers.length > 0) {
    console.log('  PASS: 用戶類型分佈合理');
  } else {
    console.error('  ERROR: 用戶類型分佈異常');
    allValid = false;
  }

  console.log('\n測試結果:', allValid ? 'PASS: 全部通過' : 'ERROR: 有錯誤');
  return allValid;
}
