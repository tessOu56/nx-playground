/**
 * Supabase Client Library
 * 封裝 Supabase SDK，提供 type-safe 的 client 與 hooks
 */

// Client
export {
  createSupabaseClient,
  getSupabaseClient,
  resetSupabaseClient,
  validateEnvironment,
} from './lib/client';

// Types
export type { Database, Json } from './lib/types';

// Hooks
export { usePostViews } from './lib/hooks';
