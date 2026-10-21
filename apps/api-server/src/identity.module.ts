import { Global, Module } from '@nestjs/common';

import { JwtVerifier } from './common/auth/jwt-verifier.service';
import { RequestIdentityService } from './common/auth/request-identity.service';
import { IdentityGuard } from './guards/identity.guard';
import { RolesGuard } from './guards/roles.guard';

@Global()
@Module({
  providers: [JwtVerifier, RequestIdentityService, IdentityGuard, RolesGuard],
  exports: [JwtVerifier, RequestIdentityService, IdentityGuard, RolesGuard],
})
export class IdentityModule {}
