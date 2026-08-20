'use client';

import { useLocale } from 'next-intl';

import { Button, Card, CardContent } from '@/components';
import { useLocalizedRouter } from '@/libs/i18n';

const STEPS_ZH = [
  {
    n: '1',
    title: '瀏覽活動',
    body: '查看場次、票種與報名狀態。',
  },
  {
    n: '2',
    title: 'LINE 登入報名',
    body: '用 LINE 帳號報名，訂單會綁在您身上。',
  },
  {
    n: '3',
    title: '出示票券',
    body: '報名完成後到「我的訂單」查看與核銷票券。',
  },
] as const;

const STEPS_EN = [
  {
    n: '1',
    title: 'Browse events',
    body: 'Check sessions, ticket types, and whether registration is open.',
  },
  {
    n: '2',
    title: 'Sign in with LINE',
    body: 'Register with your LINE account so orders stay with you.',
  },
  {
    n: '3',
    title: 'Show your ticket',
    body: 'Open My orders after signup to view and check in.',
  },
] as const;

export function UserFlowSection() {
  const locale = useLocale();
  const router = useLocalizedRouter();
  const isEn = locale === 'en';
  const steps = isEn ? STEPS_EN : STEPS_ZH;

  return (
    <section className='py-24 bg-gray-50'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='mx-auto max-w-2xl text-center'>
          <h2 className='text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl'>
            {isEn ? 'How it works' : '怎麼參加'}
          </h2>
          <p className='mt-4 text-lg leading-8 text-gray-600'>
            {isEn
              ? 'From finding an event to showing your ticket at the door.'
              : '從發現活動到入場出示票券。'}
          </p>
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
            {isEn ? 'See events' : '查看活動'}
          </Button>
        </div>
      </div>
    </section>
  );
}
