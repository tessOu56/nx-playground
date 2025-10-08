import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// UI Components Utilities

/**
 * 合併 CSS 類名，使用 clsx 和 tailwind-merge
 * 自動處理 Tailwind CSS 類名衝突
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

// 重新匯出 cva 和相關類型，方便在整個專案中使用
export { cva, type VariantProps } from 'class-variance-authority';
