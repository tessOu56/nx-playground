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

  const goToOrders = () => {
    router.push('/orders');
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
            使用您的 LINE
            帳號登入，連接活動主辦方與參與者，提供簡化的活動發現和報名體驗
          </p>
          <div className='mt-10 flex items-center justify-center gap-x-6'>
            <Button
              size='lg'
              variant='primary'
              className='bg-green-600 hover:bg-green-700 text-white font-semibold'
              onClick={scrollToLogin}
            >
              立即登入
            </Button>
            <Button variant='outline' size='lg' onClick={goToOrders}>
              查看我的訂單
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
