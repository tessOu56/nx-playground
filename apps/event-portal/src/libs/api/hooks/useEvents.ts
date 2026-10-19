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
