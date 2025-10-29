/**
 * React Hook for Post Views
 * 處理 Blog 閱讀數的查詢與追蹤
 */

import { useEffect, useState } from 'react';

import { getSupabaseClient } from '../client';

import type { Database } from '../types';

type PostViewStatsRow = Database['public']['Tables']['post_view_stats']['Row'];

interface PostViewStats {
  postId: string;
  totalViews: number;
  uniqueIps: number;
  lastUpdated: string;
}

interface UsePostViewsResult {
  stats: PostViewStats | null;
  isLoading: boolean;
  error: Error | null;
  trackView: () => Promise<void>;
}

/**
 * Hook to fetch and track post view statistics
 * @param postId - The post/blog slug to track
 */
export function usePostViews(postId: string): UsePostViewsResult {
  const [stats, setStats] = useState<PostViewStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const supabase = getSupabaseClient();

  // Fetch view stats
  useEffect(() => {
    if (!postId) {
      setIsLoading(false);
      return;
    }

    const fetchStats = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from('post_view_stats')
          .select('*')
          .eq('post_id', postId)
          .single();

        if (fetchError) {
          // If no stats exist yet, return zeros
          if (fetchError.code === 'PGRST116') {
            setStats({
              postId,
              totalViews: 0,
              uniqueIps: 0,
              lastUpdated: new Date().toISOString(),
            });
          } else {
            throw fetchError;
          }
        } else if (data) {
          const statsData = data as PostViewStatsRow;
          setStats({
            postId: statsData.post_id,
            totalViews: statsData.total_views,
            uniqueIps: statsData.unique_ips,
            lastUpdated: statsData.last_updated,
          });
        }
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error('Failed to fetch view stats')
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [postId, supabase]);

  // Track a new view
  const trackView = async () => {
    try {
      // Call Edge Function to track view
      const { data, error: trackError } = await supabase.functions.invoke(
        'track-view',
        {
          body: { postId },
        }
      );

      if (trackError) {
        console.error('Failed to track view:', trackError);
        return;
      }

      // Update local stats if returned from Edge Function
      if (data?.stats) {
        setStats({
          postId: data.stats.post_id,
          totalViews: data.stats.total_views,
          uniqueIps: data.stats.unique_ips,
          lastUpdated: data.stats.last_updated,
        });
      }
    } catch (err) {
      console.error('Error tracking view:', err);
    }
  };

  return {
    stats,
    isLoading,
    error,
    trackView,
  };
}
