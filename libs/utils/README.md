# @nx-playground/utils

Framework-agnostic utility functions for common tasks across the Nx monorepo.

## 🎯 Features

- ✅ **Date & Time** - Formatting, relative time, date math
- ✅ **String** - Truncate, slugify, capitalize, sanitize
- ✅ **Number** - Formatting, currency, bytes, percentage
- ✅ **Array** - Unique, chunk, shuffle, group, sort
- ✅ **Object** - Deep clone, pick, omit, merge, get/set
- ✅ **URL** - Build, parse, join paths, normalize
- ✅ **TypeScript** - Full type safety
- ✅ **Well-tested** - Comprehensive unit tests

## 📦 Installation

Already installed as a workspace library. Import in your app:

```typescript
import { formatDate, truncate, formatNumber, unique } from '@nx-playground/utils';
```

## 🚀 Quick Start

### Date Utilities

```typescript
import { formatDate, formatRelativeTime, addDays } from '@nx-playground/utils';

// Format date
formatDate(new Date(), 'YYYY-MM-DD'); // '2025-01-27'
formatDate(new Date(), 'YYYY-MM-DD HH:mm:ss'); // '2025-01-27 18:30:45'

// Relative time
formatRelativeTime(new Date(), 'en'); // 'just now'
formatRelativeTime(new Date(Date.now() - 3600000), 'zh-TW'); // '1 小時前'

// Date math
const tomorrow = addDays(new Date(), 1);
const lastWeek = addDays(new Date(), -7);
```

### String Utilities

```typescript
import { truncate, slugify, capitalize, maskString } from '@nx-playground/utils';

// Truncate
truncate('Long text...', 20); // 'Long text...'

// Slugify
slugify('Hello World!'); // 'hello-world'

// Capitalize
capitalize('hello'); // 'Hello'
capitalizeWords('hello world'); // 'Hello World'

// Mask sensitive data
maskString('user@example.com', 4); // 'user****ple.com'
```

### Number Utilities

```typescript
import { formatNumber, formatCurrency, formatBytes } from '@nx-playground/utils';

// Format number
formatNumber(1234567); // '1,234,567'

// Format currency
formatCurrency(1234.56, 'USD', 'en-US'); // '$1,234.56'
formatCurrency(1234.56, 'TWD', 'zh-TW'); // 'NT$1,234.56'

// Format bytes
formatBytes(1536); // '1.5 KB'
formatBytes(1048576); // '1 MB'
```

### Array Utilities

```typescript
import { unique, chunk, groupBy, sortBy } from '@nx-playground/utils';

// Remove duplicates
unique([1, 2, 2, 3]); // [1, 2, 3]

// Chunk array
chunk([1, 2, 3, 4, 5], 2); // [[1, 2], [3, 4], [5]]

// Group by key
const items = [{ type: 'a', val: 1 }, { type: 'b', val: 2 }];
groupBy(items, 'type'); // {a: [{...}], b: [{...}]}

// Sort by key
sortBy([{ age: 30 }, { age: 20 }], 'age'); // [{age: 20}, {age: 30}]
```

### Object Utilities

```typescript
import { pick, omit, deepMerge, get, set } from '@nx-playground/utils';

// Pick keys
pick({ a: 1, b: 2, c: 3 }, ['a', 'c']); // {a: 1, c: 3}

// Omit keys
omit({ a: 1, b: 2, c: 3 }, ['b']); // {a: 1, c: 3}

// Deep merge
deepMerge({ a: { b: 1 } }, { a: { c: 2 } }); // {a: {b: 1, c: 2}}

// Get nested value
get({ a: { b: { c: 1 } } }, 'a.b.c'); // 1

// Set nested value
set({}, 'a.b.c', 1); // {a: {b: {c: 1}}}
```

### URL Utilities

```typescript
import { buildUrl, parseQuery, joinPaths } from '@nx-playground/utils';

// Build URL with query params
buildUrl('/api/users', { page: 1, limit: 20 }); 
// '/api/users?page=1&limit=20'

// Parse query string
parseQuery('?page=1&limit=20'); // {page: '1', limit: '20'}

// Join paths
joinPaths('/api', 'users', '123'); // '/api/users/123'
```

## 📚 API Reference

### Date Utilities

| Function               | Description                        | Example                                   |
| ---------------------- | ---------------------------------- | ----------------------------------------- |
| `formatDate`           | Format date to custom string       | `formatDate(date, 'YYYY-MM-DD')`          |
| `formatRelativeTime`   | Format as "X ago"                  | `formatRelativeTime(date, 'en')`          |
| `isToday`              | Check if date is today             | `isToday(date)`                           |
| `isPast`               | Check if date is in the past       | `isPast(date)`                            |
| `isFuture`             | Check if date is in the future     | `isFuture(date)`                          |
| `addDays`              | Add days to date                   | `addDays(date, 7)`                        |
| `getDateRange`         | Get start/end of day               | `getDateRange(date)`                      |

### String Utilities

| Function         | Description                     | Example                                |
| ---------------- | ------------------------------- | -------------------------------------- |
| `truncate`       | Truncate string                 | `truncate('Long...', 10)`              |
| `slugify`        | Convert to URL-friendly slug    | `slugify('Hello World')`               |
| `capitalize`     | Capitalize first letter         | `capitalize('hello')`                  |
| `capitalizeWords`| Capitalize each word            | `capitalizeWords('hello world')`       |
| `camelToKebab`   | camelCase → kebab-case          | `camelToKebab('helloWorld')`           |
| `kebabToCamel`   | kebab-case → camelCase          | `kebabToCamel('hello-world')`          |
| `sanitizeHtml`   | Remove HTML tags                | `sanitizeHtml('<p>Text</p>')`          |
| `getInitials`    | Extract initials                | `getInitials('John Doe')`              |
| `randomString`   | Generate random string          | `randomString(10)`                     |
| `isEmpty`        | Check if empty/whitespace       | `isEmpty('  ')`                        |
| `maskString`     | Mask sensitive data             | `maskString('email@ex.com', 3)`        |

### Number Utilities

| Function          | Description                  | Example                              |
| ----------------- | ---------------------------- | ------------------------------------ |
| `formatNumber`    | Format with separators       | `formatNumber(1234567)`              |
| `formatCurrency`  | Format as currency           | `formatCurrency(1234.56, 'USD')`     |
| `formatPercentage`| Format as percentage         | `formatPercentage(0.1234, 2)`        |
| `formatBytes`     | Format bytes to human size   | `formatBytes(1536)`                  |
| `round`           | Round to decimals            | `round(1.2345, 2)`                   |
| `clamp`           | Clamp between min/max        | `clamp(150, 0, 100)`                 |
| `randomInt`       | Random integer in range      | `randomInt(1, 10)`                   |
| `percentage`      | Calculate percentage         | `percentage(25, 100)`                |
| `sum`             | Sum array of numbers         | `sum([1, 2, 3])`                     |
| `average`         | Calculate average            | `average([1, 2, 3])`                 |
| `inRange`         | Check if in range            | `inRange(5, 1, 10)`                  |

### Array Utilities

| Function       | Description                | Example                              |
| -------------- | -------------------------- | ------------------------------------ |
| `unique`       | Remove duplicates          | `unique([1, 2, 2, 3])`               |
| `chunk`        | Split into chunks          | `chunk([1,2,3,4], 2)`                |
| `shuffle`      | Random shuffle             | `shuffle([1, 2, 3])`                 |
| `groupBy`      | Group by key               | `groupBy(items, 'type')`             |
| `sortBy`       | Sort by key                | `sortBy(items, 'age', 'asc')`        |
| `sample`       | Random element             | `sample([1, 2, 3])`                  |
| `sampleSize`   | N random elements          | `sampleSize([1,2,3,4], 2)`           |
| `flatten`      | Flatten nested arrays      | `flatten([[1, 2], [3, [4]]])`        |
| `compact`      | Remove falsy values        | `compact([0, 1, false, 2])`          |
| `intersection` | Common elements            | `intersection([1,2], [2,3])`         |
| `difference`   | Elements in first only     | `difference([1,2,3], [2,3])`         |

### Object Utilities

| Function     | Description              | Example                           |
| ------------ | ------------------------ | --------------------------------- |
| `deepClone`  | Deep clone object        | `deepClone(obj)`                  |
| `pick`       | Pick specific keys       | `pick(obj, ['a', 'b'])`           |
| `omit`       | Omit specific keys       | `omit(obj, ['c'])`                |
| `isEmptyObject` | Check if empty        | `isEmptyObject({})`               |
| `deepMerge`  | Deep merge objects       | `deepMerge(obj1, obj2)`           |
| `get`        | Get nested value         | `get(obj, 'a.b.c')`               |
| `set`        | Set nested value         | `set(obj, 'a.b.c', 1)`            |
| `has`        | Check nested path exists | `has(obj, 'a.b.c')`               |

### URL Utilities

| Function        | Description              | Example                                |
| --------------- | ------------------------ | -------------------------------------- |
| `buildUrl`      | Build URL with params    | `buildUrl('/api', {page: 1})`          |
| `parseQuery`    | Parse query string       | `parseQuery('?page=1')`                |
| `getQueryParam` | Get single param         | `getQueryParam('?page=1', 'page')`     |
| `getDomain`     | Extract domain           | `getDomain('https://ex.com/path')`     |
| `isAbsoluteUrl` | Check if absolute        | `isAbsoluteUrl('https://...')`         |
| `joinPaths`     | Join URL paths           | `joinPaths('/api', 'users', '123')`    |
| `normalizeUrl`  | Normalize URL            | `normalizeUrl('https://Ex.com/Path/')` |

## 🎨 Examples

### Blog Post Preview

```typescript
import { formatDate, truncate } from '@nx-playground/utils';

function BlogCard({ post }) {
  return (
    <div>
      <h3>{post.title}</h3>
      <p>{truncate(post.content, 150)}</p>
      <time>{formatDate(post.publishDate, 'YYYY-MM-DD')}</time>
    </div>
  );
}
```

### API Request with Query Params

```typescript
import { buildUrl } from '@nx-playground/utils';

async function fetchUsers(page: number, limit: number) {
  const url = buildUrl('/api/users', { page, limit, sort: 'created_at' });
  return await fetch(url);
}
```

### File Upload Validation

```typescript
import { formatBytes } from '@nx-playground/utils';

function FileUpload({ file }) {
  return (
    <div>
      <p>Size: {formatBytes(file.size)}</p>
      <p>Max: {formatBytes(5 * 1024 * 1024)}</p>
    </div>
  );
}
```

### Analytics Display

```typescript
import { formatNumber, formatPercentage } from '@nx-playground/utils';

function Analytics({ views, conversions }) {
  const rate = conversions / views;
  
  return (
    <div>
      <p>Views: {formatNumber(views)}</p>
      <p>Conversion Rate: {formatPercentage(rate, 2)}</p>
    </div>
  );
}
```

## 🧪 Testing

Run tests:

```bash
nx test @nx-playground/utils
```

## 🔗 Links

- [Infrastructure Gaps Analysis](../../docs/architecture/INFRASTRUCTURE_GAPS.md)
- [Project Status](../../specs/PROJECT_STATUS.md)

---

Built with ❤️ for nx-playground monorepo
