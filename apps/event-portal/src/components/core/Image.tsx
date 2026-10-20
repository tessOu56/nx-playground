'use client';

import NextImage, { type ImageProps as NextImageProps } from 'next/image';
import { forwardRef, useState } from 'react';

import {
  PLACEHOLDER_EVENT_IMAGE,
  catalogImageSrc,
  shouldOptimizeCatalogImage,
} from '@/libs/api/catalog-image';

interface ImageProps extends Omit<NextImageProps, 'src'> {
  src: string;
  alt: string;
  fallback?: string;
  className?: string;
}

export const Image = forwardRef<HTMLImageElement, ImageProps>(
  (
    {
      src,
      alt,
      fallback = PLACEHOLDER_EVENT_IMAGE,
      className = '',
      ...props
    },
    ref
  ) => {
    const resolved = catalogImageSrc(src);
    const fallbackSrc = catalogImageSrc(fallback);
    const [failed, setFailed] = useState(false);
    const active = failed ? fallbackSrc : resolved;

    const handleError = () => {
      if (!failed) setFailed(true);
    };

    if (!shouldOptimizeCatalogImage(active)) {
      return (
        // Native img: SVG placeholders and third-party CDNs are not in the optimizer allowlist.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          ref={ref}
          src={active}
          alt={alt}
          width={props.width}
          height={props.height}
          className={className}
          decoding='async'
          onError={handleError}
        />
      );
    }

    return (
      <NextImage
        ref={ref}
        src={active}
        alt={alt}
        className={className}
        onError={handleError}
        {...props}
      />
    );
  }
);

Image.displayName = 'Image';
