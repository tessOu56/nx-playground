import { Button } from '@nx-playground/ui-components';
import { Menu, Plus, Search } from 'lucide-react';
import { type ChangeEvent, useState, type FC } from 'react';

import { Breadcrumb } from './Breadcrumb';
import { ThemeSwitcher } from './ThemeSwitcher';

interface TopBarProps {
  showBreadcrumb?: boolean;
  breadcrumbItems?: Array<{ label: string; path?: string }>;
  showSearch?: boolean;
  showCreateButton?: boolean;
  createButtonText?: string;
  onCreateClick?: () => void;
  onMenuClick?: () => void;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
}

export const TopBar: FC<TopBarProps> = ({
  showBreadcrumb = true,
  breadcrumbItems,
  showSearch = false,
  showCreateButton = false,
  createButtonText = '新增',
  onCreateClick,
  onMenuClick,
  onSearchChange,
  searchPlaceholder = '搜尋...',
}) => {
  const [searchValue, setSearchValue] = useState('');

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearchValue(value);
    onSearchChange?.(value);
  };

  return (
    <header className='bg-background-primary border-b border-border-primary px-4 py-3'>
      <div className='flex items-center justify-between'>
        {/* Left Section */}
        <div className='flex items-center space-x-4'>
          {/* Mobile Menu Button */}
          <Button
            variant='ghost'
            size='sm'
            onClick={onMenuClick}
            className='md:hidden'
          >
            <Menu className='w-5 h-5' />
          </Button>

          {/* Breadcrumb */}
          {showBreadcrumb && (
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
  );
};
