/**
 * @nx-playground/analytics
 *
 * Unified analytics tracking library
 * Supports multiple providers (Google Analytics, Plausible, etc.)
 *
 * @example
 * ```typescript
 * import { initAnalytics, track, pageView } from '@nx-playground/analytics';
 *
 * // Initialize with provider
 * initAnalytics({ provider: 'ga4', measurementId: 'G-XXXXXXXXXX' });
 *
 * // Track events
 * track('button_clicked', { buttonId: 'signup', page: '/home' });
 * pageView('/blogs/2024-12');
 *
 * // Identify users
 * identify('user-123', { email: 'user@example.com' });
 * ```
 */

// Core functions
export * from './lib/analytics';

// Types
export * from './types/analytics';

// Providers
export * from './providers/ga4';
export * from './providers/plausible';

// React hooks
export * from './hooks/useAnalytics';
export * from './hooks/usePageTracking';
