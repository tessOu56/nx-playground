/**
 * Blogs Store
 * 管理 Blog Posts 的靜態資料（從 specs/blogs/ 載入）
 */

import { logger } from '@nx-playground/logger';
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
      logger.debug(`Blog posts already loaded for locale`, {
        locale,
        count: get().posts[locale].length,
      });
      return;
    }

    logger.info(`Loading blog posts`, { locale });
    set({ loading: true });
    try {
      const posts = await loadAllBlogMetadata(locale);
      logger.info(`Blog posts loaded successfully`, { locale, count: posts.length });
      set(state => ({
        posts: { ...state.posts, [locale]: posts },
        loading: false,
      }));
    } catch (error) {
      logger.error(`Failed to load blog posts`, error, { locale });
      set({ loading: false });
    }
  },
}));
