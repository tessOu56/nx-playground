import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

// SSR 安全檢查
const isClient = () => typeof window !== 'undefined';

interface AuthUIState {
  // UI 狀態
  isLoginModalOpen: boolean;
  isLogoutModalOpen: boolean;
  isProfileModalOpen: boolean;

  // 設置登入模態框狀態
  setLoginModalOpen: (isOpen: boolean) => void;

  // 設置登出模態框狀態
  setLogoutModalOpen: (isOpen: boolean) => void;

  // 設置個人資料模態框狀態
  setProfileModalOpen: (isOpen: boolean) => void;

  // 關閉所有模態框
  closeAllModals: () => void;
}

// 創建 SSR 安全的 store
const createAuthStore = () => {
  if (!isClient()) {
    // SSR 階段：返回空的 store 實例
    return create<AuthUIState>()(() => ({
      isLoginModalOpen: false,
      isLogoutModalOpen: false,
      isProfileModalOpen: false,
      setLoginModalOpen: () => {},
      setLogoutModalOpen: () => {},
      setProfileModalOpen: () => {},
      closeAllModals: () => {},
    }));
  }

  // 客戶端：使用完整的 store 配置
  return create<AuthUIState>()(
    devtools(
      persist(
        set => ({
          isLoginModalOpen: false,
          isLogoutModalOpen: false,
          isProfileModalOpen: false,

          setLoginModalOpen: (isOpen: boolean) => {
            set({ isLoginModalOpen: isOpen }, false, 'setLoginModalOpen');
          },

          setLogoutModalOpen: (isOpen: boolean) => {
            set({ isLogoutModalOpen: isOpen }, false, 'setLogoutModalOpen');
          },

          setProfileModalOpen: (isOpen: boolean) => {
            set({ isProfileModalOpen: isOpen }, false, 'setProfileModalOpen');
          },

          closeAllModals: () => {
            set(
              {
                isLoginModalOpen: false,
                isLogoutModalOpen: false,
                isProfileModalOpen: false,
              },
              false,
              'closeAllModals'
            );
          },
        }),
        {
          name: 'auth-ui-store',
          // 不持久化模態框狀態，每次重新載入都關閉
          partialize: () => ({}),
        }
      ),
      {
        name: 'auth-ui-store',
      }
    )
  );
};

export const useAuthStore = createAuthStore();
