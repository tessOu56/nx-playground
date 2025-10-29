/**
 * Supabase Database Types
 * 由 Supabase CLI 自動產生，或手動定義
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      posts: {
        Row: {
          id: string;
          author_id: string;
          title: string;
          slug: string;
          content: string;
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          author_id: string;
          title: string;
          slug: string;
          content: string;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          author_id?: string;
          title?: string;
          slug?: string;
          content?: string;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      post_views: {
        Row: {
          id: string;
          post_id: string;
          user_id: string | null;
          ip_hash: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          post_id: string;
          user_id?: string | null;
          ip_hash: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          post_id?: string;
          user_id?: string | null;
          ip_hash?: string;
          created_at?: string;
        };
      };
      post_view_stats: {
        Row: {
          post_id: string;
          total_views: number;
          unique_ips: number;
          last_updated: string;
        };
        Insert: {
          post_id: string;
          total_views?: number;
          unique_ips?: number;
          last_updated?: string;
        };
        Update: {
          post_id?: string;
          total_views?: number;
          unique_ips?: number;
          last_updated?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

// Type helpers for easier usage
export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T];
export type Row<T extends keyof Database['public']['Tables']> =
  Tables<T>['Row'];
export type Insert<T extends keyof Database['public']['Tables']> =
  Tables<T>['Insert'];
export type Update<T extends keyof Database['public']['Tables']> =
  Tables<T>['Update'];
