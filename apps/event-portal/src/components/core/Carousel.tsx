'use client';

import { Carousel as BaseCarousel } from '@nx-playground/ui-components';
import { type ReactNode } from 'react';

import { cn } from '@/libs/css';

interface CarouselProps {
  children: ReactNode[];
  className?: string;
  slidesPerView?: number | 'auto';
  spaceBetween?: number;
  navigation?: boolean;
  pagination?: boolean;
  freeMode?: boolean;
  showDots?: boolean;
  breakpoints?: {
    [width: number]: {
      slidesPerView: number | 'auto';
      spaceBetween: number;
    };
  };
}

export function Carousel({
  children,
  className,
  slidesPerView = 'auto',
  spaceBetween = 16,
  navigation = true,
  pagination = false,
  freeMode = false,
  showDots = false,
  breakpoints,
}: CarouselProps) {
  return (
    <BaseCarousel
      className={cn('w-full', className)}
      slidesPerView={slidesPerView}
      spaceBetween={spaceBetween}
      navigation={navigation}
      pagination={pagination}
      freeMode={freeMode}
      showDots={showDots}
      breakpoints={breakpoints}
    >
      {children}
    </BaseCarousel>
  );
}
