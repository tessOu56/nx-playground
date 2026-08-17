'use client';

import { useQuery } from '@tanstack/react-query';

import { fetchPortalEvent, fetchPortalEvents } from '../event-stack-fetch';

export { fetchPortalEvent, fetchPortalEvents } from '../event-stack-fetch';

export function useEvents() {
  return useQuery({
    queryKey: ['events'],
    queryFn: fetchPortalEvents,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}

export function useEvent(eventId: string) {
  return useQuery({
    queryKey: ['event', eventId],
    queryFn: () => fetchPortalEvent(eventId),
    staleTime: 5 * 60 * 1000,
    enabled: !!eventId,
    retry: 1,
  });
}

export function useEventsByVendor(vendorId: string) {
  return useQuery({
    queryKey: ['events', 'vendor', vendorId],
    queryFn: async () => {
      const events = await fetchPortalEvents();
      return events.filter(event => event.vendorId === vendorId);
    },
    staleTime: 5 * 60 * 1000,
    enabled: !!vendorId,
  });
}
