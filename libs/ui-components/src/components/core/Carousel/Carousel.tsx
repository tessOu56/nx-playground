'use client';

import { type ReactNode, Children, isValidElement } from 'react';
import { Navigation, Pagination, FreeMode } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import { cn } from '../../../utils';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/free-mode';
import './Carousel.css';

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
  className = '',
  slidesPerView = 'auto',
  spaceBetween = 16,
  navigation = true,
  pagination = false,
  freeMode = false,
  showDots = false,
  breakpoints,
}: CarouselProps) {
  const modules = [];
  if (navigation) modules.push(Navigation);
  if (pagination) modules.push(Pagination);
  if (freeMode) modules.push(FreeMode);

  const defaultBreakpoints = {
    640: {
      slidesPerView: 2,
      spaceBetween: 16,
    },
    768: {
      slidesPerView: 3,
      spaceBetween: 20,
    },
    1024: {
      slidesPerView: 4,
      spaceBetween: 24,
    },
  };

  return (
    <div className={cn('relative', className)}>
      <Swiper
        modules={modules}
        slidesPerView={slidesPerView}
        spaceBetween={spaceBetween}
        navigation={navigation}
        pagination={showDots ? { clickable: true } : false}
        freeMode={freeMode}
        breakpoints={breakpoints ?? defaultBreakpoints}
        className='swiper-container'
      >
        {Children.map(children, (child, index) => {
          const key =
            isValidElement(child) && child.key ? child.key : `slide-${index}`;
          return (
            <SwiperSlide key={key} className='h-auto'>
              {child}
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
}
