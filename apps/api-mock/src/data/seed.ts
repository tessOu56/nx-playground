import type { EventRecord, OrderRecord, UserRecord } from './types.js';
import eventsJson from './events.json' with { type: 'json' };

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

export const eventsSeed: {
  events: Omit<EventRecord, 'createdAt' | 'updatedAt'>[];
} = {
  events: eventsJson.events as Omit<EventRecord, 'createdAt' | 'updatedAt'>[],
};

export const ordersSeed: { orders: Omit<OrderRecord, 'createdAt' | 'updatedAt'>[] } = {
  orders: [],
};
