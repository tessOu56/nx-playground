import type { ReactNode } from 'react';

interface MobileNavButtonProps {
  path: string;
  label: string;
  isActive: boolean;
  headerDark: boolean;
  onClick: () => void;
  icon?: ReactNode;
  showLoading?: boolean;
}

export function MobileNavButton({
  path: _path,
  label,
  isActive,
  headerDark,
  onClick,
  icon,
  showLoading = false,
}: MobileNavButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`group relative px-2 py-2 text-xs sm:text-sm font-medium transition-all duration-200 flex items-center gap-1.5 flex-1 justify-center min-w-0 ${
        headerDark
          ? 'text-white hover:text-white/90'
          : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
      } ${isActive ? 'text-blue-600 dark:text-blue-400' : ''}`}
    >
      {icon}
      <span className='truncate'>{label}</span>
      {/* Always reserve space for thinking dots to prevent layout shift */}
      <span className='w-4 inline-block'>
        {showLoading && !isActive && <span className='thinking-dots' />}
      </span>
      {/* Active underline */}
      {isActive && (
        <div className='absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400' />
      )}
      {/* Hover underline */}
      <div className='absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 w-0 transition-all duration-300 group-hover:w-full' />
    </button>
  );
}
