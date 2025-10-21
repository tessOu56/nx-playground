# UI Components Wrapper Layer

This directory contains 'use client' wrappers for `@nx-playground/ui-components`.

## Why This Wrapper Layer?

Next.js App Router uses Server Components by default, but our UI components from `@nx-playground/ui-components` are Client Components (they use hooks, state, and browser APIs).

**We must wrap them with 'use client' directive** so they can be imported in both Server and Client Components.

## Usage

```tsx
// ✅ Correct - Use wrapper from this directory
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';

// ❌ Wrong - Direct import from monorepo lib
import { Button } from '@nx-playground/ui-components';
```

## Adding New Components

When you need a new component from ui-components:

1. Create a new file in this directory
2. Add 'use client' directive
3. Re-export from ui-components

```tsx
// src/components/ui/NewComponent.tsx
'use client';

export { NewComponent } from '@nx-playground/ui-components';
export type { NewComponentProps } from '@nx-playground/ui-components';
```

## Available Components

- `Button` - All button variants
- `Card` - Card and related components
- `Input` - Form input
- `Select` - Dropdown select
- `Dialog` - Modal dialog
- `Tabs` - Tab navigation
- `Skeleton` - Loading skeleton
- `Badge` - Status badge

Add more as needed!
