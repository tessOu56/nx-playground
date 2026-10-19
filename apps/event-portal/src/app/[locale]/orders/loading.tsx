import { Skeleton } from '@/components/core';

export default function OrdersLoading() {
  return (
    <div className='mx-auto max-w-xl px-4 py-16' aria-busy='true'>
      <Skeleton className='mx-auto h-8 w-48' />
      <Skeleton className='mx-auto mt-4 h-4 w-72 max-w-full' />
      <div className='mt-8 flex justify-center gap-3'>
        <Skeleton className='h-10 w-32' />
        <Skeleton className='h-10 w-32' />
      </div>
    </div>
  );
}
