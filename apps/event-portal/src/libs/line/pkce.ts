const VERIFIER_PATTERN = /^[A-Za-z0-9._~-]{43,128}$/;

function bytesToUrlSafe(bytes: ArrayBuffer | Uint8Array): string {
  const arr = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let binary = '';
  for (const byte of arr) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function randomUrlSafe(byteLength: number): string {
  const bytes = new Uint8Array(byteLength);
  crypto.getRandomValues(bytes);
  return bytesToUrlSafe(bytes);
}

export function isLinePkceVerifier(value: unknown): value is string {
  return typeof value === 'string' && VERIFIER_PATTERN.test(value);
}

/**
 * LINE Login PKCE (S256). The token endpoint is a public client-secret proxy,
 * so authorize+exchange must bind the code to a verifier created in this browser.
 */
export async function createLineLoginPkce(): Promise<{
  state: string;
  codeVerifier: string;
  codeChallenge: string;
}> {
  const state = randomUrlSafe(24);
  const codeVerifier = randomUrlSafe(32);
  const digest = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(codeVerifier)
  );
  return {
    state,
    codeVerifier,
    codeChallenge: bytesToUrlSafe(digest),
  };
}
