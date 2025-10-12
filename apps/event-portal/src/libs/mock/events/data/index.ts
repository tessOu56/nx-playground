import { getEventCoverUrl } from '../../../utils/imageUtils';
import { mockLineSettings } from '../../lineSettings/data';
import { generateTemplateByEventType } from '../../registrationForms/generate/templates';
import {
  quickGenerateSessions,
  generateFlexibleSessions,
} from '../../sessions/generate';
import { mockVendors } from '../../vendors/data';

import type { Event, EventDetail } from '@/types';

// Mock 活動內容 - 匹配後端數據結構
const mockContent = [
  {
    type: 'h2' as const,
    text_data: '**活動詳情**',
  },
  {
    type: 'text' as const,
    text_data:
      '這是一個精彩的活動，我們將帶您體驗最棒的內容。活動包含豐富的體驗項目，讓您度過難忘的時光。',
  },
  {
    type: 'text' as const,
    text_data: '*重要提醒：請準時到達集合地點*',
  },
  {
    type: 'text' as const,
    text_data: '更多資訊請參考 [官方網站](https://nx-playground.local)',
  },
  {
    type: 'image' as const,
    image_data: 'https://picsum.photos/800/600?random=1',
    text_data: '活動現場照片',
  },
  {
    type: 'h3' as const,
    text_data: '活動特色',
  },
  {
    type: 'list' as const,
    text_data:
      '專業導覽服務 | **精美紀念品** | *特色餐點體驗* | [互動式活動](https://example.com)',
  },
  {
    type: 'h3' as const,
    text_data: '重要提醒',
  },
  {
    type: 'list' as const,
    text_data:
      '1. 請攜帶身分證件 | 2. **穿著舒適服裝** | 3. 準時到達集合地點 | 4. *注意天氣變化*',
  },
  {
    type: 'quote' as const,
    text_data: '**這是一個難得的體驗機會**，讓我們一起創造美好的回憶！',
  },
  {
    type: 'text_bold' as const,
    text_data: '報名截止日期：活動前三天',
  },
];

// Mock FAQ 資料
const mockFAQ = [
  {
    question: '如何報名參加活動？',
    answer:
      '請點擊活動頁面中的「立即報名」按鈕，選擇場次和票券後即可完成報名。',
  },
  {
    question: '活動當天需要準備什麼？',
    answer: '請攜帶身分證件和報名確認信，建議穿著舒適的服裝和鞋子。',
  },
  {
    question: '如果天氣不佳怎麼辦？',
    answer: '我們會提前通知天氣狀況，如遇惡劣天氣將改期或提供替代方案。',
  },
];

// 基本 Event 資料（系統用）
export const mockEvents: Event[] = [
  // === 2026 年未來活動 (最新) ===
  {
    id: 'event-1',
    vendorId: 'vendor-1',
    title: '澎湖花火節體驗',
    description:
      '前往澎湖參加國際花火節，欣賞絢爛煙火表演，體驗離島風情，品嚐新鮮海產。',
    date: '2026-04-15',
    location: '澎湖縣馬公市',
    price: 2500,
    image: getEventCoverUrl('event-1'),
    likes: 234,
    attendees: 0,
    capacity: 30,
    category: '文化體驗',
    tags: ['澎湖', '花火節', '離島'],
    status: 'upcoming',
    registrationFormTemplate: generateTemplateByEventType('cultural'),
    sessions: generateFlexibleSessions('event-1', '2026-04-15', 2500, 120, {
      sessionCount: 6,
      ticketTypesPerSession: 3,
      // 展示多種場次安排邏輯
      sessionArrangement: 'mixed', // 混合安排：同天不同時段 + 不同天不同時段 + 不同天同一時段
    }),
  },
  // === 2025 年即將到來的活動 (10天內) ===
  {
    id: 'event-2',
    vendorId: 'vendor-1',
    title: '北海岸一日遊',
    description:
      '探索北海岸的壯麗海景，參觀野柳地質公園，品嚐新鮮海鮮，享受海風吹拂的悠閒時光。',
    date: '2025-01-15',
    location: '新北市北海岸',
    price: 1200,
    image: getEventCoverUrl('event-2'),
    likes: 203,
    attendees: 38,
    capacity: 45,
    category: '戶外活動',
    tags: ['海岸', '地質公園', '海鮮'],
    status: 'upcoming',
    registrationFormTemplate: generateTemplateByEventType('outdoor'),
    sessions: quickGenerateSessions('event-2', '2025-01-15', 1200, 45, {
      sessionCount: 2,
      eventType: 'single_day',
      ticketTypesPerSession: 2,
    }),
  },
  // === 2025 年正常舉辦的活動 ===
  {
    id: 'event-3',
    vendorId: 'vendor-1',
    title: '阿里山日出觀賞團',
    description:
      '凌晨出發前往阿里山，欣賞壯麗的日出雲海，體驗台灣高山之美，品嚐當地特色早餐。',
    date: '2025-03-20',
    location: '嘉義縣阿里山',
    price: 1500,
    image: getEventCoverUrl('event-3'),
    likes: 89,
    attendees: 15,
    capacity: 25,
    category: '戶外活動',
    tags: ['阿里山', '日出', '雲海'],
    status: 'upcoming',
    registrationFormTemplate: generateTemplateByEventType('outdoor'),
    sessions: quickGenerateSessions('event-3', '2025-03-20', 1500, 45, {
      sessionCount: 3,
      eventType: 'multi_day',
      ticketTypesPerSession: 2,
    }),
  },
  // === 2024 年已完成的活動 ===
  {
    id: 'event-4',
    vendorId: 'vendor-1',
    title: '陽明山健行之旅',
    description:
      '探索陽明山國家公園的美麗景觀，欣賞杜鵑花海，享受清新的山林空氣。',
    date: '2025-03-20',
    location: '陽明山國家公園',
    price: 800,
    image: getEventCoverUrl('event-4'),
    likes: 156,
    attendees: 45,
    capacity: 50,
    category: '戶外活動',
    tags: ['健行', '自然', '陽明山'],
    status: 'completed',
    registrationFormTemplate: generateTemplateByEventType('outdoor'),
    sessions: quickGenerateSessions('event-4', '2025-03-20', 800, 50, {
      sessionCount: 2,
      eventType: 'single_day',
      ticketTypesPerSession: 2,
    }),
  },
];

// EventDetail 資料（UI 顯示用，包含完整資訊）
export const mockEventDetails: EventDetail[] = mockEvents.map(event => {
  const vendor = mockVendors.find(v => v.id === event.vendorId);
  const lineSettings = vendor
    ? mockLineSettings[vendor.lineOfficialAccountId]
    : undefined;

  if (!vendor || !lineSettings) {
    throw new Error(`Missing vendor or lineSettings for event ${event.id}`);
  }

  return {
    ...event,
    vendor,
    lineSettings,
    content: mockContent,
    faq: mockFAQ,
  };
});
