/**
 * @nx-playground/utils
 *
 * Framework-agnostic utility functions
 *
 * @example
 * ```typescript
 * import { formatDate, truncate, formatNumber, unique } from '@nx-playground/utils';
 *
 * const date = formatDate(new Date(), 'YYYY-MM-DD');
 * const short = truncate('Long text...', 20);
 * const formatted = formatNumber(1234567);
 * const uniqueItems = unique([1, 2, 2, 3]);
 * ```
 */

// Date utilities
export * from './lib/date';

// String utilities
export * from './lib/string';

// Number utilities
export * from './lib/number';

// Array utilities
export * from './lib/array';

// Object utilities
export * from './lib/object';

// URL utilities
export * from './lib/url';
