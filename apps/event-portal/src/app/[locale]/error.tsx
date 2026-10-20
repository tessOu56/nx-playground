'use client';

import { AppErrorFallback } from '@/components/error/AppErrorFallback';

export default function LocaleError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <AppErrorFallback onRetry={reset} />;
}
