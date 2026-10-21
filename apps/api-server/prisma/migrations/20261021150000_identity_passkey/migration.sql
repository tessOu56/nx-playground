-- Better Auth passkey plugin (WebAuthn). Identity schema stays in this flow.

CREATE TABLE "identity_passkey" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "publicKey" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "credentialID" TEXT NOT NULL,
    "counter" INTEGER NOT NULL,
    "deviceType" TEXT NOT NULL,
    "backedUp" BOOLEAN NOT NULL,
    "transports" TEXT,
    "createdAt" TIMESTAMP(3),
    "aaguid" TEXT,

    CONSTRAINT "identity_passkey_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "identity_passkey_credentialID_key" ON "identity_passkey"("credentialID");
CREATE INDEX "identity_passkey_userId_idx" ON "identity_passkey"("userId");

ALTER TABLE "identity_passkey" ADD CONSTRAINT "identity_passkey_userId_fkey" FOREIGN KEY ("userId") REFERENCES "identity_user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
