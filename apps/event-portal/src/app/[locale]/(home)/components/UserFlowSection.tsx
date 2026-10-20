import Link from 'next/link';

import { catalogHref } from '@/libs/api/catalog-query';
import { demoCopy } from '@/libs/i18n/demo-copy';

export function UserFlowSection({ locale }: { locale: string }) {
  const copy = demoCopy(locale);
  const steps = [
    { n: '01', title: copy.step1Title, body: copy.step1Body },
    { n: '02', title: copy.step2Title, body: copy.step2Body },
    { n: '03', title: copy.step3Title, body: copy.step3Body },
  ];

  return (
    <section className='bg-muted py-14 sm:py-16'>
      <div className='mx-auto max-w-6xl px-4 sm:px-6 lg:px-8'>
        <div className='max-w-2xl'>
          <h2 className='font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl'>
            {copy.howTitle}
          </h2>
          <p className='mt-3 text-base leading-7 text-muted-foreground'>{copy.howLead}</p>
        </div>

        <ol className='mt-10 grid gap-8 sm:grid-cols-3'>
          {steps.map(step => (
            <li key={step.n}>
              <p className='text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground'>
                {step.n}
              </p>
              <h3 className='mt-3 text-base font-semibold text-foreground'>
                {step.title}
              </h3>
              <p className='mt-2 text-sm leading-6 text-muted-foreground'>{step.body}</p>
            </li>
          ))}
        </ol>

        <div className='mt-10'>
          <Link
            href={catalogHref(locale)}
            className='inline-flex items-center justify-center rounded-md bg-foreground px-5 py-2.5 text-sm font-medium text-background hover:opacity-90'
          >
            {copy.seeEvents}
          </Link>
        </div>
      </div>
    </section>
  );
}
