'use client';

import { Image } from '@/components';

interface CoverImageProps {
  src: string;
  alt?: string;
  caption?: string;
  className?: string;
}

export function CoverImage({
  src,
  alt = '活動圖片',
  caption,
  className = '',
}: CoverImageProps) {
  return (
    <div className={`my-6 ${className}`}>
      <Image
        src={src}
        alt={alt}
        width={800}
        height={400}
        className='w-full h-auto rounded-lg shadow-sm'
        fallback='/placeholder-event.jpg'
      />
      {caption && (
        <p className='text-sm text-gray-500 mt-2 text-center'>{caption}</p>
      )}
    </div>
  );
}
