export function TicketSkeleton() {
  return (
    <div className='bg-white rounded-lg shadow-md p-6'>
      <div className='h-6 bg-gray-200 rounded mb-4 animate-pulse' />
      <div className='space-y-4'>
        {[1, 2].map(i => (
          <div key={i} className='h-32 bg-gray-200 rounded animate-pulse' />
        ))}
      </div>
    </div>
  );
}
