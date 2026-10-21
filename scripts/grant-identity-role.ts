import { PrismaClient, type IdentityRoleName } from '@prisma/client';

import { loadRootEnv } from '../apps/api-server/src/common/prisma/load-root-env';
import { assertPostgresUrl } from '../apps/api-server/src/common/prisma/postgres-url';

const ROLES = new Set<IdentityRoleName>(['organizer', 'admin']);

function arg(name: string): string | undefined {
  const index = process.argv.indexOf(name);
  if (index === -1) return undefined;
  return process.argv[index + 1]?.trim();
}

function usage(): never {
  console.error(`Grant an elevated identity role (admin-assigned, default-deny).

Usage:
  pnpm exec tsx scripts/grant-identity-role.ts --role admin --user-id <identity_user.id>
  pnpm exec tsx scripts/grant-identity-role.ts --role organizer --line-sub <LINE sub>
  pnpm exec tsx scripts/grant-identity-role.ts --role admin --email <email>

Optional: --granted-by <actor id or name>
The user must already exist (sign in with LINE or Google first).`);
  process.exit(1);
}

async function main() {
  loadRootEnv();
  const databaseUrl = process.env.DATABASE_URL?.trim() ?? '';
  if (!databaseUrl) {
    console.error('DATABASE_URL is required');
    process.exit(1);
  }
  assertPostgresUrl(databaseUrl);

  const role = arg('--role') as IdentityRoleName | undefined;
  const userId = arg('--user-id');
  const lineSub = arg('--line-sub');
  const email = arg('--email');
  const grantedBy = arg('--granted-by') ?? 'cli';

  if (!role || !ROLES.has(role)) usage();
  if ([userId, lineSub, email].filter(Boolean).length !== 1) usage();

  const prisma = new PrismaClient({ datasourceUrl: databaseUrl });
  try {
    let id = userId ?? '';
    if (lineSub) {
      const account = await prisma.identityAccount.findUnique({
        where: {
          providerId_accountId: { providerId: 'line-tw', accountId: lineSub },
        },
        select: { userId: true },
      });
      if (!account) {
        throw new Error(`No identity_account for line-tw:${lineSub}`);
      }
      id = account.userId;
    } else if (email) {
      const user = await prisma.identityUser.findUnique({
        where: { email },
        select: { id: true },
      });
      if (!user) {
        throw new Error(`No identity_user for email ${email}`);
      }
      id = user.id;
    }

    const user = await prisma.identityUser.findUnique({
      where: { id },
      select: { id: true, email: true, name: true },
    });
    if (!user) {
      throw new Error(`No identity_user ${id}`);
    }

    const row = await prisma.userRole.upsert({
      where: { userId_role: { userId: id, role } },
      create: { userId: id, role, grantedBy },
      update: { grantedBy, grantedAt: new Date() },
    });

    console.log(
      JSON.stringify(
        {
          userId: user.id,
          email: user.email,
          name: user.name,
          role: row.role,
          grantedBy: row.grantedBy,
          grantedAt: row.grantedAt,
        },
        null,
        2
      )
    );
  } finally {
    await prisma.$disconnect();
  }
}

main().catch(error => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
