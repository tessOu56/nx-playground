/**
 * React hook for error handling
 */

import { logger } from '@nx-playground/logger';
import { useCallback, useState } from 'react';

import { AppError, ErrorCode, getErrorCode } from './errors';
import { getErrorMessage } from './errorMessages';

export interface ErrorState {
  error: Error | null;
  message: string;
  code: ErrorCode | null;
}

export function useErrorHandler(locale: 'en' | 'zh-TW' = 'en') {
  const [errorState, setErrorState] = useState<ErrorState>({
    error: null,
    message: '',
    code: null,
  });

  const handleError = useCallback(
    (error: Error | AppError, context?: Record<string, unknown>) => {
      const code = getErrorCode(error);
      const message = getErrorMessage(code, locale);

      // Log error
      logger.error('Error handled', error, context);

      // Set error state
      setErrorState({
        error,
        message,
        code,
      });
    },
    [locale]
  );

  const clearError = useCallback(() => {
    setErrorState({
      error: null,
      message: '',
      code: null,
    });
  }, []);

  const resetError = useCallback(() => {
    clearError();
  }, [clearError]);

  return {
    error: errorState.error,
    message: errorState.message,
    code: errorState.code,
    hasError: errorState.error !== null,
    handleError,
    clearError,
    resetError,
  };
}

