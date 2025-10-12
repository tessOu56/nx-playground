import { Button } from '@nx-playground/ui-components';
import { Menu, Plus, Search } from 'lucide-react';
import * as React from 'react';
import { Outlet } from 'react-router-dom';

import { Breadcrumb, Sidebar, ThemeSwitcher } from '../components';

export type LayoutType = 'full' | 'sidebar-only' | 'content-only';

interface AppLayoutProps {
  type?: LayoutType;
  showBreadcrumb?: boolean;
  breadcrumbItems?: Array<{ label: string; path?: string }>;
  showSearch?: boolean;
  showCreateButton?: boolean;
  createButtonText?: string;
  onCreateClick?: () => void;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  type = 'full',
  showBreadcrumb = true,
  breadcrumbItems,
  showSearch = false,
  showCreateButton = false,
  createButtonText = '新增',
  onCreateClick,
  onSearchChange,
  searchPlaceholder = '搜尋...',
}) => {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(
    type === 'content-only'
  );
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState('');

  const handleMenuClick = () => {
    setMobileMenuOpen(true);
  };

  const handleSidebarClose = () => {
    setMobileMenuOpen(false);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearchValue(value);
    onSearchChange?.(value);
  };

  // 根據 layout 類型決定是否顯示麵包屑
  const shouldShowBreadcrumb = showBreadcrumb && type !== 'sidebar-only';

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
        {/* Header */}
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
              {shouldShowBreadcrumb && (
                <div className='hidden md:block'>
                  <Breadcrumb items={breadcrumbItems} />
                </div>
              )}
            </div>

            {/* Center Section - Search */}
            {showSearch && (
              <div className='flex-1 max-w-md mx-4'>
                <div className='relative'>
                  <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-secondary' />
                  <input
                    type='text'
                    placeholder={searchPlaceholder}
                    value={searchValue}
                    onChange={handleSearchChange}
                    className='w-full pl-10 pr-4 py-2 border border-border-primary rounded-lg bg-background-secondary text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent'
                  />
                </div>
              </div>
            )}

            {/* Right Section */}
            <div className='flex items-center space-x-4'>
              {/* Create Button */}
              {showCreateButton && (
                <Button
                  variant='default'
                  size='sm'
                  onClick={onCreateClick}
                  className='hidden md:flex'
                >
                  <Plus className='w-4 h-4 mr-2' />
                  {createButtonText}
                </Button>
              )}

              {/* Theme Switcher */}
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
