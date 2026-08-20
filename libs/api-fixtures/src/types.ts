export const DEMO_USER_ID = 'user_demo';

export interface EventRecord {
  id: string;
  title: string;
  description?: string;
  location?: string;
  startDate: string;
  endDate: string;
  maxAttendees?: number;
  status: string;
  formId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderRecord {
  id: string;
  eventId: string;
  userId: string;
  status: string;
  data: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface UserRecord {
  id: string;
  email: string;
  name: string;
  role: string;
  status: string;
}

export interface EventListResponse {
  items: EventRecord[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface OrderListResponse {
  items: OrderRecord[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreateEventInput {
  title: string;
  description?: string;
  location?: string;
  startDate: string;
  endDate: string;
  maxAttendees?: number;
  status?: string;
  formId?: string;
}

export interface CreateOrderInput {
  eventId: string;
  userId?: string;
  status?: string;
  data?: Record<string, unknown>;
}
