'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  createEvent,
  deleteEvent,
  getEvent,
  getStats,
  listEvents,
  listUsers,
  updateEvent,
} from './operations';

import type { CreateEventDto } from './types';

export function useListEvents(query?: {
  status?: string;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: ['event-stack', 'events', query],
    queryFn: () => listEvents(query),
  });
}

export function useGetEvent(id: string) {
  return useQuery({
    queryKey: ['event-stack', 'event', id],
    queryFn: () => getEvent(id),
    enabled: Boolean(id),
  });
}

export function useCreateEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateEventDto) => createEvent(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['event-stack', 'events'] });
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
}

export function useUpdateEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      body,
    }: {
      id: string;
      body: Partial<CreateEventDto>;
    }) => updateEvent(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['event-stack'] });
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
}

export function useDeleteEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteEvent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['event-stack'] });
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
}

export function useListUsers(query?: {
  role?: string;
  status?: string;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: ['event-stack', 'users', query],
    queryFn: () => listUsers(query),
  });
}

export function useGetStats() {
  return useQuery({
    queryKey: ['event-stack', 'stats'],
    queryFn: () => getStats(),
  });
}
