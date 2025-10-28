# @nx-playground/permissions

Role-Based Access Control (RBAC) library for the Nx monorepo. Provides role definitions, permission checks, protected routes, and React components for authorization.

## 🚀 Features

- **Predefined Roles**: Admin, Editor, Viewer, User, Guest
- **Permission System**: Resource-based with wildcard support
- **Type-Safe**: Full TypeScript support
- **React Hooks**: `usePermissions` for permission checks
- **React Components**: `ProtectedRoute`, `PermissionGuard`
- **Flexible**: Supports custom permissions and multiple roles

## 📦 Installation

This is an internal Nx library. Add it to your app's dependencies:

```json
{
  "dependencies": {
    "@nx-playground/permissions": "workspace:^"
  }
}
```

## 🎭 Roles

| Role | Permissions | Description |
|------|-------------|-------------|
| `admin` | `*:*` | Full system access (all permissions) |
| `editor` | events:*, users:read, forms:* | Can create and edit content |
| `viewer` | events:read, users:read, forms:read | Read-only access |
| `user` | events:read, orders:* | Regular user with basic access |
| `guest` | events:read | Public access only |

## 🔐 Permission Format

Permissions follow the pattern: `resource:action`

**Examples**:
- `events:create` - Can create events
- `events:read` - Can read events
- `users:delete` - Can delete users
- `admin:*` - All admin actions
- `*:read` - Read all resources
- `*:*` - All permissions (admin only)

## 🛠️ Usage

### Basic Permission Checks

```typescript
import { hasPermission } from '@nx-playground/permissions';

const user = {
  id: '123',
  role: 'editor',
};

// Check single permission
if (hasPermission(user, 'events:create')) {
  console.log('User can create events');
}

// Check with custom permissions
const userWithCustom = {
  id: '123',
  role: 'viewer',
  customPermissions: ['events:update'],
};

if (hasPermission(userWithCustom, 'events:update')) {
  console.log('User has custom permission');
}
```

### Multiple Permissions

```typescript
import { hasAnyPermission, hasAllPermissions } from '@nx-playground/permissions';

// Check if user has ANY of these permissions
if (hasAnyPermission(user, ['events:create', 'events:update'])) {
  console.log('User can create OR update events');
}

// Check if user has ALL permissions
if (hasAllPermissions(user, ['events:read', 'users:read'])) {
  console.log('User can read events AND users');
}
```

### Role Checks

```typescript
import { hasRole, hasAnyRole } from '@nx-playground/permissions';

// Check specific role
if (hasRole(user, 'admin')) {
  console.log('User is admin');
}

// Check multiple roles
if (hasAnyRole(user, ['admin', 'editor'])) {
  console.log('User is admin or editor');
}

// User with multiple roles
const multiRoleUser = {
  id: '123',
  role: ['editor', 'viewer'],
};
```

### React Hook

```typescript
import { usePermissions } from '@nx-playground/permissions';

function MyComponent() {
  const { can, isRole } = usePermissions(user);

  return (
    <div>
      {can('events:create') && <CreateEventButton />}
      {can('events:delete') && <DeleteEventButton />}
      {isRole('admin') && <AdminPanel />}
    </div>
  );
}
```

### Protected Route

```typescript
import { ProtectedRoute } from '@nx-playground/permissions';

function App() {
  return (
    <Routes>
      <Route
        path="/admin"
        element={
          <ProtectedRoute
            user={currentUser}
            requiredPermissions={['admin:read']}
            fallback={<div>Access Denied</div>}
            onUnauthorized={() => console.log('Unauthorized access attempt')}
          >
            <AdminPanel />
          </ProtectedRoute>
        }
      />
      
      {/* Multiple permissions (any) */}
      <Route
        path="/events/create"
        element={
          <ProtectedRoute
            user={currentUser}
            requiredPermissions={['events:create', 'events:update']}
            requireAll={false}
          >
            <CreateEventPage />
          </ProtectedRoute>
        }
      />
      
      {/* Role-based */}
      <Route
        path="/settings"
        element={
          <ProtectedRoute
            user={currentUser}
            requiredRoles={['admin', 'editor']}
          >
            <SettingsPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
```

### Permission Guard

```typescript
import { PermissionGuard } from '@nx-playground/permissions';

function EventCard({ event, user }) {
  return (
    <Card>
      <CardHeader>{event.title}</CardHeader>
      <CardContent>{event.description}</CardContent>
      
      {/* Only show edit button if user has permission */}
      <PermissionGuard user={user} permission="events:update">
        <Button>Edit Event</Button>
      </PermissionGuard>
      
      {/* Only show delete button for admins */}
      <PermissionGuard
        user={user}
        permission="events:delete"
        fallback={<span>Contact admin to delete</span>}
      >
        <Button variant="destructive">Delete</Button>
      </PermissionGuard>
    </Card>
  );
}
```

## 📖 API Reference

### Core Functions

| Function | Description |
|----------|-------------|
| `hasPermission(user, permission)` | Check single permission |
| `hasAnyPermission(user, permissions)` | Check if user has ANY permission |
| `hasAllPermissions(user, permissions)` | Check if user has ALL permissions |
| `hasRole(user, role)` | Check if user has role |
| `hasAnyRole(user, roles)` | Check if user has ANY role |
| `hasAllRoles(user, roles)` | Check if user has ALL roles |
| `getRolePermissions(role)` | Get all permissions for role |
| `matchesPermission(userPerm, reqPerm)` | Check if permission matches (supports wildcards) |

### Role Functions

| Function | Description |
|----------|-------------|
| `getRole(role)` | Get role configuration |
| `getAllRoles()` | Get all available roles |
| `isValidRole(role)` | Check if role exists |
| `getRoleHierarchy()` | Get role hierarchy (admin → guest) |
| `isRoleHigherOrEqual(role1, role2)` | Compare roles in hierarchy |

### React Hooks

| Hook | Returns | Description |
|------|---------|-------------|
| `usePermissions(user)` | `{ can, canAny, canAll, isRole, ... }` | Permission check functions |

### React Components

| Component | Props | Description |
|-----------|-------|-------------|
| `ProtectedRoute` | user, requiredPermissions, requiredRoles, fallback | Route protection |
| `PermissionGuard` | user, permission, fallback | Inline conditional rendering |

## 🎯 Permission Patterns

### Resource-Based Permissions

```typescript
// Events
'events:read'      // View events
'events:create'    // Create events
'events:update'    // Update events
'events:delete'    // Delete events
'events:*'         // All event actions

// Users
'users:read'       // View users
'users:create'     // Create users
'users:update'     // Update users
'users:delete'     // Delete users

// Forms
'forms:read'       // View forms
'forms:create'     // Create forms
'forms:update'     // Update forms
'forms:delete'     // Delete forms

// Orders
'orders:read'      // View orders
'orders:create'    // Create orders
'orders:update'    // Update orders

// Admin
'admin:read'       // View admin panel
'admin:config'     // Configure system
```

### Wildcard Permissions

- `*:*` - All permissions (admin)
- `events:*` - All event actions
- `*:read` - Read all resources

## 🧪 Testing

```bash
# Test permissions library
nx test permissions

# Build
nx build permissions
```

## 📚 Examples

### Enterprise Admin Integration

```typescript
// apps/enterprise-admin/src/app/layout.tsx
import { ProtectedRoute } from '@nx-playground/permissions';

export default function AdminLayout({ children }) {
  const { user } = useAuth();

  return (
    <ProtectedRoute
      user={user}
      requiredRoles={['admin', 'editor']}
      fallback={<UnauthorizedPage />}
    >
      {children}
    </ProtectedRoute>
  );
}
```

### Event CMS Integration

```typescript
// apps/event-cms/src/features/events/components/EventActions.tsx
import { PermissionGuard } from '@nx-playground/permissions';

export function EventActions({ event, user }) {
  return (
    <div className="flex gap-2">
      <PermissionGuard user={user} permission="events:update">
        <Button onClick={() => editEvent(event.id)}>Edit</Button>
      </PermissionGuard>
      
      <PermissionGuard user={user} permission="events:delete">
        <Button variant="destructive" onClick={() => deleteEvent(event.id)}>
          Delete
        </Button>
      </PermissionGuard>
    </div>
  );
}
```

### API Server Guards (NestJS)

```typescript
// apps/api-server/src/guards/permissions.guard.ts
import { hasPermission } from '@nx-playground/permissions';
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private requiredPermission: string) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    return hasPermission(user, this.requiredPermission);
  }
}

// Usage
@UseGuards(new PermissionsGuard('events:create'))
@Post('events')
createEvent(@Body() dto: CreateEventDto) {
  // Only users with 'events:create' permission can access
}
```

## 🔗 Links

- **RBAC Best Practices**: https://auth0.com/docs/manage-users/access-control/rbac
- **Permission Patterns**: https://docs.permit.io/concepts/rbac/
- **React Authorization**: https://www.robinwieruch.de/react-router-authentication/

---

Built with ❤️ for Enterprise-Grade Authorization
