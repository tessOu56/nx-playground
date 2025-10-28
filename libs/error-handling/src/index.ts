/**
 * @nx-playground/error-handling
 *
 * Unified error handling library
 *
 * @example
 * ```typescript
 * import { AppError, ErrorCode, ErrorBoundary } from '@nx-playground/error-handling';
 *
 * // Throw custom error
 * throw new AppError(ErrorCode.NOT_FOUND, 'User not found', 404);
 *
 * // Use Error Boundary
 * <ErrorBoundary>
 *   <YourComponent />
 * </ErrorBoundary>
 *
 * // Use error handler hook
 * const { handleError, message } = useErrorHandler('en');
 * ```
 */

// Error classes
export {
  AppError,
  AuthenticationError,
  AuthorizationError,
  ValidationError,
  NotFoundError,
  ConflictError,
  NetworkError,
  DatabaseError,
  BusinessError,
  ErrorCode,
  isOperationalError,
  getStatusCode,
  getErrorCode,
} from './lib/errors';

// Error messages
export { errorMessages, getErrorMessage } from './lib/errorMessages';

// React components
export { ErrorBoundary } from './lib/ErrorBoundary';

// React hooks
export { useErrorHandler } from './lib/useErrorHandler';
export type { ErrorState } from './lib/useErrorHandler';
