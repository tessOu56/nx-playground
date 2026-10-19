import { type Metadata } from 'next';

import { RetiredFlow } from '@/app/[locale]/events/components/RetiredFlow';
import { demoCopy } from '@/libs/i18n/demo-copy';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const copy = demoCopy(locale);
  return {
    title: `${copy.retiredOrdersTitle} | NX Playground`,
    description: copy.retiredOrdersLead,
    robots: 'noindex, nofollow',
  };
}

export default async function OrdersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return <RetiredFlow locale={locale} variant='orders' />;
}
