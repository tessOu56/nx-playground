import type { UserWithRole } from '@nx-playground/permissions';

declare global {
  namespace Express {
    interface Request {
      user?: UserWithRole;
    }
  }
}

export {};
