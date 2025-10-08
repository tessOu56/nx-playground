import * as React from 'react';
import { Outlet } from 'react-router-dom';

export const PublicLayout: React.FC = () => {
  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='container mx-auto px-4 py-8'>
        <div className='bg-white rounded-lg shadow-sm p-6'>
          <Outlet />
        </div>
      </div>
    </div>
  );
};
