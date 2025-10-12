import { SkeletonCard } from '@/components/core';

export function EventListSkeleton() {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
      {Array.from({ length: 3 }, (_, index) => (
        <SkeletonCard
          key={`event-skeleton-${index}`}
          className='border rounded-lg'
          showAvatar={false}
          titleLines={2}
          contentLines={4}
        />
      ))}
    </div>
  );
}
