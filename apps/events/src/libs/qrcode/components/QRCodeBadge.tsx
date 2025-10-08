'use client';

import React from 'react';

export interface QRCodeThemeBadgeProps {
  theme: 'order' | 'checkin';
  className?: string;
}

export function QRCodeThemeBadge({
  theme,
  className = '',
}: QRCodeThemeBadgeProps) {
  return (
    <div className={`text-center ${className}`}>
      <span
        className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
          theme === 'order'
            ? 'bg-blue-100 text-blue-800'
            : 'bg-green-100 text-green-800'
        }`}
      >
        {theme === 'order' ? '📋 訂單 QR Code' : '🎯 報到 QR Code'}
      </span>
    </div>
  );
}
