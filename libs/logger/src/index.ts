/**
 * @nx-playground/logger
 *
 * Unified logging library for the Nx monorepo
 *
 * @example
 * ```typescript
 * import { logger } from '@nx-playground/logger';
 *
 * // Simple logging
 * logger.info('User logged in', { userId: '123' });
 * logger.error('API call failed', error, { endpoint: '/api/users' });
 *
 * // With context
 * logger.setContext({ userId: '123', sessionId: 'abc' });
 * logger.info('User action'); // Includes userId and sessionId
 *
 * // Child logger
 * const requestLogger = logger.child({ requestId: 'req-456' });
 * requestLogger.info('Request started');
 *
 * // Time a function
 * const result = await logger.time('fetch-users', async () => {
 *   return await fetchUsers();
 * });
 * ```
 */

export { logger, Logger } from './lib/logger';
export type { LogLevel, LogContext, LoggerConfig } from './lib/logger';
