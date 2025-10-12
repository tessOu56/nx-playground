import { Suspense } from 'react';

import { FeedbackForm } from './components/FeedbackForm';
import { FeedbackSkeleton } from './components/FeedbackSkeleton';

export default function FeedbackPage() {
  return (
    <Suspense fallback={<FeedbackSkeleton />}>
      <FeedbackForm />
    </Suspense>
  );
}
