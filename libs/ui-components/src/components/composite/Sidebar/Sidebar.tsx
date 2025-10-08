'use client';

import { X } from 'lucide-react';
import { type ReactNode, useState } from 'react';

import { cn } from '../../../utils';
import { Button } from '../../core/Button/Button';

interface SidebarProps {
  children: ReactNode;
  className?: string;
  trigger?: ReactNode;
  title?: string;
  description?: string;
  side?: 'left' | 'right';
  width?: string;
}

export function Sidebar({
  children,
  className,
  trigger,
  title,
  description,
  side = 'right',
  width = 'w-96',
}: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const defaultTrigger = (
    <Button
      variant='outline'
      size='icon'
      className='fixed top-4 right-4 z-50'
      onClick={() => setIsOpen(!isOpen)}
      aria-label={isOpen ? '關閉側邊欄' : '開啟側邊欄'}
    >
      {isOpen ? <X className='h-4 w-4' /> : '⚙️'}
    </Button>
  );

  return (
    <>
      {/* 觸發按鈕 */}
      {trigger ?? defaultTrigger}

      {/* 遮罩 */}
      {isOpen && (
        <div
          className='fixed inset-0 bg-black/50 z-40'
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* 側邊欄內容 */}
      <div
        className={cn(
          'fixed top-0 h-full bg-background shadow-xl z-50 transform transition-transform duration-300 ease-in-out',
          width,
          side === 'right' ? 'right-0' : 'left-0',
          isOpen
            ? 'translate-x-0'
            : side === 'right'
            ? 'translate-x-full'
            : '-translate-x-full',
          className
        )}
      >
        <div className='h-full overflow-y-auto p-6'>
          {/* 標題區域 */}
          {(title ?? description) && (
            <div className='mb-8'>
              {title && (
                <h2 className='text-lg font-semibold text-foreground mb-2'>
                  {title}
                </h2>
              )}
              {description && (
                <p className='text-sm text-muted-foreground'>{description}</p>
              )}
            </div>
          )}

          {/* 內容 */}
          {children}

          {/* 關閉按鈕 */}
          <Button
            variant='outline'
            className='w-full mt-8'
            onClick={() => setIsOpen(false)}
          >
            關閉側邊欄
          </Button>
        </div>
      </div>
    </>
  );
}
