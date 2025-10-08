'use client';

import {
  createContext,
  useState,
  useCallback,
  useMemo,
  useContext,
  type FC,
  type ReactNode,
} from 'react';

import { ToastPortal, type ToastProps } from './ToastPortal';

// Toast 管理器
interface ToastManager {
  toasts: ToastProps[];
  addToast: (toast: Omit<ToastProps, 'id'>) => void;
  removeToast: (id: string) => void;
}

// 使用 React 19 兼容的 createContext
const createSafeContext = <T,>(defaultValue: T | null = null) => {
  return createContext<T | null>(defaultValue);
};

const ToastContext = createSafeContext<ToastManager>(null);

export const ToastProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const addToast = useCallback(
    (toast: Omit<ToastProps, 'id'>) => {
      const id = Math.random().toString(36).substr(2, 9);
      const newToast = { ...toast, id };

      setToasts(prev => [...prev, newToast]);

      // 自動移除 toast，預設 5 秒
      if (toast.duration !== 0) {
        setTimeout(() => {
          removeToast(id);
        }, toast.duration ?? 5000);
      }
    },
    [removeToast]
  );

  const value = useMemo(
    () => ({
      toasts,
      addToast,
      removeToast,
    }),
    [toasts, addToast, removeToast]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastPortal toasts={toasts} />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);

  // 在 SSR 環境中，如果 context 為 null，返回一個安全的 fallback
  if (!context) {
    if (typeof window === 'undefined') {
      // SSR 環境中的 fallback
      return {
        toasts: [],
        addToast: () => {
          console.warn(
            'Toast functionality is not available in SSR environment'
          );
        },
        removeToast: () => {
          console.warn(
            'Toast functionality is not available in SSR environment'
          );
        },
      };
    }
    throw new Error('useToast must be used within a ToastProvider');
  }

  return context;
};

// 重新匯出類型
export type { ToastProps } from './ToastPortal';
