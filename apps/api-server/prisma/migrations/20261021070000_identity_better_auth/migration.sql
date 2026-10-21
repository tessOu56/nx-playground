-- Better Auth identity tables (same Neon database, separate from catalog `users`).
-- Email is optional: LINE often does not provide one. Unique allows multiple NULLs.

CREATE TYPE "IdentityRoleName" AS ENUM ('organizer', 'admin');

CREATE TABLE "identity_user" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "identity_user_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "identity_session" (
    "id" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "identity_session_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "identity_account" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "idToken" TEXT,
    "accessTokenExpiresAt" TIMESTAMP(3),
    "refreshTokenExpiresAt" TIMESTAMP(3),
    "scope" TEXT,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "identity_account_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "identity_verification" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "identity_verification_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "identity_jwks" (
    "id" TEXT NOT NULL,
    "publicKey" TEXT NOT NULL,
    "privateKey" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "expiresAt" TIMESTAMP(3),
    "alg" TEXT,
    "crv" TEXT,

    CONSTRAINT "identity_jwks_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "user_role" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "IdentityRoleName" NOT NULL,
    "grantedBy" TEXT,
    "grantedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_role_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "identity_user_email_key" ON "identity_user"("email");
CREATE UNIQUE INDEX "identity_session_token_key" ON "identity_session"("token");
CREATE INDEX "identity_session_userId_idx" ON "identity_session"("userId");
CREATE UNIQUE INDEX "identity_account_providerId_accountId_key" ON "identity_account"("providerId", "accountId");
CREATE INDEX "identity_account_userId_idx" ON "identity_account"("userId");
CREATE INDEX "identity_verification_identifier_idx" ON "identity_verification"("identifier");
CREATE UNIQUE INDEX "user_role_userId_role_key" ON "user_role"("userId", "role");
CREATE INDEX "user_role_userId_idx" ON "user_role"("userId");

ALTER TABLE "identity_session" ADD CONSTRAINT "identity_session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "identity_user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "identity_account" ADD CONSTRAINT "identity_account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "identity_user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "user_role" ADD CONSTRAINT "user_role_userId_fkey" FOREIGN KEY ("userId") REFERENCES "identity_user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
