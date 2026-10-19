'use client';

import { useLocale } from 'next-intl';

import { Button, Card, CardContent } from '@/components';
import { demoCopy, useLocalizedRouter } from '@/libs/i18n';

export function UserFlowSection() {
  const locale = useLocale();
  const router = useLocalizedRouter();
  const copy = demoCopy(locale);
  const steps = [
    { n: '1', title: copy.step1Title, body: copy.step1Body },
    { n: '2', title: copy.step2Title, body: copy.step2Body },
    { n: '3', title: copy.step3Title, body: copy.step3Body },
  ];

  return (
    <section className='bg-gray-50 py-16 sm:py-20'>
      <div className='mx-auto max-w-6xl px-4 sm:px-6 lg:px-8'>
        <div className='mx-auto max-w-2xl text-center'>
          <h2 className='text-3xl font-semibold tracking-tight text-gray-900'>
            {copy.howTitle}
          </h2>
          <p className='mt-4 text-lg leading-8 text-gray-600'>{copy.howLead}</p>
        </div>

        <ol className='mt-12 grid gap-5 sm:grid-cols-3'>
          {steps.map(step => (
            <li key={step.n}>
              <Card className='h-full border border-gray-200 shadow-sm'>
                <CardContent className='p-6'>
                  <p className='mb-4 text-sm font-medium text-gray-500'>
                    {step.n}
                  </p>
                  <h3 className='text-lg font-semibold text-gray-900'>
                    {step.title}
                  </h3>
                  <p className='mt-2 text-sm leading-6 text-gray-600'>
                    {step.body}
                  </p>
                </CardContent>
              </Card>
            </li>
          ))}
        </ol>

        <div className='mt-12 text-center'>
          <Button
            variant='primary'
            size='lg'
            onClick={() => router.push('/events')}
          >
            {copy.seeEvents}
          </Button>
        </div>
      </div>
    </section>
  );
}
