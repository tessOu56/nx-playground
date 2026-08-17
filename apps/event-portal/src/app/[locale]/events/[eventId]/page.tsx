import { Suspense } from 'react';

import { EventDetailSkeleton } from './components';
import { EventDetail } from './components/layout/EventDetail';

import { eventStaticParams } from '@/libs/api/event-static-params';

export const dynamicParams = true;

export async function generateStaticParams() {
  return eventStaticParams();
}

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
