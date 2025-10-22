/**
 * Projects Store
 * 管理 Apps 和 Libs 的靜態資料（從 README + PRD 載入）
 */

import { create } from 'zustand';

import type { SupportedLocale } from '../lib/i18n/LocaleRouter';
import { loadAllApps, loadAllLibs } from '../lib/projectLoader';
import type { AppData, LibData } from '../types/projectData';

interface ProjectsState {
  // 按 locale 分別快取資料
  apps: Record<SupportedLocale, AppData[]>;
  libs: Record<SupportedLocale, LibData[]>;
  loading: boolean;

  // 載入方法
  loadApps: (locale: SupportedLocale) => Promise<void>;
  loadLibs: (locale: SupportedLocale) => Promise<void>;
}

export const useProjectsStore = create<ProjectsState>((set, get) => ({
  apps: { en: [], 'zh-TW': [] },
  libs: { en: [], 'zh-TW': [] },
  loading: false,

  loadApps: async (locale: SupportedLocale) => {
    // 防止重複載入
    if (get().apps[locale].length > 0) return;

    set({ loading: true });
    try {
      const apps = await loadAllApps(locale);
      set(state => ({
        apps: { ...state.apps, [locale]: apps },
        loading: false,
      }));
    } catch (error) {
      console.error('Failed to load apps:', error);
      set({ loading: false });
    }
  },

  loadLibs: async (locale: SupportedLocale) => {
    // 防止重複載入
    if (get().libs[locale].length > 0) {
      console.log(`[Store] Libs already loaded for ${locale}`);
      return;
    }

    set({ loading: true });
    try {
      const libs = await loadAllLibs(locale);
      console.log(`[Store] Loaded ${libs.length} libs for ${locale}:`, libs);
      set(state => ({
        libs: { ...state.libs, [locale]: libs },
        loading: false,
      }));
    } catch (error) {
      console.error('Failed to load libs:', error);
      set({ loading: false });
    }
  },
}));
