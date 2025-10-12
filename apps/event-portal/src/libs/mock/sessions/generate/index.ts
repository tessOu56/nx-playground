import { generateTicketsForSession } from '../../tickets/generate';

import type { Session } from '@/types';

// 場次名稱模板
const sessionNameTemplates = [
  '第一場',
  '第二場',
  '第三場',
  '第四場',
  '第五場',
  '第六場',
  '上午場',
  '下午場',
  '晚間場',
  '夜間場',
  '特別場',
  '加演場',
];

// 時間配置
const timeSlots = [
  '08:00',
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
  '19:00',
  '20:00',
  '21:00',
  '22:00',
];

/**
 * 生成隨機的 Session
 */
export function generateSession(
  eventId: string,
  sessionId: string,
  sessionName: string,
  date: string,
  time: string,
  basePrice: number,
  capacity: number,
  ticketCount = 2 // 每個場次的票卷類型數量
): Session {
  const tickets = generateTicketsForSession(
    sessionId,
    basePrice,
    capacity,
    ticketCount
  );

  // 計算當前參加人數（基於已售出的票卷）
  const currentAttendees = tickets.reduce(
    (total, ticket) =>
      total + (ticket.totalQuantity - ticket.availableQuantity),
    0
  );

  return {
    id: sessionId,
    eventId,
    name: sessionName,
    date,
    time,
    capacity,
    currentAttendees,
    status: 'upcoming',
    tickets,
  };
}

/**
 * 為活動生成多個場次
 */
export function generateSessionsForEvent(
  eventId: string,
  eventDate: string,
  basePrice: number,
  totalCapacity: number,
  sessionCount = 3,
  eventType: 'single_day' | 'multi_day' = 'single_day',
  ticketCount = 2
): Session[] {
  const sessions: Session[] = [];

  // 根據活動類型決定場次安排
  if (eventType === 'single_day') {
    // 單日多場次
    const timeSlotCount = Math.min(sessionCount, timeSlots.length);
    const selectedTimeSlots = timeSlots
      .sort(() => Math.random() - 0.5)
      .slice(0, timeSlotCount)
      .sort();

    selectedTimeSlots.forEach((time, index) => {
      const sessionId = `${eventId}-session-${index + 1}`;
      const sessionName = sessionNameTemplates[index] || `第${index + 1}場`;
      const capacity = Math.floor(totalCapacity / sessionCount);

      const session = generateSession(
        eventId,
        sessionId,
        sessionName,
        eventDate,
        time,
        basePrice,
        capacity,
        ticketCount
      );

      sessions.push(session);
    });
  } else {
    // 多日活動 - 但也可以在同一天內安排多個場次
    const baseDate = new Date(eventDate);

    // 檢查日期是否有效
    if (isNaN(baseDate.getTime())) {
      throw new Error(`Invalid date format: ${eventDate}`);
    }

    // 決定是否在同一天內安排所有場次
    const useSameDay = Math.random() > 0.3; // 70% 機率在同一天

    if (useSameDay) {
      // 同一天多場次，時間不重疊
      const timeSlotCount = Math.min(sessionCount, timeSlots.length);
      const selectedTimeSlots = timeSlots
        .sort(() => Math.random() - 0.5)
        .slice(0, timeSlotCount)
        .sort();

      selectedTimeSlots.forEach((time, index) => {
        const sessionId = `${eventId}-session-${index + 1}`;
        const sessionName = sessionNameTemplates[index] || `第${index + 1}場`;
        const capacity = Math.floor(totalCapacity / sessionCount);

        const session = generateSession(
          eventId,
          sessionId,
          sessionName,
          eventDate,
          time,
          basePrice,
          capacity,
          ticketCount
        );

        sessions.push(session);
      });
    } else {
      // 分散到不同日期
      for (let i = 0; i < sessionCount; i++) {
        const sessionDate = new Date(
          baseDate.getTime() + i * 24 * 60 * 60 * 1000
        );
        const sessionId = `${eventId}-session-${i + 1}`;
        const sessionName = sessionNameTemplates[i] || `第${i + 1}場`;
        const time = timeSlots[Math.floor(Math.random() * timeSlots.length)];
        const capacity = Math.floor(totalCapacity / sessionCount);

        const session = generateSession(
          eventId,
          sessionId,
          sessionName,
          sessionDate.toISOString().split('T')[0],
          time,
          basePrice,
          capacity,
          ticketCount
        );

        sessions.push(session);
      }
    }
  }

  return sessions;
}

/**
 * 生成靈活的場次安排 - 展示多種場次邏輯
 */
export function generateFlexibleSessions(
  eventId: string,
  eventDate: string,
  basePrice: number,
  totalCapacity: number,
  options: {
    sessionCount?: number;
    ticketTypesPerSession?: number;
    sessionArrangement?: 'mixed' | 'same_day' | 'multi_day' | 'same_time';
  } = {}
): Session[] {
  const {
    sessionCount = 6,
    ticketTypesPerSession = 3,
    sessionArrangement = 'mixed',
  } = options;

  const sessions: Session[] = [];
  const baseDate = new Date(eventDate);

  // 檢查日期是否有效
  if (isNaN(baseDate.getTime())) {
    throw new Error(`Invalid date format: ${eventDate}`);
  }

  if (sessionArrangement === 'mixed') {
    // 混合安排：展示多種場次邏輯
    const sessionPlan = [
      // 第一天：同天不同時段
      { date: 0, time: '09:00', name: '第一場花火秀' },
      { date: 0, time: '14:00', name: '第二場花火秀' },
      { date: 0, time: '19:00', name: '第三場花火秀' },
      // 第二天：不同天不同時段
      { date: 1, time: '10:00', name: '第四場花火秀' },
      { date: 1, time: '16:00', name: '第五場花火秀' },
      // 第三天：不同天同一時段
      { date: 2, time: '19:00', name: '第六場花火秀' },
    ];

    sessionPlan.slice(0, sessionCount).forEach((plan, index) => {
      const sessionDate = new Date(
        baseDate.getTime() + plan.date * 24 * 60 * 60 * 1000
      );
      const sessionId = `${eventId}-session-${index + 1}`;
      const capacity = Math.floor(totalCapacity / sessionCount);

      const session = generateSession(
        eventId,
        sessionId,
        plan.name,
        sessionDate.toISOString().split('T')[0],
        plan.time,
        basePrice,
        capacity,
        ticketTypesPerSession
      );

      sessions.push(session);
    });
  } else if (sessionArrangement === 'same_day') {
    // 同天不同時段
    const timeSlotCount = Math.min(sessionCount, timeSlots.length);
    const selectedTimeSlots = timeSlots
      .sort(() => Math.random() - 0.5)
      .slice(0, timeSlotCount)
      .sort();

    selectedTimeSlots.forEach((time, index) => {
      const sessionId = `${eventId}-session-${index + 1}`;
      const sessionName = sessionNameTemplates[index] || `第${index + 1}場`;
      const capacity = Math.floor(totalCapacity / sessionCount);

      const session = generateSession(
        eventId,
        sessionId,
        sessionName,
        eventDate,
        time,
        basePrice,
        capacity,
        ticketTypesPerSession
      );

      sessions.push(session);
    });
  } else if (sessionArrangement === 'multi_day') {
    // 不同天不同時段
    for (let i = 0; i < sessionCount; i++) {
      const sessionDate = new Date(
        baseDate.getTime() + i * 24 * 60 * 60 * 1000
      );
      const sessionId = `${eventId}-session-${i + 1}`;
      const sessionName = sessionNameTemplates[i] || `第${i + 1}場`;
      const time = timeSlots[Math.floor(Math.random() * timeSlots.length)];
      const capacity = Math.floor(totalCapacity / sessionCount);

      const session = generateSession(
        eventId,
        sessionId,
        sessionName,
        sessionDate.toISOString().split('T')[0],
        time,
        basePrice,
        capacity,
        ticketTypesPerSession
      );

      sessions.push(session);
    }
  } else if (sessionArrangement === 'same_time') {
    // 不同天同一時段
    const selectedTime =
      timeSlots[Math.floor(Math.random() * timeSlots.length)];

    for (let i = 0; i < sessionCount; i++) {
      const sessionDate = new Date(
        baseDate.getTime() + i * 24 * 60 * 60 * 1000
      );
      const sessionId = `${eventId}-session-${i + 1}`;
      const sessionName = sessionNameTemplates[i] || `第${i + 1}場`;
      const capacity = Math.floor(totalCapacity / sessionCount);

      const session = generateSession(
        eventId,
        sessionId,
        sessionName,
        sessionDate.toISOString().split('T')[0],
        selectedTime,
        basePrice,
        capacity,
        ticketTypesPerSession
      );

      sessions.push(session);
    }
  }

  return sessions;
}

/**
 * 生成隨機活動場次的快速函數
 */
export function quickGenerateSessions(
  eventId: string,
  date: string,
  price: number,
  capacity: number,
  options: {
    sessionCount?: number;
    eventType?: 'single_day' | 'multi_day';
    ticketTypesPerSession?: number;
  } = {}
): Session[] {
  const {
    sessionCount = 2 + Math.floor(Math.random() * 4), // 2-5 場
    eventType = Math.random() > 0.5 ? 'single_day' : 'multi_day',
    ticketTypesPerSession = 2 + Math.floor(Math.random() * 2), // 2-3 種票卷
  } = options;

  return generateSessionsForEvent(
    eventId,
    date,
    price,
    capacity,
    sessionCount,
    eventType,
    ticketTypesPerSession
  );
}
