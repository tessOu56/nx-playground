import type {
  CreateEventInput,
  CreateOrderInput,
  EventListResponse,
  EventRecord,
  OrderListResponse,
  OrderRecord,
} from './types.js';

export type EventStackRepo = {
  ready: () => Promise<void>;
  storage: 'postgres' | 'memory';
  listEvents: (query: {
    status?: string;
    page?: number;
    limit?: number;
  }) => Promise<EventListResponse>;
  getEvent: (id: string) => Promise<EventRecord | undefined>;
  createEvent: (input: CreateEventInput) => Promise<EventRecord>;
  updateEvent: (
    id: string,
    input: Partial<CreateEventInput>
  ) => Promise<EventRecord | undefined>;
  deleteEvent: (id: string) => Promise<boolean>;
  createOrder: (
    input: CreateOrderInput
  ) => Promise<OrderRecord | { error: string }>;
  listOrders: (query: {
    userId?: string;
    page?: number;
    limit?: number;
  }) => Promise<OrderListResponse>;
  getOrder: (id: string) => Promise<OrderRecord | undefined>;
  confirmOrder: (id: string) => Promise<OrderRecord | undefined>;
};
