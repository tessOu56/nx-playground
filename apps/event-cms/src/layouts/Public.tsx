import * as React from 'react';
import { Outlet } from 'react-router-dom';

export const Public: React.FC = () => {
  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header */}
      <header className='bg-white shadow-sm border-b border-gray-200'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center h-16'>
            <div className='flex items-center'>
              <h1 className='text-xl font-semibold text-gray-900'>
                <span role='img' aria-label='logo'>
                  🚀
                </span>{' '}
                NX Playground Console
              </h1>
            </div>
            <div className='flex items-center space-x-4'>
              <span className='text-sm text-gray-500'>
                <span role='img' aria-label='version'>
                  📋
                </span>{' '}
                v1.0.0
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className='flex-1'>
        <Outlet />
      </main>

      {/* Footer */}
      <footer className='bg-white border-t border-gray-200'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4'>
          <div className='text-center text-sm text-gray-500'>
            <p>&copy; 2024 NX Playground. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
