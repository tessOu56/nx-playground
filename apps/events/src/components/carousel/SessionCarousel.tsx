'use client';

import { Carousel } from '@nx-playground/ui-components';
import type { ReactNode } from 'react';

interface SessionCarouselProps {
  children: ReactNode[];
  className?: string;
}

export function SessionCarousel({ children, className }: SessionCarouselProps) {
  return (
    <Carousel
      className={className}
      slidesPerView='auto'
      spaceBetween={12}
      navigation={true}
      pagination={false}
      freeMode={false}
      breakpoints={{
        640: {
          slidesPerView: 2,
          spaceBetween: 12,
        },
        768: {
          slidesPerView: 3,
          spaceBetween: 16,
        },
        1024: {
          slidesPerView: 4,
          spaceBetween: 20,
        },
      }}
    >
      {children}
    </Carousel>
  );
}
