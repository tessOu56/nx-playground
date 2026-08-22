let organizerEmailHeader: string | undefined;
let organizerBearerToken: string | undefined;

/** CMS organizer context for protected Nest routes (users, stats). */
export function setEventStackOrganizerAuth(input: {
  email?: string | null;
  bearerToken?: string | null;
}): void {
  organizerEmailHeader = input.email?.trim() || undefined;
  organizerBearerToken = input.bearerToken?.trim() || undefined;
}

export function getEventStackOrganizerHeaders(): Record<string, string> {
  const headers: Record<string, string> = {};
  if (organizerEmailHeader) {
    headers['X-Organizer-Email'] = organizerEmailHeader;
  }
  if (organizerBearerToken) {
    headers.Authorization = `Bearer ${organizerBearerToken}`;
  }
  return headers;
}
