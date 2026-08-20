export interface CreateEventDto {
  title: string;
  description?: string;
  location?: string;
  startDate: string;
  endDate: string;
  maxAttendees?: number;
  status?: 'draft' | 'published';
  formId?: string;
  data?: Record<string, unknown>;
}

export interface EventStackEvent {
  id: string;
  title: string;
  description?: string;
  location?: string;
  startDate: string;
  endDate: string;
  maxAttendees?: number;
  status: string;
  formId?: string;
  data?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface EventListResponse {
  items: EventStackEvent[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreateOrderDto {
  eventId: string;
  userId?: string;
  status?: string;
  data?: Record<string, unknown>;
}

export interface EventStackOrder {
  id: string;
  eventId: string;
  userId: string;
  status: string;
  data: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface OrderListResponse {
  items: EventStackOrder[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface EventStackTicket {
  id: string;
  orderId: string;
  eventId: string;
  type: string;
  status: string;
  checkedInAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TicketListResponse {
  items: EventStackTicket[];
}

export interface TicketVerifyResponse {
  ticket: EventStackTicket;
  event: EventStackEvent;
  order: EventStackOrder;
  isValid: boolean;
  verificationTime: string;
}

export interface EventStackPaymentIntent {
  id: string;
  orderId: string;
  provider: 'mock' | 'ecpay-sandbox' | string;
  status: 'created' | 'paid' | 'failed' | string;
  merchantTradeNo: string;
  amount: number;
  checkoutUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentIntentListResponse {
  items: EventStackPaymentIntent[];
}

export interface PaymentWebhookResponse {
  intent: EventStackPaymentIntent;
  replayed: boolean;
}
