/**
 * Validation helper utilities
 */

import type { z, ZodError } from 'zod';

/**
 * Format Zod errors into user-friendly messages
 */
export function formatZodError(error: ZodError): Record<string, string> {
  const formatted: Record<string, string> = {};

  error.issues.forEach((issue) => {
    const path = issue.path.join('.');
    formatted[path] = issue.message;
  });

  return formatted;
}

/**
 * Get first error message from Zod error
 */
export function getFirstError(error: ZodError): string {
  return error.issues[0]?.message || 'Validation failed';
}

/**
 * Validate data and return formatted errors
 */
export function validateWithErrors<T extends z.ZodType>(
  schema: T,
  data: unknown
): {
  success: boolean;
  data?: z.infer<T>;
  errors?: Record<string, string>;
} {
  const result = schema.safeParse(data);

  if (result.success) {
    return {
      success: true,
      data: result.data,
    };
  }

  return {
    success: false,
    errors: formatZodError(result.error),
  };
}

/**
 * Create a custom error message map for localization
 */
export function createErrorMap(messages: Record<string, string>) {
  return (issue: z.ZodIssueOptionalMessage, ctx: z.ErrorMapCtx) => {
    const key = `${issue.code}.${issue.path.join('.')}`;
    return {
      message: messages[key] || messages[issue.code] || ctx.defaultError,
    };
  };
}

