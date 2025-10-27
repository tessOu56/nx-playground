# @nx-playground/logger

Unified logging library for the Nx monorepo, providing structured logging with environment awareness and context injection.

## 🎯 Features

- ✅ **Structured Logging**: JSON format with metadata
- ✅ **Log Levels**: trace, debug, info, warn, error, fatal
- ✅ **Environment-Aware**: Automatic dev/prod configuration
- ✅ **Context Injection**: Attach user/request context to logs
- ✅ **Pretty Printing**: Colorized logs in development
- ✅ **Performance Timing**: Time function execution
- ✅ **Child Loggers**: Create scoped loggers with inherited context
- ✅ **Browser + Node.js**: Works in both environments

## 📦 Installation

Already installed as a workspace library. Import in your app:

```typescript
import { logger } from '@nx-playground/logger';
```

## 🚀 Quick Start

### Basic Usage

```typescript
import { logger } from '@nx-playground/logger';

// Info level (most common)
logger.info('User logged in', { userId: '123', email: 'user@example.com' });

// Warning
logger.warn('Rate limit approaching', { current: 95, limit: 100 });

// Error with exception
try {
  await fetchData();
} catch (error) {
  logger.error('Failed to fetch data', error, { endpoint: '/api/users' });
}

// Debug (only in development)
logger.debug('Processing request', { step: 1, total: 5 });
```

### Context Injection

Set persistent context for all logs:

```typescript
// Set context once (e.g., on user login)
logger.setContext({
  userId: '123',
  sessionId: 'abc-def',
  environment: 'production',
});

// All subsequent logs will include this context
logger.info('User action'); 
// Output: { userId: '123', sessionId: 'abc-def', environment: 'production', message: 'User action' }

// Clear context (e.g., on logout)
logger.clearContext();
```

### Child Loggers

Create scoped loggers for specific modules:

```typescript
// Create a child logger for API requests
const apiLogger = logger.child({ module: 'api', version: 'v1' });

apiLogger.info('Request started', { method: 'GET', path: '/users' });
// Output includes: { module: 'api', version: 'v1', method: 'GET', path: '/users' }
```

### Performance Timing

Time function execution automatically:

```typescript
// Time a synchronous function
const result = await logger.time('fetch-users', async () => {
  return await fetchUsers();
});
// Logs: "[fetch-users] Started" and "[fetch-users] Completed { duration: 245 }"

// Handle errors
try {
  await logger.time('risky-operation', async () => {
    throw new Error('Something went wrong');
  });
} catch (error) {
  // Logs: "[risky-operation] Failed { duration: 10, error: {...} }"
}
```

## 📊 Log Levels

| Level   | Use Case                          | Environment      |
|---------|-----------------------------------|------------------|
| `trace` | Very detailed debugging           | Development only |
| `debug` | Debugging information             | Development only |
| `info`  | General informational messages    | All              |
| `warn`  | Warning messages                  | All              |
| `error` | Error messages with exceptions    | All              |
| `fatal` | Critical errors (app crashes)     | All              |

### Setting Log Level

**Environment Variable** (Node.js):
```bash
LOG_LEVEL=debug npm start
```

**Custom Logger Instance**:
```typescript
import { Logger } from '@nx-playground/logger';

const customLogger = new Logger({
  level: 'warn', // Only warn, error, fatal
  name: 'my-service',
  prettyPrint: false, // Disable colors
});
```

## 🔧 Configuration

### Default Configuration

- **Development**: `level=debug`, pretty printing enabled
- **Production**: `level=info`, JSON output

### Custom Configuration

```typescript
import { Logger } from '@nx-playground/logger';

const customLogger = new Logger({
  level: 'info',
  name: 'my-app',
  enabled: true,
  prettyPrint: false,
});

customLogger.info('Using custom logger');
```

## 🎨 Examples

### React Component

```typescript
import { logger } from '@nx-playground/logger';
import { useEffect } from 'react';

function UserProfile({ userId }: { userId: string }) {
  useEffect(() => {
    // Set context for this user session
    logger.setContext({ userId, component: 'UserProfile' });

    logger.info('Component mounted');

    return () => {
      logger.info('Component unmounted');
      logger.clearContext();
    };
  }, [userId]);

  const handleAction = async () => {
    try {
      await logger.time('save-profile', async () => {
        await saveUserProfile(userId);
      });
      logger.info('Profile saved successfully');
    } catch (error) {
      logger.error('Failed to save profile', error);
    }
  };

  return <div>...</div>;
}
```

### API Request Handler (NestJS)

```typescript
import { logger } from '@nx-playground/logger';

@Controller('users')
export class UsersController {
  @Get(':id')
  async getUser(@Param('id') id: string, @Req() req: Request) {
    const requestLogger = logger.child({
      requestId: req.id,
      method: req.method,
      path: req.path,
    });

    requestLogger.info('Fetching user');

    try {
      const user = await logger.time('db-query', async () => {
        return await this.usersService.findOne(id);
      });

      requestLogger.info('User fetched successfully', { userId: user.id });
      return user;
    } catch (error) {
      requestLogger.error('Failed to fetch user', error, { userId: id });
      throw error;
    }
  }
}
```

### Edge Function (Supabase)

```typescript
import { logger } from '@nx-playground/logger';

Deno.serve(async (req) => {
  const requestLogger = logger.child({
    requestId: crypto.randomUUID(),
    path: new URL(req.url).pathname,
  });

  requestLogger.info('Request received');

  try {
    const result = await logger.time('process-request', async () => {
      return await processRequest(req);
    });

    requestLogger.info('Request processed successfully');
    return new Response(JSON.stringify(result));
  } catch (error) {
    requestLogger.error('Request processing failed', error);
    return new Response('Internal Server Error', { status: 500 });
  }
});
```

## 🧪 Testing

Run tests:

```bash
nx test @nx-playground/logger
```

Mock logger in tests:

```typescript
import { Logger } from '@nx-playground/logger';
import { vi } from 'vitest';

describe('MyComponent', () => {
  let mockLogger: Logger;

  beforeEach(() => {
    mockLogger = new Logger({ enabled: false }); // Disable logging in tests
  });

  it('should log user action', () => {
    const infoSpy = vi.spyOn(mockLogger, 'info');
    
    // Your test code
    mockLogger.info('User clicked button');
    
    expect(infoSpy).toHaveBeenCalledWith('User clicked button');
  });
});
```

## 📚 Best Practices

### ✅ DO

- Use structured data in log messages
- Set context for user sessions
- Use appropriate log levels
- Time expensive operations
- Create child loggers for modules

```typescript
// Good
logger.info('User login successful', { 
  userId: user.id, 
  method: 'email',
  timestamp: new Date().toISOString(),
});

// Good
const apiLogger = logger.child({ module: 'api' });
apiLogger.info('Request started');
```

### ❌ DON'T

- Log sensitive data (passwords, tokens)
- Use console.log directly
- Log in hot loops (performance)
- Hardcode log messages without context

```typescript
// Bad
console.log('User:', user); // Use logger instead

// Bad
logger.info('Login', { password: user.password }); // Never log passwords

// Bad (in loop)
items.forEach(item => {
  logger.debug('Processing item', item); // Too verbose
});
```

## 🔗 Integration

### Profile App

```typescript
// apps/profile/src/main.tsx
import { logger } from '@nx-playground/logger';

logger.info('Profile app starting');

// Set global context
logger.setContext({
  app: 'profile',
  version: '1.0.0',
  environment: import.meta.env.MODE,
});
```

### API Server

```typescript
// apps/api-server/src/main.ts
import { logger } from '@nx-playground/logger';

async function bootstrap() {
  logger.info('API server starting');
  
  const app = await NestFactory.create(AppModule);
  
  // Log all requests
  app.use((req, res, next) => {
    logger.info('Request received', {
      method: req.method,
      path: req.path,
    });
    next();
  });
  
  await app.listen(3000);
  logger.info('API server listening', { port: 3000 });
}
```

## 🔍 Debugging

View logs in development:

```bash
# Set log level to debug
LOG_LEVEL=debug pnpm dev:profile

# Set log level to trace (most verbose)
LOG_LEVEL=trace pnpm dev:profile
```

## 📊 Log Output Examples

### Development (Pretty)

```
[10:30:15.123] INFO (profile/12345): User logged in
    userId: "123"
    email: "user@example.com"
```

### Production (JSON)

```json
{"level":30,"time":1706342415123,"name":"profile","userId":"123","email":"user@example.com","msg":"User logged in"}
```

## 🚀 Roadmap

- [ ] Remote logging (send to external service)
- [ ] Log aggregation
- [ ] Log rotation
- [ ] Custom transports
- [ ] React DevTools integration

## 🔗 Links

- [Pino Documentation](https://getpino.io/)
- [Infrastructure Gaps Analysis](../../docs/architecture/INFRASTRUCTURE_GAPS.md)
- [Project Status](../../specs/PROJECT_STATUS.md)

---

Built with ❤️ for nx-playground monorepo
