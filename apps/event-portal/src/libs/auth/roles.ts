export const IDENTITY_ROLES = ['user', 'organizer', 'admin'] as const;
export type IdentityRole = (typeof IDENTITY_ROLES)[number];

export function isElevatedIdentityRole(
  value: unknown
): value is 'organizer' | 'admin' {
  return value === 'organizer' || value === 'admin';
}

export async function listIdentityRoles(
  db: {
    userRole: {
      findMany: (args: {
        where: { userId: string };
      }) => Promise<Array<{ role: string }>>;
    };
  },
  userId: string
): Promise<Array<'organizer' | 'admin'>> {
  const rows = await db.userRole.findMany({ where: { userId } });
  return rows
    .map(row => row.role)
    .filter(isElevatedIdentityRole);
}
