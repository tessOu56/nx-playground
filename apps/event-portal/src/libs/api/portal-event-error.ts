/** True when a listing fetch failed because the id is missing, not because the API is down. */
export function isMissingPortalEvent(error: unknown): boolean {
  if (!error) return false;
  const message = error instanceof Error ? error.message : String(error);
  return /not found/i.test(message);
}
