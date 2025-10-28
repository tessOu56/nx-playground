/**
 * Google Analytics 4 provider
 */

import type {
  IAnalyticsProvider,
  EventProperties,
  PageViewProperties,
  UserProperties,
} from '../types/analytics';

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

export class GA4Provider implements IAnalyticsProvider {
  private measurementId: string;

  constructor(measurementId: string) {
    this.measurementId = measurementId;
    this.loadScript();
  }

  private loadScript(): void {
    // Load GA4 script if not already loaded
    if (window.gtag) return;

    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtag/js?id=${this.measurementId}`;
    script.async = true;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      window.dataLayer?.push(arguments);
    };

    window.gtag('js', new Date());
    window.gtag('config', this.measurementId, {
      send_page_view: false, // We'll handle page views manually
    });
  }

  track(eventName: string, properties?: EventProperties): void {
    if (!window.gtag) return;

    window.gtag('event', eventName, properties);
  }

  pageView(properties: PageViewProperties): void {
    if (!window.gtag) return;

    window.gtag('event', 'page_view', {
      page_path: properties.path,
      page_title: properties.title,
      page_referrer: properties.referrer,
    });
  }

  identify(userId: string, properties?: UserProperties): void {
    if (!window.gtag) return;

    window.gtag('config', this.measurementId, {
      user_id: userId,
      user_properties: properties,
    });
  }

  reset(): void {
    // GA4 doesn't have a built-in reset, handled by session management
  }
}

