/* eslint-disable no-console */
import { mockLineSettings } from '../data';

import type { LineSettings } from '@/types';

/**
 * Mock Line Settings 資料測試模組
 *
 * 此模組負責測試 mock line settings 資料的完整性和正確性，包括：
 * - LINE 官方帳號設定結構驗證
 * - 必要欄位完整性檢查 (officialAccountId, displayName, description)
 * - 可選欄位驗證 (statusMessage, pictureUrl)
 * - Key 與 officialAccountId 匹配性檢查
 * - 特定業務邏輯驗證 (NX Playground, NX Playground 官方, 古亭社區基金會)
 * - 生成資料驗證
 * - 與 vendors 資料的對應關係驗證
 * - 唯一性檢查
 *
 * @fileoverview 提供 mock line settings 資料的全面測試功能
 * @author NX Playground Team
 * @since 1.0.0
 */
/**
 * 測試 Mock Line Settings 資料的完整性和正確性
 *
 * 執行以下測試項目：
 * 1. 基本結構檢查 - 驗證 line settings 物件結構和數量
 * 2. 欄位完整性檢查 - 確保所有必要欄位都存在
 * 3. Key 匹配性檢查 - 驗證物件 key 與 officialAccountId 一致
 * 4. 格式驗證 - 檢查 displayName, description 等欄位內容
 * 5. 業務邏輯驗證 - 確認特定 LINE 帳號的業務資料正確
 * 6. 生成資料驗證 - 檢查隨機生成的 line setting 資料
 * 7. 唯一性檢查 - 確保所有 officialAccountId 都是唯一的
 * 8. 關聯性檢查 - 驗證與 vendors 資料的對應關係
 *
 * @returns {boolean} 測試是否全部通過
 * @throws {Error} 當測試過程中發生嚴重錯誤時拋出
 *
 * @example
 * ```typescript
 * const result = testMockLineSettings();
 * if (result) {
 *   console.log('所有 line settings 測試通過');
 * }
 * ```
 */
export function testMockLineSettings() {
  console.log('=== 測試 Mock Line Settings ===');

  // 1. 檢查基本結構
  console.log('\n基本統計:');
  const keys = Object.keys(mockLineSettings);
  console.log(`- 總 line settings 數量: ${keys.length}`);
  console.log(`- 預期數量: 4 (3個特定 + 1個生成)`);
  console.log(`- Keys: ${keys.join(', ')}`);

  if (keys.length !== 4) {
    console.error('ERROR: Line Settings 數量不符合預期');
    return false;
  }

  // 2. 檢查每個 line setting 的完整性
  console.log('\n檢查 Line Setting 完整性:');
  const requiredFields: (keyof LineSettings)[] = [
    'officialAccountId',
    'description',
    'displayName',
  ];

  let allValid = true;
  Object.entries(mockLineSettings).forEach(([key, setting], index) => {
    console.log(`\nLine Setting ${index + 1} (${key}):`);

    // 檢查 key 與 officialAccountId 是否匹配
    if (key !== setting.officialAccountId) {
      console.error(
        `  ERROR: Key 與 officialAccountId 不匹配: ${key} vs ${setting.officialAccountId}`
      );
      allValid = false;
    } else {
      console.log(`  PASS: Key 與 officialAccountId 匹配: ${key}`);
    }

    // 檢查必要欄位
    const missingFields = requiredFields.filter(field => !(field in setting));
    if (missingFields.length > 0) {
      console.error(`  ERROR: 缺少欄位: ${missingFields.join(', ')}`);
      allValid = false;
    } else {
      console.log(`  PASS: 必要欄位完整`);
    }

    // 檢查欄位內容
    if (!setting.displayName || setting.displayName.trim() === '') {
      console.error(`  ERROR: DisplayName 為空`);
      allValid = false;
    } else {
      console.log(`  PASS: DisplayName: ${setting.displayName}`);
    }

    if (!setting.description || setting.description.trim() === '') {
      console.error(`  ERROR: Description 為空`);
      allValid = false;
    } else {
      console.log(
        `  PASS: Description: ${setting.description.substring(0, 50)}...`
      );
    }

    // 檢查狀態訊息 (可選)
    if (setting.statusMessage) {
      console.log(`  PASS: StatusMessage: ${setting.statusMessage}`);
    } else {
      console.log(`  WARN: StatusMessage: 未設定 (可選)`);
    }

    // 檢查圖片 URL (可選)
    if (setting.pictureUrl) {
      if (setting.pictureUrl.startsWith('http')) {
        console.log(`  PASS: PictureUrl: ${setting.pictureUrl}`);
      } else {
        console.error(`  ERROR: PictureUrl 格式錯誤: ${setting.pictureUrl}`);
        allValid = false;
      }
    } else {
      console.log(`  WARN: PictureUrl: 未設定 (可選)`);
    }
  });

  // 3. 檢查特定 line setting 的業務邏輯
  console.log('\n檢查特定 Line Setting 的業務邏輯:');

  const nxPlayground = mockLineSettings['@nx_playground'];
  if (nxPlayground) {
    const expectedDisplayName = 'NX Playground';
    // const expectedDescriptionContains = 'NX Playground 官方 LINE 帳號';

    if (
      nxPlayground.displayName === expectedDisplayName &&
      nxPlayground.description.includes('NX Playground')
    ) {
      console.log(`  PASS: @nx_playground 業務邏輯正確`);
      console.log(`  INFO: DisplayName: ${nxPlayground.displayName}`);
      console.log(
        `  INFO: Description: ${nxPlayground.description.substring(0, 50)}...`
      );
    } else {
      console.error(`  ERROR: @nx_playground 業務邏輯錯誤`);
      allValid = false;
    }
  } else {
    console.error('  ERROR: 找不到 @nx_playground');
    allValid = false;
  }

  const nxPlaygroundOfficial = mockLineSettings['@nx-playground_official'];
  if (nxPlaygroundOfficial) {
    if (
      nxPlaygroundOfficial.displayName === 'NX Playground 官方' &&
      nxPlaygroundOfficial.description.includes('NX Playground')
    ) {
      console.log(`  PASS: @nx-playground_official 業務邏輯正確`);
    } else {
      console.error(`  ERROR: @nx-playground_official 業務邏輯錯誤`);
      allValid = false;
    }
  } else {
    console.error('  ERROR: 找不到 @nx-playground_official');
    allValid = false;
  }

  const gutingCommunity = mockLineSettings['@guting_community'];
  if (gutingCommunity) {
    if (
      gutingCommunity.displayName === '古亭社區基金會' &&
      gutingCommunity.description.includes('古亭')
    ) {
      console.log(`  PASS: @guting_community 業務邏輯正確`);
    } else {
      console.error(`  ERROR: @guting_community 業務邏輯錯誤`);
      allValid = false;
    }
  } else {
    console.error('  ERROR: 找不到 @guting_community');
    allValid = false;
  }

  // 4. 檢查生成的 line setting
  console.log('\n檢查生成的 Line Setting:');
  const generatedSetting = mockLineSettings['@vendor4'];
  if (generatedSetting) {
    console.log(`  PASS: 找到生成的 @vendor4`);
    console.log(`  INFO: DisplayName: ${generatedSetting.displayName}`);
    console.log(
      `  INFO: Description: ${generatedSetting.description.substring(0, 50)}...`
    );

    // 檢查生成內容是否合理
    if (
      generatedSetting.displayName.includes('Vendor4') ||
      generatedSetting.displayName.includes('官方')
    ) {
      console.log(`  PASS: 生成的 DisplayName 格式合理`);
    } else {
      console.log(
        `  WARN: 生成的 DisplayName 格式: ${generatedSetting.displayName}`
      );
    }
  } else {
    console.error('  ERROR: 找不到生成的 @vendor4');
    allValid = false;
  }

  // 5. 檢查唯一性
  console.log('\n檢查唯一性:');
  const officialAccountIds = Object.values(mockLineSettings).map(
    s => s.officialAccountId
  );
  const uniqueIds = new Set(officialAccountIds);
  if (officialAccountIds.length === uniqueIds.size) {
    console.log('  PASS: 所有 officialAccountId 都是唯一的');
  } else {
    console.error('  ERROR: 發現重複的 officialAccountId');
    allValid = false;
  }

  // 6. 檢查與 vendors 的對應關係
  console.log('\n檢查與 Vendors 的對應關係:');
  const expectedLineIds = [
    '@nx_playground',
    '@nx-playground_official',
    '@guting_community',
    '@vendor4',
  ];
  const missingLineIds = expectedLineIds.filter(id => !mockLineSettings[id]);
  const extraLineIds = keys.filter(key => !expectedLineIds.includes(key));

  if (missingLineIds.length > 0) {
    console.error(
      `  ERROR: 缺少的 Line Settings: ${missingLineIds.join(', ')}`
    );
    allValid = false;
  } else {
    console.log('  PASS: 所有預期的 Line Settings 都存在');
  }

  if (extraLineIds.length > 0) {
    console.log(`  WARN: 額外的 Line Settings: ${extraLineIds.join(', ')}`);
  }

  console.log('\n測試結果:', allValid ? 'PASS: 全部通過' : 'ERROR: 有錯誤');
  return allValid;
}
