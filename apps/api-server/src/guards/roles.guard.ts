import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';

import {
  hasAnyIdentityRole,
  type IdentityRole,
} from '../common/auth/identity-roles';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const allowed = this.reflector.getAllAndOverride<IdentityRole[] | undefined>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()]
    );

    if (!allowed || allowed.length === 0) {
      throw new ForbiddenException();
    }

    const request = context.switchToHttp().getRequest<Request>();
    const identity = request.identity;
    if (!identity) {
      throw new UnauthorizedException();
    }
    if (!hasAnyIdentityRole(identity, allowed)) {
      throw new ForbiddenException();
    }
    return true;
  }
}
