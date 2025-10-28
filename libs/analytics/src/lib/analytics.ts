/**
 * Core analytics functions
 */

import type {
  AnalyticsConfig,
  EventProperties,
  PageViewProperties,
  UserProperties,
} from '../types/analytics';
import { GA4Provider } from '../providers/ga4';
import { PlausibleProvider } from '../providers/plausible';

let currentProvider: any = null;
let config: AnalyticsConfig | null = null;

/**
 * Initialize analytics with provider
 */
export function initAnalytics(analyticsConfig: AnalyticsConfig): void {
  config = analyticsConfig;

  switch (analyticsConfig.provider) {
    case 'ga4':
      if (!analyticsConfig.measurementId) {
        console.warn('[Analytics] GA4 measurementId is required');
        return;
      }
      currentProvider = new GA4Provider(analyticsConfig.measurementId);
      break;

    case 'plausible':
      if (!analyticsConfig.domain) {
        console.warn('[Analytics] Plausible domain is required');
        return;
      }
      currentProvider = new PlausibleProvider(analyticsConfig.domain);
      break;

    case 'none':
      currentProvider = null;
      break;

    default:
      console.warn(`[Analytics] Unknown provider: ${analyticsConfig.provider}`);
  }

  if (analyticsConfig.debug) {
    console.log('[Analytics] Initialized with provider:', analyticsConfig.provider);
  }
}

/**
 * Track custom event
 */
export function track(
  eventName: string,
  properties?: EventProperties
): void {
  if (!currentProvider) {
    if (config?.debug) {
      console.log('[Analytics] Track (no provider):', eventName, properties);
    }
    return;
  }

  currentProvider.track(eventName, properties);

  if (config?.debug) {
    console.log('[Analytics] Track:', eventName, properties);
  }
}

/**
 * Track page view
 */
export function pageView(path: string, title?: string): void {
  if (!currentProvider) {
    if (config?.debug) {
      console.log('[Analytics] PageView (no provider):', path, title);
    }
    return;
  }

  currentProvider.pageView({
    path,
    title: title || document.title,
    referrer: document.referrer,
  });

  if (config?.debug) {
    console.log('[Analytics] PageView:', path, title);
  }
}

/**
 * Identify user
 */
export function identify(userId: string, properties?: UserProperties): void {
  if (!currentProvider) {
    if (config?.debug) {
      console.log('[Analytics] Identify (no provider):', userId, properties);
    }
    return;
  }

  currentProvider.identify(userId, properties);

  if (config?.debug) {
    console.log('[Analytics] Identify:', userId, properties);
  }
}

/**
 * Reset analytics (on logout)
 */
export function reset(): void {
  if (currentProvider?.reset) {
    currentProvider.reset();
  }

  if (config?.debug) {
    console.log('[Analytics] Reset');
  }
}
