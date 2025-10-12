import { Suspense } from 'react';

import { EventDetailSkeleton } from './components';
import { EventDetail } from './components/layout/EventDetail';

import { mockEvents } from '@/libs/mock/events';

// 生成靜態參數
export async function generateStaticParams() {
  return mockEvents.map(event => ({
    eventId: event.id,
  }));
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
