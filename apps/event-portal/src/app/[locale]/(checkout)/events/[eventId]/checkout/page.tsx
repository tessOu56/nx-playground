import { type Metadata } from 'next';
import { Suspense } from 'react';

import { CheckoutLayoutSkeleton } from './components';
import { CheckoutClient } from './components/layout/CheckoutClient';

import { eventStaticParams } from '@/libs/api/event-static-params';
import { demoCopy } from '@/libs/i18n/demo-copy';
import type { PaymentMethod } from '@/types';

export const dynamic = 'force-dynamic';
export const dynamicParams = true;

export async function generateStaticParams() {
  return eventStaticParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const copy = demoCopy(locale);
  return {
    title: `${copy.checkoutTitle} | NX Playground`,
    description: copy.checkoutLead,
    robots: 'noindex, nofollow',
  };
}

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ locale: string; eventId: string }>;
}) {
  const { locale, eventId } = await params;
  const copy = demoCopy(locale);

  const paymentMethods = [
    {
      value: 'cash' as PaymentMethod,
      label: copy.cash,
      description: copy.cashHint,
    },
    {
      value: 'atm' as PaymentMethod,
      label: copy.atm,
      description: copy.atmHint,
    },
    {
      value: 'third_party' as PaymentMethod,
      label: copy.thirdParty,
      description: copy.thirdPartyHint,
    },
  ];

  return (
    <>
      {/* 互動功能 - Client Component 處理，會從 layout 的快取讀取事件資料 */}
      <Suspense fallback={<CheckoutLayoutSkeleton />}>
        <CheckoutClient eventId={eventId} paymentMethods={paymentMethods} />
      </Suspense>
    </>
  );
}
