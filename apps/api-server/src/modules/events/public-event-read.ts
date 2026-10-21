import { isAdminBearerAuthorized } from '../../common/auth/timing-safe-equal';

export function isEventAdmin(authorizationHeader?: string): boolean {
  return isAdminBearerAuthorized(authorizationHeader);
}

/**
 * Public list is published-only. Admin bearer may omit status (all rows)
 * or pass a filter. Attacker-supplied status=draft is ignored.
 */
export function eventListStatusForCaller(
  authorizationHeader: string | undefined,
  requestedStatus: string | undefined
): string | undefined {
  if (isEventAdmin(authorizationHeader)) {
    return requestedStatus;
  }
  return 'published';
}

export function canReadEventRecord(
  authorizationHeader: string | undefined,
  status: string
): boolean {
  return status === 'published' || isEventAdmin(authorizationHeader);
}
