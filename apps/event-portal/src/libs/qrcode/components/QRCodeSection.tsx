'use client';

import { Button } from '@nx-playground/ui-components';
import { useState } from 'react';

import type { QRCodeSectionProps } from '../core/types';
import { useQRCodeImage } from '../hooks/useQRCodeImage';

import { QRCodeImage } from './QRCodeImage';
import { QRCodeModal } from './QRCodeModal';

export function QRCodeSection({
  data,
  theme,
  modalTitle,
  size = 200,
  description,
  hint,
  disabled = false,
  actions = [],
  clickToEnlarge = true,
  className = '',
}: QRCodeSectionProps) {
  const [isQRCodeModalOpen, setIsQRCodeModalOpen] = useState(false);

  // 使用純 React 的圖片方法
  const { downloadImage } = useQRCodeImage({
    data,
    theme,
    size,
    disabled,
  });

  const handleQRCodeClick = () => {
    if (clickToEnlarge && !disabled) {
      setIsQRCodeModalOpen(true);
    }
  };

  const renderButtons = () => {
    if (actions.length === 0) return null;

    return (
      <div className='flex flex-col space-y-3 w-full max-w-xs'>
        {actions.map(action => (
          <Button
            key={action.id}
            onClick={() => {
              // 如果是下載動作，使用新的下載方法
              if (action.id === 'download') {
                downloadImage(`qrcode-${theme}`);
              } else {
                action.onClick();
              }
            }}
            variant={action.variant ?? 'primary'}
            size='lg'
            disabled={action.disabled ?? disabled}
            className={`w-full ${action.className ?? ''}`}
          >
            {action.isLoading && action.loadingLabel
              ? action.loadingLabel
              : action.label}
          </Button>
        ))}
      </div>
    );
  };

  return (
    <div className={`text-center text-gray-600 ${className}`}>
      {/* 描述文字 */}
      {description && <p className='mb-6'>{description}</p>}

      {/* QR Code - 純 React 圖片方式 */}
      <div className='mb-6'>
        <QRCodeImage
          data={data}
          theme={theme}
          size={size}
          disabled={disabled}
          showLoading={true}
          onClick={clickToEnlarge && !disabled ? handleQRCodeClick : undefined}
          className='mx-auto mb-4'
        />

        {/* 提示文字 */}
        {hint && <p className='text-xs text-gray-500 mt-2'>{hint}</p>}
      </div>

      {/* 操作按鈕 */}
      <div className='flex flex-col items-center justify-center space-y-4'>
        {renderButtons()}
      </div>

      {/* QR Code 放大 Modal */}
      <QRCodeModal
        isOpen={isQRCodeModalOpen}
        onClose={() => setIsQRCodeModalOpen(false)}
        data={data}
        theme={theme}
        title={modalTitle}
      />
    </div>
  );
}
