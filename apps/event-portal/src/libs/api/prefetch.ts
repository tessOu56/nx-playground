import { type QueryClient } from '@tanstack/react-query';

import { fetchPortalEvent, fetchPortalEvents } from './event-stack-fetch';

export async function prefetchEvents(queryClient: QueryClient) {
  await queryClient.prefetchQuery({
    queryKey: ['events'],
    queryFn: fetchPortalEvents,
    staleTime: 5 * 60 * 1000,
  });
}

export async function prefetchEvent(queryClient: QueryClient, eventId: string) {
  await queryClient.prefetchQuery({
    queryKey: ['event', eventId],
    queryFn: () => fetchPortalEvent(eventId),
    staleTime: 5 * 60 * 1000,
  });
}

export async function prefetchEventPage(
  queryClient: QueryClient,
  eventId: string
) {
  await Promise.all([
    prefetchEvent(queryClient, eventId),
    prefetchEvents(queryClient),
  ]);
}
