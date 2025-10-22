import { type FC, useRef } from 'react';

import { Footer } from '../../../components/layout/Footer';
import {
  ContactSection,
  CoreStrengths,
  TechProfile,
  TechTimeline,
} from '../components';

export const HomePage: FC = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <div
        ref={scrollContainerRef}
        className='snap-y snap-mandatory'
        style={{ scrollBehavior: 'smooth' }}
      >
        {/* 1. Hero Section with Background */}
        <div className='snap-start snap-always'>
          <TechProfile />
        </div>

        {/* 2. Tech Stack Carousel */}
        <div className='snap-start snap-always'>
          <CoreStrengths />
        </div>

        {/* 3. Tech Journey Timeline (2025 → 2019) */}
        <TechTimeline />

        {/* 4. Contact Section */}
        <div className='snap-start snap-always'>
          <ContactSection />
        </div>
      </div>

      {/* Footer at the end of content */}
      <Footer />
    </>
  );
};
