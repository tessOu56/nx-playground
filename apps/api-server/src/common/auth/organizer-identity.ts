import {
  type KratosSessionIdentity,
  verifyKratosSession,
} from './kratos-session';
import { isAdminBearerAuthorized, parseBearerToken } from './timing-safe-equal';

export type OrganizerIdentity = { id: string; role: 'admin' };

export function parseAllowedEmails(raw: string | undefined): Set<string> {
  const value = raw?.trim() ?? '';
  if (!value) return new Set();
  return new Set(
    value
      .split(',')
      .map(email => email.trim().toLowerCase())
      .filter(Boolean)
  );
}

function headerString(value: string | string[] | undefined): string {
  return typeof value === 'string' ? value : '';
}

export function isDevOrganizerAuthEnabled(
  nodeEnv: string | undefined,
  eventStackCmsDevAuth: string | undefined
): boolean {
  return nodeEnv !== 'production' && eventStackCmsDevAuth === 'true';
}

/**
 * Resolves organizer/admin identity.
 *
 * Production never honors X-Organizer-Email or EVENT_STACK_CMS_DEV_AUTH.
 * A verified Kratos session (cookie or session token) whose email is on
 * ALLOWED_ORGANIZER_EMAILS, or a matching ADMIN_API_TOKEN bearer, is required.
 */
export async function resolveOrganizerIdentity(input: {
  authorizationHeader?: string;
  organizerEmailHeader?: string | string[];
  cookieHeader?: string;
  sessionTokenHeader?: string | string[];
  adminApiToken?: string;
  allowedOrganizerEmails?: string;
  eventStackCmsDevAuth?: string;
  nodeEnv?: string;
  kratosPublicUrl?: string;
  verifySession?: (args: {
    kratosPublicUrl?: string;
    cookie?: string;
    sessionToken?: string;
  }) => Promise<KratosSessionIdentity | null>;
}): Promise<OrganizerIdentity | undefined> {
  if (isAdminBearerAuthorized(input.authorizationHeader, input.adminApiToken)) {
    return { id: 'admin-token', role: 'admin' };
  }

  const verify = input.verifySession ?? verifyKratosSession;
  const cookie = input.cookieHeader?.trim() ?? '';
  const sessionTokenHeader = headerString(input.sessionTokenHeader).trim();
  const bearer = parseBearerToken(input.authorizationHeader) ?? '';
  const sessionToken = sessionTokenHeader !== '' ? sessionTokenHeader : bearer;

  if (cookie !== '' || sessionToken !== '') {
    const session = await verify({
      kratosPublicUrl: input.kratosPublicUrl,
      cookie: cookie !== '' ? cookie : undefined,
      sessionToken: sessionToken !== '' ? sessionToken : undefined,
    });
    if (session) {
      const allowed = parseAllowedEmails(input.allowedOrganizerEmails);
      if (allowed.has(session.email)) {
        return { id: session.id, role: 'admin' };
      }
    }
  }

  if (!isDevOrganizerAuthEnabled(input.nodeEnv, input.eventStackCmsDevAuth)) {
    return undefined;
  }

  const email = headerString(input.organizerEmailHeader).trim().toLowerCase();
  if (!email) {
    return undefined;
  }
  return { id: email, role: 'admin' };
}
