import { EventStackStore } from './store.js';
import { createNeonStore } from './neon-store.js';
import type { EventStackRepo } from './repo.js';

function memoryRepo(): EventStackRepo {
  const store = new EventStackStore();
  return {
    storage: 'memory',
    ready: async () => undefined,
    listEvents: async query => store.listEvents(query),
    getEvent: async id => store.getEvent(id),
    createEvent: async input => store.createEvent(input),
    updateEvent: async (id, input) => store.updateEvent(id, input),
    deleteEvent: async id => store.deleteEvent(id),
    createOrder: async input => store.createOrder(input),
    listOrders: async query => store.listOrders(query),
    getOrder: async id => store.getOrder(id),
    confirmOrder: async id => store.confirmOrder(id),
  };
}

let cached: EventStackRepo | undefined;

export function getEventStackRepo(): EventStackRepo {
  if (cached) return cached;
  const databaseUrl = process.env.DATABASE_URL;
  cached = databaseUrl ? createNeonStore(databaseUrl) : memoryRepo();
  return cached;
}
