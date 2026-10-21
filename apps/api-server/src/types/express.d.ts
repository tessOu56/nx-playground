import type { UserWithRole } from '@nx-playground/permissions/server';

import type { IdentityPrincipal } from '../common/auth/identity-roles';

declare global {
  namespace Express {
    interface Request {
      user?: UserWithRole;
      identity?: IdentityPrincipal;
    }
  }
}

export {};
