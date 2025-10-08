import { generateTemplateByEventType } from '../../registrationForms/generate/templates';
import { quickGenerateSessions } from '../../sessions/generate';

import type { Event } from '@/types';

// 活動類別
const categories = [
  '文化體驗',
  '戶外活動',
  '美食體驗',
  '藝術展覽',
  '音樂會',
  '工作坊',
  '運動競賽',
  '旅遊觀光',
];

// 活動標籤
const tags = [
  ['澎湖', '花火節', '離島'],
  ['海岸', '地質公園', '海鮮'],
  ['阿里山', '日出', '雲海'],
  ['健行', '自然', '陽明山'],
  ['台北', '歷史', '古蹟'],
  ['美食', '料理', '品酒'],
  ['藝術', '展覽', '文化'],
  ['音樂', '演唱會', '表演'],
];

// 活動狀態
const statuses: Array<'upcoming' | 'ongoing' | 'completed' | 'cancelled'> = [
  'upcoming',
  'upcoming',
  'upcoming',
  'completed',
  'cancelled',
];

/**
 * 生成隨機的 Event
 */
export function generateEvent(
  eventId: string,
  vendorId: string,
  title: string,
  description: string,
  date: string,
  location: string,
  basePrice: number,
  capacity: number,
  options: {
    category?: string;
    tags?: string[];
    status?: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
    sessionCount?: number;
    eventType?: 'single_day' | 'multi_day';
    ticketTypesPerSession?: number;
  } = {}
): Event {
  const {
    category = categories[Math.floor(Math.random() * categories.length)],
    tags: eventTags = tags[Math.floor(Math.random() * tags.length)],
    status = statuses[Math.floor(Math.random() * statuses.length)],
    sessionCount = 2 + Math.floor(Math.random() * 4),
    eventType = Math.random() > 0.5 ? 'single_day' : 'multi_day',
    ticketTypesPerSession = 2 + Math.floor(Math.random() * 2),
  } = options;

  const sessions = quickGenerateSessions(eventId, date, basePrice, capacity, {
    sessionCount,
    eventType,
    ticketTypesPerSession,
  });

  return {
    id: eventId,
    vendorId,
    title,
    description,
    date,
    location,
    price: basePrice,
    image: `/images/events/${eventId}.jpg`, // 假設圖片路徑
    likes: Math.floor(Math.random() * 500),
    attendees: Math.floor(Math.random() * capacity * 0.8),
    capacity,
    category,
    tags: eventTags,
    status,
    registrationFormTemplate: generateTemplateByEventType('standard'),
    sessions,
  };
}

/**
 * 批量生成多個活動
 */
export function generateMultipleEvents(
  eventCount: number,
  vendorId: string,
  options: {
    baseDate?: string;
    priceRange?: [number, number];
    capacityRange?: [number, number];
  } = {}
): Event[] {
  const {
    baseDate = new Date().toISOString().split('T')[0],
    priceRange = [500, 5000],
    capacityRange = [20, 200],
  } = options;

  const events: Event[] = [];

  for (let i = 1; i <= eventCount; i++) {
    const eventId = `generated-event-${i}`;
    const eventDate = new Date(baseDate);
    eventDate.setDate(eventDate.getDate() + Math.floor(Math.random() * 365)); // 一年內隨機日期

    const price =
      priceRange[0] +
      Math.floor(Math.random() * (priceRange[1] - priceRange[0]));
    const capacity =
      capacityRange[0] +
      Math.floor(Math.random() * (capacityRange[1] - capacityRange[0]));

    const event = generateEvent(
      eventId,
      vendorId,
      `Generated Event ${i}`,
      `This is a generated event description for event ${i}.`,
      eventDate.toISOString().split('T')[0],
      `Location ${i}`,
      price,
      capacity
    );

    events.push(event);
  }

  return events;
}
