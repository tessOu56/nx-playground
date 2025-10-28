/**
 * Analytics type definitions
 */

export type AnalyticsProviderType = 'ga4' | 'plausible' | 'none';

export interface AnalyticsConfig {
  provider: AnalyticsProviderType;
  measurementId?: string; // For GA4
  domain?: string; // For Plausible
  debug?: boolean;
}

export interface EventProperties {
  [key: string]: string | number | boolean | undefined;
}

export interface UserProperties {
  email?: string;
  name?: string;
  plan?: string;
  [key: string]: string | number | boolean | undefined;
}

export interface PageViewProperties {
  path: string;
  title?: string;
  referrer?: string;
}

export interface IAnalyticsProvider {
  track(eventName: string, properties?: EventProperties): void;
  pageView(properties: PageViewProperties): void;
  identify(userId: string, properties?: UserProperties): void;
  reset?(): void;
}

