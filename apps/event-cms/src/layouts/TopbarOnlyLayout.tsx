import * as React from 'react';
import { Outlet } from 'react-router-dom';

export const TopbarOnlyLayout: React.FC = () => {
  return (
    <div className='flex h-screen bg-background-primary'>
      <div className='flex-1 flex flex-col overflow-hidden'>
        <main className='flex-1 overflow-auto bg-background-primary'>
          <Outlet />
        </main>
      </div>
    </div>
  );
};
