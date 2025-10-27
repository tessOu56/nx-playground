/**
 * Number formatting and manipulation utilities
 */

/**
 * Format number with thousand separators
 * @example formatNumber(1234567) => '1,234,567'
 */
export function formatNumber(num: number, locale = 'en-US'): string {
  return new Intl.NumberFormat(locale).format(num);
}

/**
 * Format number as currency
 * @example formatCurrency(1234.56, 'USD') => '$1,234.56'
 */
export function formatCurrency(
  amount: number,
  currency = 'USD',
  locale = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount);
}

/**
 * Format number as percentage
 * @example formatPercentage(0.1234, 2) => '12.34%'
 */
export function formatPercentage(value: number, decimals = 2): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

/**
 * Format bytes to human readable size
 * @example formatBytes(1536) => '1.5 KB'
 */
export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
}

/**
 * Round number to decimals
 * @example round(1.2345, 2) => 1.23
 */
export function round(num: number, decimals = 0): number {
  const factor = Math.pow(10, decimals);
  return Math.round(num * factor) / factor;
}

/**
 * Clamp number between min and max
 * @example clamp(150, 0, 100) => 100
 */
export function clamp(num: number, min: number, max: number): number {
  return Math.min(Math.max(num, min), max);
}

/**
 * Generate random number between min and max
 * @example randomInt(1, 10) => 7
 */
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Calculate percentage
 * @example percentage(25, 100) => 25
 */
export function percentage(value: number, total: number): number {
  if (total === 0) return 0;
  return (value / total) * 100;
}

/**
 * Sum array of numbers
 * @example sum([1, 2, 3, 4]) => 10
 */
export function sum(numbers: number[]): number {
  return numbers.reduce((acc, num) => acc + num, 0);
}

/**
 * Calculate average
 * @example average([1, 2, 3, 4]) => 2.5
 */
export function average(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  return sum(numbers) / numbers.length;
}

/**
 * Check if number is in range
 * @example inRange(5, 1, 10) => true
 */
export function inRange(num: number, min: number, max: number): boolean {
  return num >= min && num <= max;
}

