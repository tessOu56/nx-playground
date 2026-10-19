import { EventCatalog } from './components/EventCatalog';
import { EventListError } from './components/EventListError';

import { LabelledDemoBanner } from '@/components/demo/LabelledDemoBanner';
import { LineOfficialCta } from '@/components/line/LineOfficialCta';
import { EdsReveal } from '@/components/motion/EdsReveal';
import { fetchPortalEvents } from '@/libs/api/event-stack-fetch';
import { demoCopy } from '@/libs/i18n/demo-copy';

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
    <div className='mx-auto max-w-6xl px-4 py-8 sm:py-10'>
      <LabelledDemoBanner locale={locale} />
      <header className='mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'>
        <div className='max-w-2xl'>
          <h1 className='text-3xl font-semibold tracking-tight text-gray-900 eds-enter'>
            {copy.navEvents}
          </h1>
          <p className='mt-2 text-sm leading-6 text-gray-600 sm:text-base'>
            {copy.upcomingLead}
          </p>
        </div>
        <div className='flex flex-wrap items-center gap-3'>
          {!loadError ? (
            <p className='rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-700 ring-1 ring-inset ring-gray-200'>
              {copy.eventCount(events.length)}
            </p>
          ) : null}
          <LineOfficialCta locale={locale} />
        </div>
      </header>
      {loadError ? (
        <EventListError locale={locale} />
      ) : (
        <EdsReveal>
          <EventCatalog events={events} locale={locale} />
        </EdsReveal>
      )}
    </div>
  );
}
