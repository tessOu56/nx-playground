import { type FC, useEffect } from 'react';

import { Footer } from '../../../components/layout/Footer';
import {
  ContactSection,
  CoreStrengths,
  TechProfile,
  TechTimeline,
} from '../components';
import './HomePage.css';

export const HomePage: FC = () => {
  // Enable scroll snap on document for home page
  useEffect(() => {
    document.documentElement.style.scrollSnapType = 'y mandatory';
    document.documentElement.style.scrollBehavior = 'smooth';

    return () => {
      document.documentElement.style.scrollSnapType = '';
      document.documentElement.style.scrollBehavior = '';
    };
  }, []);

  return (
    <>
      {/* 1. Hero Section with Background */}
      <section className='snap-start snap-always'>
        <TechProfile />
      </section>

      {/* 2. Tech Stack Carousel */}
      <section className='snap-start snap-always'>
        <CoreStrengths />
      </section>

      {/* 3. Tech Journey Timeline (2025 → 2019) */}
      <TechTimeline />

      {/* 4. Contact Section with Footer overlay */}
      <section className='snap-start snap-always h-screen relative'>
        <ContactSection />
        {/* Footer overlay at bottom */}
        <div className='absolute bottom-0 left-0 right-0'>
          <Footer />
        </div>
      </section>
    </>
  );
};
