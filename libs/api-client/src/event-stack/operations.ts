import { eventStackRequest, toQuery } from './http';

import type {
  CreateEventDto,
  CreateOrderDto,
  EventListResponse,
  EventStackEvent,
  EventStackOrder,
  OrderListResponse,
} from './types';

export function listEvents(query?: {
  status?: string;
  page?: number;
  limit?: number;
}): Promise<EventListResponse> {
  return eventStackRequest(`/events${toQuery(query ?? {})}`);
}

export function getEvent(id: string): Promise<EventStackEvent> {
  return eventStackRequest(`/events/${id}`);
}

export function createEvent(body: CreateEventDto): Promise<EventStackEvent> {
  return eventStackRequest('/events', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export function updateEvent(
  id: string,
  body: Partial<CreateEventDto>
): Promise<EventStackEvent> {
  return eventStackRequest(`/events/${id}`, {
    method: 'PUT',
    body: JSON.stringify(body),
  });
}

export function deleteEvent(id: string): Promise<{ message?: string; id?: string }> {
  return eventStackRequest(`/events/${id}`, { method: 'DELETE' });
}

export function createOrder(body: CreateOrderDto): Promise<EventStackOrder> {
  return eventStackRequest('/orders', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export function listOrders(query?: {
  userId?: string;
  page?: number;
  limit?: number;
}): Promise<OrderListResponse> {
  return eventStackRequest(`/orders${toQuery(query ?? {})}`);
}

export function getOrder(id: string): Promise<EventStackOrder> {
  return eventStackRequest(`/orders/${id}`);
}

export function confirmOrder(id: string): Promise<EventStackOrder> {
  return eventStackRequest(`/orders/${id}/confirm`, { method: 'POST' });
}
