/**
 * Validation constants
 */

/**
 * String length limits
 */
export const STRING_LENGTH = {
  EMAIL_MAX: 255,
  PASSWORD_MIN: 8,
  PASSWORD_MAX: 100,
  USERNAME_MIN: 2,
  USERNAME_MAX: 50,
  TITLE_MIN: 3,
  TITLE_MAX: 200,
  DESCRIPTION_MIN: 10,
  DESCRIPTION_MAX: 5000,
  BIO_MAX: 500,
  SLUG_MAX: 200,
} as const;

/**
 * Number limits
 */
export const NUMBER_LIMITS = {
  AGE_MIN: 0,
  AGE_MAX: 150,
  PRICE_MIN: 0,
  PRICE_MAX: 999999999,
  QUANTITY_MIN: 0,
  QUANTITY_MAX: 9999,
  RATING_MIN: 0,
  RATING_MAX: 5,
} as const;

/**
 * Array limits
 */
export const ARRAY_LIMITS = {
  TAGS_MAX: 10,
  IMAGES_MAX: 10,
  FILES_MAX: 5,
} as const;

/**
 * File size limits (in bytes)
 */
export const FILE_SIZE = {
  IMAGE_MAX: 5 * 1024 * 1024, // 5MB
  VIDEO_MAX: 50 * 1024 * 1024, // 50MB
  DOCUMENT_MAX: 10 * 1024 * 1024, // 10MB
  AVATAR_MAX: 2 * 1024 * 1024, // 2MB
} as const;

/**
 * Allowed MIME types
 */
export const MIME_TYPE = {
  IMAGES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  VIDEOS: ['video/mp4', 'video/webm'],
  DOCUMENTS: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
} as const;

/**
 * Regex patterns
 */
export const REGEX_PATTERN = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^\+?[1-9]\d{1,14}$/,
  UUID: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
  SLUG: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
  HEX_COLOR: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
  URL: /^https?:\/\/.+/,
} as const;

