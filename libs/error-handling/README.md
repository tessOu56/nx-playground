# @nx-playground/error-handling

Unified error handling library with custom error classes, React Error Boundary, and i18n-ready error messages.

## 🎯 Features

- ✅ **Custom Error Classes** - Type-safe error hierarchy
- ✅ **Error Codes** - Standardized error codes across all apps
- ✅ **React Error Boundary** - Catch errors in component tree
- ✅ **useErrorHandler Hook** - React hook for error handling
- ✅ **I18n Support** - Localized error messages (en, zh-TW)
- ✅ **Operational vs Programmer Errors** - Distinguish error types
- ✅ **Context Preservation** - Attach metadata to errors
- ✅ **Logger Integration** - Auto-logs errors

## 📦 Installation

Already installed as a workspace library. Import in your app:

```typescript
import { AppError, ErrorCode, ErrorBoundary } from '@nx-playground/error-handling';
```

## 🚀 Quick Start

### Custom Error Classes

```typescript
import { NotFoundError, ValidationError, AuthenticationError } from '@nx-playground/error-handling';

// Throw errors
throw new NotFoundError('User', { userId: '123' });
throw new ValidationError('Invalid email format', { email: 'invalid' });
throw new AuthenticationError('Token expired');
```

### Error Boundary

```typescript
import { ErrorBoundary } from '@nx-playground/error-handling';

function App() {
  return (
    <ErrorBoundary>
      <YourComponent />
    </ErrorBoundary>
  );
}
```

### Custom Fallback UI

```typescript
<ErrorBoundary
  fallback={(error, reset) => (
    <div>
      <h1>Error: {error.message}</h1>
      <button onClick={reset}>Try Again</button>
    </div>
  )}
>
  <YourComponent />
</ErrorBoundary>
```

### useErrorHandler Hook

```typescript
import { useErrorHandler } from '@nx-playground/error-handling';

function MyComponent() {
  const { handleError, message, hasError, clearError } = useErrorHandler('en');

  const fetchData = async () => {
    try {
      await api.fetchUsers();
    } catch (error) {
      handleError(error, { action: 'fetch-users' });
    }
  };

  if (hasError) {
    return <div>Error: {message}</div>;
  }

  return <div>...</div>;
}
```

## 📚 Error Classes

### Base Classes

| Class                   | Status Code | Error Code            | Use Case                    |
|-------------------------|-------------|-----------------------|-----------------------------|
| `AppError`              | Custom      | Custom                | Base class for all errors   |
| `AuthenticationError`   | 401         | AUTH_001              | Login required              |
| `AuthorizationError`    | 403         | AUTH_002              | Insufficient permissions    |
| `ValidationError`       | 400         | VAL_001               | Invalid input               |
| `NotFoundError`         | 404         | RES_001               | Resource not found          |
| `ConflictError`         | 409         | RES_002               | Resource already exists     |
| `NetworkError`          | 503         | NET_001               | Network request failed      |
| `DatabaseError`         | 500         | DB_001                | Database operation failed   |
| `BusinessError`         | 422         | BIZ_001               | Business rule violation     |

### Error Codes

#### Authentication (1xxx)
- `AUTH_001` - UNAUTHORIZED
- `AUTH_002` - FORBIDDEN
- `AUTH_003` - INVALID_CREDENTIALS
- `AUTH_004` - TOKEN_EXPIRED
- `AUTH_005` - SESSION_EXPIRED

#### Validation (2xxx)
- `VAL_001` - VALIDATION_FAILED
- `VAL_002` - INVALID_EMAIL
- `VAL_003` - INVALID_PASSWORD
- `VAL_004` - REQUIRED_FIELD
- `VAL_005` - INVALID_FORMAT

#### Resource (3xxx)
- `RES_001` - NOT_FOUND
- `RES_002` - ALREADY_EXISTS
- `RES_003` - CONFLICT

#### Network (4xxx)
- `NET_001` - NETWORK_ERROR
- `NET_002` - TIMEOUT
- `NET_003` - SERVICE_UNAVAILABLE

#### Database (5xxx)
- `DB_001` - DATABASE_ERROR
- `DB_002` - QUERY_FAILED
- `DB_003` - CONNECTION_FAILED

#### Business Logic (6xxx)
- `BIZ_001` - BUSINESS_RULE_VIOLATION
- `BIZ_002` - INSUFFICIENT_PERMISSIONS
- `BIZ_003` - QUOTA_EXCEEDED

#### System (9xxx)
- `SYS_001` - INTERNAL_ERROR
- `SYS_002` - NOT_IMPLEMENTED
- `SYS_003` - MAINTENANCE

## 🎨 Examples

### API Request Handler

```typescript
import { NotFoundError, NetworkError } from '@nx-playground/error-handling';

async function fetchUser(id: string) {
  try {
    const response = await fetch(`/api/users/${id}`);
    
    if (response.status === 404) {
      throw new NotFoundError('User', { userId: id });
    }
    
    if (!response.ok) {
      throw new NetworkError('Failed to fetch user', { 
        status: response.status 
      });
    }
    
    return await response.json();
  } catch (error) {
    if (error instanceof AppError) {
      throw error; // Re-throw operational errors
    }
    // Wrap unknown errors
    throw new NetworkError('Unexpected error', { originalError: error });
  }
}
```

### Form Validation

```typescript
import { ValidationError } from '@nx-playground/error-handling';
import { userLoginSchema } from '@nx-playground/validation';

function LoginForm() {
  const handleSubmit = (data: unknown) => {
    const result = userLoginSchema.safeParse(data);
    
    if (!result.success) {
      throw new ValidationError('Invalid login credentials', {
        errors: result.error.issues,
      });
    }
    
    // Proceed with validated data
    login(result.data);
  };
}
```

### NestJS Exception Filter

```typescript
import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { AppError, getStatusCode } from '@nx-playground/error-handling';

@Catch(AppError)
export class AppErrorFilter implements ExceptionFilter {
  catch(exception: AppError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = getStatusCode(exception);

    response.status(status).json({
      statusCode: status,
      code: exception.code,
      message: exception.message,
      context: exception.context,
      timestamp: new Date().toISOString(),
    });
  }
}
```

### Error Boundary with Logging

```typescript
import { ErrorBoundary } from '@nx-playground/error-handling';
import { logger } from '@nx-playground/logger';

<ErrorBoundary
  onError={(error, errorInfo) => {
    logger.error('React error boundary triggered', error, {
      componentStack: errorInfo.componentStack,
    });
    
    // Send to external service (e.g., Sentry)
    Sentry.captureException(error);
  }}
>
  <App />
</ErrorBoundary>
```

## 🧪 Testing

Run tests:

```bash
nx test @nx-playground/error-handling
```

Test error handling:

```typescript
import { NotFoundError, ErrorCode } from '@nx-playground/error-handling';

describe('MyComponent', () => {
  it('should throw NotFoundError', () => {
    expect(() => {
      throw new NotFoundError('User');
    }).toThrow('User not found');
  });

  it('should have correct error code', () => {
    const error = new NotFoundError('User');
    expect(error.code).toBe(ErrorCode.NOT_FOUND);
    expect(error.statusCode).toBe(404);
  });
});
```

## 📚 Best Practices

### ✅ DO

- Use specific error classes
- Include context in errors
- Wrap third-party errors
- Log errors before throwing
- Use Error Boundary at app root

```typescript
// Good
throw new NotFoundError('User', { userId: '123', action: 'fetch' });

// Good
try {
  await externalApi.call();
} catch (error) {
  throw new NetworkError('External API failed', { originalError: error });
}
```

### ❌ DON'T

- Don't throw generic Error
- Don't expose sensitive data in error messages
- Don't swallow errors silently
- Don't log errors without context

```typescript
// Bad
throw new Error('Something went wrong'); // Use specific error class

// Bad
throw new ValidationError('Failed', { password: user.password }); // Don't expose sensitive data

// Bad
try {
  await operation();
} catch (error) {
  // Silent fail - BAD!
}
```

## 🌐 I18n Support

Error messages are available in English and Traditional Chinese:

```typescript
import { getErrorMessage, ErrorCode } from '@nx-playground/error-handling';

const message = getErrorMessage(ErrorCode.NOT_FOUND, 'en'); 
// "The requested resource was not found"

const messageTW = getErrorMessage(ErrorCode.NOT_FOUND, 'zh-TW'); 
// "找不到請求的資源"
```

## 🔗 Integration

### Profile App

```typescript
// Wrap app with Error Boundary
import { ErrorBoundary } from '@nx-playground/error-handling';

<ErrorBoundary>
  <App />
</ErrorBoundary>
```

### API Server

```typescript
// Use custom errors in controllers
import { NotFoundError } from '@nx-playground/error-handling';

@Get(':id')
async findOne(@Param('id') id: string) {
  const user = await this.usersService.findOne(id);
  if (!user) {
    throw new NotFoundError('User', { userId: id });
  }
  return user;
}
```

## 🚀 Roadmap

- [ ] Error recovery strategies
- [ ] Retry logic
- [ ] Circuit breaker pattern
- [ ] Error reporting to external services (Sentry, LogRocket)

## 🔗 Links

- [Infrastructure Gaps Analysis](../../docs/architecture/INFRASTRUCTURE_GAPS.md)
- [Project Status](../../specs/PROJECT_STATUS.md)

---

Built with ❤️ for nx-playground monorepo
