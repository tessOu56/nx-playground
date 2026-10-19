import { Suspense } from 'react';

import { EventDetailSkeleton } from './components';
import { EventDetail } from './components/layout/EventDetail';

export const dynamic = 'force-dynamic';
export const dynamicParams = true;

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;

  return (
    <Suspense fallback={<EventDetailSkeleton />}>
      <EventDetail eventId={eventId} />
    </Suspense>
  );
}
