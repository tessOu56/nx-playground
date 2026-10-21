import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
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
import { identityPrisma } from './prisma';
import { listIdentityRoles } from './roles';

const lineTw = lineTwCredentials();
const google = googleCredentials();
const baseURL = betterAuthBaseUrl();
const isProduction = process.env.NODE_ENV === 'production';

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
      enabled: false,
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
              user.email === undefined
                ? undefined
                : optionalEmail(user.email),
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
    nextCookies(),
  ],
});
