# @nx-playground/test-utils

Unified testing utilities for the Nx monorepo. Provides mock data generators, test helpers, and custom matchers for consistent testing across all apps and libraries.

## 🚀 Features

- **Mock Data Generators**: Create realistic test data for users, events, blogs, projects
- **Test Helpers**: Render components with providers, wait utilities, mock functions
- **Custom Matchers**: Vitest matchers for common assertions
- **Type-Safe**: Full TypeScript support with type inference

## 📦 Installation

This is an internal Nx library. Add it to your app's dependencies:

```json
{
  "dependencies": {
    "@nx-playground/test-utils": "workspace:^"
  }
}
```

## 🛠️ Usage

### Mock Data Generators

```typescript
import {
  createMockUser,
  createMockEvent,
  createMockBlog,
  createMockProject,
} from '@nx-playground/test-utils';

// Create single mock
const user = createMockUser({ role: 'admin', name: 'Admin User' });
const event = createMockEvent({ capacity: 200 });
const blog = createMockBlog({ slug: '2025-01' });
const project = createMockProject({ type: 'lib', status: 'production' });

// Create multiple mocks
const users = createMockUsers(10); // Creates 10 mock users
const events = createMockEvents(5); // Creates 5 mock events
```

### Render Helpers

```typescript
import { renderWithProviders, screen } from '@nx-playground/test-utils';

// Render with all providers (i18n, theme, router)
const { getByText, getByRole } = renderWithProviders(<MyComponent />);

// Use screen queries
expect(screen.getByText('Hello')).toBeInTheDocument();
```

### Wait Utilities

```typescript
import { waitFor, wait, waitForNextTick } from '@nx-playground/test-utils';

// Wait for condition
await waitFor(() => expect(element).toBeInTheDocument());

// Wait for specific time
await wait(1000); // 1 second

// Wait for next tick
await waitForNextTick();
```

### Mock Functions

```typescript
import {
  createMockFn,
  mockConsole,
  mockFetch,
} from '@nx-playground/test-utils';

// Create typed mock
const onClickMock = createMockFn<(id: string) => void>();

// Mock console (prevent noise in tests)
const { mocks, restore } = mockConsole();
console.log('test'); // Mocked
expect(mocks.log).toHaveBeenCalled();
restore(); // Restore original console

// Mock fetch
mockFetch({ data: 'test' });
const response = await fetch('/api/test');
```

### Custom Matchers

```typescript
import { toHaveBeenCalledWithContext } from '@nx-playground/test-utils';
import { logger } from '@nx-playground/logger';
import { vi } from 'vitest';

// Extend expect with custom matcher
expect.extend({ toHaveBeenCalledWithContext });

// Mock logger
const loggerSpy = vi.spyOn(logger, 'info');

// Test
logger.info('User action', { userId: '123', action: 'login' });

// Assert
expect(loggerSpy).toHaveBeenCalledWithContext('User action', {
  userId: '123',
  action: 'login',
});
```

### Test Utilities

```typescript
import { randomId, suppressConsoleError } from '@nx-playground/test-utils';

// Generate unique test IDs
const id = randomId('test'); // 'test-abc123xyz'

// Suppress console errors during test
suppressConsoleError(() => {
  // Code that logs errors
  console.error('This will be suppressed');
});
```

## 📖 API Reference

### Mock Generators

| Function              | Returns         | Description                   |
| --------------------- | --------------- | ----------------------------- |
| `createMockUser()`    | `MockUser`      | Create single user            |
| `createMockUsers(n)`  | `MockUser[]`    | Create n users                |
| `createMockEvent()`   | `MockEvent`     | Create single event           |
| `createMockEvents(n)` | `MockEvent[]`   | Create n events               |
| `createMockBlog()`    | `MockBlog`      | Create single blog            |
| `createMockBlogs(n)`  | `MockBlog[]`    | Create n blogs                |
| `createMockProject()` | `MockProject`   | Create single project         |
| `createMockProjects(n)` | `MockProject[]` | Create n projects           |

### Test Helpers

| Function                  | Description                       |
| ------------------------- | --------------------------------- |
| `renderWithProviders()`   | Render with i18n, theme, router   |
| `waitFor()`               | Wait for condition                |
| `wait(ms)`                | Wait for milliseconds             |
| `waitForNextTick()`       | Wait for next event loop tick     |
| `createMockFn<T>()`       | Create typed mock function        |
| `mockConsole()`           | Mock all console methods          |
| `mockFetch(response)`     | Mock global fetch                 |

### Custom Matchers

| Matcher                           | Description                      |
| --------------------------------- | -------------------------------- |
| `toHaveBeenCalledWithContext()`   | Check logger context             |

## 🧪 Running Tests

```bash
# Test this library
nx test test-utils

# Test all projects using test-utils
nx affected --target=test
```

## 📋 Examples

### Testing a Component

```typescript
import { describe, it, expect } from 'vitest';
import {
  renderWithProviders,
  createMockUser,
  screen,
} from '@nx-playground/test-utils';
import { UserProfile } from './UserProfile';

describe('UserProfile', () => {
  it('should display user name', () => {
    const user = createMockUser({ name: 'John Doe' });
    renderWithProviders(<UserProfile user={user} />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('should show admin badge for admin users', () => {
    const admin = createMockUser({ role: 'admin' });
    renderWithProviders(<UserProfile user={admin} />);
    expect(screen.getByText('Admin')).toBeInTheDocument();
  });
});
```

### Testing Async Operations

```typescript
import { describe, it, expect } from 'vitest';
import {
  waitFor,
  mockFetch,
  createMockUsers,
} from '@nx-playground/test-utils';
import { fetchUsers } from './api';

describe('fetchUsers', () => {
  it('should fetch users from API', async () => {
    const mockUsers = createMockUsers(3);
    mockFetch(mockUsers);

    const users = await fetchUsers();

    await waitFor(() => {
      expect(users).toHaveLength(3);
    });
  });
});
```

### Testing Logger Calls

```typescript
import { describe, it, expect, vi } from 'vitest';
import { logger } from '@nx-playground/logger';
import { toHaveBeenCalledWithContext } from '@nx-playground/test-utils';
import { loginUser } from './auth';

expect.extend({ toHaveBeenCalledWithContext });

describe('loginUser', () => {
  it('should log user login', async () => {
    const loggerSpy = vi.spyOn(logger, 'info');

    await loginUser('user@example.com', 'password');

    expect(loggerSpy).toHaveBeenCalledWithContext('User logged in', {
      email: 'user@example.com',
    });
  });
});
```

## 🔗 Links

- **Vitest**: https://vitest.dev/
- **React Testing Library**: https://testing-library.com/react
- **Test Best Practices**: https://kentcdodds.com/blog/common-mistakes-with-react-testing-library

---

Built with ❤️ for Nx Monorepo Testing
