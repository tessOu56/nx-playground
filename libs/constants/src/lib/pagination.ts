/**
 * Pagination constants
 */

/**
 * Default pagination values
 */
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MIN_LIMIT: 1,
  MAX_LIMIT: 100,
  DEFAULT_OFFSET: 0,
} as const;

/**
 * Sort orders
 */
export const SORT_ORDER = {
  ASC: 'asc',
  DESC: 'desc',
} as const;

export type SortOrder = (typeof SORT_ORDER)[keyof typeof SORT_ORDER];

/**
 * Common sort fields
 */
export const SORT_FIELD = {
  CREATED_AT: 'created_at',
  UPDATED_AT: 'updated_at',
  NAME: 'name',
  TITLE: 'title',
  ID: 'id',
} as const;

export type SortField = (typeof SORT_FIELD)[keyof typeof SORT_FIELD];

