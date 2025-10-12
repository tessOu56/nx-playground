import { Button } from '@nx-playground/ui-components';
import { Menu } from 'lucide-react';
import * as React from 'react';
import { Outlet } from 'react-router-dom';

import { Breadcrumb, Sidebar, ThemeSwitcher } from '../components';

export const ContentLayout: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(true); // 預設收起
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleMenuClick = () => {
    setMobileMenuOpen(true);
  };

  const handleSidebarClose = () => {
    setMobileMenuOpen(false);
  };

  return (
    <div className='flex h-screen bg-background-primary'>
      {/* Desktop Sidebar - Always Collapsed */}
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
        {/* Header with Breadcrumb */}
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

              {/* Breadcrumb */}
              <div className='hidden md:block'>
                <Breadcrumb />
              </div>
            </div>

            {/* Right Section */}
            <div className='flex items-center space-x-4'>
              <ThemeSwitcher />
            </div>
          </div>
        </header>

        {/* Main Content Area - Full Width */}
        <main className='flex-1 overflow-auto bg-background-primary'>
          <div className='p-6'>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
