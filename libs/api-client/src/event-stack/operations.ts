import { eventStackRequest, toQuery } from './http';

import type {
  CreateEventDto,
  CreateOrderDto,
  EventListResponse,
  EventStackEvent,
  EventStackOrder,
  EventStackPaymentIntent,
  EventStackTicket,
  OrderListResponse,
  PaymentIntentListResponse,
  PaymentWebhookResponse,
  TicketListResponse,
  TicketVerifyResponse,
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

export function listOrderTickets(orderId: string): Promise<TicketListResponse> {
  return eventStackRequest(`/orders/${orderId}/tickets`);
}

export function getTicket(id: string): Promise<EventStackTicket> {
  return eventStackRequest(`/tickets/${id}`);
}

export function verifyTicket(id: string): Promise<TicketVerifyResponse> {
  return eventStackRequest(`/tickets/${id}/verify`);
}

export function checkInTicket(id: string): Promise<EventStackTicket> {
  return eventStackRequest(`/tickets/${id}/check-in`, { method: 'POST' });
}

export function createPaymentIntent(body: {
  orderId: string;
}): Promise<EventStackPaymentIntent> {
  return eventStackRequest('/payments/intents', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export function listPaymentIntents(
  orderId: string
): Promise<PaymentIntentListResponse> {
  return eventStackRequest(`/payments/intents${toQuery({ orderId })}`);
}

export function getPaymentIntent(id: string): Promise<EventStackPaymentIntent> {
  return eventStackRequest(`/payments/intents/${id}`);
}

export function postPaymentWebhook(body: {
  merchantTradeNo?: string;
  rtnCode?: string | number;
}): Promise<PaymentWebhookResponse> {
  return eventStackRequest('/payments/webhook', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}
