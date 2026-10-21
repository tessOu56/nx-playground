import { Injectable } from '@nestjs/common';

import {
  AUTH_JWT_AUDIENCE,
  type AccessTokenClaims,
} from './identity-roles';
import {
  createRemoteJwtVerifier,
  verifyAccessJwt,
  type JwtVerifyOptions,
} from './jwt-verify';

@Injectable()
export class JwtVerifier {
  private readonly options: JwtVerifyOptions | null;

  constructor() {
    const issuer = process.env.AUTH_JWT_ISSUER ?? process.env.BETTER_AUTH_URL;
    this.options = createRemoteJwtVerifier({
      jwksUrl: process.env.AUTH_JWKS_URL,
      issuer,
      audience: process.env.AUTH_JWT_AUDIENCE || AUTH_JWT_AUDIENCE,
    });
  }

  async verify(token: string): Promise<AccessTokenClaims | null> {
    if (!this.options) return null;
    return verifyAccessJwt(token, this.options);
  }
}
