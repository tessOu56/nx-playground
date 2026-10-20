import { type Metadata } from 'next';

import { RetiredFlow } from '@/app/[locale]/events/components/RetiredFlow';
import { demoCopy } from '@/libs/i18n/demo-copy';

export const dynamic = 'force-dynamic';
export const dynamicParams = true;

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

export default async function TicketCheckInPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return <RetiredFlow locale={locale} variant='checkout' />;
}
