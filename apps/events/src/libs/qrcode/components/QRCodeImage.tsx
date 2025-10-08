'use client';

import type { QRCodeTheme } from '../core/types';
import { useQRCodeImage } from '../hooks/useQRCodeImage';

export interface QRCodeImageProps {
  data: string;
  theme: QRCodeTheme;
  size?: number;
  className?: string;
  disabled?: boolean;
  showLoading?: boolean;
  onClick?: () => void;
}

export function QRCodeImage({
  data,
  theme,
  size = 300,
  className = '',
  disabled = false,
  showLoading = true,
  onClick,
}: QRCodeImageProps) {
  const { imageUrl, isLoading, error, isReady } = useQRCodeImage({
    data,
    theme,
    size,
    disabled,
  });

  return (
    <div className={`flex justify-center text-gray-600 ${className}`}>
      <div
        className={`border-2 border-gray-200 rounded-lg p-4 bg-white min-h-[200px] min-w-[200px] flex items-center justify-center ${
          onClick ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''
        }`}
        onClick={onClick}
        style={{ width: size + 32, height: size + 32 }}
      >
        {disabled ? (
          <div className='text-center text-gray-400'>
            <p className='text-xs'>QR Code 不可用</p>
          </div>
        ) : error ? (
          <div className='text-center text-red-500'>
            <p className='text-xs'>載入失敗</p>
            <p className='text-xs'>{error}</p>
          </div>
        ) : isLoading && showLoading ? (
          <div className='text-center'>
            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2' />
            <p className='text-xs text-gray-500'>生成中...</p>
          </div>
        ) : isReady && imageUrl ? (
          <img
            src={imageUrl}
            alt='QR Code'
            width={size}
            height={size}
            className='rounded'
          />
        ) : null}
      </div>
    </div>
  );
}
