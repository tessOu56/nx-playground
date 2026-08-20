import * as React from 'react';
import { Outlet } from 'react-router-dom';

import { OrganizerGate } from '../auth/OrganizerGate';

export const TopbarOnlyLayout: React.FC = () => {
  return (
    <OrganizerGate>
      <div className='flex h-screen bg-background-primary'>
        <div className='flex-1 flex flex-col overflow-hidden'>
          <main className='flex-1 overflow-auto bg-background-primary'>
            <Outlet />
          </main>
        </div>
      </div>
    </OrganizerGate>
  );
};
