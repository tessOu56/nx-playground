# Profile App - Cloudflare Pages Deployment

## Build Output

Location: `dist/apps/profile/`

## Cloudflare Pages Settings

**Build Command**: `pnpm nx build profile --configuration=production`
**Build Output**: `dist/apps/profile`
**Node Version**: 20

## Environment Variables

```
VITE_ANALYTICS_PROVIDER=ga4
VITE_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Features

- Security headers configured (_headers)
- SPA routing configured (_redirects)
- PWA with service worker
- Analytics tracking ready

## Next Steps

1. Connect GitHub repo to Cloudflare Pages
2. Set environment variables
3. Deploy

