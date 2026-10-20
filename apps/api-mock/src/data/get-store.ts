import { EventStackStore } from '@nx-playground/api-fixtures';

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
  };
}

let cached: EventStackRepo | undefined;

function useMemoryStore(): boolean {
  const explicit = process.env.EVENT_STACK_STORE?.trim().toLowerCase();
  if (explicit === 'memory' || explicit === '1' || explicit === 'true') {
    return true;
  }
  if (explicit === 'postgres' || explicit === 'neon') {
    return false;
  }
  if (process.env.VERCEL === '1') {
    if (process.env.DATABASE_URL) {
      console.warn(
        '[event-stack-api] VERCEL + DATABASE_URL ignored; using memory fixtures. Set EVENT_STACK_STORE=postgres to override.'
      );
    }
    return true;
  }
  return !process.env.DATABASE_URL;
}

export function getEventStackRepo(): EventStackRepo {
  if (cached) return cached;
  cached = useMemoryStore()
    ? memoryRepo()
    : createNeonStore(process.env.DATABASE_URL!);
  return cached;
}
