/**
 * @nx-playground/validation
 *
 * Unified validation library using Zod
 * Provides reusable schemas for all apps
 *
 * @example
 * ```typescript
 * import { userLoginSchema, eventCreateSchema } from '@nx-playground/validation';
 *
 * // Validate user login
 * const result = userLoginSchema.safeParse(formData);
 * if (!result.success) {
 *   console.error(result.error.issues);
 * }
 *
 * // Type inference
 * type UserLogin = z.infer<typeof userLoginSchema>;
 * ```
 */

// Re-export Zod for convenience
export { z } from 'zod';

// Common schemas
export * from './schemas/common';

// User schemas
export * from './schemas/user';

// Event schemas
export * from './schemas/event';

// Utility functions
export * from './utils/helpers';
