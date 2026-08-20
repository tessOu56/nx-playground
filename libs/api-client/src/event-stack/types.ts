export interface CreateEventDto {
  title: string;
  description?: string;
  location?: string;
  startDate: string;
  endDate: string;
  maxAttendees?: number;
  status?: 'draft' | 'published';
  formId?: string;
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
