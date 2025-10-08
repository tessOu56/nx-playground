'use client';

import { useState, useEffect } from 'react';

import type { QRCodeTheme } from '../core/types';
import { getThemeColors } from '../core/utils';

export interface UseQRCodeImageOptions {
  data: string;
  theme: QRCodeTheme;
  size?: number;
  disabled?: boolean;
}

export function useQRCodeImage({
  data,
  theme,
  size = 300,
  disabled = false,
}: UseQRCodeImageOptions) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!data || disabled) {
      setImageUrl(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    // 創建 QR Code 並轉換為圖片 URL
    import('qr-code-styling')
      .then(({ default: QRCodeStyling }) => {
        const colors = getThemeColors(theme);

        const qrCode = new QRCodeStyling({
          width: size,
          height: size,
          type: 'canvas',
          data,
          dots: {
            color: colors.dots,
            type: 'square',
          },
          background: colors.background,
          cornersSquare: {
            type: 'square',
            color: colors.corners,
          },
          cornersDot: {
            type: 'square',
            color: colors.corners,
          },
          margin: 8,
        });

        // 創建臨時容器來生成圖片
        const tempDiv = document.createElement('div');
        tempDiv.style.position = 'absolute';
        tempDiv.style.left = '-9999px';
        document.body.appendChild(tempDiv);

        qrCode.append(tempDiv);

        // 等待渲染完成後獲取圖片
        setTimeout(() => {
          const canvas = tempDiv.querySelector('canvas');
          if (canvas) {
            const dataUrl = canvas.toDataURL('image/png');
            setImageUrl(dataUrl);
            setIsLoading(false);
          } else {
            setError('無法生成 QR Code 圖片');
            setIsLoading(false);
          }

          // 清理臨時容器
          document.body.removeChild(tempDiv);
        }, 100);
      })
      .catch(err => {
        setError('載入失敗');
        setIsLoading(false);
        console.error('Failed to create QR Code:', err);
      });
  }, [data, theme, size, disabled]);

  // 下載圖片的函數
  const downloadImage = (filename = 'qrcode') => {
    if (!imageUrl) return;

    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `${filename}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return {
    imageUrl,
    isLoading,
    error,
    isReady: !!imageUrl && !isLoading && !error,
    downloadImage,
  };
}
