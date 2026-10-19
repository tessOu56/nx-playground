/** Public Official Account ID (Messaging channel 2012101436). Not a secret. */
const DEFAULT_OFFICIAL_ACCOUNT_ID = '@006dcvmv';

function ownerOfficialAccountId(): string {
  const fromEnv = process.env.NEXT_PUBLIC_LINE_OFFICIAL_ACCOUNT_ID?.trim();
  if (fromEnv) {
    return fromEnv.startsWith('@') ? fromEnv : `@${fromEnv}`;
  }
  return DEFAULT_OFFICIAL_ACCOUNT_ID;
}

export function lineOfficialAccountId(): string {
  return ownerOfficialAccountId();
}

/** Add-friend / chat deep link for the Official Account. */
export function lineOfficialAccountUrl(): string {
  return `https://line.me/R/ti/p/${lineOfficialAccountId()}`;
}
