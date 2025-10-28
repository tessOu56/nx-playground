/**
 * Custom Error Classes
 * Unified error types for all apps
 */

/**
 * Error codes enum
 */
export enum ErrorCode {
  // Authentication errors (1xxx)
  UNAUTHORIZED = 'AUTH_001',
  FORBIDDEN = 'AUTH_002',
  INVALID_CREDENTIALS = 'AUTH_003',
  TOKEN_EXPIRED = 'AUTH_004',
  SESSION_EXPIRED = 'AUTH_005',

  // Validation errors (2xxx)
  VALIDATION_FAILED = 'VAL_001',
  INVALID_EMAIL = 'VAL_002',
  INVALID_PASSWORD = 'VAL_003',
  REQUIRED_FIELD = 'VAL_004',
  INVALID_FORMAT = 'VAL_005',

  // Resource errors (3xxx)
  NOT_FOUND = 'RES_001',
  ALREADY_EXISTS = 'RES_002',
  CONFLICT = 'RES_003',

  // Network errors (4xxx)
  NETWORK_ERROR = 'NET_001',
  TIMEOUT = 'NET_002',
  SERVICE_UNAVAILABLE = 'NET_003',

  // Database errors (5xxx)
  DATABASE_ERROR = 'DB_001',
  QUERY_FAILED = 'DB_002',
  CONNECTION_FAILED = 'DB_003',

  // Business logic errors (6xxx)
  BUSINESS_RULE_VIOLATION = 'BIZ_001',
  INSUFFICIENT_PERMISSIONS = 'BIZ_002',
  QUOTA_EXCEEDED = 'BIZ_003',

  // System errors (9xxx)
  INTERNAL_ERROR = 'SYS_001',
  NOT_IMPLEMENTED = 'SYS_002',
  MAINTENANCE = 'SYS_003',
}

/**
 * Base application error
 */
export class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly context?: Record<string, unknown>;

  constructor(
    code: ErrorCode,
    message: string,
    statusCode = 500,
    isOperational = true,
    context?: Record<string, unknown>
  ) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.context = context;

    // Maintains proper stack trace for where our error was thrown
    Error.captureStackTrace(this, this.constructor);
  }

  toJSON() {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      statusCode: this.statusCode,
      context: this.context,
      stack: this.stack,
    };
  }
}

/**
 * Authentication error
 */
export class AuthenticationError extends AppError {
  constructor(
    message = 'Authentication failed',
    code = ErrorCode.UNAUTHORIZED,
    context?: Record<string, unknown>
  ) {
    super(code, message, 401, true, context);
  }
}

/**
 * Authorization error
 */
export class AuthorizationError extends AppError {
  constructor(
    message = 'Insufficient permissions',
    context?: Record<string, unknown>
  ) {
    super(ErrorCode.FORBIDDEN, message, 403, true, context);
  }
}

/**
 * Validation error
 */
export class ValidationError extends AppError {
  constructor(
    message = 'Validation failed',
    context?: Record<string, unknown>
  ) {
    super(ErrorCode.VALIDATION_FAILED, message, 400, true, context);
  }
}

/**
 * Not found error
 */
export class NotFoundError extends AppError {
  constructor(
    resource = 'Resource',
    context?: Record<string, unknown>
  ) {
    super(
      ErrorCode.NOT_FOUND,
      `${resource} not found`,
      404,
      true,
      context
    );
  }
}

/**
 * Conflict error
 */
export class ConflictError extends AppError {
  constructor(
    message = 'Resource already exists',
    context?: Record<string, unknown>
  ) {
    super(ErrorCode.ALREADY_EXISTS, message, 409, true, context);
  }
}

/**
 * Network error
 */
export class NetworkError extends AppError {
  constructor(
    message = 'Network request failed',
    context?: Record<string, unknown>
  ) {
    super(ErrorCode.NETWORK_ERROR, message, 503, true, context);
  }
}

/**
 * Database error
 */
export class DatabaseError extends AppError {
  constructor(
    message = 'Database operation failed',
    context?: Record<string, unknown>
  ) {
    super(ErrorCode.DATABASE_ERROR, message, 500, false, context);
  }
}

/**
 * Business logic error
 */
export class BusinessError extends AppError {
  constructor(
    message: string,
    code = ErrorCode.BUSINESS_RULE_VIOLATION,
    context?: Record<string, unknown>
  ) {
    super(code, message, 422, true, context);
  }
}

/**
 * Check if error is operational (expected) vs programmer error
 */
export function isOperationalError(error: Error): boolean {
  if (error instanceof AppError) {
    return error.isOperational;
  }
  return false;
}

/**
 * Get HTTP status code from error
 */
export function getStatusCode(error: Error): number {
  if (error instanceof AppError) {
    return error.statusCode;
  }
  return 500;
}

/**
 * Get error code from error
 */
export function getErrorCode(error: Error): ErrorCode {
  if (error instanceof AppError) {
    return error.code;
  }
  return ErrorCode.INTERNAL_ERROR;
}

