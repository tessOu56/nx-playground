import { listEvents } from '@nx-playground/api-client/event-stack';

export async function eventStaticParams(): Promise<{ eventId: string }[]> {
  try {
    const page = await listEvents({ limit: 50 });
    return page.items
      .filter(event => event.status !== 'draft')
      .map(event => ({ eventId: event.id }));
  } catch {
    return [
      { eventId: 'event_react19' },
      { eventId: 'event_nestjs' },
    ];
  }
}
