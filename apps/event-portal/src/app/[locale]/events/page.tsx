import { Suspense } from 'react';
import { type Metadata } from 'next';
import { connection } from 'next/server';

import { EventCatalog } from './components/EventCatalog';
import { EventCatalogSkeleton } from './components/EventCatalogSkeleton';
import { EventListError } from './components/EventListError';

import { LabelledDemoBanner } from '@/components/demo/LabelledDemoBanner';
import { LineOfficialCta } from '@/components/line/LineOfficialCta';
import { EdsReveal } from '@/components/motion/EdsReveal';
import { parseCatalogQuery } from '@/libs/api/catalog-query';
import { loadPortalCatalog } from '@/libs/exhibition-search/load-portal';
import { demoCopy } from '@/libs/i18n/demo-copy';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const copy = demoCopy(locale);
  const ogLocale =
    locale === 'en' ? 'en_US' : locale === 'ja' ? 'ja_JP' : 'zh_TW';
  return {
    title: copy.navEvents,
    description: copy.upcomingLead,
    openGraph: {
      title: copy.metaTitle,
      description: copy.metaDescription,
      locale: ogLocale,
    },
    twitter: {
      card: 'summary_large_image',
      title: copy.metaTitle,
      description: copy.metaDescription,
    },
  };
}

export default async function EventsIndexPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await connection();
  const { locale } = await params;
  const copy = demoCopy(locale);
  const filters = parseCatalogQuery(await searchParams);

  let events: Awaited<ReturnType<typeof loadPortalCatalog>> = [];
  let catalog: Awaited<ReturnType<typeof loadPortalCatalog>> = [];
  let loadError = false;
  try {
    const hasFilters =
      filters.q.length > 0 ||
      filters.city !== 'all' ||
      filters.dates !== 'all' ||
      filters.category.length > 0;
    catalog = await loadPortalCatalog();
    events = hasFilters ? await loadPortalCatalog(filters) : catalog;
  } catch {
    loadError = true;
  }

  return (
    <div className='mx-auto max-w-6xl px-4 py-8 sm:py-10'>
      <LabelledDemoBanner locale={locale} />
      <header className='mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'>
        <div className='max-w-2xl'>
          <h1 className='font-display text-3xl font-semibold tracking-tight text-gray-900 eds-enter'>
            {copy.navEvents}
          </h1>
          <p className='mt-2 text-sm leading-6 text-gray-600 sm:text-base'>
            {copy.upcomingLead}
          </p>
        </div>
        <div className='flex flex-wrap items-center gap-3'>
          <LineOfficialCta locale={locale} />
        </div>
      </header>
      {loadError ? (
        <EventListError locale={locale} />
      ) : (
        <EdsReveal>
          <Suspense fallback={<EventCatalogSkeleton />}>
            <EventCatalog events={events} catalog={catalog} locale={locale} />
          </Suspense>
        </EdsReveal>
      )}
    </div>
  );
}
