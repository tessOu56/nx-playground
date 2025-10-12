'use client';

import NextImage, { type ImageProps as NextImageProps } from 'next/image';
import { forwardRef } from 'react';

interface ImageProps extends Omit<NextImageProps, 'src'> {
  src: string;
  alt: string;
  fallback?: string;
  className?: string;
}

export const Image = forwardRef<HTMLImageElement, ImageProps>(
  (
    { src, alt, fallback = '/placeholder-image.png', className = '', ...props },
    ref
  ) => {
    return (
      <NextImage
        ref={ref}
        src={src}
        alt={alt}
        className={className}
        onError={e => {
          // 如果圖片載入失敗，使用 fallback
          const target = e.target as HTMLImageElement;
          if (target.src !== fallback) {
            target.src = fallback;
          }
        }}
        {...props}
      />
    );
  }
);

Image.displayName = 'Image';
