import type { ReactNode } from 'react';

interface NavButtonProps {
  path: string;
  label: string;
  isActive: boolean;
  headerDark: boolean;
  onClick: () => void;
  icon?: ReactNode;
  showLoading?: boolean;
}

export function NavButton({
  path: _path,
  label,
  isActive,
  headerDark,
  onClick,
  icon,
  showLoading = false,
}: NavButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`group relative px-4 py-2 text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
        headerDark
          ? 'text-white hover:text-white/90'
          : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
      } ${isActive ? 'text-blue-600 dark:text-blue-400' : ''}`}
    >
      {icon}
      <span>{label}</span>
      {showLoading && !isActive && <span className='thinking-dots' />}
      {/* Active underline */}
      {isActive && (
        <div className='absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400' />
      )}
      {/* Hover underline */}
      <div className='absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 w-0 transition-all duration-300 group-hover:w-full' />
    </button>
  );
}
