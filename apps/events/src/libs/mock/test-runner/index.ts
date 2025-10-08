/* eslint-disable no-console */
import { testMockBills } from '../bills/test/index';
import { testMockEvents } from '../events/test/index';
import { testGenerators } from '../generators-test/index';
import { testMockDataIntegration } from '../integration/index';
import { testMockLineSettings } from '../lineSettings/test/index';
import { testMockOrders } from '../orders/test/index';
import { testMockPayments } from '../payments/test/index';
import { testMockRegistrationForms } from '../registrationForms/test/index';
import { testMockTickets } from '../tickets/test/index';
import { testMockUsers } from '../users/test/index';
import { testMockVendors } from '../vendors/test/index';

/**
 * Mock 資料測試主執行器模組
 *
 * 此模組提供統一的測試執行入口，包括：
 * - 執行所有 mock 資料測試的完整流程
 * - 執行單一測試模組的功能
 * - 測試結果統計和報告
 * - 測試執行順序管理
 * - 錯誤處理和異常捕獲
 * - 測試結果格式化輸出
 *
 * 測試模組包括：
 * - vendors.test.ts - 主辦方資料測試
 * - lineSettings.test.ts - LINE 設定資料測試
 * - events.test.ts - 活動資料測試
 * - generators.test.ts - 生成器函數測試
 * - integration.test.ts - 整合性測試
 *
 * @fileoverview 提供 mock 資料測試的統一執行和管理功能
 * @author NX Playground Team
 * @since 1.0.0
 */
/**
 * 執行所有 Mock 資料測試
 *
 * 按順序執行以下測試模組：
 * 1. testMockBills - 測試帳單資料
 * 2. testMockOrders - 測試訂單資料
 * 3. testMockPayments - 測試支付記錄資料
 * 4. testMockRegistrationForms - 測試報名表資料
 * 5. testMockTickets - 測試票券資料
 * 6. testMockUsers - 測試用戶資料
 * 7. testMockVendors - 測試主辦方資料
 * 8. testMockLineSettings - 測試 LINE 設定資料
 * 9. testMockEvents - 測試活動資料
 * 10. testGenerators - 測試生成器函數
 * 11. testMockDataIntegration - 測試資料整合性
 *
 * 每個測試都會被包裝在 try-catch 中，確保單一測試失敗不會影響其他測試的執行。
 * 最終會提供詳細的測試結果報告，包括通過率和失敗項目。
 *
 * @returns {Object} 測試結果物件，包含各個測試模組的執行結果
 * @returns {boolean} results.bills - bills 測試結果
 * @returns {boolean} results.orders - orders 測試結果
 * @returns {boolean} results.payments - payments 測試結果
 * @returns {boolean} results.registrationForms - registrationForms 測試結果
 * @returns {boolean} results.tickets - tickets 測試結果
 * @returns {boolean} results.users - users 測試結果
 * @returns {boolean} results.vendors - vendors 測試結果
 * @returns {boolean} results.lineSettings - lineSettings 測試結果
 * @returns {boolean} results.events - events 測試結果
 * @returns {boolean} results.generators - generators 測試結果
 * @returns {boolean} results.integration - integration 測試結果
 *
 * @example
 * ```typescript
 * const results = runAllMockTests();
 * console.log('測試通過率:', Object.values(results).filter(r => r).length / 11);
 * ```
 */
export function runAllMockTests() {
  console.log('==========================================');
  console.log('開始執行 Mock 資料完整測試');
  console.log('==========================================');

  const results = {
    bills: false,
    orders: false,
    payments: false,
    registrationForms: false,
    tickets: false,
    users: false,
    vendors: false,
    lineSettings: false,
    events: false,
    generators: false,
    integration: false,
  };

  try {
    // 1. 測試 Bills
    console.log('\n[1/11] 測試 Mock Bills');
    console.log('------------------------------------------');
    results.bills = testMockBills();
  } catch (error) {
    console.error('ERROR: Bills 測試失敗:', error);
  }

  try {
    // 2. 測試 Orders
    console.log('\n[2/11] 測試 Mock Orders');
    console.log('------------------------------------------');
    results.orders = testMockOrders();
  } catch (error) {
    console.error('ERROR: Orders 測試失敗:', error);
  }

  try {
    // 3. 測試 Payments
    console.log('\n[3/11] 測試 Mock Payments');
    console.log('------------------------------------------');
    results.payments = testMockPayments();
  } catch (error) {
    console.error('ERROR: Payments 測試失敗:', error);
  }

  try {
    // 4. 測試 Registration Forms
    console.log('\n[4/11] 測試 Mock Registration Forms');
    console.log('------------------------------------------');
    results.registrationForms = testMockRegistrationForms();
  } catch (error) {
    console.error('ERROR: Registration Forms 測試失敗:', error);
  }

  try {
    // 5. 測試 Tickets
    console.log('\n[5/11] 測試 Mock Tickets');
    console.log('------------------------------------------');
    results.tickets = testMockTickets();
  } catch (error) {
    console.error('ERROR: Tickets 測試失敗:', error);
  }

  try {
    // 6. 測試 Users
    console.log('\n[6/11] 測試 Mock Users');
    console.log('------------------------------------------');
    results.users = testMockUsers();
  } catch (error) {
    console.error('ERROR: Users 測試失敗:', error);
  }

  try {
    // 7. 測試 Vendors
    console.log('\n[7/11] 測試 Mock Vendors');
    console.log('------------------------------------------');
    results.vendors = testMockVendors();
  } catch (error) {
    console.error('ERROR: Vendors 測試失敗:', error);
  }

  try {
    // 8. 測試 Line Settings
    console.log('\n[8/11] 測試 Mock Line Settings');
    console.log('------------------------------------------');
    results.lineSettings = testMockLineSettings();
  } catch (error) {
    console.error('ERROR: Line Settings 測試失敗:', error);
  }

  try {
    // 9. 測試 Events
    console.log('\n[9/11] 測試 Mock Events');
    console.log('------------------------------------------');
    results.events = testMockEvents();
  } catch (error) {
    console.error('ERROR: Events 測試失敗:', error);
  }

  try {
    // 10. 測試生成器
    console.log('\n[10/11] 測試生成器函數');
    console.log('------------------------------------------');
    results.generators = testGenerators();
  } catch (error) {
    console.error('ERROR: 生成器測試失敗:', error);
  }

  try {
    // 11. 測試整合性
    console.log('\n[11/11] 測試資料整合性');
    console.log('------------------------------------------');
    results.integration = testMockDataIntegration();
  } catch (error) {
    console.error('ERROR: 整合性測試失敗:', error);
  }

  // 總結報告
  console.log('\n==========================================');
  console.log('測試結果總結');
  console.log('==========================================');

  const passedTests = Object.values(results).filter(
    result => result === true
  ).length;
  const totalTests = Object.keys(results).length;

  Object.entries(results).forEach(([testName, passed]) => {
    const status = passed ? 'PASS' : 'FAIL';
    console.log(`${status}: ${testName}`);
  });

  console.log('\n總計:');
  console.log(`- 通過: ${passedTests}/${totalTests}`);
  console.log(`- 成功率: ${((passedTests / totalTests) * 100).toFixed(1)}%`);

  if (passedTests === totalTests) {
    console.log('\n🎉 所有測試都通過了！Mock 資料結構完整且正確。');
  } else {
    console.log('\n⚠️  有測試失敗，請檢查上述錯誤訊息。');
  }

  console.log('==========================================');

  return results;
}

/**
 * 執行單一測試模組
 *
 * 根據提供的測試名稱執行對應的測試模組。可用的測試名稱包括：
 * - 'bills' - 執行 testMockBills
 * - 'orders' - 執行 testMockOrders
 * - 'payments' - 執行 testMockPayments
 * - 'registrationForms' - 執行 testMockRegistrationForms
 * - 'tickets' - 執行 testMockTickets
 * - 'users' - 執行 testMockUsers
 * - 'vendors' - 執行 testMockVendors
 * - 'lineSettings' - 執行 testMockLineSettings
 * - 'events' - 執行 testMockEvents
 * - 'generators' - 執行 testGenerators
 * - 'integration' - 執行 testMockDataIntegration
 *
 * 如果提供的測試名稱不存在，會顯示錯誤訊息並列出所有可用的測試名稱。
 *
 * @param {string} testName - 要執行的測試名稱
 * @returns {boolean} 測試是否通過
 *
 * @example
 * ```typescript
 * // 執行單一測試
 * const result = runSingleTest('vendors');
 * if (result) {
 *   console.log('Vendors 測試通過');
 * }
 *
 * // 列出所有可用測試
 * runSingleTest('invalid'); // 會顯示所有可用測試名稱
 * ```
 */
export function runSingleTest(testName: string) {
  const tests = {
    bills: testMockBills,
    orders: testMockOrders,
    payments: testMockPayments,
    registrationForms: testMockRegistrationForms,
    tickets: testMockTickets,
    users: testMockUsers,
    vendors: testMockVendors,
    lineSettings: testMockLineSettings,
    events: testMockEvents,
    generators: testGenerators,
    integration: testMockDataIntegration,
  };

  const testFunction = tests[testName as keyof typeof tests];

  if (!testFunction) {
    console.error(`ERROR: 找不到測試 "${testName}"`);
    console.log('可用的測試:', Object.keys(tests).join(', '));
    return false;
  }

  console.log(`執行單一測試: ${testName}`);
  console.log('==========================================');

  try {
    const result = testFunction();
    console.log(`\n測試結果: ${result ? 'PASS' : 'FAIL'}`);
    return result;
  } catch (error) {
    console.error(`ERROR: 測試 "${testName}" 失敗:`, error);
    return false;
  }
}

// 如果直接執行此檔案，則運行所有測試
if (require.main === module) {
  runAllMockTests();
}
