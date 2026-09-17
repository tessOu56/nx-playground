import { describe, expect, it } from 'vitest';

import {
  getEventStackBaseUrl,
  labelledDemoBffBaseUrl,
  shouldUseLabelledDemoBff,
} from './http';

describe('shouldUseLabelledDemoBff', () => {
  it('uses the labelled-demo BFF when Hobby mock host is the Next portal', () => {
    expect(
      shouldUseLabelledDemoBff({
        NEXT_PUBLIC_API_BASE_URL: 'https://nx-event-stack-api.vercel.app/api',
      })
    ).toBe(true);
  });

  it('uses the BFF on Vercel when the API base is unset', () => {
    expect(shouldUseLabelledDemoBff({ VERCEL: '1' })).toBe(true);
  });

  it('does not steal Render Nest or local Nest URLs', () => {
    expect(
      shouldUseLabelledDemoBff({
        VERCEL: '1',
        NEXT_PUBLIC_API_BASE_URL: 'https://nx-event-stack-nest.onrender.com/api',
      })
    ).toBe(false);
    expect(
      shouldUseLabelledDemoBff({
        NEXT_PUBLIC_API_BASE_URL: 'http://localhost:3001/api',
      })
    ).toBe(false);
  });

  it('can be forced off', () => {
    expect(
      shouldUseLabelledDemoBff({
        EVENT_STACK_LABELLED_DEMO_BFF: '0',
        NEXT_PUBLIC_API_BASE_URL: 'https://nx-event-stack-api.vercel.app/api',
      })
    ).toBe(false);
  });
});

describe('labelledDemoBffBaseUrl', () => {
  it('uses the public site URL on the server', () => {
    expect(
      labelledDemoBffBaseUrl(
        {
          NEXT_PUBLIC_SITE_URL: 'https://nx-event-portal.vercel.app/',
        },
        false
      )
    ).toBe('https://nx-event-portal.vercel.app/api');
  });

  it('uses a relative /api in the browser', () => {
    expect(labelledDemoBffBaseUrl({}, true)).toBe('/api');
  });
});

describe('getEventStackBaseUrl', () => {
  it('defaults to local Nest when no labelled-demo override applies', () => {
    const previous = {
      NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
      VITE_API_BASE_URL: process.env.VITE_API_BASE_URL,
      VERCEL: process.env.VERCEL,
      EVENT_STACK_LABELLED_DEMO_BFF: process.env.EVENT_STACK_LABELLED_DEMO_BFF,
    };
    delete process.env.NEXT_PUBLIC_API_BASE_URL;
    delete process.env.VITE_API_BASE_URL;
    delete process.env.VERCEL;
    delete process.env.EVENT_STACK_LABELLED_DEMO_BFF;
    try {
      expect(getEventStackBaseUrl()).toBe('http://localhost:3001/api');
    } finally {
      for (const [key, value] of Object.entries(previous)) {
        if (value === undefined) delete process.env[key];
        else process.env[key] = value;
      }
    }
  });
});
