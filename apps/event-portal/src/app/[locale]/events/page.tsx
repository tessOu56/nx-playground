import { EventListError } from '@/app/[locale]/vendors/[vendorId]/components/events/EventListError';
import { fetchPortalEvents } from '@/libs/api/event-stack-fetch';
import { EdsReveal } from '@/components/motion/EdsReveal';
import { LabelledDemoBanner } from '@/components/demo/LabelledDemoBanner';
import { demoCopy } from '@/libs/i18n/demo-copy';

import { EventStackCards } from './components/EventStackCards';

export const dynamic = 'force-dynamic';

export default async function EventsIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const copy = demoCopy(locale);

  let events: Awaited<ReturnType<typeof fetchPortalEvents>> = [];
  let loadError = false;
  try {
    events = await fetchPortalEvents();
  } catch {
    loadError = true;
  }

  return (
    <div className='mx-auto max-w-6xl px-4 py-8'>
      <LabelledDemoBanner locale={locale} />
      <header className='mb-6 flex flex-wrap items-end justify-between gap-3'>
        <div>
          <h1 className='text-2xl font-semibold text-gray-900 eds-enter'>
            {copy.upcoming}
          </h1>
          <p className='mt-1 text-sm text-gray-600'>{copy.upcomingLead}</p>
        </div>
        {!loadError ? (
          <p className='rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700'>
            {copy.eventCount(events.length)}
          </p>
        ) : null}
      </header>
      {loadError ? (
        <EventListError locale={locale} />
      ) : (
        <EdsReveal>
          <EventStackCards events={events} locale={locale} />
        </EdsReveal>
      )}
    </div>
  );
}
