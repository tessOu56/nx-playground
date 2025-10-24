import { type ImgHTMLAttributes, useState } from 'react';

interface OptimizedImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
}

/**
 * Optimized image component with lazy loading and blur placeholder
 */
export function OptimizedImage({
  src,
  alt,
  width,
  height,
  priority = false,
  className = '',
  ...props
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Generate optimized src (for future webp conversion)
  const optimizedSrc = src;

  return (
    <div className={`relative overflow-hidden ${className}`} style={{ width, height }}>
      {/* Blur placeholder */}
      {!isLoaded && !hasError && (
        <div className='absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse' />
      )}

      {/* Actual image */}
      <img
        src={optimizedSrc}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        {...props}
      />

      {/* Error fallback */}
      {hasError && (
        <div className='absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800'>
          <span className='text-sm text-gray-400'>Failed to load image</span>
        </div>
      )}
    </div>
  );
}

