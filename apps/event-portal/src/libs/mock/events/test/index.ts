/* eslint-disable no-console */
import { mockLineSettings } from '../../lineSettings/data';
import { mockVendors } from '../../vendors/data';
import { mockEvents, mockEventDetails } from '../data';

import type { Event, EventDetail } from '@/types';

/**
 * Mock Events 資料測試模組
 *
 * 此模組負責測試 mock events 和 event details 資料的完整性和正確性，包括：
 * - Event 基本資料結構驗證 (title, description, date, location, price 等)
 * - EventDetail 完整結構驗證 (vendor, lineSettings, content, faq)
 * - Sessions 和 Tickets 階層結構驗證
 * - 與 vendors 和 lineSettings 的關聯性驗證
 * - 日期、價格、容量等數值格式驗證
 * - 票卷數量邏輯驗證 (availableQuantity <= totalQuantity)
 * - 所有 ID 的唯一性檢查
 * - 資料一致性驗證
 *
 * @fileoverview 提供 mock events 和 event details 資料的全面測試功能
 * @author NX Playground Team
 * @since 1.0.0
 */
/**
 * 測試 Mock Events 資料的完整性和正確性
 *
 * 執行以下測試項目：
 * 1. 基本結構檢查 - 驗證 events 和 eventDetails 數量匹配
 * 2. Event 欄位完整性檢查 - 確保所有必要欄位都存在
 * 3. EventDetail 結構驗證 - 檢查 vendor, lineSettings, content, faq 結構
 * 4. Sessions 和 Tickets 階層驗證 - 檢查場次和票卷的嵌套結構
 * 5. 關聯性驗證 - 確認 events 與 vendors 的對應關係
 * 6. 資料格式驗證 - 檢查日期、價格、容量等格式
 * 7. 票卷邏輯驗證 - 確保可售數量不大於總數量
 * 8. ID 唯一性檢查 - 驗證所有 ID 都是唯一的
 * 9. 統計資訊計算 - 提供平均統計數據
 *
 * @returns {boolean} 測試是否全部通過
 * @throws {Error} 當測試過程中發生嚴重錯誤時拋出
 *
 * @example
 * ```typescript
 * const result = testMockEvents();
 * if (result) {
 *   console.log('所有 events 測試通過');
 * }
 * ```
 */
export function testMockEvents() {
  console.log('=== 測試 Mock Events ===');

  // 1. 檢查基本結構
  console.log('\n基本統計:');
  console.log(`- 總 events 數量: ${mockEvents.length}`);
  console.log(`- 總 event details 數量: ${mockEventDetails.length}`);

  if (mockEvents.length !== mockEventDetails.length) {
    console.error('ERROR: Events 與 EventDetails 數量不匹配');
    return false;
  }

  let allValid = true;

  // 2. 檢查每個 event 的完整性
  console.log('\n檢查 Event 完整性:');
  const requiredEventFields: (keyof Event)[] = [
    'id',
    'vendorId',
    'title',
    'description',
    'date',
    'location',
    'price',
    'image',
    'likes',
    'attendees',
    'capacity',
    'category',
    'tags',
    'status',
    'sessions',
  ];

  mockEvents.forEach((event, index) => {
    console.log(`\nEvent ${index + 1} (${event.id}):`);

    // 檢查必要欄位
    const missingFields = requiredEventFields.filter(
      field => !(field in event)
    );
    if (missingFields.length > 0) {
      console.error(`  ERROR: 缺少欄位: ${missingFields.join(', ')}`);
      allValid = false;
    } else {
      console.log(`  PASS: 必要欄位完整`);
    }

    // 檢查 sessions 陣列
    if (!Array.isArray(event.sessions) || event.sessions.length === 0) {
      console.error(`  ERROR: Sessions 陣列為空或無效`);
      allValid = false;
    } else {
      console.log(`  PASS: Sessions 數量: ${event.sessions.length}`);
    }

    // 檢查 vendorId 是否存在於 mockVendors 中
    const vendor = mockVendors.find(v => v.id === event.vendorId);
    if (!vendor) {
      console.error(`  ERROR: 找不到對應的 vendor: ${event.vendorId}`);
      allValid = false;
    } else {
      console.log(`  PASS: 找到對應的 vendor: ${vendor.id}`);
    }

    // 檢查價格和容量
    if (typeof event.price !== 'number' || event.price < 0) {
      console.error(`  ERROR: 價格無效: ${event.price}`);
      allValid = false;
    } else {
      console.log(`  PASS: 價格: ${event.price}`);
    }

    if (typeof event.capacity !== 'number' || event.capacity <= 0) {
      console.error(`  ERROR: 容量無效: ${event.capacity}`);
      allValid = false;
    } else {
      console.log(`  PASS: 容量: ${event.capacity}`);
    }

    // 檢查日期格式
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(event.date)) {
      console.error(`  ERROR: 日期格式錯誤: ${event.date}`);
      allValid = false;
    } else {
      console.log(`  PASS: 日期格式正確: ${event.date}`);
    }

    // 檢查標籤陣列
    if (!Array.isArray(event.tags)) {
      console.error(`  ERROR: Tags 不是陣列`);
      allValid = false;
    } else {
      console.log(`  PASS: Tags: ${event.tags.join(', ')}`);
    }
  });

  // 3. 檢查每個 event detail 的完整性
  console.log('\n檢查 EventDetail 完整性:');
  const requiredEventDetailFields: (keyof EventDetail)[] = [
    'vendor',
    'lineSettings',
    'content',
    'faq',
  ];

  mockEventDetails.forEach((eventDetail, index) => {
    console.log(`\nEventDetail ${index + 1} (${eventDetail.id}):`);

    // 檢查必要欄位
    const missingFields = requiredEventDetailFields.filter(
      field => !(field in eventDetail)
    );
    if (missingFields.length > 0) {
      console.error(`  ERROR: 缺少欄位: ${missingFields.join(', ')}`);
      allValid = false;
    } else {
      console.log(`  PASS: 必要欄位完整`);
    }

    // 檢查 vendor 物件
    if (!eventDetail.vendor || typeof eventDetail.vendor !== 'object') {
      console.error(`  ERROR: Vendor 物件無效`);
      allValid = false;
    } else {
      console.log(`  PASS: Vendor: ${eventDetail.vendor.id}`);
    }

    // 檢查 lineSettings 物件
    if (
      !eventDetail.lineSettings ||
      typeof eventDetail.lineSettings !== 'object'
    ) {
      console.error(`  ERROR: LineSettings 物件無效`);
      allValid = false;
    } else {
      console.log(
        `  PASS: LineSettings: ${eventDetail.lineSettings.officialAccountId}`
      );
    }

    // 檢查 vendor 和 lineSettings 的對應關係
    const expectedLineSetting =
      mockLineSettings[eventDetail.vendor.lineOfficialAccountId];
    if (!expectedLineSetting) {
      console.error(
        `  ERROR: 找不到對應的 lineSetting: ${eventDetail.vendor.lineOfficialAccountId}`
      );
      allValid = false;
    } else if (
      expectedLineSetting.officialAccountId !==
      eventDetail.lineSettings.officialAccountId
    ) {
      console.error(`  ERROR: LineSettings 不匹配`);
      allValid = false;
    } else {
      console.log(`  PASS: Vendor 和 LineSettings 對應正確`);
    }

    // 檢查 content 和 faq 陣列
    if (!Array.isArray(eventDetail.content)) {
      console.error(`  ERROR: Content 不是陣列`);
      allValid = false;
    } else {
      console.log(`  PASS: Content 項目數量: ${eventDetail.content.length}`);
    }

    if (!Array.isArray(eventDetail.faq)) {
      console.error(`  ERROR: FAQ 不是陣列`);
      allValid = false;
    } else {
      console.log(`  PASS: FAQ 項目數量: ${eventDetail.faq.length}`);
    }
  });

  // 4. 檢查 sessions 和 tickets 的結構
  console.log('\n檢查 Sessions 和 Tickets 結構:');
  mockEvents.forEach((event, eventIndex) => {
    console.log(`\nEvent ${eventIndex + 1} Sessions:`);

    event.sessions.forEach((session, sessionIndex) => {
      console.log(`  Session ${sessionIndex + 1} (${session.id}):`);

      // 檢查 session 基本欄位
      const sessionRequiredFields = [
        'id',
        'eventId',
        'name',
        'date',
        'time',
        'capacity',
        'tickets',
      ];
      const missingSessionFields = sessionRequiredFields.filter(
        field => !(field in session)
      );
      if (missingSessionFields.length > 0) {
        console.error(
          `    ERROR: 缺少欄位: ${missingSessionFields.join(', ')}`
        );
        allValid = false;
      } else {
        console.log(`    PASS: Session 欄位完整`);
      }

      // 檢查 eventId 是否匹配
      if (session.eventId !== event.id) {
        console.error(
          `    ERROR: Session eventId 不匹配: ${session.eventId} vs ${event.id}`
        );
        allValid = false;
      } else {
        console.log(`    PASS: Session eventId 匹配`);
      }

      // 檢查 tickets 陣列
      if (!Array.isArray(session.tickets) || session.tickets.length === 0) {
        console.error(`    ERROR: Tickets 陣列為空或無效`);
        allValid = false;
      } else {
        console.log(`    PASS: Tickets 數量: ${session.tickets.length}`);

        // 檢查每個 ticket
        session.tickets.forEach((ticket, ticketIndex) => {
          const ticketRequiredFields = [
            'id',
            'sessionId',
            'name',
            'price',
            'totalQuantity',
            'availableQuantity',
            'status',
          ];
          const missingTicketFields = ticketRequiredFields.filter(
            field => !(field in ticket)
          );
          if (missingTicketFields.length > 0) {
            console.error(
              `      ERROR: Ticket ${
                ticketIndex + 1
              } 缺少欄位: ${missingTicketFields.join(', ')}`
            );
            allValid = false;
          } else {
            console.log(`      PASS: Ticket ${ticketIndex + 1} 欄位完整`);
          }

          // 檢查 sessionId 是否匹配
          if (ticket.sessionId !== session.id) {
            console.error(
              `      ERROR: Ticket sessionId 不匹配: ${ticket.sessionId} vs ${session.id}`
            );
            allValid = false;
          }

          // 檢查票價和數量
          if (typeof ticket.price !== 'number' || ticket.price < 0) {
            console.error(`      ERROR: Ticket 價格無效: ${ticket.price}`);
            allValid = false;
          }

          if (
            typeof ticket.totalQuantity !== 'number' ||
            ticket.totalQuantity < 0
          ) {
            console.error(
              `      ERROR: Ticket 總數量無效: ${ticket.totalQuantity}`
            );
            allValid = false;
          }

          if (
            typeof ticket.availableQuantity !== 'number' ||
            ticket.availableQuantity < 0
          ) {
            console.error(
              `      ERROR: Ticket 可售數量無效: ${ticket.availableQuantity}`
            );
            allValid = false;
          }

          if (ticket.availableQuantity > ticket.totalQuantity) {
            console.error(
              `      ERROR: 可售數量大於總數量: ${ticket.availableQuantity} > ${ticket.totalQuantity}`
            );
            allValid = false;
          }
        });
      }
    });
  });

  // 5. 檢查唯一性
  console.log('\n檢查唯一性:');
  const eventIds = mockEvents.map(e => e.id);
  const uniqueEventIds = new Set(eventIds);
  if (eventIds.length === uniqueEventIds.size) {
    console.log('  PASS: 所有 event ID 都是唯一的');
  } else {
    console.error('  ERROR: 發現重複的 event ID');
    allValid = false;
  }

  // 檢查 session 和 ticket ID 唯一性
  const allSessionIds: string[] = [];
  const allTicketIds: string[] = [];

  mockEvents.forEach(event => {
    event.sessions.forEach(session => {
      allSessionIds.push(session.id);
      session.tickets.forEach(ticket => {
        allTicketIds.push(ticket.id);
      });
    });
  });

  const uniqueSessionIds = new Set(allSessionIds);
  const uniqueTicketIds = new Set(allTicketIds);

  if (allSessionIds.length === uniqueSessionIds.size) {
    console.log('  PASS: 所有 session ID 都是唯一的');
  } else {
    console.error('  ERROR: 發現重複的 session ID');
    allValid = false;
  }

  if (allTicketIds.length === uniqueTicketIds.size) {
    console.log('  PASS: 所有 ticket ID 都是唯一的');
  } else {
    console.error('  ERROR: 發現重複的 ticket ID');
    allValid = false;
  }

  console.log('\n測試結果:', allValid ? 'PASS: 全部通過' : 'ERROR: 有錯誤');
  return allValid;
}
