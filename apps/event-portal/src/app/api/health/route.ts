import { NextResponse } from 'next/server';
import { loadFixtureEvents } from '@nx-playground/api-fixtures';

export const dynamic = 'force-dynamic';

export async function GET() {
  const catalogEvents = loadFixtureEvents().filter(
    event => event.status !== 'draft'
  ).length;

  return NextResponse.json(
    {
      status: 'ok',
      service: 'event-portal',
      labelledDemo: true,
      catalogSource: 'api-fixtures',
      catalogEvents,
      fundsPath: false,
    },
    { status: 200 }
  );
}
