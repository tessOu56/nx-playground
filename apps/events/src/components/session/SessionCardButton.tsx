'use client';

import { Button } from '@/components';
import { cn } from '@/libs/css';
import type { Session } from '@/types';

interface SessionCardButtonProps {
  session: Session;
  isSelected?: boolean;
  onClick: (sessionId: string) => void;
  className?: string;
}

export function SessionCardButton({
  session,
  isSelected = false,
  onClick,
  className,
}: SessionCardButtonProps) {
  const handleClick = () => {
    onClick(session.id);
  };

  return (
    <Button
      onClick={handleClick}
      variant={isSelected ? 'primary' : 'secondary'}
      className={cn(
        'p-4 h-auto text-left transition-colors min-w-[200px] border-2',
        isSelected
          ? 'border-blue-500 bg-blue-50 hover:bg-blue-100'
          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50',
        className
      )}
    >
      <div className='flex flex-col items-start w-full'>
        <div className='font-medium text-gray-900 mb-1'>{session.name}</div>
        <div className='text-sm text-gray-600'>
          {session.date} {session.time}
        </div>
      </div>
    </Button>
  );
}
