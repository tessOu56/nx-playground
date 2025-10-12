'use client';

import { useEffect, useRef } from 'react';

import { useQRCodeImage } from '../hooks/useQRCodeImage';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: string;
  theme: 'order' | 'checkin';
  title?: string;
}

export function QRCodeModal({
  isOpen,
  onClose,
  data,
  theme,
  title = 'QR Code',
}: QRCodeModalProps) {
  // 使用純 React 的圖片方法
  const { imageUrl, isLoading, error } = useQRCodeImage({
    data: isOpen ? data : '', // 只在 Modal 開啟時生成
    theme,
    size: 400,
    disabled: !isOpen,
  });

  const modalRef = useRef<HTMLDivElement>(null);

  // 處理點擊背景關閉
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === modalRef.current) {
      onClose();
    }
  };

  // 處理 ESC 鍵關閉
  useEffect(() => {
    if (!isOpen) return;

    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    // 添加事件監聽器和設置樣式
    document.addEventListener('keydown', handleEscapeKey);
    document.body.style.overflow = 'hidden';

    // 清理函數
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]); // 移除 onClose 依賴，避免不必要的重新執行

  if (!isOpen) return null;

  return (
    <div
      ref={modalRef}
      className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4'
      onClick={handleBackdropClick}
    >
      <div className='relative bg-white rounded-lg shadow-2xl max-w-md w-full max-h-[90vh] overflow-auto'>
        {/* 關閉按鈕 */}
        <button
          onClick={onClose}
          className='absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full transition-colors'
          aria-label='關閉'
        >
          <svg
            className='w-5 h-5 text-gray-600'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M6 18L18 6M6 6l12 12'
            />
          </svg>
        </button>

        {/* Modal 內容 */}
        <div className='p-8 text-center'>
          <h3 className='text-xl font-semibold text-gray-900 mb-6'>{title}</h3>

          {/* 放大的 QR Code */}
          <div className='flex justify-center'>
            <div className='border-2 border-gray-200 rounded-lg p-4 bg-white min-h-[400px] min-w-[400px] flex items-center justify-center'>
              {error ? (
                <div className='text-center text-red-500'>
                  <p className='text-sm'>載入失敗</p>
                  <p className='text-xs'>{error}</p>
                </div>
              ) : isLoading ? (
                <div className='text-center'>
                  <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4' />
                  <p className='text-sm text-gray-500'>生成中...</p>
                </div>
              ) : imageUrl ? (
                <img
                  src={imageUrl}
                  alt='QR Code'
                  width={400}
                  height={400}
                  className='rounded'
                />
              ) : null}
            </div>
          </div>

          <p className='text-sm text-gray-600 mt-4'>
            點擊 QR Code 外的區域或按 ESC 鍵關閉
          </p>
        </div>
      </div>
    </div>
  );
}
