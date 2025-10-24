---
id: api-client
name: API Client
version: 0.0.1
description: Type-safe API client generated from OpenAPI specifications using Orval
techStack:
  - OpenAPI
  - Orval
  - React Query
  - TypeScript
features:
  - OpenAPI integration
  - Auto type generation
  - React Query hooks
  - Mock data support
status: production
category: data
published: true
lastUpdated: '2025-01-24'
---

# API Client – API 客戶端

(Type-Safe API Client Library)

## Overview / 概念與定位

This is an **auto-generated API client** providing type-safe access to backend services with full TypeScript support.

Unlike manual API calls, this library offers:

- Automatic generation from OpenAPI specifications
- Type-safe request/response interfaces
- React Query hooks for caching and state management
- Mock data support for development
- Automatic synchronization with backend API changes

The library demonstrates **code generation** and **API-first development** patterns.

---

## Core Capabilities / 核心能力

### 1. Auto-Generated Client Code

- Orval generates client from OpenAPI specs
- Type-safe request payloads and responses
- Automatic validation with Zod schemas
- Error handling with typed exceptions
- Generated React Query hooks

**Key Value**: Eliminates manual API client maintenance and type mismatches.

---

### 2. React Query Integration

- Optimistic updates for better UX
- Automatic caching and invalidation
- Loading and error states management
- Background refetching
- Pagination and infinite scroll support

**Key Value**: Robust data fetching with minimal boilerplate code.

---

### 3. Development Tools

- Mock data generation for testing
- API response interceptors
- Request/response logging
- Error retry strategies
- Network status handling

**Key Value**: Speeds up frontend development without waiting for backend completion.

---

## Technical Highlights / 技術亮點

| Aspect           | Description                                     |
| ---------------- | ----------------------------------------------- |
| **Orval**        | OpenAPI to TypeScript code generation           |
| **React Query**  | Powerful async state management                 |
| **Type Safety**  | End-to-end type safety from backend to frontend |
| **Mock Support** | MSW integration for testing                     |

**Result**: Type-safe API layer reducing integration bugs.

---

## Usage Scope / 使用範圍

**Applications**:

- Event-CMS (event management APIs)
- Event-Portal (event browsing APIs)
- Future apps connecting to api-server

**Generated From**:

- `api-server` OpenAPI specification
- Updated automatically via `pnpm sync:api`

---

## API & Integration / 整合方式

**Example Usage**:

```tsx
import { useGetEvents, useCreateEvent } from '@nx-playground/api-client';

function EventList() {
  const { data, isLoading } = useGetEvents();
  const createMutation = useCreateEvent();

  const handleCreate = (eventData) => {
    createMutation.mutate(eventData);
  };

  return (/* UI */);
}
```

---

## Quality Standards / 品質標準

**Type Safety**:

- Generated types match backend exactly
- Compile-time error detection
- IntelliSense for all API endpoints

**Testing**:

- Mock Service Worker (MSW) for testing
- Automatic mock data generation
- Integration tests with real API

---

## License / 授權

MIT (Open for use and modification)

---

## Additional Documentation / 補充文件

- `specs/libs/api-client/en.md` - English specification (this file)
- `specs/libs/api-client/zh-TW.md` - Traditional Chinese specification
- `libs/api-client/README.md` - Developer documentation
