import { useQueryClient } from '@tanstack/react-query';

import { useLineSettings as useLineSettingsHook } from './useLineSettings';
import { useVendor } from './useVendors';

import { extractVendorIdFromEvent } from '@/libs/utils/vendorUtils';
import { useCurrentStore } from '@/stores/currentStore';

/**
 * 獲取 vendor 和 LINE 設定資料（不包含 side effects）
 */
export const useVendorData = (vendorId: string) => {
  // 使用 React Query 獲取主辦方資料
  const vendorQuery = useVendor(vendorId);

  // 使用 React Query 獲取 LINE 設定
  const lineSettingsQuery = useLineSettingsHook(vendorId);

  return {
    vendor: vendorQuery.data,
    vendorLoading: vendorQuery.isLoading,
    vendorError: vendorQuery.error,
    lineSettings: lineSettingsQuery.data,
    lineSettingsLoading: lineSettingsQuery.isLoading,
    lineSettingsError: lineSettingsQuery.error,
    isLoading: vendorQuery.isLoading ?? lineSettingsQuery.isLoading,
    error: vendorQuery.error ?? lineSettingsQuery.error,
  };
};

/**
 * 透過活動 ID 獲取 vendor 資料
 */
export const useVendorDataByEvent = (eventId: string) => {
  const queryClient = useQueryClient();

  // 先獲取活動資料來找到主辦方 ID
  const eventQuery = queryClient.getQueryData(['event', eventId]) as any;
  const vendorId = extractVendorIdFromEvent(eventQuery);

  const vendorData = useVendorData(vendorId ?? '');

  return {
    ...vendorData,
    vendorId,
  };
};

/**
 * 獲取當前主辦方資料（從 store 中讀取）
 */
export const useCurrentVendor = () => {
  const {
    currentVendor,
    currentLineSettings,
    isLoadingVendor,
    isLoadingLineSettings,
  } = useCurrentStore();

  return {
    vendor: currentVendor,
    lineSettings: currentLineSettings,
    isLoading: isLoadingVendor ?? isLoadingLineSettings,
  };
};

/**
 * 獲取 vendor store 操作函數
 */
export const useVendorStoreActions = () => {
  const {
    setCurrentVendor,
    setCurrentLineSettings,
    setLoadingVendor,
    setLoadingLineSettings,
    clearCurrentData,
  } = useCurrentStore();

  return {
    setCurrentVendor,
    setCurrentLineSettings,
    setLoadingVendor,
    setLoadingLineSettings,
    clearCurrentData,
  };
};
