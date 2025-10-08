import { useQuery } from '@tanstack/react-query';

import { mockLineSettings } from '../../mock/lineSettings';
import { mockVendors } from '../../mock/vendors';

import type { LineSettings } from '@/types/line';

// 根據 LINE 官方帳號 ID 獲取設定
const getLineSettingsById = (
  lineOfficialAccountId: string
): LineSettings | null => {
  return mockLineSettings[lineOfficialAccountId] ?? null;
};

// 模擬前端呼叫 LINE API 獲取官方帳號設定
const fetchLineSettings = async (
  lineOfficialAccountId: string
): Promise<LineSettings | null> => {
  // 在實際應用中，這裡會呼叫 LINE API
  // const response = await fetch(`https://api.line.me/v2/bot/profile/${lineOfficialAccountId}`);
  // const data = await response.json();

  // 模擬 LINE API 回應
  await new Promise(resolve => setTimeout(resolve, 500));

  // 從獨立的 LINE 設定 mock 中獲取資料
  return getLineSettingsById(lineOfficialAccountId);
};

// 根據主辦方 ID 獲取 LINE 設定描述
export function useLineSettings(vendorId: string) {
  return useQuery({
    queryKey: ['lineSettings', vendorId],
    queryFn: async () => {
      // 1. 先從 vendor 資料中獲取 LINE 官方帳號 ID
      const vendor = mockVendors.find(v => v.id === vendorId);
      if (!vendor?.lineOfficialAccountId) {
        return null;
      }

      // 2. 前端呼叫 LINE API 獲取官方帳號設定
      return await fetchLineSettings(vendor.lineOfficialAccountId);
    },
    staleTime: 10 * 60 * 1000, // 10分鐘
    enabled: !!vendorId,
  });
}
