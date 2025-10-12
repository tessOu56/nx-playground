/* eslint-disable no-console */
import { mockTickets } from '../data';

import type { Ticket } from '@/types';

/**
 * Mock Tickets 資料測試模組
 *
 * 此模組負責測試 mock tickets 資料的完整性和正確性，包括：
 * - 基本資料結構驗證
 * - 必要欄位完整性檢查
 * - 資料格式驗證 (日期、狀態等)
 * - ID 唯一性檢查
 * - 狀態邏輯驗證
 * - 與 orders 的關聯性檢查
 *
 * @fileoverview 提供 mock tickets 資料的全面測試功能
 * @author NX Playground Team
 * @since 1.0.0
 */

/**
 * 測試 Mock Tickets 資料的完整性和正確性
 *
 * 執行以下測試項目：
 * 1. 基本結構檢查 - 驗證 tickets 陣列長度和基本格式
 * 2. 欄位完整性檢查 - 確保所有必要欄位都存在
 * 3. 格式驗證 - 檢查日期、狀態等格式
 * 4. 狀態邏輯驗證 - 確認狀態邏輯正確
 * 5. ID 唯一性檢查 - 確保所有 ID 都是唯一的
 * 6. 關聯性檢查 - 檢查與 orders 的關聯關係
 *
 * @returns {boolean} 測試是否全部通過
 * @throws {Error} 當測試過程中發生嚴重錯誤時拋出
 *
 * @example
 * ```typescript
 * const result = testMockTickets();
 * if (result) {
 *   console.log('所有 tickets 測試通過');
 * }
 * ```
 */
export function testMockTickets() {
  console.log('=== 測試 Mock Tickets ===');

  // 1. 檢查基本結構
  console.log('\n基本統計:');
  console.log(`- 總 tickets 數量: ${mockTickets.length}`);

  let allValid = true;

  // 2. 檢查每個 ticket 的完整性
  console.log('\n檢查 Ticket 完整性:');
  const requiredFields: (keyof Ticket)[] = [
    'id',
    'orderId',
    'eventId',
    'type',
    'status',
    'createdAt',
    'updatedAt',
  ];

  mockTickets.forEach((ticket, index) => {
    console.log(`\nTicket ${index + 1} (${ticket.id}):`);

    // 檢查必要欄位
    const missingFields = requiredFields.filter(field => !(field in ticket));
    if (missingFields.length > 0) {
      console.error(`  ERROR: 缺少欄位: ${missingFields.join(', ')}`);
      allValid = false;
    } else {
      console.log(`  PASS: 必要欄位完整`);
    }

    // 檢查票券類型
    if (typeof ticket.type !== 'string' || ticket.type.length === 0) {
      console.error(`  ERROR: 票券類型無效: ${ticket.type}`);
      allValid = false;
    } else {
      console.log(`  PASS: 票券類型: ${ticket.type}`);
    }

    // 檢查票券狀態
    const validStatuses = ['issued', 'used', 'cancelled'];
    if (!validStatuses.includes(ticket.status)) {
      console.error(`  ERROR: 票券狀態無效: ${ticket.status}`);
      allValid = false;
    } else {
      console.log(`  PASS: 票券狀態: ${ticket.status}`);
    }

    // 檢查日期格式
    const dateFields = ['createdAt', 'updatedAt'];
    dateFields.forEach(field => {
      const dateValue = ticket[field as keyof Ticket] as string;
      if (!dateValue || isNaN(Date.parse(dateValue))) {
        console.error(`  ERROR: ${field} 日期格式錯誤: ${dateValue}`);
        allValid = false;
      } else {
        console.log(`  PASS: ${field} 格式正確`);
      }
    });

    // 檢查 ID 格式
    if (!ticket.id.includes('-ticket-')) {
      console.error(`  ERROR: Ticket ID 格式錯誤: ${ticket.id}`);
      allValid = false;
    } else {
      console.log(`  PASS: Ticket ID 格式正確`);
    }
  });

  // 3. 檢查唯一性
  console.log('\n檢查唯一性:');
  const ids = mockTickets.map(t => t.id);
  const uniqueIds = new Set(ids);
  if (ids.length === uniqueIds.size) {
    console.log('  PASS: 所有 ticket ID 都是唯一的');
  } else {
    console.error('  ERROR: 發現重複的 ticket ID');
    allValid = false;
  }

  // 4. 檢查與 orders 的關聯性
  console.log('\n檢查與 Orders 的關聯性:');
  const orderIds = mockTickets.map(t => t.orderId);
  const uniqueOrderIds = new Set(orderIds);

  // 檢查每個 order 的 ticket 數量是否合理
  const orderTicketCounts: Record<string, number> = {};
  mockTickets.forEach(ticket => {
    orderTicketCounts[ticket.orderId] =
      (orderTicketCounts[ticket.orderId] || 0) + 1;
  });

  console.log(`- 涉及的 Order 數量: ${uniqueOrderIds.size}`);
  console.log(`- Order Ticket 分布:`);
  Object.entries(orderTicketCounts).forEach(([orderId, count]) => {
    console.log(`  ${orderId}: ${count} 張票券`);
  });

  // 檢查 event ID 一致性
  const eventIds = mockTickets.map(t => t.eventId);
  const uniqueEventIds = new Set(eventIds);
  if (uniqueEventIds.size <= 5) {
    // 假設最多 5 個不同的活動
    console.log(`  PASS: Event ID 分佈合理 (${uniqueEventIds.size} 個活動)`);
  } else {
    console.error(`  ERROR: Event ID 分佈異常 (${uniqueEventIds.size} 個活動)`);
    allValid = false;
  }

  // 5. 檢查狀態邏輯
  console.log('\n檢查狀態邏輯:');
  const usedTickets = mockTickets.filter(t => t.status === 'used');
  const issuedTickets = mockTickets.filter(t => t.status === 'issued');
  const cancelledTickets = mockTickets.filter(t => t.status === 'cancelled');

  console.log(`- 已出票: ${issuedTickets.length}`);
  console.log(`- 已使用: ${usedTickets.length}`);
  console.log(`- 已取消: ${cancelledTickets.length}`);

  // 檢查已使用的票券是否有合理的時間差
  const invalidUsedTickets = usedTickets.filter(ticket => {
    const createdAt = new Date(ticket.createdAt);
    const updatedAt = new Date(ticket.updatedAt);
    return updatedAt <= createdAt;
  });

  if (invalidUsedTickets.length === 0) {
    console.log('  PASS: 已使用票券的時間邏輯正確');
  } else {
    console.error(
      `  ERROR: 發現 ${invalidUsedTickets.length} 張時間邏輯錯誤的已使用票券`
    );
    allValid = false;
  }

  console.log('\n測試結果:', allValid ? 'PASS: 全部通過' : 'ERROR: 有錯誤');
  return allValid;
}
