/**
 * Events Query Hooks
 *
 * React Query hooks for events data fetching
 */

import { useQuery } from '@tanstack/react-query';

import { EventsService } from '../services';

/**
 * Get all events
 */
export function useEventsQuery() {
  return useQuery({
    queryKey: ['events'],
    queryFn: () => EventsService.getEvents(),
  });
}

/**
 * Get single event by ID
 */
export function useEventQuery(id: string) {
  return useQuery({
    queryKey: ['events', id],
    queryFn: () => EventsService.getEventById(id),
    enabled: !!id,
  });
}
