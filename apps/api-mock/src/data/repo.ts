import type {
  CreateEventInput,
  CreateOrderInput,
  EventListResponse,
  EventRecord,
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
  getOrder: (id: string) => Promise<OrderRecord | undefined>;
  confirmOrder: (id: string) => Promise<OrderRecord | undefined>;
};
