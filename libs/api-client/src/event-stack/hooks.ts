'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  confirmOrder,
  createEvent,
  createOrder,
  deleteEvent,
  getEvent,
  getOrder,
  listEvents,
  listOrders,
  updateEvent,
} from './operations';

import type { CreateEventDto, CreateOrderDto } from './types';

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

export function useCreateOrderMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateOrderDto) => createOrder(body),
    onSuccess: order => {
      queryClient.invalidateQueries({ queryKey: ['event-stack', 'orders'] });
      queryClient.setQueryData(['event-stack', 'order', order.id], order);
    },
  });
}

export function useListOrders(query?: {
  userId?: string;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: ['event-stack', 'orders', query],
    queryFn: () => listOrders(query),
  });
}

export function useGetOrder(id: string) {
  return useQuery({
    queryKey: ['event-stack', 'order', id],
    queryFn: () => getOrder(id),
    enabled: Boolean(id),
  });
}

export function useConfirmOrderMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => confirmOrder(id),
    onSuccess: order => {
      queryClient.setQueryData(['event-stack', 'order', order.id], order);
    },
  });
}
