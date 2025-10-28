# @nx-playground/supabase-client

Supabase client library for the Nx monorepo, providing type-safe database access, authentication, realtime subscriptions, and Edge Function callers.

## 🎯 Purpose

Centralized Supabase integration following the **Mode S** strategy:
- **Single Source of Truth (SSOT)**: Supabase為 DDL/migrations 唯一路徑
- **Type-safe**: TypeScript types generated from Supabase schema
- **Reusable**: Shared across all apps (profile, event-portal, etc.)
- **Secure**: RLS policies enforced, environment-aware configuration

## 📦 Installation

Already installed as a workspace library. Import in your app:

```typescript
import { 
  getSupabaseClient, 
  usePostViews 
} from '@nx-playground/supabase-client';
```

## 🔧 Setup

### 1. Environment Variables

Create `.env.local` in your app directory:

```bash
# apps/profile/.env.local
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

⚠️ **Never commit `.env.local` or expose `SUPABASE_SERVICE_ROLE_KEY` in frontend!**

### 2. Run SQL Migrations

Execute the schema in Supabase SQL Editor:

1. Go to https://supabase.com/dashboard → Your Project → SQL Editor
2. Copy contents of `sql/001_initial_schema.sql`
3. Run the query
4. Verify tables created: `posts`, `post_views`, `post_view_stats`

### 3. Deploy Edge Function

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link project
supabase link --project-ref your-project-ref

# Deploy function
supabase functions deploy track-view
```

## 🚀 Usage

### Basic Client Usage

```typescript
import { getSupabaseClient } from '@nx-playground/supabase-client';

const supabase = getSupabaseClient();

// Query data
const { data, error } = await supabase
  .from('posts')
  .select('*')
  .eq('slug', '2024-12')
  .single();
```

### React Hook: Post Views

Track and display blog post view counts:

```typescript
import { usePostViews } from '@nx-playground/supabase-client';

function BlogPost({ slug }: { slug: string }) {
  const { stats, isLoading, error, trackView } = usePostViews(slug);

  useEffect(() => {
    // Track view when component mounts
    trackView();
  }, [trackView]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>Post: {slug}</h1>
      <p>Total Views: {stats?.totalViews || 0}</p>
      <p>Unique Visitors: {stats?.uniqueIps || 0}</p>
    </div>
  );
}
```

## 📊 Database Schema

### Tables

#### `posts`
- Blog metadata (title, slug, published_at)
- Maps to `specs/blogs/*.md`

#### `post_views`
- Raw view records
- Written by Edge Function only (RLS enforced)
- IP hashing for privacy

#### `post_view_stats`
- Aggregated statistics
- Fast queries for UI display
- Updated by Edge Function

### RLS Policies

- ✅ **posts**: Anyone can read published posts
- ✅ **post_views**: Only service role can insert
- ✅ **post_view_stats**: Anyone can read, only service role can update

## 🔒 Security

### RLS (Row Level Security)
All tables have RLS enabled with strict policies:
- Default: Deny all writes
- Edge Function: Uses service role for writes
- Frontend: Uses anon key for reads

### Environment Separation
- **Dev**: Local Supabase or dev project
- **Staging**: Separate Supabase project
- **Production**: Production project with strict RLS

### Key Management
- ✅ Anon key: Safe to expose in frontend
- ❌ Service role key: Server-side only (Edge Functions)
- ❌ Never commit keys to git

## 🧪 Testing

```bash
# Unit tests
nx test @nx-playground/supabase-client

# E2E RLS tests
# See sql/test_rls.sql
```

## 📚 API Reference

### Client

```typescript
// Create/get client
const client = getSupabaseClient();

// Validate environment
const { isValid, errors } = validateEnvironment();

// Reset instance (testing)
resetSupabaseClient();
```

### Hooks

```typescript
// Post views
const { stats, isLoading, error, trackView } = usePostViews(postId);
```

## 🎯 Roadmap

- [ ] Auth hooks (useAuth, useSession)
- [ ] Realtime hooks (useRealtimeSubscription)
- [ ] Storage helpers (uploadFile, getPublicUrl)
- [ ] Nx generator for Supabase features

## 🔗 Links

- [Supabase Docs](https://supabase.com/docs)
- [Project Status](../../specs/PROJECT_STATUS.md)
- [Backend Evaluation Plan](../../specs/BACKEND/BACKEND_EVALUATION.md)

---

Built with ❤️ for nx-playground monorepo
