import { Button, useToast } from '@nx-playground/ui-components';
import {
  Calendar,
  FileText,
  Home,
  LayoutDashboard,
  Menu,
  Palette,
  Settings,
  Users,
  X,
  Bell,
} from 'lucide-react';
import * as React from 'react';
import { NavLink } from 'react-router-dom';

import { useSidebarTranslation } from './hooks/useSidebarTranslation';

interface SidebarProps {
  collapsed?: boolean;
  isMobile?: boolean;
  onClose?: () => void;
  onToggle?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed = false,
  isMobile = false,
  onClose,
  onToggle,
}) => {
  const { t } = useSidebarTranslation();
  const { addToast } = useToast();

  const menuItems = [
    {
      path: '/dashboard',
      label: t('sidebar.navigation.dashboard') as string,
      icon: LayoutDashboard,
    },
    {
      path: '/events',
      label: t('sidebar.navigation.events') as string,
      icon: Calendar,
    },
    {
      path: '/users',
      label: t('sidebar.navigation.users') as string,
      icon: Users,
    },
    {
      path: '/forms',
      label: t('sidebar.navigation.forms') as string,
      icon: FileText,
    },
    {
      path: '/components',
      label: t('sidebar.navigation.components') as string,
      icon: Palette,
    },
    {
      path: '/settings',
      label: t('sidebar.navigation.settings') as string,
      icon: Settings,
    },
  ];

  const handleToastTest = () => {
    addToast({
      message: `測試通知 ${Date.now()}！點擊按鈕可以執行自定義操作。`,
      type: 'success',
      duration: 5000,
      action: {
        label: '確定',
        onClick: () => {
          addToast({
            message: `你點擊了確定按鈕！${Date.now()}`,
            type: 'info',
            duration: 3000,
          });
        },
      },
    });
  };

  const sidebarContent = (
    <div
      className={`bg-background-secondary/95 backdrop-blur-sm text-text-primary h-full border-r border-border-primary ${
        collapsed ? 'w-16' : 'w-64'
      } transition-all duration-300`}
    >
      {/* Header */}
      <div className='p-4 border-b border-border-primary'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-3'>
            <div className='w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center'>
              <Home className='w-5 h-5 text-white' />
            </div>
            {!collapsed && (
              <h1 className='text-lg font-semibold'>
                {t('sidebar.title') as string}
              </h1>
            )}
          </div>
          <div className='flex items-center space-x-2'>
            {/* Desktop Toggle Button */}
            {!isMobile && onToggle && (
              <Button
                variant='ghost'
                size='sm'
                onClick={onToggle}
                className='hidden md:block'
              >
                <Menu className='w-5 h-5' />
              </Button>
            )}
            {/* Mobile Close Button */}
            {isMobile && onClose && (
              <Button
                variant='ghost'
                size='sm'
                onClick={onClose}
                className='md:hidden'
              >
                <X className='w-5 h-5' />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className='p-4'>
        <ul className='space-y-2'>
          {menuItems.map(item => {
            const Icon = item.icon;
            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-primary-100 text-primary-700 border-r-2 border-primary-600'
                        : 'text-text-secondary hover:bg-background-tertiary hover:text-text-primary'
                    }`
                  }
                  onClick={isMobile ? onClose : undefined}
                >
                  <Icon className='w-5 h-5 flex-shrink-0' />
                  {!collapsed && <span>{item.label}</span>}
                </NavLink>
              </li>
            );
          })}
        </ul>

        {/* Toast Test Button */}
        <div className='mt-6 pt-4 border-t border-border-primary'>
          <Button
            variant='outline'
            size='sm'
            onClick={handleToastTest}
            className='w-full justify-start'
          >
            <Bell className='w-4 h-4 mr-2' />
            {!collapsed && <span>測試 Toast</span>}
          </Button>
        </div>
      </nav>
    </div>
  );

  // 移動端：浮起覆蓋層
  if (isMobile) {
    return (
      <div className='fixed inset-0 z-50 md:hidden'>
        {/* 背景遮罩 */}
        <div
          className='fixed inset-0 bg-black/50 backdrop-blur-sm'
          onClick={onClose}
        />
        {/* Sidebar */}
        <div className='fixed left-0 top-0 h-full'>{sidebarContent}</div>
      </div>
    );
  }

  // 桌面端：固定側邊欄
  return sidebarContent;
};
