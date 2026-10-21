import {
  type IdentityPrincipal,
  type AccessTokenClaims,
} from './identity-roles';
import { isAdminBearerAuthorized, parseBearerToken } from './timing-safe-equal';

export const MACHINE_PRINCIPAL: IdentityPrincipal = {
  kind: 'machine',
  id: 'admin-token',
  roles: ['admin'],
};

export async function resolveRequestIdentity(input: {
  authorizationHeader?: string;
  adminApiToken?: string;
  verifyJwt?: (token: string) => Promise<AccessTokenClaims | null>;
}): Promise<IdentityPrincipal | undefined> {
  if (isAdminBearerAuthorized(input.authorizationHeader, input.adminApiToken)) {
    return MACHINE_PRINCIPAL;
  }

  const token = parseBearerToken(input.authorizationHeader);
  if (!token || !input.verifyJwt) {
    return undefined;
  }

  const claims = await input.verifyJwt(token);
  if (!claims) {
    return undefined;
  }

  return {
    kind: 'user',
    id: claims.sub,
    roles: claims.roles,
  };
}
