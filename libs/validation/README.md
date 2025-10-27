# @nx-playground/validation

Unified validation library using Zod for all Nx apps. Provides type-safe, reusable validation schemas with automatic TypeScript type inference.

## 🎯 Features

- ✅ **Type-safe validation** with Zod
- ✅ **TypeScript inference** - automatic types from schemas
- ✅ **Reusable schemas** - common, user, event
- ✅ **I18n-ready** - customizable error messages
- ✅ **Cross-app consistency** - auth, event-cms, api-server use same schemas
- ✅ **Composable** - build complex schemas from primitives
- ✅ **Well-tested** - comprehensive unit tests

## 📦 Installation

Already installed as a workspace library. Import in your app:

```typescript
import { userLoginSchema, eventCreateSchema } from '@nx-playground/validation';
```

## 🚀 Quick Start

### Basic Validation

```typescript
import { userLoginSchema } from '@nx-playground/validation';

const result = userLoginSchema.safeParse({
  email: 'user@example.com',
  password: 'password123',
});

if (result.success) {
  console.log('Valid data:', result.data);
} else {
  console.error('Errors:', result.error.issues);
}
```

### Type Inference

```typescript
import { z } from 'zod';
import { userLoginSchema } from '@nx-playground/validation';

// Automatic type inference
type UserLogin = z.infer<typeof userLoginSchema>;
// { email: string; password: string }

const login: UserLogin = {
  email: 'user@example.com',
  password: 'password123',
};
```

### Form Validation (React)

```typescript
import { userRegisterSchema, type UserRegister } from '@nx-playground/validation';

function RegisterForm() {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (data: UserRegister) => {
    const result = userRegisterSchema.safeParse(data);

    if (!result.success) {
      const formattedErrors = formatZodError(result.error);
      setErrors(formattedErrors);
      return;
    }

    // Data is valid, submit to API
    submitRegistration(result.data);
  };

  return <form onSubmit={handleSubmit}>...</form>;
}
```

## 📚 Available Schemas

### Common Schemas (`@nx-playground/validation`)

| Schema                    | Description                           | Example                        |
| ------------------------- | ------------------------------------- | ------------------------------ |
| `emailSchema`             | Email validation                      | `user@example.com`             |
| `passwordSchema`          | Password (8+ chars, mixed case)       | `Password123`                  |
| `strongPasswordSchema`    | Password with special char            | `P@ssw0rd!`                    |
| `phoneSchema`             | International phone format            | `+886912345678`                |
| `urlSchema`               | Valid URL                             | `https://example.com`          |
| `uuidSchema`              | UUID v4                               | `123e4567-e89b-12d3-a456...`   |
| `slugSchema`              | URL-friendly slug                     | `my-blog-post-2024`            |
| `localeSchema`            | Supported locales (en, zh-TW)         | `en` or `zh-TW`                |
| `paginationLimitSchema`   | Pagination limit (1-100, default 20)  | `20`                           |
| `paginationOffsetSchema`  | Pagination offset (0+, default 0)     | `0`                            |
| `hexColorSchema`          | Hex color code                        | `#FF5733`                      |

### User Schemas (`@nx-playground/validation`)

| Schema                       | Description                  | Usage                          |
| ---------------------------- | ---------------------------- | ------------------------------ |
| `userLoginSchema`            | Email + password             | Auth login                     |
| `userRegisterSchema`         | Full registration form       | Auth sign up                   |
| `userProfileSchema`          | Complete user profile        | Profile display                |
| `userProfileUpdateSchema`    | Partial profile update       | Profile edit                   |
| `passwordChangeSchema`       | Change password form         | Password change                |
| `emailVerificationSchema`    | Email + 6-digit code         | Email verification             |
| `passwordResetRequestSchema` | Email for reset              | Forgot password                |
| `passwordResetSchema`        | Reset with token             | Password reset                 |
| `userRoleSchema`             | User role enum               | RBAC                           |

### Event Schemas (`@nx-playground/validation`)

| Schema                      | Description                 | Usage                           |
| --------------------------- | --------------------------- | ------------------------------- |
| `eventCreateSchema`         | Create new event            | Event CMS                       |
| `eventUpdateSchema`         | Update event (partial)      | Event CMS                       |
| `eventSchema`               | Full event data             | Event display                   |
| `eventRegistrationSchema`   | Event registration form     | Event Portal                    |
| `eventFilterSchema`         | Event query filters         | Event search/filter             |
| `eventFormFieldSchema`      | Dynamic form field          | Form builder                    |
| `eventTemplateSchema`       | Event template              | Template management             |
| `eventStatusSchema`         | Status enum                 | Draft/Published/Cancelled/Done  |
| `eventVisibilitySchema`     | Visibility enum             | Public/Private/Unlisted         |

## 🎨 Examples

### User Registration (Auth app)

```typescript
import { userRegisterSchema, type UserRegister } from '@nx-playground/validation';

async function register(data: UserRegister) {
  // Parse and validate
  const result = userRegisterSchema.safeParse(data);

  if (!result.success) {
    throw new Error(formatZodError(result.error));
  }

  // Data is type-safe and validated
  const { email, password, displayName } = result.data;

  // Submit to API
  await api.post('/auth/register', result.data);
}
```

### Event Creation (Event CMS)

```typescript
import { eventCreateSchema, type EventCreate } from '@nx-playground/validation';

function CreateEventForm() {
  const onSubmit = (data: EventCreate) => {
    const result = eventCreateSchema.safeParse(data);

    if (!result.success) {
      // Show errors to user
      showErrors(formatZodError(result.error));
      return;
    }

    // Validate additional business rules
    if (new Date(result.data.endDate) < new Date()) {
      showError('Event cannot end in the past');
      return;
    }

    // Save event
    saveEvent(result.data);
  };

  return <EventForm onSubmit={onSubmit} />;
}
```

### API Validation (API Server)

```typescript
import { userLoginSchema } from '@nx-playground/validation';
import { BadRequestException } from '@nestjs/common';

@Post('login')
async login(@Body() body: unknown) {
  const result = userLoginSchema.safeParse(body);

  if (!result.success) {
    throw new BadRequestException(formatZodError(result.error));
  }

  // result.data is type-safe
  return await this.authService.login(result.data);
}
```

### Pagination (Any app)

```typescript
import { paginationLimitSchema, paginationOffsetSchema } from '@nx-playground/validation';

function getUsers(limit?: number, offset?: number) {
  // Parse with defaults
  const validLimit = paginationLimitSchema.parse(limit); // Default: 20
  const validOffset = paginationOffsetSchema.parse(offset); // Default: 0

  return db.users.findMany({
    take: validLimit,
    skip: validOffset,
  });
}
```

## 🔧 Helper Utilities

### `formatZodError`

Convert Zod errors to user-friendly object:

```typescript
import { formatZodError } from '@nx-playground/validation';

const result = userLoginSchema.safeParse(data);

if (!result.success) {
  const errors = formatZodError(result.error);
  // { email: 'Invalid email format', password: 'Password is required' }
}
```

### `getFirstError`

Get the first error message:

```typescript
import { getFirstError } from '@nx-playground/validation';

if (!result.success) {
  const message = getFirstError(result.error);
  // 'Invalid email format'
}
```

### `validateWithErrors`

Convenience wrapper:

```typescript
import { validateWithErrors, userLoginSchema } from '@nx-playground/validation';

const { success, data, errors } = validateWithErrors(userLoginSchema, formData);

if (success) {
  console.log('Valid data:', data);
} else {
  console.error('Errors:', errors);
}
```

## 🌐 I18n Support

Customize error messages for different locales:

```typescript
import { z, createErrorMap } from '@nx-playground/validation';

const zhTWMessages = {
  'invalid_type': '類型錯誤',
  'too_small': '長度不足',
  'invalid_string.email': '電子郵件格式錯誤',
};

z.setErrorMap(createErrorMap(zhTWMessages));

// Now all errors use Traditional Chinese
```

## 🧪 Testing

Run tests:

```bash
nx test @nx-playground/validation
```

Mock schemas in tests:

```typescript
import { userLoginSchema } from '@nx-playground/validation';

describe('LoginForm', () => {
  it('should validate correct data', () => {
    const data = { email: 'user@example.com', password: 'password' };
    expect(userLoginSchema.safeParse(data).success).toBe(true);
  });

  it('should reject invalid email', () => {
    const data = { email: 'invalid', password: 'password' };
    expect(userLoginSchema.safeParse(data).success).toBe(false);
  });
});
```

## 📊 Integration

### Auth App

```typescript
// apps/auth/src/pages/Login.tsx
import { userLoginSchema, formatZodError } from '@nx-playground/validation';

function LoginPage() {
  const handleSubmit = (e: FormEvent) => {
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    const result = userLoginSchema.safeParse(data);

    if (!result.success) {
      setErrors(formatZodError(result.error));
      return;
    }

    // Type-safe data
    login(result.data);
  };

  return <form onSubmit={handleSubmit}>...</form>;
}
```

### API Server

```typescript
// apps/api-server/src/modules/users/users.controller.ts
import { userRegisterSchema } from '@nx-playground/validation';

@Post('register')
async register(@Body() body: unknown) {
  const result = userRegisterSchema.safeParse(body);

  if (!result.success) {
    throw new BadRequestException(result.error.issues);
  }

  return await this.usersService.create(result.data);
}
```

### Event CMS

```typescript
// apps/event-cms/src/features/events/CreateEvent.tsx
import { eventCreateSchema, type EventCreate } from '@nx-playground/validation';

function CreateEventPage() {
  const handleSubmit = (data: EventCreate) => {
    const result = eventCreateSchema.safeParse(data);

    if (!result.success) {
      showValidationErrors(result.error);
      return;
    }

    createEvent(result.data);
  };

  return <EventForm onSubmit={handleSubmit} />;
}
```

## 📚 Best Practices

### ✅ DO

- Use schemas for all user input
- Infer types from schemas
- Use `safeParse` for user input
- Use `parse` for trusted data
- Compose complex schemas from primitives

```typescript
// Good: Type-safe and validated
const result = userLoginSchema.safeParse(userInput);
if (result.success) {
  const data: UserLogin = result.data;
}

// Good: Compose schemas
const extendedProfileSchema = userProfileSchema.extend({
  preferences: z.object({ theme: z.enum(['light', 'dark']) }),
});
```

### ❌ DON'T

- Don't validate on the client only (always validate server-side)
- Don't use `any` or `unknown` without validation
- Don't duplicate validation logic

```typescript
// Bad: No validation
function login(email: string, password: string) {
  // Trusting input without validation
}

// Good: Always validate
function login(data: unknown) {
  const result = userLoginSchema.safeParse(data);
  if (!result.success) throw new Error();
  // Use result.data
}
```

## 🔗 Adding Custom Schemas

Create new schemas in `libs/validation/src/schemas/`:

```typescript
// libs/validation/src/schemas/blog.ts
import { z } from 'zod';
import { slugSchema, localeSchema } from './common';

export const blogPostSchema = z.object({
  title: z.string().min(3).max(200),
  slug: slugSchema,
  content: z.string().min(10),
  publishDate: z.date(),
  locale: localeSchema,
  tags: z.array(z.string()).max(10),
});

export type BlogPost = z.infer<typeof blogPostSchema>;
```

Then export in `src/index.ts`:

```typescript
export * from './schemas/blog';
```

## 🚀 Roadmap

- [ ] Blog post schemas
- [ ] Comment schemas
- [ ] File upload validation
- [ ] Custom validation rules
- [ ] Integration with React Hook Form
- [ ] Integration with Formik

## 🔗 Links

- [Zod Documentation](https://zod.dev/)
- [Infrastructure Gaps Analysis](../../docs/architecture/INFRASTRUCTURE_GAPS.md)
- [Project Status](../../specs/PROJECT_STATUS.md)

---

Built with ❤️ for nx-playground monorepo
