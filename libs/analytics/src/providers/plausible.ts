/**
 * Plausible Analytics provider
 */

import type {
  IAnalyticsProvider,
  EventProperties,
  PageViewProperties,
  UserProperties,
} from '../types/analytics';

interface PlausibleFunction {
  (...args: any[]): void;
  q?: any[];
}

declare global {
  interface Window {
    plausible?: PlausibleFunction;
  }
}

export class PlausibleProvider implements IAnalyticsProvider {
  private domain: string;

  constructor(domain: string) {
    this.domain = domain;
    this.loadScript();
  }

  private loadScript(): void {
    // Load Plausible script if not already loaded
    if (window.plausible) return;

    const script = document.createElement('script');
    script.src = 'https://plausible.io/js/script.js';
    script.defer = true;
    script.setAttribute('data-domain', this.domain);
    document.head.appendChild(script);

    // Initialize plausible function
    window.plausible =
      window.plausible ||
      function () {
        (window.plausible!.q = window.plausible!.q || []).push(arguments);
      };
  }

  track(eventName: string, properties?: EventProperties): void {
    if (!window.plausible) return;

    window.plausible(eventName, { props: properties });
  }

  pageView(properties: PageViewProperties): void {
    if (!window.plausible) return;

    // Plausible auto-tracks page views, but we can manually trigger
    window.plausible('pageview', {
      props: {
        path: properties.path,
        title: properties.title,
      },
    });
  }

  identify(userId: string, properties?: UserProperties): void {
    // Plausible doesn't support user identification
    // Use custom events instead
    if (!window.plausible) return;

    window.plausible('identify', {
      props: { userId, ...properties },
    });
  }

  reset(): void {
    // Plausible doesn't require reset
  }
}

