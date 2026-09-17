import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from '@tanstack/react-query';

import { BackLink } from '@/components/nav/BackLink';
import { LabelledDemoBanner } from '@/components/demo/LabelledDemoBanner';
import { prefetchEventPage } from '@/libs';
import { demoCopy } from '@/libs/i18n/demo-copy';

export const dynamic = 'force-dynamic';

export default async function CheckoutLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string; eventId: string }>;
}) {
  const { locale, eventId } = await params;
  const copy = demoCopy(locale);

  const queryClient = new QueryClient();
  await prefetchEventPage(queryClient, eventId);
  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <div className='min-h-screen bg-gray-50'>
        <div className='page-container'>
          <div className='mb-8'>
            <BackLink href={`/${locale}/events/${eventId}`} />
            <LabelledDemoBanner locale={locale} variant='checkout' />
            <h1 className='text-2xl font-semibold text-gray-900'>
              {copy.checkoutTitle}
            </h1>
            <p className='mt-1 text-sm text-gray-600'>{copy.checkoutLead}</p>
          </div>
          <div className='space-y-6'>{children}</div>
        </div>
      </div>
    </HydrationBoundary>
  );
}
