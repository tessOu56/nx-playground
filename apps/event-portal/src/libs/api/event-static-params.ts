import { listEvents } from '@nx-playground/api-client/event-stack';
import { loadFixtureEvents } from '@nx-playground/api-fixtures';

function fixtureParams(): { eventId: string }[] {
  return loadFixtureEvents()
    .filter(event => event.status !== 'draft')
    .map(event => ({ eventId: event.id }));
}

export async function eventStaticParams(): Promise<{ eventId: string }[]> {
  try {
    const page = await listEvents({ limit: 50 });
    const ids = page.items
      .filter(event => event.status !== 'draft')
      .map(event => ({ eventId: event.id }));
    return ids.length > 0 ? ids : fixtureParams();
  } catch {
    return fixtureParams();
  }
}
