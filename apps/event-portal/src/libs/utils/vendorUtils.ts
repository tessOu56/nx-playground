import type { Vendor, LineSettings } from '@/types';

/**
 * 檢查是否需要更新 vendor
 */
export function shouldUpdateVendor(
  newVendor: Vendor | null | undefined,
  currentVendor: Vendor | null | undefined,
  forceReload = false
): boolean {
  if (!newVendor) return false;
  if (forceReload) return true;
  if (!currentVendor) return true;
  return currentVendor.id !== newVendor.id;
}

/**
 * 檢查是否需要更新 LINE 設定
 */
export function shouldUpdateLineSettings(
  newLineSettings: LineSettings | null | undefined,
  vendor: Vendor | null | undefined
): boolean {
  return !!(newLineSettings && vendor);
}

/**
 * 從活動資料中提取 vendor ID
 */
export function extractVendorIdFromEvent(eventData: any): string | undefined {
  return eventData?.vendorId;
}
