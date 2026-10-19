import type { LineVerifiedIdToken } from './verify-id-token';

/** Browser helper: never decode the JWT locally — the server verifies with LINE. */
export async function verifyLiffIdToken(
  idToken: string,
  nonce?: string
): Promise<LineVerifiedIdToken | null> {
  if (typeof window === 'undefined' || !idToken.trim()) return null;

  try {
    const response = await fetch('/api/line/auth/id-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken, nonce }),
    });
    if (!response.ok) return null;
    const data = (await response.json()) as { payload?: LineVerifiedIdToken };
    return data.payload ?? null;
  } catch {
    return null;
  }
}
