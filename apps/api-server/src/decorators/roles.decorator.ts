import { SetMetadata } from '@nestjs/common';

import type { IdentityRole } from '../common/auth/identity-roles';

export const ROLES_KEY = 'identity-roles';

export const Roles = (...roles: IdentityRole[]) =>
  SetMetadata(ROLES_KEY, roles);
