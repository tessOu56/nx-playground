import type { EventRecord, OrderRecord, UserRecord } from './types.js';

/** Fixtures loaded into memory (local) or Postgres (hosted `DATABASE_URL`). */
export const usersSeed: { users: UserRecord[] } = {
  users: [
    {
      id: 'user_admin',
      email: 'admin@nx-playground.local',
      name: '管理員',
      role: 'admin',
      status: 'active',
    },
    {
      id: 'user_organizer',
      email: 'organizer@nx-playground.local',
      name: '活動主辦人',
      role: 'organizer',
      status: 'active',
    },
    {
      id: 'user_demo',
      email: 'user@nx-playground.local',
      name: '一般用戶',
      role: 'user',
      status: 'active',
    },
  ],
};

export const eventsSeed: { events: Omit<EventRecord, 'createdAt' | 'updatedAt'>[] } = {
  events: [
    {
      id: 'event_react19',
      title: 'React 19 技術分享會',
      description: '深入了解 React 19 的新特性和最佳實踐',
      location: '台北市信義區',
      startDate: '2026-11-15T14:00:00.000Z',
      endDate: '2026-11-15T17:00:00.000Z',
      maxAttendees: 50,
      status: 'published',
      formId: 'form_basic',
    },
    {
      id: 'event_nestjs',
      title: 'NestJS 實戰工作坊',
      description: '從零開始構建企業級後端應用',
      location: '台北市大安區',
      startDate: '2026-12-01T09:00:00.000Z',
      endDate: '2026-12-01T16:00:00.000Z',
      maxAttendees: 30,
      status: 'published',
      formId: 'form_basic',
    },
    {
      id: 'event_nx',
      title: 'Nx Monorepo 最佳實踐',
      description: '大型專案的架構設計和管理',
      location: '線上',
      startDate: '2026-12-20T19:00:00.000Z',
      endDate: '2026-12-20T21:00:00.000Z',
      maxAttendees: 100,
      status: 'draft',
      formId: 'form_basic',
    },
  ],
};

export const ordersSeed: { orders: Omit<OrderRecord, 'createdAt' | 'updatedAt'>[] } = {
  orders: [
    {
      id: 'order_demo_1',
      eventId: 'event_react19',
      userId: 'user_demo',
      status: 'confirmed',
      data: {
        name: '一般用戶',
        email: 'user@nx-playground.local',
        phone: '0912345678',
        note: '期待參加！',
      },
    },
    {
      id: 'order_demo_2',
      eventId: 'event_nestjs',
      userId: 'user_demo',
      status: 'pending',
      data: {
        name: '一般用戶',
        email: 'user@nx-playground.local',
        phone: '0912345678',
      },
    },
  ],
};
