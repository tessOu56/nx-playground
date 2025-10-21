import { type FC } from 'react';

import { ContactSection, SkillCloud, TechProfile } from '../components';

export const HomePage: FC = () => {
  return (
    <div className='min-h-screen'>
      {/* Hero Section */}
      <TechProfile />
      
      {/* Tech Skills Section */}
      <div className='border-t'>
        <SkillCloud />
      </div>
      
      {/* Contact Section */}
      <div className='border-t bg-muted/30'>
        <ContactSection />
      </div>
    </div>
  );
};

