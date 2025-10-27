/**
 * Common validation schemas
 * Reusable primitives for all apps
 */

import { z } from 'zod';

/**
 * Email validation
 */
export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email('Invalid email format')
  .min(3, 'Email must be at least 3 characters')
  .max(255, 'Email must not exceed 255 characters');

/**
 * Password validation
 * - At least 8 characters
 * - Contains uppercase, lowercase, number
 */
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(100, 'Password must not exceed 100 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number');

/**
 * Strong password (optional special char)
 */
export const strongPasswordSchema = passwordSchema.regex(
  /[!@#$%^&*(),.?":{}|<>]/,
  'Password must contain at least one special character'
);

/**
 * Phone number validation (international format)
 */
export const phoneSchema = z
  .string()
  .trim()
  .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format');

/**
 * URL validation
 */
export const urlSchema = z
  .string()
  .url('Invalid URL format')
  .max(2048, 'URL must not exceed 2048 characters');

/**
 * Date string validation (ISO 8601)
 */
export const dateStringSchema = z
  .string()
  .datetime('Invalid date format (ISO 8601 required)');

/**
 * UUID validation
 */
export const uuidSchema = z.string().uuid('Invalid UUID format');

/**
 * Slug validation (URL-friendly string)
 */
export const slugSchema = z
  .string()
  .min(1, 'Slug cannot be empty')
  .max(200, 'Slug must not exceed 200 characters')
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Invalid slug format (use lowercase letters, numbers, and hyphens)');

/**
 * Positive integer
 */
export const positiveIntSchema = z.number().int().positive('Must be a positive integer');

/**
 * Non-negative integer (includes 0)
 */
export const nonNegativeIntSchema = z.number().int().nonnegative('Must be non-negative');

/**
 * Pagination limit (1-100)
 */
export const paginationLimitSchema = z
  .number()
  .int()
  .min(1, 'Limit must be at least 1')
  .max(100, 'Limit must not exceed 100')
  .default(20);

/**
 * Pagination offset (0+)
 */
export const paginationOffsetSchema = z.number().int().nonnegative('Offset must be non-negative').default(0);

/**
 * Locale validation (en, zh-TW)
 */
export const localeSchema = z.enum(['en', 'zh-TW'], {
  errorMap: () => ({ message: 'Invalid locale (must be "en" or "zh-TW")' }),
});

/**
 * Hex color validation
 */
export const hexColorSchema = z
  .string()
  .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid hex color format');

/**
 * File size validation (in bytes)
 */
export const fileSizeSchema = (maxSizeInMB: number) =>
  z.number().max(maxSizeInMB * 1024 * 1024, `File size must not exceed ${maxSizeInMB}MB`);

/**
 * MIME type validation
 */
export const mimeTypeSchema = (allowedTypes: string[]) =>
  z.enum(allowedTypes as [string, ...string[]], {
    errorMap: () => ({ message: `Invalid file type (allowed: ${allowedTypes.join(', ')})` }),
  });

