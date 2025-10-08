import { Suspense } from 'react';

import { PageSkeleton } from '@/components/PageSkeleton';

export default function Loading() {
  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='page-container'>
        <Suspense fallback={<PageSkeleton />}>
          <PageSkeleton />
        </Suspense>
      </div>
    </div>
  );
}
