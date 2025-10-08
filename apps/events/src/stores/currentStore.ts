import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

import type { LineSettings } from '@/types/line';
import type { Vendor } from '@/types/vendor';

// SSR 安全檢查
const isClient = () => typeof window !== 'undefined';

interface CurrentUIState {
  // 當前主辦方資訊
  currentVendor: Vendor | null;
  // 當前主辦方的 LINE 設定
  currentLineSettings: LineSettings | null;
  // 是否正在載入主辦方資訊
  isLoadingVendor: boolean;
  // 是否正在載入 LINE 設定
  isLoadingLineSettings: boolean;

  // Actions
  setCurrentVendor: (vendor: Vendor | null) => void;
  setCurrentLineSettings: (lineSettings: LineSettings | null) => void;
  setLoadingVendor: (loading: boolean) => void;
  setLoadingLineSettings: (loading: boolean) => void;
  clearCurrentData: () => void;
}

// 創建 SSR 安全的 store
const createCurrentStore = () => {
  if (!isClient()) {
    // SSR 階段：返回空的 store 實例
    return create<CurrentUIState>()(() => ({
      currentVendor: null,
      currentLineSettings: null,
      isLoadingVendor: false,
      isLoadingLineSettings: false,
      setCurrentVendor: (_vendor: Vendor | null) => {
        // SSR placeholder
      },
      setCurrentLineSettings: (_lineSettings: LineSettings | null) => {
        // SSR placeholder
      },
      setLoadingVendor: (_loading: boolean) => {
        // SSR placeholder
      },
      setLoadingLineSettings: (_loading: boolean) => {
        // SSR placeholder
      },
      clearCurrentData: () => {
        // SSR placeholder
      },
    }));
  }

  // 客戶端：使用完整的 store 配置
  return create<CurrentUIState>()(
    devtools(
      persist(
        set => ({
          currentVendor: null,
          currentLineSettings: null,
          isLoadingVendor: false,
          isLoadingLineSettings: false,

          setCurrentVendor: (vendor: Vendor | null) => {
            set({ currentVendor: vendor }, false, 'setCurrentVendor');
          },

          setCurrentLineSettings: (lineSettings: LineSettings | null) => {
            set(
              { currentLineSettings: lineSettings },
              false,
              'setCurrentLineSettings'
            );
          },

          setLoadingVendor: (loading: boolean) => {
            set({ isLoadingVendor: loading }, false, 'setLoadingVendor');
          },

          setLoadingLineSettings: (loading: boolean) => {
            set(
              { isLoadingLineSettings: loading },
              false,
              'setLoadingLineSettings'
            );
          },

          clearCurrentData: () => {
            set(
              {
                currentVendor: null,
                currentLineSettings: null,
                isLoadingVendor: false,
                isLoadingLineSettings: false,
              },
              false,
              'clearCurrentData'
            );
          },
        }),
        {
          name: 'current-ui-store',
          // 持久化主辦方資訊，但不持久化載入狀態
          partialize: state => ({
            currentVendor: state.currentVendor,
            currentLineSettings: state.currentLineSettings,
          }),
        }
      ),
      {
        name: 'current-ui-store',
      }
    )
  );
};

export const useCurrentStore = createCurrentStore();
