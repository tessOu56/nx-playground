export const LINE_TW_PROVIDER_ID = 'line-tw';

export type LineAccountLookup = {
  identityAccount: {
    findUnique: (args: {
      where: {
        providerId_accountId: { providerId: string; accountId: string };
      };
    }) => Promise<{ userId: string } | null>;
  };
};

export function normalizeLineSub(lineSub: string | null | undefined): string {
  return lineSub?.trim() ?? '';
}

export function lineTwAccountKey(lineSub: string): {
  providerId: string;
  accountId: string;
} {
  const accountId = normalizeLineSub(lineSub);
  if (!accountId) {
    throw new Error('LINE sub is required');
  }
  return { providerId: LINE_TW_PROVIDER_ID, accountId };
}

/**
 * Existing LINE attendees are keyed by LINE `sub`. Better Auth stores that
 * value as `identity_account.accountId` with provider `line-tw`, so a returning
 * user is the same row — no re-registration.
 */
export async function findIdentityUserIdByLineSub(
  db: LineAccountLookup,
  lineSub: string
): Promise<string | null> {
  const accountId = normalizeLineSub(lineSub);
  if (!accountId) return null;
  const account = await db.identityAccount.findUnique({
    where: {
      providerId_accountId: lineTwAccountKey(accountId),
    },
  });
  return account?.userId ?? null;
}

export function stripProviderSecrets<
  T extends {
    accessToken?: string | null;
    refreshToken?: string | null;
    idToken?: string | null;
  },
>(account: T): T {
  return {
    ...account,
    accessToken: null,
    refreshToken: null,
    idToken: null,
  };
}

export function optionalEmail(
  email: string | null | undefined
): string | undefined {
  const trimmed = email?.trim() ?? '';
  return trimmed.length > 0 ? trimmed : undefined;
}
