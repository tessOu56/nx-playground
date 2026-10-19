import Link from 'next/link';

import { LineOfficialCta } from '@/components/line/LineOfficialCta';
import { demoCopy } from '@/libs/i18n/demo-copy';

export function RetiredFlow({
  locale,
  variant,
}: {
  locale: string;
  variant: 'checkout' | 'orders';
}) {
  const copy = demoCopy(locale);
  const title =
    variant === 'orders' ? copy.retiredOrdersTitle : copy.checkoutTitle;
  const lead =
    variant === 'orders' ? copy.retiredOrdersLead : copy.checkoutLead;

  return (
    <section className='mx-auto max-w-xl px-4 py-16 text-center'>
      <h1 className='text-2xl font-semibold tracking-tight text-gray-900'>
        {title}
      </h1>
      <p className='mt-3 text-sm leading-6 text-gray-600 sm:text-base'>
        {lead}
      </p>
      <div className='mt-8 flex flex-wrap items-center justify-center gap-3'>
        <Link
          href={`/${locale}/events`}
          className='inline-flex items-center justify-center rounded-md bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800'
        >
          {copy.backToEvents}
        </Link>
        <LineOfficialCta locale={locale} />
      </div>
    </section>
  );
}
