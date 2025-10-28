# @nx-playground/analytics

Unified analytics tracking library for the Nx monorepo. Supports multiple analytics providers (Google Analytics 4, Plausible) with a consistent API.

## 🚀 Features

- **Multiple Providers**: GA4, Plausible, or none (development)
- **Type-Safe**: Full TypeScript support
- **React Hooks**: `useAnalytics`, `usePageTracking`
- **Privacy-Focused**: Configurable tracking levels
- **Debug Mode**: Console logging for development

## 📦 Installation

This is an internal Nx library. Add it to your app's dependencies:

```json
{
  "dependencies": {
    "@nx-playground/analytics": "workspace:^"
  }
}
```

## ⚙️ Setup

### Initialize Analytics

```typescript
import { initAnalytics } from '@nx-playground/analytics';

// Google Analytics 4
initAnalytics({
  provider: 'ga4',
  measurementId: 'G-XXXXXXXXXX',
  debug: process.env.NODE_ENV === 'development',
});

// Plausible Analytics
initAnalytics({
  provider: 'plausible',
  domain: 'yourdomain.com',
  debug: process.env.NODE_ENV === 'development',
});

// Disable (for development)
initAnalytics({
  provider: 'none',
  debug: true,
});
```

### Environment Variables

```env
# .env.local
VITE_ANALYTICS_PROVIDER=ga4
VITE_GA4_MEASUREMENT_ID=G-XXXXXXXXXX

# or
VITE_ANALYTICS_PROVIDER=plausible
VITE_PLAUSIBLE_DOMAIN=yourdomain.com
```

## 🛠️ Usage

### Track Custom Events

```typescript
import { track } from '@nx-playground/analytics';

// Button click
track('button_clicked', {
  buttonId: 'signup',
  page: '/home',
  location: 'hero',
});

// Form submission
track('form_submitted', {
  formId: 'contact',
  success: true,
});

// Search query
track('search_query', {
  query: 'react hooks',
  resultCount: 5,
});

// Blog reading time
track('blog_read_time', {
  slug: '2024-12',
  timeSpent: 120, // seconds
});
```

### Track Page Views

```typescript
import { pageView } from '@nx-playground/analytics';

// Manual page view
pageView('/blogs/2024-12', 'My Blog Post Title');

// Auto page views (React Router)
import { useLocation } from 'react-router-dom';
import { usePageTracking } from '@nx-playground/analytics';

function App() {
  const location = useLocation();
  usePageTracking(location.pathname);

  return <Routes>...</Routes>;
}
```

### Identify Users

```typescript
import { identify } from '@nx-playground/analytics';

// After login
identify('user-123', {
  email: 'user@example.com',
  name: 'John Doe',
  plan: 'pro',
});

// After logout
import { reset } from '@nx-playground/analytics';
reset();
```

### React Hooks

```typescript
import { useAnalytics } from '@nx-playground/analytics';

function MyComponent() {
  const { track, identify } = useAnalytics();

  const handleClick = () => {
    track('button_clicked', { buttonId: 'cta' });
  };

  const handleLogin = (user) => {
    identify(user.id, { email: user.email });
  };

  return <button onClick={handleClick}>Click me</button>;
}
```

## 📖 API Reference

### Core Functions

| Function                                  | Description                |
| ----------------------------------------- | -------------------------- |
| `initAnalytics(config)`                   | Initialize provider        |
| `track(eventName, properties?)`           | Track custom event         |
| `pageView(path, title?)`                  | Track page view            |
| `identify(userId, properties?)`           | Identify user              |
| `reset()`                                 | Reset user (on logout)     |

### React Hooks

| Hook                      | Description                    |
| ------------------------- | ------------------------------ |
| `useAnalytics()`          | Get track/identify functions   |
| `usePageTracking(path)`   | Auto track page views          |

### Providers

| Provider     | Measurement ID Required | Notes                      |
| ------------ | ----------------------- | -------------------------- |
| `ga4`        | ✅ Yes                  | Google Analytics 4         |
| `plausible`  | Domain required         | Privacy-focused analytics  |
| `none`       | ❌ No                   | Development mode (console) |

## 🎯 Event Naming Conventions

Follow these conventions for consistency:

### Action Events
- `button_clicked`
- `link_clicked`
- `form_submitted`
- `modal_opened`
- `modal_closed`

### Content Events
- `page_viewed`
- `blog_read`
- `project_viewed`
- `search_performed`

### User Events
- `user_registered`
- `user_logged_in`
- `user_logged_out`
- `user_updated_profile`

### E-commerce Events (if applicable)
- `product_viewed`
- `add_to_cart`
- `checkout_started`
- `purchase_completed`

## 🔒 Privacy

- No PII (Personally Identifiable Information) in event properties
- User email/name only in `identify()` calls
- IP anonymization enabled for GA4
- Cookie consent (future enhancement)

## 📊 Common Tracking Patterns

### Profile App

```typescript
// Track AI search
track('ai_search_query', {
  query: 'what is React',
  resultCount: 3,
  sessionId: 'session-123',
});

// Track blog reading
track('blog_viewed', {
  slug: '2024-12',
  title: 'My Blog Post',
  readingTime: 5,
});

// Track project detail
track('project_viewed', {
  projectId: 'profile',
  type: 'app',
});
```

### Event Portal

```typescript
// Track event registration
track('event_registration_started', {
  eventId: 'event-123',
  eventTitle: 'Tech Conference 2024',
});

track('event_registration_completed', {
  eventId: 'event-123',
  ticketType: 'early-bird',
  price: 1000,
});
```

## 🧪 Testing

```bash
# Test analytics library
nx test analytics

# Build
nx build analytics
```

## 🔗 Links

- **Google Analytics 4**: https://developers.google.com/analytics/devguides/collection/ga4
- **Plausible**: https://plausible.io/docs
- **Analytics Best Practices**: https://segment.com/academy/collecting-data/naming-conventions-for-clean-data/

---

Built with ❤️ for Privacy-Focused Analytics
