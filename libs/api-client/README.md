# @nx-playground/api-client

A comprehensive React SDK for the NX Playground event management platform, featuring auto-generated API clients from OpenAPI specifications with full TypeScript support.

## Features

- 🔄 **Auto-generated API Client** - Generated from OpenAPI spec using Orval
- 🔐 **Authentication Management** - JWT token handling with auto-refresh
- 📊 **React Query Integration** - Optimized data fetching with caching
- 🎯 **Type Safety** - Full TypeScript support with generated types
- 🔌 **React Hooks** - Custom hooks for common operations
- 📱 **SSR Support** - Works with Next.js and other SSR frameworks
- 🛠️ **Developer Experience** - Built-in devtools and error handling

## Installation

```bash
# Install the SDK
npm install @nx-playground/api-client

# Peer dependencies (if not already installed)
npm install react react-dom @tanstack/react-query axios
```

## Quick Start

### 1. Setup Providers

```tsx
import { AuthProvider, QueryProvider } from '@nx-playground/api-client';

function App() {
  return (
    <QueryProvider>
      <AuthProvider>
        <YourApp />
      </AuthProvider>
    </QueryProvider>
  );
}
```

### 2. Use Authentication

```tsx
import { useAuth } from '@nx-playground/api-client';

function LoginForm() {
  const { login, isLoading, error } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Your form fields */}
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
      {error && <div className="error">{error}</div>}
    </form>
  );
}
```

### 3. Fetch Events

```tsx
import { useUpcomingEvents } from '@nx-playground/api-client';

function EventsList() {
  const { data: events, isLoading, error } = useUpcomingEvents(10);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {events?.map((event) => (
        <div key={event.id}>
          <h3>{event.title}</h3>
          <p>{event.description}</p>
        </div>
      ))}
    </div>
  );
}
```

### 4. Register for Events

```tsx
import { useEventRegistration } from '@nx-playground/api-client';

function RegisterButton({ eventId }) {
  const { mutate: register, isLoading } = useEventRegistration();

  const handleRegister = () => {
    register(
      { eventId, notes: 'Looking forward to this event!' },
      {
        onSuccess: () => {
          alert('Registration successful!');
        },
        onError: (error) => {
          alert('Registration failed: ' + error.message);
        },
      }
    );
  };

  return (
    <button onClick={handleRegister} disabled={isLoading}>
      {isLoading ? 'Registering...' : 'Register'}
    </button>
  );
}
```

## API Generation

The SDK uses [Orval](https://orval.dev/) to generate TypeScript API clients from OpenAPI specifications.

### Generate API Client

```bash
# Generate API client from OpenAPI spec
npm run generate:api

# Generate only TypeScript types
npm run generate:types
```

### OpenAPI Specification

The OpenAPI spec is located at `./specs/openapi.yaml` and defines all available endpoints, request/response types, and authentication requirements.

## Configuration

### Environment Variables

```env
# API Base URL
NEXT_PUBLIC_API_URL=https://api.nx-playground.local/v1

# Development
NODE_ENV=development
```

### Custom API Client

You can customize the API client configuration:

```tsx
import { apiClient, setTokens } from '@nx-playground/api-client';

// Configure base URL
apiClient.defaults.baseURL = 'https://your-api.com/v1';

// Set custom headers
apiClient.defaults.headers.common['X-Custom-Header'] = 'value';

// Set authentication tokens
setTokens('your-access-token', 'your-refresh-token');
```

## Available Hooks

### Authentication

- `useAuth()` - Authentication state and methods
- `useLogin()` - Login mutation (generated)
- `useRegister()` - Registration mutation (generated)

### Events

- `useEvents()` - List events with filters (generated)
- `useEvent()` - Get single event (generated)
- `useUpcomingEvents()` - Custom hook for upcoming events
- `useMyEvents()` - User's registered events
- `useEventRegistration()` - Register for events
- `useCanRegisterForEvent()` - Check registration eligibility

### Users

- `useUsers()` - List users (generated)
- `useUser()` - Get single user (generated)
- `useUpdateUser()` - Update user mutation (generated)

### Files

- `useUploadFile()` - File upload mutation (generated)

## Custom Hooks

You can create custom hooks for complex business logic:

```tsx
import { useApiQuery, queryKeys } from '@nx-playground/api-client';

export const useEventStatistics = (eventId: string) => {
  return useApiQuery(
    [...queryKeys.events.detail(eventId), 'statistics'],
    async () => {
      // Custom logic here
      return fetchEventStatistics(eventId);
    },
    {
      enabled: !!eventId,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );
};
```

## Error Handling

The SDK provides comprehensive error handling:

```tsx
import { getErrorMessage, isApiError } from '@nx-playground/api-client';

try {
  await someApiCall();
} catch (error) {
  if (isApiError(error)) {
    console.error('API Error:', error.response?.data);
  } else {
    console.error('General Error:', getErrorMessage(error));
  }
}
```

## Query Keys

Use the query keys factory for consistent cache management:

```tsx
import { queryKeys, useQueryClient } from '@nx-playground/api-client';

const queryClient = useQueryClient();

// Invalidate all events
queryClient.invalidateQueries({ queryKey: queryKeys.events.all });

// Invalidate specific event
queryClient.invalidateQueries({ queryKey: queryKeys.events.detail(eventId) });
```

## Development

### Prerequisites

- Node.js 18+
- npm or yarn

### Setup

```bash
# Install dependencies
npm install

# Generate API client
npm run generate:api

# Build library
npm run build

# Run tests
npm test
```

### Project Structure

```
src/
├── lib/
│   └── api-client.ts          # Core API client
├── generated/                 # Auto-generated API code
├── providers/
│   ├── AuthProvider.tsx       # Authentication context
│   └── QueryProvider.tsx      # React Query setup
├── hooks/
│   ├── useApi.ts             # Generic API hooks
│   └── useEvents.ts          # Event-specific hooks
├── utils/
│   └── query-keys.ts         # Query key factory
└── index.ts                  # Main exports
```

## Contributing

1. Update the OpenAPI specification in `./specs/openapi.yaml`
2. Run `npm run generate:api` to regenerate the client
3. Add custom business logic hooks as needed
4. Update tests and documentation

## License

MIT License - see LICENSE file for details.
