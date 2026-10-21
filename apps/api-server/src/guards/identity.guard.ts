import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';

import { permissionRoleFor } from '../common/auth/identity-roles';
import { JwtVerifier } from '../common/auth/jwt-verifier.service';
import { resolveRequestIdentity } from '../common/auth/request-identity';

@Injectable()
export class IdentityGuard implements CanActivate {
  constructor(private readonly jwtVerifier: JwtVerifier) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const identity = await resolveRequestIdentity({
      authorizationHeader: request.headers.authorization,
      adminApiToken: process.env.ADMIN_API_TOKEN,
      verifyJwt: token => this.jwtVerifier.verify(token),
    });
    if (!identity) {
      throw new UnauthorizedException();
    }
    request.identity = identity;
    request.user = {
      id: identity.id,
      role: permissionRoleFor(identity),
    };
    return true;
  }
}
