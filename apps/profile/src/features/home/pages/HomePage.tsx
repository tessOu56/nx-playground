import { type FC } from 'react';

import {
  ContactSection,
  CoreStrengths,
  TechProfile,
  TechTimeline,
} from '../components';

export const HomePage: FC = () => {
  return (
    <div className='min-h-screen'>
      {/* 1. Hero Section with Background */}
      <TechProfile />

      {/* 2. Core Strengths */}
      <CoreStrengths />

      {/* 3. Tech Journey Timeline (2025 → 2019) */}
      <TechTimeline />

      {/* 4. Contact Section */}
      <ContactSection />
    </div>
  );
};
