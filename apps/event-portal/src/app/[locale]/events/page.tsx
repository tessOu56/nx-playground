import { EventListError } from '@/app/[locale]/vendors/[vendorId]/components/events/EventListError';
import { fetchPortalEvents } from '@/libs/api/event-stack-fetch';
import { EdsReveal } from '@/components/motion/EdsReveal';

import { EventStackCards } from './components/EventStackCards';

export const dynamic = 'force-dynamic';

export default async function EventsIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  let events: Awaited<ReturnType<typeof fetchPortalEvents>> = [];
  let loadError = false;
  try {
    events = await fetchPortalEvents();
  } catch {
    loadError = true;
  }

  return (
    <div className='mx-auto max-w-5xl px-4 py-10'>
      <h1 className='mb-2 text-2xl font-semibold text-gray-900 eds-enter'>
        即將舉辦
      </h1>
      <p className='mb-8 text-sm text-gray-600'>
        查看場次、講者與票價後報名。無需登入，示範身分即可完成。
      </p>
      {loadError ? (
        <EventListError />
      ) : (
        <EdsReveal>
          <EventStackCards events={events} locale={locale} />
        </EdsReveal>
      )}
    </div>
  );
}
