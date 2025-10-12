import type { default as QRCodeStyling } from 'qr-code-styling';

/**
 * 下載 QR Code 為圖片
 */
export async function downloadQRCode(
  qrCodeInstance: QRCodeStyling,
  filename = 'qrcode',
  format: 'png' | 'svg' = 'png'
): Promise<void> {
  try {
    qrCodeInstance.download({
      name: filename,
      extension: format,
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('下載 QR Code 失敗:', error);
    throw new Error('下載失敗');
  }
}

/**
 * 分享 QR Code 圖片到 LINE
 */
export async function shareQRCodeImage(
  qrCodeInstance: QRCodeStyling,
  message: string
): Promise<void> {
  try {
    // 由於 qr-code-styling 的 getRawData 方法 API 限制，
    // 我們使用 canvas 來獲取圖片數據
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('無法創建 canvas context');
    }

    // 創建一個臨時容器來渲染 QR Code
    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px';
    document.body.appendChild(tempContainer);

    // 將 QR Code 渲染到臨時容器
    qrCodeInstance.append(tempContainer);

    // 等待渲染完成
    await new Promise(resolve => setTimeout(resolve, 100));

    // 從容器中獲取 canvas
    const qrCanvas = tempContainer.querySelector('canvas');
    if (!qrCanvas) {
      throw new Error('無法獲取 QR Code canvas');
    }

    // 將 QR Code canvas 轉換為 blob
    const blob = await new Promise<Blob | null>(resolve => {
      qrCanvas.toBlob(resolve, 'image/png');
    });

    // 清理臨時容器
    document.body.removeChild(tempContainer);

    if (!blob) {
      throw new Error('無法生成 QR Code 圖片');
    }

    // 檢查是否支援 Web Share API
    if (navigator.share && navigator.canShare) {
      const file = new File([blob], 'qrcode.png', { type: 'image/png' });

      if (navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: '活動報到 QR Code',
          text: message,
          files: [file],
        });
        return;
      }
    }

    // 如果不支援 Web Share API，則使用 LINE URL scheme
    const lineUrl = `https://line.me/R/share?text=${encodeURIComponent(
      message
    )}`;

    // 在新視窗開啟 LINE 分享
    window.open(lineUrl, '_blank');
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('分享 QR Code 失敗:', error);
    throw new Error('分享失敗');
  }
}

/**
 * 複製 QR Code 圖片到剪貼簿
 */
export async function copyQRCodeToClipboard(
  qrCodeInstance: QRCodeStyling
): Promise<void> {
  try {
    // 創建一個臨時容器來渲染 QR Code
    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px';
    document.body.appendChild(tempContainer);

    // 將 QR Code 渲染到臨時容器
    qrCodeInstance.append(tempContainer);

    // 等待渲染完成
    await new Promise(resolve => setTimeout(resolve, 100));

    // 從容器中獲取 canvas
    const qrCanvas = tempContainer.querySelector('canvas');
    if (!qrCanvas) {
      throw new Error('無法獲取 QR Code canvas');
    }

    // 將 QR Code canvas 轉換為 blob
    const blob = await new Promise<Blob | null>(resolve => {
      qrCanvas.toBlob(resolve, 'image/png');
    });

    // 清理臨時容器
    document.body.removeChild(tempContainer);

    if (!blob) {
      throw new Error('無法生成 QR Code 圖片');
    }

    if (navigator.clipboard?.write) {
      const item = new ClipboardItem({ 'image/png': blob });
      await navigator.clipboard.write([item]);
    } else {
      throw new Error('瀏覽器不支援剪貼簿功能');
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('複製 QR Code 失敗:', error);
    throw new Error('複製失敗');
  }
}
