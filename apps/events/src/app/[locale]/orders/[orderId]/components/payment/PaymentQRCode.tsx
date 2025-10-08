'use client';

import { shareQRCodeToVendor, generateOrderQRCode } from '@/libs';
import { QRCodeSection, type QRCodeAction } from '@/libs/qrcode';
import type { Order } from '@/types';

interface PaymentQRCodeProps {
  order: Order;
}

export function PaymentQRCode({ order }: PaymentQRCodeProps) {
  const qrData = generateOrderQRCode(
    order.id,
    order.eventId,
    order.totalAmount
  );

  const actions: QRCodeAction[] = [
    {
      id: 'share',
      label: '分享 QR Code 到主辦方 LINE',
      onClick: () =>
        shareQRCodeToVendor(
          `${window.location.origin}/orders/${order.id}`,
          'order',
          { orderId: order.id }
        ),
      variant: 'primary',
    },
    {
      id: 'download',
      label: '下載 QR Code',
      onClick: () => {}, // QRCodeSection 會自動處理下載
      variant: 'secondary',
    },
    {
      id: 'print',
      label: '列印 QR Code',
      onClick: () => window.print(),
      variant: 'outline',
    },
  ];

  return (
    <QRCodeSection
      data={qrData}
      theme='order'
      modalTitle='訂單 QR Code'
      size={200}
      actions={actions}
      clickToEnlarge={true}
      hint='點擊 QR Code 可放大顯示'
    />
  );
}
