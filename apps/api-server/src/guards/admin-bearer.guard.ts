import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { isAdminBearerAuthorized } from '../common/auth/timing-safe-equal';

@Injectable()
export class AdminBearerGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<{
      headers?: { authorization?: string };
    }>();
    if (!isAdminBearerAuthorized(request.headers?.authorization)) {
      throw new UnauthorizedException();
    }
    return true;
  }
}
