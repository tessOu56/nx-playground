/**
 * Error messages for i18n
 */

import { ErrorCode } from './errors';

export const errorMessages: Record<ErrorCode, { en: string; 'zh-TW': string }> = {
  // Authentication
  [ErrorCode.UNAUTHORIZED]: {
    en: 'You need to be logged in to access this resource',
    'zh-TW': '您需要登入才能存取此資源',
  },
  [ErrorCode.FORBIDDEN]: {
    en: 'You do not have permission to access this resource',
    'zh-TW': '您沒有權限存取此資源',
  },
  [ErrorCode.INVALID_CREDENTIALS]: {
    en: 'Invalid email or password',
    'zh-TW': '電子郵件或密碼錯誤',
  },
  [ErrorCode.TOKEN_EXPIRED]: {
    en: 'Your session has expired. Please login again',
    'zh-TW': '您的登入已過期，請重新登入',
  },
  [ErrorCode.SESSION_EXPIRED]: {
    en: 'Your session has expired',
    'zh-TW': '您的連線已過期',
  },

  // Validation
  [ErrorCode.VALIDATION_FAILED]: {
    en: 'Validation failed. Please check your input',
    'zh-TW': '驗證失敗，請檢查您的輸入',
  },
  [ErrorCode.INVALID_EMAIL]: {
    en: 'Invalid email format',
    'zh-TW': '電子郵件格式錯誤',
  },
  [ErrorCode.INVALID_PASSWORD]: {
    en: 'Password must be at least 8 characters with uppercase, lowercase, and number',
    'zh-TW': '密碼必須至少 8 個字元，包含大小寫字母和數字',
  },
  [ErrorCode.REQUIRED_FIELD]: {
    en: 'This field is required',
    'zh-TW': '此欄位為必填',
  },
  [ErrorCode.INVALID_FORMAT]: {
    en: 'Invalid format',
    'zh-TW': '格式錯誤',
  },

  // Resource
  [ErrorCode.NOT_FOUND]: {
    en: 'The requested resource was not found',
    'zh-TW': '找不到請求的資源',
  },
  [ErrorCode.ALREADY_EXISTS]: {
    en: 'Resource already exists',
    'zh-TW': '資源已存在',
  },
  [ErrorCode.CONFLICT]: {
    en: 'A conflict occurred while processing your request',
    'zh-TW': '處理您的請求時發生衝突',
  },

  // Network
  [ErrorCode.NETWORK_ERROR]: {
    en: 'Network error. Please check your connection',
    'zh-TW': '網路錯誤，請檢查您的連線',
  },
  [ErrorCode.TIMEOUT]: {
    en: 'Request timed out. Please try again',
    'zh-TW': '請求逾時，請重試',
  },
  [ErrorCode.SERVICE_UNAVAILABLE]: {
    en: 'Service is temporarily unavailable',
    'zh-TW': '服務暫時無法使用',
  },

  // Database
  [ErrorCode.DATABASE_ERROR]: {
    en: 'Database error occurred',
    'zh-TW': '資料庫錯誤',
  },
  [ErrorCode.QUERY_FAILED]: {
    en: 'Database query failed',
    'zh-TW': '資料庫查詢失敗',
  },
  [ErrorCode.CONNECTION_FAILED]: {
    en: 'Failed to connect to database',
    'zh-TW': '無法連接資料庫',
  },

  // Business logic
  [ErrorCode.BUSINESS_RULE_VIOLATION]: {
    en: 'Business rule violation',
    'zh-TW': '違反業務規則',
  },
  [ErrorCode.INSUFFICIENT_PERMISSIONS]: {
    en: 'Insufficient permissions for this operation',
    'zh-TW': '權限不足以執行此操作',
  },
  [ErrorCode.QUOTA_EXCEEDED]: {
    en: 'Quota exceeded',
    'zh-TW': '超過配額限制',
  },

  // System
  [ErrorCode.INTERNAL_ERROR]: {
    en: 'Internal server error',
    'zh-TW': '內部伺服器錯誤',
  },
  [ErrorCode.NOT_IMPLEMENTED]: {
    en: 'Feature not yet implemented',
    'zh-TW': '功能尚未實作',
  },
  [ErrorCode.MAINTENANCE]: {
    en: 'System is under maintenance',
    'zh-TW': '系統維護中',
  },
};

/**
 * Get localized error message
 */
export function getErrorMessage(
  code: ErrorCode,
  locale: 'en' | 'zh-TW' = 'en'
): string {
  return errorMessages[code]?.[locale] || errorMessages[ErrorCode.INTERNAL_ERROR][locale];
}

