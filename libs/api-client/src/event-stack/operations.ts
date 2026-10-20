import { eventStackRequest, toQuery } from './http';

import type {
  CreateEventDto,
  EventListResponse,
  EventStackEvent,
  ExhibitionRegion,
  EventStackStats,
  EventStackUser,
  UserListResponse,
} from './types';

export function listEvents(query?: {
  status?: string;
  region?: ExhibitionRegion;
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

export function listUsers(query?: {
  role?: string;
  status?: string;
  page?: number;
  limit?: number;
}): Promise<UserListResponse> {
  return eventStackRequest(`/users${toQuery(query ?? {})}`);
}

export function getStats(): Promise<EventStackStats> {
  return eventStackRequest('/stats');
}
