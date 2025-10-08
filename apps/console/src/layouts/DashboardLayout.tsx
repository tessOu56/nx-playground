import { Button } from '@nx-playground/ui-components';
import { Menu } from 'lucide-react';
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';

import { Sidebar } from '../components';

export const DashboardLayout: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSidebarToggle = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleSidebarClose = () => {
    setMobileMenuOpen(false);
  };

  return (
    <div className='flex h-screen bg-background-primary'>
      {/* Desktop Sidebar */}
      <div className='hidden md:block'>
        <Sidebar collapsed={sidebarCollapsed} onToggle={handleSidebarToggle} />
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
        {/* Mobile Menu Button */}
        <div className='md:hidden fixed top-4 left-4 z-50'>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => setMobileMenuOpen(true)}
            className='bg-background-secondary/95 backdrop-blur-sm border border-border-primary'
          >
            <Menu className='w-5 h-5' />
          </Button>
        </div>

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
