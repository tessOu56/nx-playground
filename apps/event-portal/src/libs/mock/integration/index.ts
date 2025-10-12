/* eslint-disable no-console */
import { mockEvents, mockEventDetails } from '../events/data';
import { mockLineSettings } from '../lineSettings/data';
import { mockVendors } from '../vendors/data';

/**
 * Mock 資料整合性測試模組
 *
 * 此模組負責測試所有 mock 資料之間的整合性和一致性，包括：
 * - Vendors 與 LineSettings 的對應關係驗證
 * - Events 與 Vendors 的關聯性驗證
 * - EventDetails 的完整性和一致性檢查
 * - Sessions 和 Tickets 的階層結構驗證
 * - 所有 ID 的唯一性和一致性檢查
 * - 資料統計和分析
 * - 跨模組資料關聯性驗證
 * - 整體資料完整性檢查
 *
 * @fileoverview 提供 mock 資料整合性和一致性的全面測試功能
 * @author NX Playground Team
 * @since 1.0.0
 */
/**
 * 測試 Mock 資料的整合性和一致性
 *
 * 執行以下測試項目：
 * 1. 關聯性檢查 - 驗證 vendors 與 lineSettings 的對應關係
 * 2. 事件關聯檢查 - 驗證 events 與 vendors 的關聯性
 * 3. 詳細資料檢查 - 驗證 eventDetails 的完整性和一致性
 * 4. 階層結構檢查 - 驗證 sessions 和 tickets 的嵌套結構
 * 5. 資料一致性檢查 - 確保所有資料間的關聯正確
 * 6. ID 唯一性檢查 - 驗證所有 ID 都是唯一的
 * 7. 統計資訊計算 - 提供整體資料統計和分析
 * 8. 完整性驗證 - 確保沒有遺漏的關聯資料
 *
 * @returns {boolean} 測試是否全部通過
 * @throws {Error} 當測試過程中發生嚴重錯誤時拋出
 *
 * @example
 * ```typescript
 * const result = testMockDataIntegration();
 * if (result) {
 *   console.log('所有整合性測試通過');
 * }
 * ```
 */
export function testMockDataIntegration() {
  console.log('=== 測試 Mock 資料整合性 ===');

  let allValid = true;

  // 1. 檢查 vendors 和 lineSettings 的對應關係
  console.log('\n檢查 Vendors 和 LineSettings 的對應關係:');
  mockVendors.forEach(vendor => {
    const lineSetting = mockLineSettings[vendor.lineOfficialAccountId];
    if (lineSetting) {
      console.log(
        `  PASS: ${vendor.id} -> ${vendor.lineOfficialAccountId} (找到對應設定)`
      );

      // 檢查 lineSetting 的 officialAccountId 是否匹配
      if (lineSetting.officialAccountId !== vendor.lineOfficialAccountId) {
        console.error(
          `  ERROR: LineSetting 的 officialAccountId 不匹配: ${lineSetting.officialAccountId} vs ${vendor.lineOfficialAccountId}`
        );
        allValid = false;
      }
    } else {
      console.error(
        `  ERROR: ${vendor.id} -> ${vendor.lineOfficialAccountId} (找不到對應設定)`
      );
      allValid = false;
    }
  });

  // 2. 檢查 events 和 vendors 的對應關係
  console.log('\n檢查 Events 和 Vendors 的對應關係:');
  mockEvents.forEach(event => {
    const vendor = mockVendors.find(v => v.id === event.vendorId);
    if (vendor) {
      console.log(`  PASS: ${event.id} -> ${event.vendorId} (找到對應 vendor)`);
    } else {
      console.error(
        `  ERROR: ${event.id} -> ${event.vendorId} (找不到對應 vendor)`
      );
      allValid = false;
    }
  });

  // 3. 檢查 eventDetails 的完整性
  console.log('\n檢查 EventDetails 的完整性:');
  mockEventDetails.forEach((eventDetail, index) => {
    console.log(`\nEventDetail ${index + 1} (${eventDetail.id}):`);

    // 檢查 vendor 是否存在
    const vendor = mockVendors.find(v => v.id === eventDetail.vendorId);
    if (!vendor) {
      console.error(`  ERROR: 找不到對應的 vendor: ${eventDetail.vendorId}`);
      allValid = false;
    } else {
      console.log(`  PASS: 找到對應的 vendor: ${vendor.id}`);
    }

    // 檢查 lineSettings 是否存在
    const lineSetting =
      mockLineSettings[eventDetail.vendor.lineOfficialAccountId];
    if (!lineSetting) {
      console.error(
        `  ERROR: 找不到對應的 lineSetting: ${eventDetail.vendor.lineOfficialAccountId}`
      );
      allValid = false;
    } else {
      console.log(
        `  PASS: 找到對應的 lineSetting: ${lineSetting.officialAccountId}`
      );
    }

    // 檢查 lineSettings 物件是否正確
    if (
      eventDetail.lineSettings.officialAccountId !==
      lineSetting.officialAccountId
    ) {
      console.error(
        `  ERROR: EventDetail 的 lineSettings 與 mockLineSettings 不匹配`
      );
      allValid = false;
    } else {
      console.log(`  PASS: EventDetail 的 lineSettings 正確`);
    }

    // 檢查 sessions 和 tickets 的完整性
    let sessionValid = true;
    let ticketValid = true;

    eventDetail.sessions.forEach(session => {
      if (session.eventId !== eventDetail.id) {
        console.error(
          `    ERROR: Session eventId 不匹配: ${session.eventId} vs ${eventDetail.id}`
        );
        sessionValid = false;
      }

      session.tickets.forEach(ticket => {
        if (ticket.sessionId !== session.id) {
          console.error(
            `      ERROR: Ticket sessionId 不匹配: ${ticket.sessionId} vs ${session.id}`
          );
          ticketValid = false;
        }

        if (ticket.availableQuantity > ticket.totalQuantity) {
          console.error(
            `      ERROR: 可售數量大於總數量: ${ticket.availableQuantity} > ${ticket.totalQuantity}`
          );
          ticketValid = false;
        }
      });
    });

    if (sessionValid) {
      console.log(
        `  PASS: Sessions 結構正確 (${eventDetail.sessions.length} 個場次)`
      );
    } else {
      console.error(`  ERROR: Sessions 結構有問題`);
      allValid = false;
    }

    const totalTickets = eventDetail.sessions.reduce(
      (sum, session) => sum + session.tickets.length,
      0
    );
    if (ticketValid) {
      console.log(`  PASS: Tickets 結構正確 (總共 ${totalTickets} 張票卷)`);
    } else {
      console.error(`  ERROR: Tickets 結構有問題`);
      allValid = false;
    }
  });

  // 4. 檢查資料一致性
  console.log('\n檢查資料一致性:');

  // 檢查所有 vendors 都有對應的 lineSettings
  const vendorLineIds = mockVendors.map(v => v.lineOfficialAccountId);
  const lineSettingIds = Object.keys(mockLineSettings);

  const missingLineSettings = vendorLineIds.filter(
    id => !lineSettingIds.includes(id)
  );
  const extraLineSettings = lineSettingIds.filter(
    id => !vendorLineIds.includes(id)
  );

  if (missingLineSettings.length > 0) {
    console.error(
      `  ERROR: 缺少的 Line Settings: ${missingLineSettings.join(', ')}`
    );
    allValid = false;
  } else {
    console.log('  PASS: 所有 vendors 都有對應的 lineSettings');
  }

  if (extraLineSettings.length > 0) {
    console.log(
      `  WARN: 額外的 Line Settings: ${extraLineSettings.join(', ')}`
    );
  }

  // 檢查所有 events 都有對應的 vendors
  const eventVendorIds = mockEvents.map(e => e.vendorId);
  const vendorIds = mockVendors.map(v => v.id);

  const missingVendors = eventVendorIds.filter(id => !vendorIds.includes(id));
  if (missingVendors.length > 0) {
    console.error(`  ERROR: 缺少的 Vendors: ${missingVendors.join(', ')}`);
    allValid = false;
  } else {
    console.log('  PASS: 所有 events 都有對應的 vendors');
  }

  // 5. 檢查 ID 唯一性
  console.log('\n檢查 ID 唯一性:');

  // 檢查 vendor IDs
  const uniqueVendorIds = new Set(mockVendors.map(v => v.id));
  if (uniqueVendorIds.size === mockVendors.length) {
    console.log('  PASS: Vendor IDs 唯一');
  } else {
    console.error('  ERROR: Vendor IDs 有重複');
    allValid = false;
  }

  // 檢查 event IDs
  const uniqueEventIds = new Set(mockEvents.map(e => e.id));
  if (uniqueEventIds.size === mockEvents.length) {
    console.log('  PASS: Event IDs 唯一');
  } else {
    console.error('  ERROR: Event IDs 有重複');
    allValid = false;
  }

  // 檢查 session IDs
  const allSessionIds: string[] = [];
  mockEvents.forEach(event => {
    event.sessions.forEach(session => {
      allSessionIds.push(session.id);
    });
  });
  const uniqueSessionIds = new Set(allSessionIds);
  if (uniqueSessionIds.size === allSessionIds.length) {
    console.log('  PASS: Session IDs 唯一');
  } else {
    console.error('  ERROR: Session IDs 有重複');
    allValid = false;
  }

  // 檢查 ticket IDs
  const allTicketIds: string[] = [];
  mockEvents.forEach(event => {
    event.sessions.forEach(session => {
      session.tickets.forEach(ticket => {
        allTicketIds.push(ticket.id);
      });
    });
  });
  const uniqueTicketIds = new Set(allTicketIds);
  if (uniqueTicketIds.size === allTicketIds.length) {
    console.log('  PASS: Ticket IDs 唯一');
  } else {
    console.error('  ERROR: Ticket IDs 有重複');
    allValid = false;
  }

  // 6. 統計資訊
  console.log('\n統計資訊:');
  console.log(`- 總 Vendors: ${mockVendors.length}`);
  console.log(`- 總 Line Settings: ${Object.keys(mockLineSettings).length}`);
  console.log(`- 總 Events: ${mockEvents.length}`);
  console.log(`- 總 Event Details: ${mockEventDetails.length}`);
  console.log(`- 總 Sessions: ${allSessionIds.length}`);
  console.log(`- 總 Tickets: ${allTicketIds.length}`);

  // 計算平均統計
  const avgSessionsPerEvent = allSessionIds.length / mockEvents.length;
  const avgTicketsPerSession = allTicketIds.length / allSessionIds.length;

  console.log(
    `- 平均每個 Event 的 Sessions: ${avgSessionsPerEvent.toFixed(2)}`
  );
  console.log(
    `- 平均每個 Session 的 Tickets: ${avgTicketsPerSession.toFixed(2)}`
  );

  console.log('\n測試結果:', allValid ? 'PASS: 全部通過' : 'ERROR: 有錯誤');
  return allValid;
}
