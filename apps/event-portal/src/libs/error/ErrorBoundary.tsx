'use client';

import { Component, type ErrorInfo, type ReactNode, useCallback } from 'react';

import { AppErrorFallback } from '@/components/error/AppErrorFallback';

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
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, _errorInfo: ErrorInfo) {
    if (error.message.includes('Unexpected API name')) {
      this.setState({ hasError: false });
    }
  }

  public render() {
    if (this.state.hasError) {
      if (typeof window === 'undefined') {
        return this.props.children;
      }

      return (
        this.props.fallback || (
          <AppErrorFallback
            onRetry={() => this.setState({ hasError: false, error: undefined })}
          />
        )
      );
    }

    return this.props.children;
  }
}

export function useErrorHandler() {
  return useCallback((error: Error) => {
    if (error.message.includes('Unexpected API name')) {
      return;
    }
    console.error('Error caught by useErrorHandler:', error);
  }, []);
}
