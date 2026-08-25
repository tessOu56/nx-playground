import type { UserWithRole } from '@nx-playground/permissions/server';

declare global {
  namespace Express {
    interface Request {
      user?: UserWithRole;
    }
  }
}

export {};
