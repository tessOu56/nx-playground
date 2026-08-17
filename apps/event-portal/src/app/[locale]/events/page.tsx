import { DemoBanner } from './components/DemoBanner';
import { EventStackList } from './components/EventStackList';

export const dynamic = 'force-dynamic';

export default function EventsIndexPage() {
  return (
    <div className='mx-auto max-w-5xl px-4 py-10'>
      <DemoBanner />
      <h1 className='mb-2 text-2xl font-bold text-gray-900'>活動列表</h1>
      <p className='mb-8 text-sm text-gray-600'>
        資料來自 event-stack API（Nest :3001 或 api-mock :3011）。API
        關閉時會顯示錯誤，不會改塞假資料。
      </p>
      <EventStackList />
    </div>
  );
}
