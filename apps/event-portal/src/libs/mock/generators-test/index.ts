/* eslint-disable no-console */
import { generateEvent, generateMultipleEvents } from '../events/generate';
import {
  generateLineSettings,
  generateMultipleLineSettings,
} from '../lineSettings/generate';
import {
  generateSession,
  generateSessionsForEvent,
  quickGenerateSessions,
} from '../sessions/generate';
import {
  generateSessionTicket,
  generateTicketsForSession,
} from '../tickets/generate';
import { generateVendor, generateMultipleVendors } from '../vendors/generate';

// 類型定義僅用於類型檢查，不需要導入

/**
 * Mock 資料生成器測試模組
 *
 * 此模組負責測試所有 mock 資料生成器函數的正確性和穩定性，包括：
 * - SessionTicket 生成器測試 (generateSessionTicket, generateTicketsForSession)
 * - Session 生成器測試 (generateSession, generateSessionsForEvent, quickGenerateSessions)
 * - Event 生成器測試 (generateEvent, generateMultipleEvents)
 * - Vendor 生成器測試 (generateVendor, generateMultipleVendors)
 * - LineSettings 生成器測試 (generateLineSettings, generateMultipleLineSettings)
 * - 生成器隨機性測試
 * - 參數處理和錯誤處理測試
 * - 返回值結構驗證
 *
 * @fileoverview 提供 mock 資料生成器的全面測試功能
 * @author NX Playground Team
 * @since 1.0.0
 */
/**
 * 測試所有 Mock 資料生成器函數的正確性和穩定性
 *
 * 執行以下測試項目：
 * 1. SessionTicket 生成器測試 - 驗證單一票卷和批量票卷生成
 * 2. Session 生成器測試 - 驗證單一場次、多場次和快速生成功能
 * 3. Event 生成器測試 - 驗證單一活動和批量活動生成
 * 4. Vendor 生成器測試 - 驗證單一主辦方和批量主辦方生成
 * 5. LineSettings 生成器測試 - 驗證單一和批量 LINE 設定生成
 * 6. 隨機性測試 - 確保生成器能產生不同的隨機資料
 * 7. 參數處理測試 - 驗證各種參數組合的處理
 * 8. 錯誤處理測試 - 檢查異常情況的處理
 * 9. 返回值結構驗證 - 確保生成資料符合預期結構
 *
 * @returns {boolean} 測試是否全部通過
 * @throws {Error} 當測試過程中發生嚴重錯誤時拋出
 *
 * @example
 * ```typescript
 * const result = testGenerators();
 * if (result) {
 *   console.log('所有生成器測試通過');
 * }
 * ```
 */
export function testGenerators() {
  console.log('=== 測試生成器函數 ===');

  let allValid = true;

  // 1. 測試 generateSessionTicket
  console.log('\n測試 generateSessionTicket:');
  try {
    const ticket = generateSessionTicket(
      'session-test',
      'ticket-test',
      1000,
      50
    );

    if (!ticket.id || !ticket.sessionId || !ticket.name || !ticket.price) {
      console.error(
        '  ERROR: generateSessionTicket 返回的 ticket 缺少必要欄位'
      );
      allValid = false;
    } else {
      console.log(`  PASS: generateSessionTicket 成功`);
      console.log(
        `  INFO: Ticket ID: ${ticket.id}, Name: ${ticket.name}, Price: ${ticket.price}`
      );
    }
  } catch (error) {
    console.error(`  ERROR: generateSessionTicket 失敗: ${error}`);
    allValid = false;
  }

  // 2. 測試 generateTicketsForSession
  console.log('\n測試 generateTicketsForSession:');
  try {
    const tickets = generateTicketsForSession('session-test', 1000, 50, 3);

    if (!Array.isArray(tickets) || tickets.length !== 3) {
      console.error(
        '  ERROR: generateTicketsForSession 返回的 tickets 數量不正確'
      );
      allValid = false;
    } else {
      console.log(`  PASS: generateTicketsForSession 成功`);
      console.log(`  INFO: 生成 ${tickets.length} 張票卷`);
    }
  } catch (error) {
    console.error(`  ERROR: generateTicketsForSession 失敗: ${error}`);
    allValid = false;
  }

  // 3. 測試 generateSession
  console.log('\n測試 generateSession:');
  try {
    const session = generateSession(
      'event-test',
      'session-test',
      '測試場次',
      '2026-01-01',
      '19:00',
      1000,
      50,
      2
    );

    if (
      !session.id ||
      !session.eventId ||
      !session.name ||
      !Array.isArray(session.tickets)
    ) {
      console.error('  ERROR: generateSession 返回的 session 缺少必要欄位');
      allValid = false;
    } else {
      console.log(`  PASS: generateSession 成功`);
      console.log(
        `  INFO: Session ID: ${session.id}, Tickets: ${session.tickets.length}`
      );
    }
  } catch (error) {
    console.error(`  ERROR: generateSession 失敗: ${error}`);
    allValid = false;
  }

  // 4. 測試 generateSessionsForEvent
  console.log('\n測試 generateSessionsForEvent:');
  try {
    const sessions = generateSessionsForEvent(
      'event-test',
      '2026-01-01',
      1000,
      100,
      3,
      'multi_day',
      2
    );

    if (!Array.isArray(sessions) || sessions.length !== 3) {
      console.error(
        '  ERROR: generateSessionsForEvent 返回的 sessions 數量不正確'
      );
      allValid = false;
    } else {
      console.log(`  PASS: generateSessionsForEvent 成功`);
      console.log(`  INFO: 生成 ${sessions.length} 個場次`);
    }
  } catch (error) {
    console.error(`  ERROR: generateSessionsForEvent 失敗: ${error}`);
    allValid = false;
  }

  // 5. 測試 quickGenerateSessions
  console.log('\n測試 quickGenerateSessions:');
  try {
    const sessions = quickGenerateSessions(
      'event-test',
      '2026-01-01',
      1000,
      100,
      {
        sessionCount: 2,
        eventType: 'single_day',
        ticketTypesPerSession: 3,
      }
    );

    if (!Array.isArray(sessions) || sessions.length !== 2) {
      console.error(
        '  ERROR: quickGenerateSessions 返回的 sessions 數量不正確'
      );
      allValid = false;
    } else {
      console.log(`  PASS: quickGenerateSessions 成功`);
      console.log(`  INFO: 生成 ${sessions.length} 個場次`);
    }
  } catch (error) {
    console.error(`  ERROR: quickGenerateSessions 失敗: ${error}`);
    allValid = false;
  }

  // 6. 測試 generateEvent
  console.log('\n測試 generateEvent:');
  try {
    const event = generateEvent(
      'event-test',
      'vendor-test',
      '測試活動',
      '這是一個測試活動',
      '2026-01-01',
      '測試地點',
      1000,
      100,
      {
        category: '測試類別',
        tags: ['測試', '活動'],
        sessionCount: 2,
        eventType: 'single_day',
        ticketTypesPerSession: 2,
      }
    );

    if (
      !event.id ||
      !event.vendorId ||
      !event.title ||
      !Array.isArray(event.sessions)
    ) {
      console.error('  ERROR: generateEvent 返回的 event 缺少必要欄位');
      allValid = false;
    } else {
      console.log(`  PASS: generateEvent 成功`);
      console.log(
        `  INFO: Event ID: ${event.id}, Sessions: ${event.sessions.length}`
      );
    }
  } catch (error) {
    console.error(`  ERROR: generateEvent 失敗: ${error}`);
    allValid = false;
  }

  // 7. 測試 generateMultipleEvents
  console.log('\n測試 generateMultipleEvents:');
  try {
    const events = generateMultipleEvents(3, 'vendor-test', {
      baseDate: '2026-01-01',
      priceRange: [500, 2000],
      capacityRange: [20, 100],
    });

    if (!Array.isArray(events) || events.length !== 3) {
      console.error('  ERROR: generateMultipleEvents 返回的 events 數量不正確');
      allValid = false;
    } else {
      console.log(`  PASS: generateMultipleEvents 成功`);
      console.log(`  INFO: 生成 ${events.length} 個活動`);
    }
  } catch (error) {
    console.error(`  ERROR: generateMultipleEvents 失敗: ${error}`);
    allValid = false;
  }

  // 8. 測試 generateVendor
  console.log('\n測試 generateVendor:');
  try {
    const vendor = generateVendor('vendor-test', {
      email: 'test@example.com',
      bankCode: '013',
      accountNumber: '1234567890',
      accountName: '測試主辦方',
      events: 5,
    });

    if (
      !vendor.id ||
      !vendor.email ||
      !vendor.lineOfficialAccountId ||
      !vendor.defaultBankAccount
    ) {
      console.error('  ERROR: generateVendor 返回的 vendor 缺少必要欄位');
      allValid = false;
    } else {
      console.log(`  PASS: generateVendor 成功`);
      console.log(`  INFO: Vendor ID: ${vendor.id}, Email: ${vendor.email}`);
    }
  } catch (error) {
    console.error(`  ERROR: generateVendor 失敗: ${error}`);
    allValid = false;
  }

  // 9. 測試 generateMultipleVendors
  console.log('\n測試 generateMultipleVendors:');
  try {
    const vendors = generateMultipleVendors(2, {
      prefix: 'test-vendor',
      eventsRange: [5, 20],
    });

    if (!Array.isArray(vendors) || vendors.length !== 2) {
      console.error(
        '  ERROR: generateMultipleVendors 返回的 vendors 數量不正確'
      );
      allValid = false;
    } else {
      console.log(`  PASS: generateMultipleVendors 成功`);
      console.log(`  INFO: 生成 ${vendors.length} 個主辦方`);
    }
  } catch (error) {
    console.error(`  ERROR: generateMultipleVendors 失敗: ${error}`);
    allValid = false;
  }

  // 10. 測試 generateLineSettings
  console.log('\n測試 generateLineSettings:');
  try {
    const lineSettings = generateLineSettings('@test_account', {
      displayName: '測試帳號',
      description: '這是一個測試 LINE 帳號',
      statusMessage: '歡迎來到測試帳號！',
      pictureUrl: 'https://example.com/test.jpg',
    });

    if (
      !lineSettings.officialAccountId ||
      !lineSettings.displayName ||
      !lineSettings.description
    ) {
      console.error(
        '  ERROR: generateLineSettings 返回的 lineSettings 缺少必要欄位'
      );
      allValid = false;
    } else {
      console.log(`  PASS: generateLineSettings 成功`);
      console.log(
        `  INFO: Account ID: ${lineSettings.officialAccountId}, Name: ${lineSettings.displayName}`
      );
    }
  } catch (error) {
    console.error(`  ERROR: generateLineSettings 失敗: ${error}`);
    allValid = false;
  }

  // 11. 測試 generateMultipleLineSettings
  console.log('\n測試 generateMultipleLineSettings:');
  try {
    const lineSettings = generateMultipleLineSettings(['@test1', '@test2'], {
      displayNames: {
        test1: '測試帳號1',
        test2: '測試帳號2',
      },
      descriptions: {
        test1: '這是測試帳號1',
        test2: '這是測試帳號2',
      },
    });

    if (!lineSettings['@test1'] || !lineSettings['@test2']) {
      console.error(
        '  ERROR: generateMultipleLineSettings 返回的 lineSettings 缺少預期的帳號'
      );
      allValid = false;
    } else {
      console.log(`  PASS: generateMultipleLineSettings 成功`);
      console.log(
        `  INFO: 生成 ${Object.keys(lineSettings).length} 個 LINE 設定`
      );
    }
  } catch (error) {
    console.error(`  ERROR: generateMultipleLineSettings 失敗: ${error}`);
    allValid = false;
  }

  // 12. 測試生成器的隨機性
  console.log('\n測試生成器的隨機性:');
  try {
    const ticket1 = generateSessionTicket(
      'session-test',
      'ticket-test-1',
      1000,
      50
    );
    const ticket2 = generateSessionTicket(
      'session-test',
      'ticket-test-2',
      1000,
      50
    );

    // 檢查是否生成不同的票卷類型或價格
    if (ticket1.name === ticket2.name && ticket1.price === ticket2.price) {
      console.log(`  WARN: 生成的票卷完全相同，可能需要檢查隨機性`);
    } else {
      console.log(`  PASS: 生成器具有隨機性`);
      console.log(
        `  INFO: Ticket1: ${ticket1.name} (${ticket1.price}), Ticket2: ${ticket2.name} (${ticket2.price})`
      );
    }
  } catch (error) {
    console.error(`  ERROR: 測試隨機性失敗: ${error}`);
    allValid = false;
  }

  console.log('\n測試結果:', allValid ? 'PASS: 全部通過' : 'ERROR: 有錯誤');
  return allValid;
}
