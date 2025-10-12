'use client';

import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';

import { withLocale } from '../localeRoutes';

/**
 * 提供帶 locale 支援的 router hook
 */
export function useLocalizedRouter() {
  const router = useRouter();
  const locale = useLocale();

  return {
    push: (path: string) => {
      const localizedPath = withLocale(path, locale);
      router.push(localizedPath);
    },
    replace: (path: string) => {
      const localizedPath = withLocale(path, locale);
      router.replace(localizedPath);
    },
    back: () => router.back(),
    forward: () => router.forward(),
    refresh: () => router.refresh(),
  };
}
