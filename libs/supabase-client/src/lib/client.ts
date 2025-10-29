/**
 * Supabase Client Factory
 * 環境感知的 client 建立，支援 dev/staging/prod
 */

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

import type { Database } from './types';

// Environment-aware configuration
const SUPABASE_URL = import.meta.env['VITE_SUPABASE_URL'] || '';
const SUPABASE_ANON_KEY = import.meta.env['VITE_SUPABASE_ANON_KEY'] || '';

let supabaseInstance: SupabaseClient<Database> | null = null;

/**
 * 建立 Supabase client (singleton pattern)
 * 用於前端應用（使用 anon key）
 */
export function createSupabaseClient(): SupabaseClient<Database> {
  if (!SUPABASE_URL) {
    throw new Error('Missing VITE_SUPABASE_URL environment variable');
  }
  if (!SUPABASE_ANON_KEY) {
    throw new Error('Missing VITE_SUPABASE_ANON_KEY environment variable');
  }

  // Return existing instance if available
  if (supabaseInstance) {
    return supabaseInstance;
  }

  // Create new instance
  supabaseInstance = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    },
    realtime: {
      params: {
        eventsPerSecond: 10, // Rate limiting for realtime events
      },
    },
  });

  return supabaseInstance;
}

/**
 * 取得現有的 Supabase client instance
 * 如果不存在則建立新的
 */
export function getSupabaseClient(): SupabaseClient<Database> {
  if (!supabaseInstance) {
    return createSupabaseClient();
  }
  return supabaseInstance;
}

/**
 * 重設 client instance（用於測試或環境切換）
 */
export function resetSupabaseClient(): void {
  supabaseInstance = null;
}

/**
 * 檢查環境變數是否正確設定
 */
export function validateEnvironment(): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!SUPABASE_URL) {
    errors.push('Missing VITE_SUPABASE_URL');
  }
  if (!SUPABASE_ANON_KEY) {
    errors.push('Missing VITE_SUPABASE_ANON_KEY');
  }

  if (SUPABASE_URL && !SUPABASE_URL.startsWith('https://')) {
    errors.push('VITE_SUPABASE_URL must start with https://');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

