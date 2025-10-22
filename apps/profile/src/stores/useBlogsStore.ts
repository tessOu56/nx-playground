/**
 * Blogs Store
 * 管理 Blog Posts 的靜態資料（從 specs/blogs/ 載入）
 */

import { create } from 'zustand';

import { loadAllBlogMetadata } from '../lib/blogLoader';
import type { SupportedLocale } from '../lib/i18n/LocaleRouter';
import type { BlogMetadata } from '../types/blogData';

interface BlogsState {
  // 按 locale 分別快取資料
  posts: Record<SupportedLocale, BlogMetadata[]>;
  loading: boolean;

  // 載入方法
  loadPosts: (locale: SupportedLocale) => Promise<void>;
}

export const useBlogsStore = create<BlogsState>((set, get) => ({
  posts: { en: [], 'zh-TW': [] },
  loading: false,

  loadPosts: async (locale: SupportedLocale) => {
    // 防止重複載入
    if (get().posts[locale].length > 0) {
      console.log(`[BlogsStore] Posts already loaded for ${locale}, count:`, get().posts[locale].length);
      return;
    }

    console.log(`[BlogsStore] Loading posts for ${locale}...`);
    set({ loading: true });
    try {
      const posts = await loadAllBlogMetadata(locale);
      console.log(`[BlogsStore] Loaded ${posts.length} posts for ${locale}`);
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
