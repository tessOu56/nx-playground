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
    <section className='py-24 bg-gray-50'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='mx-auto max-w-2xl text-center'>
          <h2 className='text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl'>
            {copy.howTitle}
          </h2>
          <p className='mt-4 text-lg leading-8 text-gray-600'>{copy.howLead}</p>
        </div>

        <div className='mt-16 grid gap-6 sm:grid-cols-3'>
          {steps.map(step => (
            <Card key={step.n} className='border-0 shadow-md'>
              <CardContent className='p-6'>
                <div className='mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-lg font-bold text-green-700'>
                  {step.n}
                </div>
                <h3 className='text-xl font-semibold text-gray-900'>
                  {step.title}
                </h3>
                <p className='mt-2 text-gray-600'>{step.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className='mt-12 text-center'>
          <Button
            variant='primary'
            size='lg'
            className='bg-green-600 hover:bg-green-700 text-white font-semibold'
            onClick={() => router.push('/events')}
          >
            {copy.seeEvents}
          </Button>
        </div>
      </div>
    </section>
  );
}
