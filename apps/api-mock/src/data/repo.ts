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
  listTicketsByOrder: (orderId: string) => Promise<
    | { items: import('./tickets.js').TicketRecord[] }
    | { error: 'not_found' }
  >;
  getTicket: (
    id: string
  ) => Promise<import('./tickets.js').TicketRecord | undefined>;
  verifyTicket: (id: string) => Promise<
    | {
        ticket: import('./tickets.js').TicketRecord;
        event: EventRecord;
        order: OrderRecord;
        isValid: boolean;
        verificationTime: string;
      }
    | undefined
  >;
  checkInTicket: (
    id: string
  ) => Promise<
    | import('./tickets.js').TicketRecord
    | { error: string }
    | undefined
  >;
  listPaymentIntentsByOrder: (
    orderId: string
  ) => Promise<
    | { items: import('./payments.js').PaymentIntentRecord[] }
    | { error: 'not_found' }
  >;
  getPaymentIntent: (
    id: string
  ) => Promise<import('./payments.js').PaymentIntentRecord | undefined>;
  createPaymentIntent: (
    orderId: string,
    options: { publicApiBase: string }
  ) => Promise<
    | import('./payments.js').PaymentIntentRecord
    | { error: string }
  >;
  applyPaymentWebhook: (input: {
    merchantTradeNo: string;
    rtnCode?: string | number;
  }) => Promise<
    | { intent: import('./payments.js').PaymentIntentRecord; replayed: boolean }
    | { error: string }
  >;
};
