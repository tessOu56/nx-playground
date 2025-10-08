import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface LoadingState {
  loadingStates: Record<string, boolean>;
  globalLoading: boolean;
}

interface LoadingActions {
  setLoading: (key: string, loading: boolean) => void;
  setGlobalLoading: (loading: boolean) => void;
  clearLoading: (key: string) => void;
  clearAllLoading: () => void;
  isLoading: (key: string) => boolean;
}

type LoadingStore = LoadingState & LoadingActions;

export const useLoadingStore = create<LoadingStore>()(
  devtools(
    (set, get) => ({
      // State
      loadingStates: {},
      globalLoading: false,

      // Actions
      setLoading: (key: string, loading: boolean) => {
        set(state => ({
          loadingStates: {
            ...state.loadingStates,
            [key]: loading,
          },
        }));
      },

      setGlobalLoading: (loading: boolean) => {
        set({ globalLoading: loading });
      },

      clearLoading: (key: string) => {
        set(state => {
          const newLoadingStates = { ...state.loadingStates };
          delete newLoadingStates[key];
          return { loadingStates: newLoadingStates };
        });
      },

      clearAllLoading: () => {
        set({ loadingStates: {}, globalLoading: false });
      },

      isLoading: (key: string) => {
        return get().loadingStates[key] || false;
      },
    }),
    { name: 'LoadingStore' }
  )
);
