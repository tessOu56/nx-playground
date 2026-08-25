import { SetMetadata } from '@nestjs/common';
import type { Permission } from '@nx-playground/permissions/server';

export const RequirePermissions = (...permissions: Permission[]) =>
  SetMetadata('permissions', permissions);

