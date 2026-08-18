import { listEvents } from '@nx-playground/api-client/event-stack';

export async function eventStaticParams(): Promise<{ eventId: string }[]> {
  try {
    const page = await listEvents({ status: 'published', limit: 50 });
    return page.items.map(event => ({ eventId: event.id }));
  } catch {
    return [
      { eventId: 'event_react19' },
      { eventId: 'event_nestjs' },
    ];
  }
}
