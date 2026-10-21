import { passkey } from '@better-auth/passkey';
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import {
  APIError,
  createAuthMiddleware,
  getSessionFromCtx,
} from 'better-auth/api';
import { nextCookies } from 'better-auth/next-js';
import { customSession, genericOAuth, jwt, line } from 'better-auth/plugins';

import {
  AUTH_JWT_AUDIENCE,
  betterAuthBaseUrl,
  betterAuthSecret,
  betterAuthTrustedOrigins,
  googleCredentials,
  lineTwCredentials,
} from './env';
import {
  LINE_TW_PROVIDER_ID,
  optionalEmail,
  stripProviderSecrets,
} from './line-account-map';
import { passkeyRelyingParty } from './passkey-rp';
import { identityPrisma } from './prisma';
import { listIdentityRoles } from './roles';
import {
  LastSignInMethodError,
  LAST_SIGN_IN_METHOD_CODE,
  assertNotRemovingLastSignInMethod,
  removalForAuthPath,
} from './sign-in-methods';

const lineTw = lineTwCredentials();
const google = googleCredentials();
const baseURL = betterAuthBaseUrl();
const isProduction = process.env.NODE_ENV === 'production';
const passkeyRp = passkeyRelyingParty(baseURL);

function rethrowLastSignInMethod(error: unknown): never {
  if (error instanceof LastSignInMethodError) {
    throw new APIError('BAD_REQUEST', {
      message: error.message,
      code: LAST_SIGN_IN_METHOD_CODE,
    });
  }
  throw error;
}

export const auth = betterAuth({
  baseURL,
  secret: betterAuthSecret(),
  trustedOrigins: betterAuthTrustedOrigins(),
  database: prismaAdapter(identityPrisma, {
    provider: 'postgresql',
  }),
  emailAndPassword: {
    enabled: false,
  },
  account: {
    accountLinking: {
      enabled: true,
      disableImplicitLinking: true,
      allowDifferentEmails: true,
      allowUnlinkingAll: true,
    },
    modelName: 'identityAccount',
  },
  user: {
    modelName: 'identityUser',
  },
  session: {
    modelName: 'identitySession',
    expiresIn: 60 * 60 * 24 * 7,
    cookieCache: {
      enabled: false,
    },
  },
  verification: {
    modelName: 'identityVerification',
  },
  socialProviders: google
    ? {
        google: {
          clientId: google.clientId,
          clientSecret: google.clientSecret,
        },
      }
    : {},
  advanced: {
    useSecureCookies: isProduction,
    defaultCookieAttributes: {
      httpOnly: true,
      sameSite: 'lax',
      secure: isProduction,
      path: '/',
    },
  },
  hooks: {
    before: createAuthMiddleware(async ctx => {
      const removing = removalForAuthPath(ctx.path);
      if (!removing) return;
      const session = await getSessionFromCtx(ctx);
      if (!session?.user?.id) return;
      try {
        await assertNotRemovingLastSignInMethod({
          db: identityPrisma,
          userId: session.user.id,
          removing,
        });
      } catch (error) {
        rethrowLastSignInMethod(error);
      }
    }),
  },
  databaseHooks: {
    user: {
      create: {
        before: async user => ({
          data: {
            ...user,
            email: optionalEmail(user.email),
          },
        }),
      },
      update: {
        before: async user => ({
          data: {
            ...user,
            email:
              user.email === undefined ? undefined : optionalEmail(user.email),
          },
        }),
      },
    },
    account: {
      create: {
        before: async account => ({
          data: stripProviderSecrets(account),
        }),
      },
      update: {
        before: async account => ({
          data: stripProviderSecrets(account),
        }),
      },
      delete: {
        before: async account => {
          try {
            await assertNotRemovingLastSignInMethod({
              db: identityPrisma,
              userId: account.userId,
              removing: 'account',
            });
          } catch (error) {
            rethrowLastSignInMethod(error);
          }
        },
      },
    },
  },
  plugins: [
    ...(lineTw
      ? [
          genericOAuth({
            config: [
              line({
                providerId: LINE_TW_PROVIDER_ID,
                clientId: lineTw.clientId,
                clientSecret: lineTw.clientSecret,
                pkce: true,
                scopes: ['openid', 'profile'],
              }),
            ],
          }),
        ]
      : []),
    jwt({
      schema: {
        jwks: {
          modelName: 'identityJwks',
        },
      },
      jwt: {
        issuer: baseURL,
        audience: AUTH_JWT_AUDIENCE,
        expirationTime: '15m',
        definePayload: async ({ user }) => ({
          roles: await listIdentityRoles(identityPrisma, user.id),
        }),
      },
    }),
    customSession(async ({ user, session }) => {
      const [roles, accounts] = await Promise.all([
        listIdentityRoles(identityPrisma, user.id),
        identityPrisma.identityAccount.findMany({
          where: { userId: user.id },
          select: { providerId: true, accountId: true },
        }),
      ]);
      const lineAccount = accounts.find(
        account => account.providerId === LINE_TW_PROVIDER_ID
      );
      return {
        user: {
          id: user.id,
          name: user.name,
          email: optionalEmail(user.email),
          image: user.image,
          roles,
          lineId: lineAccount?.accountId ?? null,
        },
        session,
      };
    }),
    passkey({
      rpID: passkeyRp.rpID,
      rpName: 'NX Playground Exhibitions',
      origin: passkeyRp.origin,
      schema: {
        passkey: {
          modelName: 'identityPasskey',
        },
      },
    }),
    nextCookies(),
  ],
});
