/**
 * Supabase Edge Function: track-view
 * 
 * Purpose: Track blog post views with anti-spam protection
 * 
 * Features:
 * - IP hashing for privacy
 * - Rate limiting (1 hour window per IP)
 * - Deduplication
 * - Stats aggregation
 * 
 * Security:
 * - Uses service role for writes
 * - RLS policies enforced
 * - IP never stored in plaintext
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour

// Helper: Hash IP for privacy
async function hashIP(ip: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(ip);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

// Helper: Check if view already counted (within rate limit window)
async function isViewCounted(
  supabase: ReturnType<typeof createClient>,
  postId: string,
  ipHash: string
): Promise<boolean> {
  const windowStart = new Date(Date.now() - RATE_LIMIT_WINDOW_MS).toISOString();

  const { data, error } = await supabase
    .from('post_views')
    .select('id')
    .eq('post_id', postId)
    .eq('ip_hash', ipHash)
    .gte('created_at', windowStart)
    .limit(1);

  if (error) {
    console.error('Error checking view count:', error);
    return false; // Fail open: allow view if check fails
  }

  return data && data.length > 0;
}

// Helper: Insert new view record
async function insertView(
  supabase: ReturnType<typeof createClient>,
  postId: string,
  ipHash: string,
  userAgent: string | null
): Promise<boolean> {
  const { error } = await supabase
    .from('post_views')
    .insert({
      post_id: postId,
      ip_hash: ipHash,
      user_agent: userAgent,
    });

  if (error) {
    console.error('Error inserting view:', error);
    return false;
  }

  return true;
}

// Helper: Update aggregated stats
async function updateStats(
  supabase: ReturnType<typeof createClient>,
  postId: string
) {
  const { data, error } = await supabase.rpc('update_post_view_stats', {
    p_post_id: postId,
  });

  if (error) {
    console.error('Error updating stats:', error);
  }

  return data;
}

// Helper: Get current stats
async function getStats(
  supabase: ReturnType<typeof createClient>,
  postId: string
) {
  const { data, error } = await supabase
    .from('post_view_stats')
    .select('*')
    .eq('post_id', postId)
    .single();

  if (error) {
    console.error('Error fetching stats:', error);
    return {
      post_id: postId,
      total_views: 0,
      unique_ips: 0,
      last_updated: new Date().toISOString(),
    };
  }

  return data;
}

// Main handler
Deno.serve(async (req) => {
  try {
    // CORS headers
    if (req.method === 'OPTIONS') {
      return new Response('ok', {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      });
    }

    // Only allow POST
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Parse request
    const { postId } = await req.json();

    if (!postId) {
      return new Response(JSON.stringify({ error: 'Missing postId' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Get client IP (Cloudflare/Deno Deploy)
    const clientIP = req.headers.get('x-forwarded-for')?.split(',')[0] 
      || req.headers.get('cf-connecting-ip') 
      || 'unknown';

    const userAgent = req.headers.get('user-agent');

    // Hash IP for privacy
    const ipHash = await hashIP(clientIP);

    // Create Supabase client with service role
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      }
    );

    // Check rate limit
    const alreadyCounted = await isViewCounted(supabase, postId, ipHash);

    if (alreadyCounted) {
      // View already counted, return current stats without inserting
      const stats = await getStats(supabase, postId);
      return new Response(
        JSON.stringify({
          success: true,
          counted: false,
          message: 'View already counted within rate limit window',
          stats,
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }

    // Insert new view
    const inserted = await insertView(supabase, postId, ipHash, userAgent);

    if (!inserted) {
      return new Response(JSON.stringify({ error: 'Failed to insert view' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Update aggregated stats
    await updateStats(supabase, postId);

    // Get updated stats
    const stats = await getStats(supabase, postId);

    // Return success
    return new Response(
      JSON.stringify({
        success: true,
        counted: true,
        message: 'View tracked successfully',
        stats,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
});

