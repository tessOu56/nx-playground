/**
 * @nx-playground/constants
 *
 * Shared constants for all apps
 *
 * @example
 * ```typescript
 * import { HTTP_STATUS, PAGINATION, LOCALE, TIME } from '@nx-playground/constants';
 *
 * if (response.status === HTTP_STATUS.OK) {
 *   // Handle success
 * }
 *
 * const limit = PAGINATION.DEFAULT_LIMIT;
 * const locale = LOCALE.EN;
 * const oneDay = TIME.DAY;
 * ```
 */

// HTTP constants
export * from './lib/http';

// Pagination constants
export * from './lib/pagination';

// Validation constants
export * from './lib/validation';

// App constants
export * from './lib/app';
