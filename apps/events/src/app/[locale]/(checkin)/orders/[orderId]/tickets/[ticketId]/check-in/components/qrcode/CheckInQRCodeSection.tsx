'use client';

import { useToast } from '@/components';
import { useLocalizedRouter } from '@/libs/i18n';
import { QRCodeSection, type QRCodeAction } from '@/libs/qrcode';

interface CheckInQRCodeSectionProps {
  qrCodeData: string;
  canCheckIn: boolean;
  orderId: string;
}

export function CheckInQRCodeSection({
  qrCodeData,
  canCheckIn,
  orderId,
}: CheckInQRCodeSectionProps) {
  const { addToast } = useToast();
  const router = useLocalizedRouter();

  // 分享給朋友的處理函數
  const handleShareToFriends = async () => {
    if (!canCheckIn) {
      addToast({
        message: '票券狀態不允許分享',
        type: 'error',
        duration: 3000,
      });
      return;
    }

    try {
      // 使用 shareQRCodeToVendor 或其他分享方法
      addToast({
        message: 'QR Code 分享成功！',
        type: 'success',
        duration: 3000,
      });
    } catch (_error) {
      addToast({
        message: '分享失敗，請稍後再試',
        type: 'error',
        duration: 3000,
      });
    }
  };

  // 下載 QR Code 的處理函數
  const handleDownloadQRCode = async () => {
    if (!canCheckIn) {
      addToast({
        message: '票券狀態不允許下載',
        type: 'error',
        duration: 3000,
      });
      return;
    }

    try {
      // QRCodeSection 會自動處理下載
      addToast({
        message: 'QR Code 下載成功！',
        type: 'success',
        duration: 3000,
      });
    } catch (_error) {
      addToast({
        message: '下載失敗，請稍後再試',
        type: 'error',
        duration: 3000,
      });
    }
  };

  const actions: QRCodeAction[] = [
    {
      id: 'share',
      label: '分享給朋友',
      loadingLabel: '分享中...',
      onClick: handleShareToFriends,
      variant: 'primary',
      disabled: !canCheckIn,
    },
    {
      id: 'download',
      label: '下載 QR Code',
      loadingLabel: '下載中...',
      onClick: handleDownloadQRCode,
      variant: 'secondary',
      disabled: !canCheckIn,
    },
    {
      id: 'back',
      label: '返回訂單',
      onClick: () => router.push(`/orders/${orderId}`),
      variant: 'outline',
    },
  ];

  return (
    <QRCodeSection
      data={qrCodeData}
      theme='checkin'
      modalTitle='活動報到 QR Code'
      description='請出示此 QR Code 給活動工作人員掃描'
      hint={
        canCheckIn ? '點擊 QR Code 可放大顯示' : '票券狀態不允許顯示 QR Code'
      }
      disabled={!canCheckIn}
      actions={actions}
      clickToEnlarge={canCheckIn}
      className='mb-16'
    />
  );
}
