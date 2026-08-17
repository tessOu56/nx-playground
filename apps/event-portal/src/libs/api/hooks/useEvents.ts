import { useQuery } from '@tanstack/react-query';
import { getEvent, listEvents } from '@nx-playground/api-client';

import { toPortalEvent, toPortalEventDetail } from '../event-stack-map';

export async function fetchPortalEvents() {
  const page = await listEvents({ status: 'published', limit: 50 });
  return page.items.map(toPortalEvent);
}

export async function fetchPortalEvent(eventId: string) {
  const event = await getEvent(eventId);
  return toPortalEventDetail(event);
}

export function useEvents() {
  return useQuery({
    queryKey: ['events'],
    queryFn: fetchPortalEvents,
    staleTime: 5 * 60 * 1000,
  });
}

export function useEvent(eventId: string) {
  return useQuery({
    queryKey: ['event', eventId],
    queryFn: () => fetchPortalEvent(eventId),
    staleTime: 5 * 60 * 1000,
    enabled: !!eventId,
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
