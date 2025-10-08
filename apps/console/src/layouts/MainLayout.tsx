import { Button } from '@nx-playground/ui-components';
import { Menu } from 'lucide-react';
import * as React from 'react';
import { Outlet } from 'react-router-dom';

import { Sidebar, ThemeSwitcher } from '../components';

export const MainLayout: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleMenuClick = () => {
    setMobileMenuOpen(true);
  };

  const handleSidebarClose = () => {
    setMobileMenuOpen(false);
  };

  return (
    <div className='flex h-screen bg-background-primary'>
      {/* Desktop Sidebar */}
      <div className='hidden md:block'>
        <Sidebar collapsed={sidebarCollapsed} />
      </div>

      {/* Mobile Sidebar */}
      {mobileMenuOpen && (
        <Sidebar
          collapsed={false}
          isMobile={true}
          onClose={handleSidebarClose}
        />
      )}

      {/* Main Content */}
      <div className='flex-1 flex flex-col overflow-hidden'>
        {/* Minimal Header - Only Menu Toggle and Theme Switcher */}
        <header className='bg-background-primary border-b border-border-primary px-4 py-3'>
          <div className='flex items-center justify-between'>
            {/* Left Section */}
            <div className='flex items-center space-x-4'>
              {/* Mobile Menu Button */}
              <Button
                variant='ghost'
                size='sm'
                onClick={handleMenuClick}
                className='md:hidden'
              >
                <Menu className='w-5 h-5' />
              </Button>

              {/* Desktop Toggle Button */}
              <Button
                variant='ghost'
                size='sm'
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className='hidden md:block'
              >
                <Menu className='w-5 h-5' />
              </Button>
            </div>

            {/* Right Section */}
            <div className='flex items-center space-x-4'>
              <ThemeSwitcher />
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className='flex-1 overflow-auto bg-background-primary'>
          <div className='p-6'>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
