export const LAST_SIGN_IN_METHOD_CODE = 'LAST_SIGN_IN_METHOD';
export const UNLINK_ACCOUNT_PATH = '/unlink-account';
export const DELETE_PASSKEY_PATH = '/passkey/delete-passkey';

export class LastSignInMethodError extends Error {
  readonly code = LAST_SIGN_IN_METHOD_CODE;

  constructor() {
    super('Keep at least one sign-in method');
    this.name = 'LastSignInMethodError';
  }
}

export type SignInMethodCounts = {
  accounts: number;
  passkeys: number;
};

export type SignInMethodDb = {
  identityAccount: {
    count: (args: { where: { userId: string } }) => Promise<number>;
  };
  identityPasskey: {
    count: (args: { where: { userId: string } }) => Promise<number>;
  };
};

export function removalForAuthPath(path: string): 'account' | 'passkey' | null {
  if (path === UNLINK_ACCOUNT_PATH) return 'account';
  if (path === DELETE_PASSKEY_PATH) return 'passkey';
  return null;
}

export function signInMethodCount(counts: SignInMethodCounts): number {
  return counts.accounts + counts.passkeys;
}

export function wouldRemoveLastSignInMethod(
  counts: SignInMethodCounts,
  removing: 'account' | 'passkey'
): boolean {
  const remaining =
    removing === 'account'
      ? counts.accounts - 1 + counts.passkeys
      : counts.accounts + counts.passkeys - 1;
  return remaining < 1;
}

export async function loadSignInMethodCounts(
  db: SignInMethodDb,
  userId: string
): Promise<SignInMethodCounts> {
  const [accounts, passkeys] = await Promise.all([
    db.identityAccount.count({ where: { userId } }),
    db.identityPasskey.count({ where: { userId } }),
  ]);
  return { accounts, passkeys };
}

export async function assertNotRemovingLastSignInMethod(opts: {
  db: SignInMethodDb;
  userId: string;
  removing: 'account' | 'passkey';
}): Promise<void> {
  const counts = await loadSignInMethodCounts(opts.db, opts.userId);
  if (wouldRemoveLastSignInMethod(counts, opts.removing)) {
    throw new LastSignInMethodError();
  }
}
