interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'blue' | 'purple' | 'white';
  text?: string;
}

export function LoadingSpinner({ 
  size = 'md', 
  color = 'blue',
  text 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  const colorClasses = {
    blue: 'border-blue-600',
    purple: 'border-purple-600',
    white: 'border-white',
  };

  const textColorClasses = {
    blue: 'text-gray-600 dark:text-gray-400',
    purple: 'text-purple-600 dark:text-purple-400',
    white: 'text-white',
  };

  return (
    <div className='flex flex-col items-center justify-center gap-3'>
      <div
        className={`${sizeClasses[size]} ${colorClasses[color]} animate-spin rounded-full border-b-2`}
        role='status'
        aria-label='Loading'
      />
      {text && (
        <p className={`text-sm ${textColorClasses[color]}`}>
          {text}
        </p>
      )}
    </div>
  );
}

