export type IdentityAuthErrorKey =
  | 'alreadyLinkedToOtherUser'
  | 'lastSignInMethod'
  | 'accountNotLinked'
  | 'sessionNotFresh'
  | 'unknown';

function normalizeAuthErrorToken(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, '_');
}

function tokensFromAuthError(input: {
  code?: string | null;
  error?: string | null;
  message?: string | null;
}): string[] {
  return [input.code, input.error, input.message]
    .filter((value): value is string => typeof value === 'string')
    .map(normalizeAuthErrorToken)
    .filter(Boolean);
}

export type IdentityAuthErrorCopy = {
  alreadyLinkedToOtherUser: string;
  lastSignInMethod: string;
  accountNotLinked: string;
  sessionNotFresh: string;
  fallback: string;
};

export function identityAuthErrorText(
  copy: IdentityAuthErrorCopy,
  input: {
    code?: string | null;
    error?: string | null;
    message?: string | null;
  }
): string | null {
  const key = identityAuthErrorKey(input);
  if (key === 'alreadyLinkedToOtherUser') return copy.alreadyLinkedToOtherUser;
  if (key === 'lastSignInMethod') return copy.lastSignInMethod;
  if (key === 'accountNotLinked') return copy.accountNotLinked;
  if (key === 'sessionNotFresh') return copy.sessionNotFresh;
  if (input.message?.trim()) return input.message.trim();
  if (key === 'unknown') return copy.fallback;
  return null;
}

export function resolveAuthError(
  copy: IdentityAuthErrorCopy,
  input: {
    code?: string | null;
    error?: string | null;
    message?: string | null;
  }
): string {
  return identityAuthErrorText(copy, input) ?? copy.fallback;
}

export function identityAuthErrorKey(input: {
  code?: string | null;
  error?: string | null;
  message?: string | null;
}): IdentityAuthErrorKey | null {
  const tokens = tokensFromAuthError(input);
  if (tokens.length === 0) return null;

  const joined = tokens.join(' ');
  if (
    joined.includes('already_linked_to_different_user') ||
    joined.includes('already_linked_to_a_different_user') ||
    (joined.includes('already_linked') && joined.includes('different_user'))
  ) {
    return 'alreadyLinkedToOtherUser';
  }
  if (
    joined.includes('failed_to_unlink_last_account') ||
    joined.includes('last_sign_in_method') ||
    joined.includes("can't_unlink_your_last_account") ||
    joined.includes('keep_at_least_one_sign_in_method')
  ) {
    return 'lastSignInMethod';
  }
  if (joined.includes('account_not_linked')) {
    return 'accountNotLinked';
  }
  if (
    joined.includes('session_not_fresh') ||
    joined.includes('session_expired')
  ) {
    return 'sessionNotFresh';
  }
  return 'unknown';
}
