import type { TFunction } from 'react-i18next';

/**
 * Type-safe translation helper that ensures string return type
 * Prevents ReactNode type errors throughout the app
 */
export const ts = (t: TFunction, key: string): string => {
  return String(t(key));
};

/**
 * Batch translation helper for multiple keys
 */
export const tsBatch = (t: TFunction, keys: string[]): Record<string, string> => {
  return keys.reduce((acc, key) => {
    acc[key] = String(t(key));
    return acc;
  }, {} as Record<string, string>);
};
