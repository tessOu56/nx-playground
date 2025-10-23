import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SearchState {
  hasSearchHistory: boolean;
  currentQuery: string;
  setHasSearchHistory: (has: boolean) => void;
  setCurrentQuery: (query: string) => void;
}

export const useSearchStore = create<SearchState>()(
  persist(
    set => ({
      hasSearchHistory: false,
      currentQuery: '',
      setHasSearchHistory: has => set({ hasSearchHistory: has }),
      setCurrentQuery: query => set({ currentQuery: query }),
    }),
    {
      name: 'search-storage',
    }
  )
);
