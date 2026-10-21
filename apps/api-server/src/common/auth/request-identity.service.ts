import { Injectable } from '@nestjs/common';

import type { IdentityPrincipal } from './identity-roles';
import { JwtVerifier } from './jwt-verifier.service';
import { resolveRequestIdentity } from './request-identity';

@Injectable()
export class RequestIdentityService {
  constructor(private readonly jwtVerifier: JwtVerifier) {}

  resolve(authorizationHeader?: string): Promise<IdentityPrincipal | undefined> {
    return resolveRequestIdentity({
      authorizationHeader,
      adminApiToken: process.env.ADMIN_API_TOKEN,
      verifyJwt: token => this.jwtVerifier.verify(token),
    });
  }
}
