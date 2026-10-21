import type { NestMiddleware } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';

import { isAdminBearerAuthorized } from '../common/auth/timing-safe-equal';

export type OrganizerIdentity = { id: string; role: 'admin' };

function parseAllowedEmails(raw: string | undefined): Set<string> {
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

/**
 * Resolves organizer identity for CMS-protected routes.
 * Production never honors EVENT_STACK_CMS_DEV_AUTH (fail closed).
 * Email headers are not a proof of identity; they remain a local/dev
 * convenience and an allowlist check in production.
 */
export function resolveOrganizerIdentity(input: {
  authorizationHeader?: string;
  organizerEmailHeader?: string | string[];
  cmsOrganizerApiToken?: string;
  allowedOrganizerEmails?: string;
  eventStackCmsDevAuth?: string;
  nodeEnv?: string;
}): OrganizerIdentity | undefined {
  if (
    isAdminBearerAuthorized(
      input.authorizationHeader,
      input.cmsOrganizerApiToken
    )
  ) {
    return { id: 'cms-token', role: 'admin' };
  }

  const email = headerString(input.organizerEmailHeader).trim().toLowerCase();
  if (!email) {
    return undefined;
  }

  const isProduction = input.nodeEnv === 'production';
  const devAuth = !isProduction && input.eventStackCmsDevAuth === 'true';
  const allowed = parseAllowedEmails(input.allowedOrganizerEmails);
  if (devAuth || !isProduction || allowed.has(email)) {
    return { id: email, role: 'admin' };
  }

  return undefined;
}

/**
 * Injects organizer permissions for CMS-protected routes (users, stats).
 * CMS sends X-Organizer-Email after Kratos session; optional bearer token for hosted.
 */
export class OrganizerAuthMiddleware implements NestMiddleware {
  use(req: Request, _res: Response, next: NextFunction): void {
    if (req.user) {
      next();
      return;
    }

    const identity = resolveOrganizerIdentity({
      authorizationHeader: req.headers.authorization,
      organizerEmailHeader: req.headers['x-organizer-email'],
      cmsOrganizerApiToken: process.env.CMS_ORGANIZER_API_TOKEN,
      allowedOrganizerEmails: process.env.ALLOWED_ORGANIZER_EMAILS,
      eventStackCmsDevAuth: process.env.EVENT_STACK_CMS_DEV_AUTH,
      nodeEnv: process.env.NODE_ENV,
    });
    if (identity) {
      req.user = identity;
    }
    next();
  }
}
