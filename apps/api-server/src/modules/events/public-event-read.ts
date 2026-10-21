/**
 * Public list is published-only. Organizer/admin/machine callers may omit
 * status (all rows) or pass a filter. Attacker-supplied status=draft is ignored.
 */
export function eventListStatusForCaller(
  canReadUnpublished: boolean,
  requestedStatus: string | undefined
): string | undefined {
  if (canReadUnpublished) {
    return requestedStatus;
  }
  return 'published';
}

export function canReadEventRecord(
  canReadUnpublished: boolean,
  status: string
): boolean {
  return status === 'published' || canReadUnpublished;
}
