# @nx-playground/constants

Shared constants for all Nx apps. Eliminates magic strings and numbers, provides type-safe constants.

## 🎯 Features

- ✅ **HTTP Constants** - Status codes, methods, headers
- ✅ **Pagination** - Default values, limits, sort orders
- ✅ **Validation** - String lengths, number limits, regex patterns
- ✅ **App** - Locales, themes, storage keys, time values
- ✅ **Type-safe** - All constants have TypeScript types
- ✅ **Zero dependencies** - Pure TypeScript

## 📦 Installation

Already installed as a workspace library. Import in your app:

```typescript
import { HTTP_STATUS, PAGINATION, LOCALE } from '@nx-playground/constants';
```

## 🚀 Quick Start

### HTTP Status Codes

```typescript
import { HTTP_STATUS } from '@nx-playground/constants';

if (response.status === HTTP_STATUS.OK) {
  // Handle success
}

if (response.status === HTTP_STATUS.NOT_FOUND) {
  throw new NotFoundError('Resource not found');
}
```

### Pagination

```typescript
import { PAGINATION } from '@nx-playground/constants';

function getUsers(page = PAGINATION.DEFAULT_PAGE, limit = PAGINATION.DEFAULT_LIMIT) {
  return db.users.findMany({
    skip: (page - 1) * limit,
    take: Math.min(limit, PAGINATION.MAX_LIMIT),
  });
}
```

### Locales

```typescript
import { LOCALE, SUPPORTED_LOCALES } from '@nx-playground/constants';

function switchLanguage(locale: string) {
  if (!SUPPORTED_LOCALES.includes(locale as any)) {
    throw new Error('Unsupported locale');
  }
  i18n.changeLanguage(locale);
}
```

### Time Constants

```typescript
import { TIME } from '@nx-playground/constants';

// Cache TTL
const CACHE_TTL = TIME.HOUR;

// Debounce delay
setTimeout(handleSearch, TIME.SECOND / 3); // 300ms
```

## 📚 Available Constants

### HTTP (`lib/http.ts`)

#### `HTTP_STATUS`
```typescript
HTTP_STATUS.OK                    // 200
HTTP_STATUS.CREATED               // 201
HTTP_STATUS.BAD_REQUEST           // 400
HTTP_STATUS.UNAUTHORIZED          // 401
HTTP_STATUS.FORBIDDEN             // 403
HTTP_STATUS.NOT_FOUND             // 404
HTTP_STATUS.INTERNAL_SERVER_ERROR // 500
// ... and more
```

#### `HTTP_METHOD`
```typescript
HTTP_METHOD.GET
HTTP_METHOD.POST
HTTP_METHOD.PUT
HTTP_METHOD.DELETE
```

#### `CONTENT_TYPE`
```typescript
CONTENT_TYPE.JSON        // 'application/json'
CONTENT_TYPE.FORM        // 'application/x-www-form-urlencoded'
CONTENT_TYPE.MULTIPART   // 'multipart/form-data'
```

#### `HTTP_HEADER`
```typescript
HTTP_HEADER.AUTHORIZATION  // 'Authorization'
HTTP_HEADER.CONTENT_TYPE   // 'Content-Type'
HTTP_HEADER.X_CSRF_TOKEN   // 'X-CSRF-Token'
```

---

### Pagination (`lib/pagination.ts`)

#### `PAGINATION`
```typescript
PAGINATION.DEFAULT_PAGE   // 1
PAGINATION.DEFAULT_LIMIT  // 20
PAGINATION.MIN_LIMIT      // 1
PAGINATION.MAX_LIMIT      // 100
PAGINATION.DEFAULT_OFFSET // 0
```

#### `SORT_ORDER`
```typescript
SORT_ORDER.ASC   // 'asc'
SORT_ORDER.DESC  // 'desc'
```

#### `SORT_FIELD`
```typescript
SORT_FIELD.CREATED_AT  // 'created_at'
SORT_FIELD.UPDATED_AT  // 'updated_at'
SORT_FIELD.NAME        // 'name'
```

---

### Validation (`lib/validation.ts`)

#### `STRING_LENGTH`
```typescript
STRING_LENGTH.EMAIL_MAX        // 255
STRING_LENGTH.PASSWORD_MIN     // 8
STRING_LENGTH.PASSWORD_MAX     // 100
STRING_LENGTH.USERNAME_MIN     // 2
STRING_LENGTH.USERNAME_MAX     // 50
STRING_LENGTH.TITLE_MIN        // 3
STRING_LENGTH.TITLE_MAX        // 200
STRING_LENGTH.DESCRIPTION_MAX  // 5000
```

#### `FILE_SIZE`
```typescript
FILE_SIZE.IMAGE_MAX     // 5MB
FILE_SIZE.VIDEO_MAX     // 50MB
FILE_SIZE.DOCUMENT_MAX  // 10MB
FILE_SIZE.AVATAR_MAX    // 2MB
```

#### `REGEX_PATTERN`
```typescript
REGEX_PATTERN.EMAIL       // Email regex
REGEX_PATTERN.PHONE       // Phone regex
REGEX_PATTERN.UUID        // UUID regex
REGEX_PATTERN.SLUG        // Slug regex
REGEX_PATTERN.HEX_COLOR   // Hex color regex
```

---

### App (`lib/app.ts`)

#### `LOCALE`
```typescript
LOCALE.EN      // 'en'
LOCALE.ZH_TW   // 'zh-TW'

SUPPORTED_LOCALES  // ['en', 'zh-TW']
```

#### `THEME`
```typescript
THEME.LIGHT   // 'light'
THEME.DARK    // 'dark'
THEME.SYSTEM  // 'system'
```

#### `STORAGE_KEY`
```typescript
STORAGE_KEY.THEME           // 'theme'
STORAGE_KEY.LOCALE          // 'locale'
STORAGE_KEY.USER            // 'user'
STORAGE_KEY.TOKEN           // 'token'
STORAGE_KEY.SEARCH_HISTORY  // 'search_history'
```

#### `TIME`
```typescript
TIME.SECOND  // 1000
TIME.MINUTE  // 60000
TIME.HOUR    // 3600000
TIME.DAY     // 86400000
TIME.WEEK    // 604800000
```

#### `DELAY`
```typescript
DELAY.DEBOUNCE_SEARCH  // 300ms
DELAY.DEBOUNCE_INPUT   // 500ms
DELAY.THROTTLE_SCROLL  // 100ms
DELAY.TOAST_DURATION   // 3000ms
```

#### `DATE_FORMAT`
```typescript
DATE_FORMAT.ISO              // 'YYYY-MM-DD'
DATE_FORMAT.ISO_DATETIME     // 'YYYY-MM-DD HH:mm:ss'
DATE_FORMAT.DISPLAY          // 'MMM DD, YYYY'
```

---

## 🎨 Examples

### API Request

```typescript
import { HTTP_STATUS, HTTP_METHOD, CONTENT_TYPE } from '@nx-playground/constants';

async function fetchUsers() {
  const response = await fetch('/api/users', {
    method: HTTP_METHOD.GET,
    headers: {
      'Content-Type': CONTENT_TYPE.JSON,
    },
  });

  if (response.status === HTTP_STATUS.OK) {
    return await response.json();
  }

  if (response.status === HTTP_STATUS.UNAUTHORIZED) {
    throw new AuthenticationError();
  }

  throw new Error('Unexpected error');
}
```

### Pagination Component

```typescript
import { PAGINATION, SORT_ORDER } from '@nx-playground/constants';

function UserList() {
  const [page, setPage] = useState(PAGINATION.DEFAULT_PAGE);
  const [limit, setLimit] = useState(PAGINATION.DEFAULT_LIMIT);
  const [sort, setSort] = useState(SORT_ORDER.DESC);

  const { data } = useQuery(['users', page, limit, sort], () =>
    fetchUsers({ page, limit, sort })
  );

  return <div>...</div>;
}
```

### Form Validation

```typescript
import { STRING_LENGTH, REGEX_PATTERN } from '@nx-playground/constants';

const userSchema = z.object({
  email: z.string()
    .max(STRING_LENGTH.EMAIL_MAX)
    .regex(REGEX_PATTERN.EMAIL),
  password: z.string()
    .min(STRING_LENGTH.PASSWORD_MIN)
    .max(STRING_LENGTH.PASSWORD_MAX),
});
```

### File Upload

```typescript
import { FILE_SIZE, MIME_TYPE } from '@nx-playground/constants';

function validateFile(file: File) {
  if (file.size > FILE_SIZE.IMAGE_MAX) {
    throw new ValidationError('File too large');
  }

  if (!MIME_TYPE.IMAGES.includes(file.type)) {
    throw new ValidationError('Invalid file type');
  }
}
```

### Time-based Operations

```typescript
import { TIME, DELAY } from '@nx-playground/constants';

// Cache TTL
const cacheExpiry = Date.now() + TIME.HOUR;

// Debounce
const debouncedSearch = debounce(handleSearch, DELAY.DEBOUNCE_SEARCH);

// Toast
toast.success('Saved!', { duration: DELAY.TOAST_DURATION });
```

## 📚 Best Practices

### ✅ DO

- Use constants instead of magic numbers
- Import specific constants
- Use types for type safety

```typescript
// Good
import { HTTP_STATUS, PAGINATION } from '@nx-playground/constants';

if (status === HTTP_STATUS.NOT_FOUND) {
  // Handle 404
}

const limit = PAGINATION.DEFAULT_LIMIT;
```

### ❌ DON'T

- Don't hardcode magic numbers
- Don't duplicate constants

```typescript
// Bad
if (status === 404) { // Use HTTP_STATUS.NOT_FOUND
  // ...
}

// Bad
const DEFAULT_LIMIT = 20; // Use PAGINATION.DEFAULT_LIMIT
```

## 🔗 Integration

### With Validation Library

```typescript
import { STRING_LENGTH, REGEX_PATTERN } from '@nx-playground/constants';
import { z } from '@nx-playground/validation';

export const emailSchema = z.string()
  .max(STRING_LENGTH.EMAIL_MAX)
  .regex(REGEX_PATTERN.EMAIL);
```

### With Utils Library

```typescript
import { DATE_FORMAT, TIME } from '@nx-playground/constants';
import { formatDate, addDays } from '@nx-playground/utils';

const formattedDate = formatDate(new Date(), DATE_FORMAT.ISO);
const nextWeek = addDays(new Date(), TIME.WEEK / TIME.DAY);
```

## 🚀 Roadmap

- [ ] API route constants
- [ ] Event types constants
- [ ] Permission constants
- [ ] Feature flag constants

## 🔗 Links

- [Infrastructure Gaps Analysis](../../specs/ARCHITECTURE/INFRASTRUCTURE_GAPS.md)
- [Project Status](../../specs/PROJECT_STATUS.md)

---

Built with ❤️ for nx-playground monorepo
