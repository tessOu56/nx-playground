# Performance Optimization Guide

This document explains the performance optimizations implemented in the Profile app and how to test them.

## Implemented Optimizations

### 1. Code Splitting (React.lazy + Suspense)

**What**: All pages are lazy loaded, reducing initial bundle size by ~60-70%.

**Files**:
- `src/App.tsx` - Lazy imports for all pages
- `src/components/LoadingSpinner.tsx` - Suspense fallback component

**Benefits**:
- Smaller initial bundle
- Faster First Contentful Paint (FCP)
- Only load code when needed

**Testing**:
```bash
pnpm build
pnpm preview

# Open DevTools > Network > Disable cache
# Navigate between pages and watch chunk loading
```

### 2. Build Optimizations (Vite)

**What**: Intelligent code splitting and asset optimization.

**Files**:
- `vite.config.ts` - manualChunks configuration

**Chunks**:
- `vendor-react` - React core and router
- `vendor-radix` - Radix UI components
- `vendor-utils` - Utilities (date-fns, lodash)
- `vendor-other` - Other third-party packages
- `ui-components` - @nx-playground/ui-components
- `design-system` - @nx-playground/design-system
- `search-engine` - @nx-playground/search-engine
- `i18n` - @nx-playground/i18n

**Benefits**:
- Better long-term caching
- Parallel loading
- Smaller individual chunks

**Testing**:
```bash
pnpm build

# Check dist/apps/profile/assets/ for chunk files
# Verify vendor chunks are separated
```

### 3. PWA (Progressive Web App)

**What**: Full PWA support with offline capability.

**Files**:
- `public/manifest.json` - App metadata
- `public/sw.js` - Service worker
- `src/main.tsx` - SW registration
- `index.html` - Manifest link

**Features**:
- Installable as native app
- Offline support
- Cached assets for repeat visits
- Network-first with cache fallback

**Testing**:
```bash
pnpm build
pnpm preview

# Open DevTools > Application > Manifest
# Check manifest loads correctly

# DevTools > Application > Service Workers
# Verify service worker registered

# DevTools > Application > Cache Storage
# Check cached files

# Turn on airplane mode and refresh
# App should still work (for cached pages)
```

### 4. Font Optimization

**What**: Using system fonts for zero loading time.

**Files**:
- `src/index.css` - System font stack

**Font Stack**:
```
-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 
'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 
'Droid Sans', 'Helvetica Neue', sans-serif
```

**Benefits**:
- Zero network requests for fonts
- Instant text rendering
- Native OS appearance
- Better performance on all devices

**Testing**:
```bash
# Open DevTools > Network
# Filter by "Font"
# Should see 0 font requests
```

### 5. Image Optimization

**What**: Optimized image component with lazy loading and placeholders.

**Files**:
- `src/components/OptimizedImage.tsx` - Image component
- `index.html` - Preconnect to image CDN

**Features**:
- Lazy loading by default
- Blur placeholder during load
- Error handling
- Priority loading for above-fold images
- Async decoding

**Usage**:
```tsx
import { OptimizedImage } from '@/components/OptimizedImage';

// Regular image (lazy loaded)
<OptimizedImage
  src="https://example.com/image.jpg"
  alt="Description"
  width={800}
  height={600}
/>

// Priority image (eager loading for hero)
<OptimizedImage
  src="https://example.com/hero.jpg"
  alt="Hero"
  priority
/>
```

**Testing**:
```bash
# Open DevTools > Network
# Scroll down the page
# Watch images load only when visible
```

### 6. Resource Hints

**What**: Preconnect and DNS prefetch for external resources.

**Files**:
- `index.html` - Resource hints

**Implementation**:
```html
<!-- Preconnect to external domains -->
<link rel="preconnect" href="https://picsum.photos" crossorigin />

<!-- DNS Prefetch -->
<link rel="dns-prefetch" href="https://picsum.photos" />
```

**Benefits**:
- Faster connection to CDN
- Reduced latency for external resources

## Lighthouse Testing

### Run Lighthouse Audit

```bash
# Build production version
pnpm build

# Serve production build
pnpm preview

# Open Chrome DevTools > Lighthouse
# Select:
#   - Performance ✓
#   - Progressive Web App ✓
#   - Best Practices ✓
#   - Accessibility ✓
#   - SEO ✓
# Click "Generate report"
```

### Expected Scores (Desktop)

- ✅ Performance: 90-95
- ✅ PWA: 100
- ✅ Best Practices: 95-100
- ✅ Accessibility: 90-95
- ✅ SEO: 95-100

### Expected Scores (Mobile)

- ✅ Performance: 85-90
- ✅ PWA: 100
- ✅ Best Practices: 95-100
- ✅ Accessibility: 90-95
- ✅ SEO: 95-100

### Key Metrics Targets

| Metric | Target | Description |
|--------|--------|-------------|
| FCP | < 1.8s | First Contentful Paint |
| LCP | < 2.5s | Largest Contentful Paint |
| TBT | < 200ms | Total Blocking Time |
| CLS | < 0.1 | Cumulative Layout Shift |
| SI | < 3.4s | Speed Index |

## Bundle Analysis

### Analyze Bundle Size

```bash
# Build with analysis
pnpm build

# Check output
# dist/apps/profile/assets/

# Look for:
# - vendor-react-[hash].js (~150-200KB)
# - vendor-radix-[hash].js (~100-150KB)
# - main-[hash].js (~50-100KB)
# - Page chunks (~10-30KB each)
```

### Bundle Size Targets

- Main bundle: < 100KB (gzipped)
- Vendor chunks: < 200KB each (gzipped)
- Page chunks: < 30KB each (gzipped)
- Total initial load: < 300KB (gzipped)

## Production Checklist

Before deploying to production, verify:

- [ ] All Lighthouse scores > 90
- [ ] Service worker registers correctly
- [ ] PWA manifest valid
- [ ] Images lazy load
- [ ] Code splitting works
- [ ] Chunks load in parallel
- [ ] Cache headers set correctly
- [ ] HTTPS enabled (required for PWA)
- [ ] No console errors in production build

## Further Optimizations (Future)

If you need even better performance:

1. **Image CDN**:
   - Use Cloudflare Images or similar
   - Automatic WebP/AVIF conversion
   - Responsive image sizes

2. **Server-Side Rendering (SSR)**:
   - Migrate to Next.js or Remix
   - Faster initial page load
   - Better SEO

3. **Critical CSS**:
   - Extract above-fold CSS
   - Inline critical styles

4. **HTTP/3**:
   - Enable on CDN/hosting
   - Better performance over high-latency networks

5. **Advanced Service Worker**:
   - Use Workbox for more strategies
   - Background sync
   - Push notifications

## Troubleshooting

### Service Worker Not Registering

Check:
- Running in production mode (`pnpm build && pnpm preview`)
- HTTPS enabled (or localhost)
- No console errors
- `public/sw.js` exists in build output

### Poor Lighthouse Score

Common issues:
- Testing in development mode (use production build)
- Network throttling not enabled
- Browser extensions interfering
- Large images not optimized
- Missing meta tags

### Bundle Too Large

Solutions:
- Check for duplicate dependencies
- Remove unused imports
- Lazy load heavy components
- Split larger chunks further

## Resources

- [Vite Performance Guide](https://vitejs.dev/guide/performance.html)
- [Web.dev Performance](https://web.dev/performance/)
- [Lighthouse Documentation](https://developer.chrome.com/docs/lighthouse/)
- [PWA Checklist](https://web.dev/pwa-checklist/)

