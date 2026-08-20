'use client';

import { useLocale } from 'next-intl';

import { Badge, Button } from '@/components';
import { canStartLineLogin, useLiff } from '@/libs';
import { useLocalizedRouter } from '@/libs/i18n';

export function HeroSection() {
  const router = useLocalizedRouter();
  const locale = useLocale();
  const isEn = locale === 'en';
  const { isInitialized, login, error, isLoggedIn, profile } = useLiff();
  const lineLoginReady = canStartLineLogin();
  const displayName = profile?.displayName?.trim() || '';

  const goToEvents = () => {
    router.push('/events');
  };

  const goToOrders = () => {
    router.push('/orders');
  };

  const handleLineLogin = () => {
    if (!lineLoginReady) return;
    login();
  };

  return (
    <section className='relative overflow-hidden bg-white'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='relative z-10 mx-auto max-w-2xl text-center py-24'>
          <div className='mb-8'>
            <Badge className='mb-4'>
              {isEn ? 'Events · LINE login' : '活動發現與報名'}
            </Badge>
          </div>
          <h1 className='text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl'>
            NX Playground Events
          </h1>

          {isLoggedIn ? (
            <>
              <p className='mt-6 text-lg leading-8 text-gray-600'>
                {isEn
                  ? `Welcome back${displayName ? `, ${displayName}` : ''}. Browse events or open your tickets.`
                  : `歡迎回來${displayName ? `，${displayName}` : ''}。繼續瀏覽活動，或查看您的訂單與票券。`}
              </p>
              <div className='mt-10 flex items-center justify-center gap-x-6'>
                <Button
                  size='lg'
                  variant='primary'
                  className='bg-green-600 hover:bg-green-700 text-white font-semibold'
                  onClick={goToEvents}
                >
                  {isEn ? 'Browse events' : '瀏覽活動'}
                </Button>
                <Button variant='outline' size='lg' onClick={goToOrders}>
                  {isEn ? 'My orders' : '我的訂單'}
                </Button>
              </div>
            </>
          ) : (
            <>
              <p className='mt-6 text-lg leading-8 text-gray-600'>
                {isEn
                  ? 'Find events, sign in with LINE to register, and keep tickets on your account.'
                  : '發現活動、用 LINE 登入報名，票券與訂單會綁在您的帳號。'}
              </p>
              <div className='mt-10 flex items-center justify-center gap-x-6'>
                <Button
                  size='lg'
                  variant='primary'
                  className='bg-green-600 hover:bg-green-700 text-white font-semibold'
                  onClick={goToEvents}
                >
                  {isEn ? 'Browse events' : '瀏覽活動'}
                </Button>
                {lineLoginReady ? (
                  <Button
                    variant='outline'
                    size='lg'
                    onClick={handleLineLogin}
                    disabled={!isInitialized}
                  >
                    {isInitialized
                      ? isEn
                        ? 'Sign in with LINE'
                        : 'LINE 登入'
                      : isEn
                        ? 'Preparing…'
                        : '準備中…'}
                  </Button>
                ) : null}
              </div>
              {error ? (
                <p className='mt-4 text-sm text-red-700' role='alert'>
                  {isEn ? 'LINE sign-in failed. Please try again.' : 'LINE 登入失敗，請再試一次。'}
                </p>
              ) : null}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
