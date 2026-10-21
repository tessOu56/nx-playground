import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as typeof globalThis & {
  identityPrisma?: PrismaClient;
};

export const identityPrisma =
  globalForPrisma.identityPrisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.identityPrisma = identityPrisma;
}
