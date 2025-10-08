'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

import { ToastItem } from './ToastItem';

export interface ToastProps {
  id: string;
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastPortalProps {
  toasts: ToastProps[];
}

export const ToastPortal = ({ toasts }: ToastPortalProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // 取得最新的 4 個通知，並將陣列反轉 (讓最新的在最下面)
  const visibleToasts = toasts.slice(-4).reverse();

  return createPortal(
    <div className='fixed bottom-6 right-8 z-50 flex flex-col-reverse gap-2 pointer-events-none'>
      {visibleToasts.map((toast, index) => {
        return (
          <div key={toast.id} className='pointer-events-auto'>
            <ToastItem {...toast} index={index} />
          </div>
        );
      })}
    </div>,
    document.body
  );
};
