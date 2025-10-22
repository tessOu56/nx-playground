import { type FC } from 'react';

import {
  ContactSection,
  CoreStrengths,
  ExperienceTimeline,
  FeaturedProjects,
  SkillCloud,
  TechProfile,
} from '../components';

export const HomePage: FC = () => {
  return (
    <div className='min-h-screen'>
      {/* 1. Hero Section */}
      <TechProfile />

      {/* 2. Core Strengths */}
      <CoreStrengths />

      {/* 3. Featured Projects */}
      <FeaturedProjects />

      {/* 4. Experience Timeline */}
      <ExperienceTimeline />

      {/* 5. Tech Stack */}
      <div className='border-t'>
        <SkillCloud />
      </div>

      {/* 6. Contact Section */}
      <ContactSection />
    </div>
  );
};
