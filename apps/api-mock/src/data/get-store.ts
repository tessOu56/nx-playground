import { EventStackStore } from './store.js';
import { createNeonStore } from './neon-store.js';
import type { EventStackRepo } from './repo.js';

/** Hobby/CI mock store. Not the Nest funds path (Prisma `users`/`events`/`orders`). */

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
    listTicketsByOrder: async orderId => {
      if (!store.getOrder(orderId)) return { error: 'not_found' };
      return { items: store.listTicketsByOrder(orderId) };
    },
    getTicket: async id => store.getTicket(id),
    verifyTicket: async id => store.verifyTicket(id),
    checkInTicket: async id => store.checkInTicket(id),
    listPaymentIntentsByOrder: async orderId => {
      if (!store.getOrder(orderId)) return { error: 'not_found' };
      return { items: store.listPaymentIntentsByOrder(orderId) };
    },
    getPaymentIntent: async id => store.getPaymentIntent(id),
    createPaymentIntent: async (orderId, options) =>
      store.createPaymentIntent(orderId, options),
    applyPaymentWebhook: async input => store.applyPaymentWebhook(input),
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
  // Hobby C-end demo must not silently use Neon when DATABASE_URL leaks in.
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
  cached = useMemoryStore() ? memoryRepo() : createNeonStore(process.env.DATABASE_URL!);
  return cached;
}
