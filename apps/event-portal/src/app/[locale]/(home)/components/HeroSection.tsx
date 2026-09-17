'use client';

import { useLocale } from 'next-intl';

import { Badge, Button } from '@/components';
import { canStartLineLogin, useLiff } from '@/libs';
import { demoCopy, useLocalizedRouter } from '@/libs/i18n';

export function HeroSection() {
  const router = useLocalizedRouter();
  const locale = useLocale();
  const copy = demoCopy(locale);
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
            <Badge className='mb-4'>{copy.homeBadge}</Badge>
          </div>
          <h1 className='text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl'>
            NX Playground Events
          </h1>

          {isLoggedIn ? (
            <>
              <p className='mt-6 text-lg leading-8 text-gray-600'>
                {copy.welcomeBack(displayName)}
              </p>
              <div className='mt-10 flex items-center justify-center gap-x-6'>
                <Button
                  size='lg'
                  variant='primary'
                  className='bg-green-600 hover:bg-green-700 text-white font-semibold'
                  onClick={goToEvents}
                >
                  {copy.browse}
                </Button>
                <Button variant='outline' size='lg' onClick={goToOrders}>
                  {copy.myOrders}
                </Button>
              </div>
            </>
          ) : (
            <>
              <p className='mt-6 text-lg leading-8 text-gray-600'>
                {copy.homeLead}
              </p>
              <div className='mt-10 flex items-center justify-center gap-x-6'>
                <Button
                  size='lg'
                  variant='primary'
                  className='bg-green-600 hover:bg-green-700 text-white font-semibold'
                  onClick={goToEvents}
                >
                  {copy.browse}
                </Button>
                {lineLoginReady ? (
                  <Button
                    variant='outline'
                    size='lg'
                    onClick={handleLineLogin}
                    disabled={!isInitialized}
                  >
                    {isInitialized
                      ? locale === 'en'
                        ? 'Sign in with LINE'
                        : 'LINE 登入'
                      : locale === 'en'
                        ? 'Preparing…'
                        : '準備中…'}
                  </Button>
                ) : null}
              </div>
              {error ? (
                <p className='mt-4 text-sm text-red-700' role='alert'>
                  {locale === 'en'
                    ? 'LINE sign-in failed. Please try again.'
                    : 'LINE 登入失敗，請再試一次。'}
                </p>
              ) : null}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
