/**
 * Blogs Store
 * 管理 Blog Posts 的靜態資料（從 docs/ 載入）
 */

import { create } from 'zustand';

import type { BlogPost } from '../features/blogs/types';
import { loadAllPosts } from '../features/blogs/utils/loadDocs';
import type { SupportedLocale } from '../lib/i18n/LocaleRouter';

interface BlogsState {
  // 按 locale 分別快取資料
  posts: Record<SupportedLocale, BlogPost[]>;
  loading: boolean;

  // 載入方法
  loadPosts: (locale: SupportedLocale) => Promise<void>;
}

export const useBlogsStore = create<BlogsState>((set, get) => ({
  posts: { en: [], 'zh-TW': [] },
  loading: false,

  loadPosts: async (locale: SupportedLocale) => {
    // 防止重複載入
    if (get().posts[locale].length > 0) return;

    set({ loading: true });
    try {
      const posts = await loadAllPosts(locale);
      set(state => ({
        posts: { ...state.posts, [locale]: posts },
        loading: false,
      }));
    } catch (error) {
      console.error('Failed to load blog posts:', error);
      set({ loading: false });
    }
  },
}));
