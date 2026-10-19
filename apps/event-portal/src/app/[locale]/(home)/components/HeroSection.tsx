'use client';

import { useLocale } from 'next-intl';

import { Badge, Button } from '@/components';
import { LineOfficialCta } from '@/components/line/LineOfficialCta';
import { canStartLineLogin, useLiff } from '@/libs';
import { demoCopy, useLocalizedRouter } from '@/libs/i18n';

export function HeroSection() {
  const router = useLocalizedRouter();
  const locale = useLocale();
  const copy = demoCopy(locale);
  const { isInitialized, login, error, isLoggedIn, profile } = useLiff();
  const lineLoginReady = canStartLineLogin();
  const displayName = profile?.displayName?.trim() ?? '';

  const goToEvents = () => {
    router.push('/events');
  };

  const handleLineLogin = () => {
    if (!lineLoginReady) return;
    login();
  };

  return (
    <section className='relative overflow-hidden border-b border-gray-200 bg-white'>
      <div className='mx-auto max-w-6xl px-4 sm:px-6 lg:px-8'>
        <div className='relative z-10 mx-auto max-w-2xl py-16 text-center sm:py-24'>
          <Badge className='mb-5'>{copy.homeBadge}</Badge>
          <h1 className='text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl'>
            {copy.homeTitle}
          </h1>

          {isLoggedIn ? (
            <>
              <p className='mt-6 text-lg leading-8 text-gray-600'>
                {copy.welcomeBack(displayName)}
              </p>
              <div className='mt-10 flex flex-wrap items-center justify-center gap-3'>
                <Button size='lg' variant='primary' onClick={goToEvents}>
                  {copy.browse}
                </Button>
                <LineOfficialCta locale={locale} />
              </div>
            </>
          ) : (
            <>
              <p className='mt-6 text-lg leading-8 text-gray-600'>
                {copy.homeLead}
              </p>
              <div className='mt-10 flex flex-wrap items-center justify-center gap-3'>
                <Button size='lg' variant='primary' onClick={goToEvents}>
                  {copy.browse}
                </Button>
                {lineLoginReady ? (
                  <Button
                    variant='outline'
                    size='lg'
                    onClick={handleLineLogin}
                    disabled={!isInitialized}
                  >
                    {isInitialized ? copy.lineLogin : copy.linePreparing}
                  </Button>
                ) : null}
                <LineOfficialCta locale={locale} />
              </div>
              {error ? (
                <p className='mt-4 text-sm text-red-700' role='alert'>
                  {copy.lineLoginError}
                </p>
              ) : null}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
