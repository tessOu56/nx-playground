import { Suspense } from 'react';

import { NotFoundActions } from './components/NotFoundActions';
import { NotFoundSkeleton } from './components/NotFoundSkeleton';

export default function NotFoundPage() {
  return (
    <Suspense fallback={<NotFoundSkeleton />}>
      <NotFoundActions />
    </Suspense>
  );
}
