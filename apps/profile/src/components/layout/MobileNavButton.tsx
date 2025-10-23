interface MobileNavButtonProps {
  path: string;
  label: string;
  isActive: boolean;
  headerDark: boolean;
  onClick: () => void;
}

export function MobileNavButton({
  path: _path,
  label,
  isActive,
  headerDark,
  onClick,
}: MobileNavButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`relative px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
        headerDark
          ? 'text-white hover:text-white/90 hover:bg-white/10'
          : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
      } ${
        isActive
          ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
          : ''
      }`}
    >
      {label}
    </button>
  );
}
