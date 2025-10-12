'use client';

import { Image, LineOfficialChannelButton } from '@/components';
import { useCurrentVendor } from '@/libs';
import { useLocalizedRouter } from '@/libs/i18n';
import type { EventDetail } from '@/types';

interface EventInfoHeaderProps {
  event: EventDetail;
  eventId: string;
}

export function EventInfoHeader({
  event,
  eventId: _eventId,
}: EventInfoHeaderProps) {
  const router = useLocalizedRouter();
  const { lineSettings } = useCurrentVendor();

  const handleVendorDetail = () => {
    if (event.vendorId) {
      router.push(`/vendors/${event.vendorId}`);
    }
  };

  return (
    <div className='space-y-6'>
      {/* 活動基本資料 */}
      <div className='bg-white rounded-lg shadow-md overflow-hidden'>
        {/* 活動封面 */}
        <div className='h-64 relative'>
          <Image
            src={event.image}
            alt={event.title}
            width={800}
            height={256}
            className='w-full h-full object-cover'
            fallback='/placeholder-event.jpg'
          />

          {/* 分類標籤 - 左上角 */}
          <div className='absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full'>
            <span className='text-sm font-medium text-gray-700'>
              {event.category}
            </span>
          </div>

          {/* 主辦方資訊 - 左下角 */}
          <div className='absolute bottom-6 left-4 flex items-center space-x-3 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg'>
            <div className='w-12 h-12 rounded-full overflow-hidden bg-white border-2 border-white'>
              <Image
                src={lineSettings?.pictureUrl ?? ''}
                alt={`${lineSettings?.displayName ?? '主辦方'} logo`}
                width={48}
                height={48}
                className='w-full h-full object-cover'
                fallback='/placeholder-avatar.jpg'
              />
            </div>
            <span className='text-sm font-medium text-gray-900'>
              {lineSettings?.displayName ?? '主辦方'}
            </span>
          </div>

          {/* 加入 LINE 官方頻道按鈕 - 右下角 */}
          <div className='absolute bottom-4 right-4'>
            <LineOfficialChannelButton onClick={handleVendorDetail} size='md'>
              加入 LINE
            </LineOfficialChannelButton>
          </div>
        </div>

        {/* 活動資訊 */}
        <div className='p-6'>
          <h1 className='text-3xl font-bold text-gray-900 mb-4'>
            {event.title}
          </h1>
          <p className='text-gray-600 mb-6 text-lg leading-relaxed'>
            {event.description}
          </p>
          <p className='flex items-center text-gray-600'>
            <span className='w-4 h-4 mr-2' role='img' aria-label='地點'>
              📍
            </span>
            {event.location}
          </p>
        </div>
      </div>
    </div>
  );
}
