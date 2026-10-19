export type ExhibitionRegion = 'TAIPEI' | 'TOKYO';

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
  region?: ExhibitionRegion;
  timezone?: string;
  source?: string;
  sourceUrl?: string;
  externalId?: string;
  contentHash?: string;
  tags?: string[];
  priceText?: string;
  lastSeenAt?: string;
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
  region?: ExhibitionRegion | null;
  timezone?: string | null;
  source?: string | null;
  sourceUrl?: string | null;
  externalId?: string | null;
  contentHash?: string | null;
  tags?: string[];
  priceText?: string | null;
  lastSeenAt?: string | null;
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

export interface EventStackUser {
  id: string;
  email: string;
  name: string;
  avatar?: string | null;
  role: 'admin' | 'organizer' | 'user';
  status: 'active' | 'inactive' | 'suspended';
  createdAt: string;
  updatedAt: string;
}

export interface UserListResponse {
  items: EventStackUser[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface EventStackStats {
  events: number;
  users: number;
  activeUsers: number;
  orders: number;
  ticketsSold: number;
}
