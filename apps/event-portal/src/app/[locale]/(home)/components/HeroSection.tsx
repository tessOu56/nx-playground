'use client';

import { Badge, Button } from '@/components';
import { useLocalizedRouter } from '@/libs/i18n';

export function HeroSection() {
  const router = useLocalizedRouter();

  const scrollToLogin = () => {
    document
      .getElementById('login-section')
      ?.scrollIntoView({ behavior: 'smooth' });
  };

  const goToEvents = () => {
    router.push('/events');
  };

  return (
    <section className='relative overflow-hidden bg-white'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='relative z-10 mx-auto max-w-2xl text-center py-24'>
          <div className='mb-8'>
            <Badge className='mb-4'>LINE 登入 | 活動發現與報名平台</Badge>
          </div>
          <h1 className='text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl'>
            NX Playground Events
          </h1>
          <p className='mt-6 text-lg leading-8 text-gray-600'>
            活動發現與報名。公開示範可用標示身分走完整流程；LINE
            登入僅在 tessOu56 自己的 LINE Developers 接好後才會跳轉授權。
          </p>
          <div className='mt-10 flex items-center justify-center gap-x-6'>
            <Button
              size='lg'
              variant='primary'
              className='bg-green-600 hover:bg-green-700 text-white font-semibold'
              onClick={goToEvents}
            >
              瀏覽活動
            </Button>
            <Button variant='outline' size='lg' onClick={scrollToLogin}>
              LINE 登入
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
