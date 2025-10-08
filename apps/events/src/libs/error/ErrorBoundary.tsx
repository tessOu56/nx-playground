'use client';

import { Component, type ErrorInfo, type ReactNode, useCallback } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    // 更新 state 使下一次渲染能夠顯示降級後的 UI
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // 你可以將錯誤日誌上報給服務器

    // 如果是 "Unexpected API name" 錯誤，記錄但不顯示錯誤 UI
    if (error.message.includes('Unexpected API name')) {
      this.setState({ hasError: false });
      return;
    }
  }

  public render() {
    if (this.state.hasError) {
      // 在 SSR 期間，不渲染錯誤 UI，直接返回 children
      if (typeof window === 'undefined') {
        return this.props.children;
      }

      // 自定義降級後的 UI
      return (
        this.props.fallback || (
          <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
            <div className='bg-white rounded-lg shadow-md p-8 max-w-md mx-4'>
              <div className='text-center'>
                <div className='text-6xl mb-4'>⚠️</div>
                <h2 className='text-xl font-semibold text-gray-900 mb-2'>
                  發生錯誤
                </h2>
                <p className='text-gray-600 mb-4'>
                  應用程式遇到了一個問題，請重新整理頁面或聯繫客服。
                </p>
                <button
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      window.location.reload();
                    }
                  }}
                  className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
                >
                  重新整理
                </button>
              </div>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

// 函數式錯誤邊界 Hook
export function useErrorHandler() {
  return useCallback((error: Error) => {
    // 如果是 "Unexpected API name" 錯誤，忽略它
    if (error.message.includes('Unexpected API name')) {
      return;
    }

    // 處理其他錯誤
    console.error('Error caught by useErrorHandler:', error);
  }, []);
}
