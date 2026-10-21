import {
  request as httpRequest,
  type IncomingMessage,
  type ServerResponse,
} from 'node:http';
import { request as httpsRequest } from 'node:https';
import { URL } from 'node:url';

const MAX_BODY_BYTES = 1024 * 1024;
const HOP_BY_HOP = new Set([
  'connection',
  'keep-alive',
  'proxy-authenticate',
  'proxy-authorization',
  'te',
  'trailers',
  'transfer-encoding',
  'upgrade',
  'host',
  'authorization',
  'cookie',
  'x-organizer-email',
  'x-session-token',
]);

const ELEVATED_ROLES = new Set(['organizer', 'admin']);

export type CmsOrganizerSession = {
  token: string;
  roles: string[];
  id: string;
};

export type CmsBffConfig = {
  nestApiBaseUrl: string;
  authUrl?: string;
  nodeEnv?: string;
  allowedOrigins: string[];
  issueOrganizerAccess?: (args: {
    authUrl?: string;
    cookie?: string;
  }) => Promise<CmsOrganizerSession | null>;
  fetchImpl?: typeof fetch;
};

export type CmsBffAuthorization =
  | { ok: true; authorization: string }
  | { ok: false; status: number; body: string };

function isMutatingMethod(method: string): boolean {
  return !['GET', 'HEAD', 'OPTIONS'].includes(method.toUpperCase());
}

export function isAllowedCmsOrigin(
  origin: string | undefined,
  allowedOrigins: string[]
): boolean {
  const value = origin?.trim() ?? '';
  if (!value) return false;
  return allowedOrigins.some(allowed => allowed === value);
}

export function parseAuthBaseUrl(authUrl: string | undefined): string | null {
  const trimmed = authUrl?.trim() ?? '';
  if (!trimmed) return null;
  try {
    const url = new URL(trimmed);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      return null;
    }
    return `${url.origin}${url.pathname.replace(/\/$/, '')}`;
  } catch {
    return null;
  }
}

function hasOrganizerRole(roles: unknown): boolean {
  if (!Array.isArray(roles)) return false;
  return roles.some(role => typeof role === 'string' && ELEVATED_ROLES.has(role));
}

async function defaultIssueOrganizerAccess(input: {
  authUrl?: string;
  cookie?: string;
  fetchImpl?: typeof fetch;
}): Promise<CmsOrganizerSession | null> {
  const base = parseAuthBaseUrl(input.authUrl);
  const cookie = input.cookie?.trim() ?? '';
  if (!base || !cookie) return null;

  const fetchImpl = input.fetchImpl ?? fetch;
  const headers = { Accept: 'application/json', cookie };
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 3000);
  try {
    const sessionResponse = await fetchImpl(`${base}/api/auth/get-session`, {
      method: 'GET',
      headers,
      signal: controller.signal,
    });
    if (!sessionResponse.ok) return null;
    const session = (await sessionResponse.json()) as {
      user?: { id?: string; roles?: unknown };
    };
    const id = session.user?.id?.trim();
    const roles = Array.isArray(session.user?.roles)
      ? session.user.roles.filter((role): role is string => typeof role === 'string')
      : [];
    if (!id || !hasOrganizerRole(roles)) return null;

    const tokenResponse = await fetchImpl(`${base}/api/auth/token`, {
      method: 'GET',
      headers,
      signal: controller.signal,
    });
    if (!tokenResponse.ok) return null;
    const body = (await tokenResponse.json()) as { token?: unknown };
    const token = typeof body.token === 'string' ? body.token.trim() : '';
    if (!token) return null;
    return { id, roles, token };
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Gate for CMS → Nest proxy. Forwards a Better Auth JWT after an organizer
 * session; never attaches ADMIN_API_TOKEN.
 */
export async function authorizeCmsBffRequest(input: {
  method: string;
  origin?: string;
  cookie?: string;
  config: CmsBffConfig;
}): Promise<CmsBffAuthorization> {
  const method = input.method.toUpperCase();
  if (
    input.config.nodeEnv === 'production' &&
    isMutatingMethod(method) &&
    !isAllowedCmsOrigin(input.origin, input.config.allowedOrigins)
  ) {
    return { ok: false, status: 403, body: '{"message":"Forbidden"}' };
  }

  const issue =
    input.config.issueOrganizerAccess ??
    (args =>
      defaultIssueOrganizerAccess({
        ...args,
        fetchImpl: input.config.fetchImpl,
      }));

  const session = await issue({
    authUrl: input.config.authUrl,
    cookie: input.cookie,
  });
  if (!session) {
    return { ok: false, status: 401, body: '{"message":"Unauthorized"}' };
  }

  return { ok: true, authorization: `Bearer ${session.token}` };
}

function headerValue(
  headers: IncomingMessage['headers'],
  name: string
): string | undefined {
  const value = headers[name];
  return typeof value === 'string' ? value : undefined;
}

async function readBody(req: IncomingMessage): Promise<Buffer> {
  const chunks: Buffer[] = [];
  let size = 0;
  for await (const chunk of req) {
    const buf = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    size += buf.length;
    if (size > MAX_BODY_BYTES) {
      throw new Error('payload too large');
    }
    chunks.push(buf);
  }
  return Buffer.concat(chunks);
}

function writeJson(res: ServerResponse, status: number, body: string): void {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(body);
}

export function createCmsBffMiddleware(config: CmsBffConfig) {
  return async (
    req: IncomingMessage,
    res: ServerResponse,
    next: (err?: unknown) => void
  ): Promise<void> => {
    try {
      const method = req.method ?? 'GET';
      const decision = await authorizeCmsBffRequest({
        method,
        origin: headerValue(req.headers, 'origin'),
        cookie: headerValue(req.headers, 'cookie'),
        config,
      });
      if (!decision.ok) {
        writeJson(res, decision.status, decision.body);
        return;
      }

      const nestBase = config.nestApiBaseUrl.replace(/\/$/, '');
      const pathAndQuery = req.url ?? '/';
      const target = new URL(
        `${nestBase}${pathAndQuery.startsWith('/') ? pathAndQuery : `/${pathAndQuery}`}`
      );
      const body =
        method === 'GET' || method === 'HEAD' ? Buffer.alloc(0) : await readBody(req);

      const outgoing: Record<string, string | string[]> = {
        authorization: decision.authorization,
      };
      for (const [key, value] of Object.entries(req.headers)) {
        if (!value || HOP_BY_HOP.has(key.toLowerCase())) continue;
        outgoing[key] = value;
      }
      if (body.length > 0 && !outgoing['content-length']) {
        outgoing['content-length'] = String(body.length);
      }

      const transport = target.protocol === 'https:' ? httpsRequest : httpRequest;
      const upstream = transport(
        {
          protocol: target.protocol,
          hostname: target.hostname,
          port: target.port,
          path: `${target.pathname}${target.search}`,
          method,
          headers: outgoing,
        },
        upstreamRes => {
          res.statusCode = upstreamRes.statusCode ?? 502;
          for (const [key, value] of Object.entries(upstreamRes.headers)) {
            if (value === undefined) continue;
            if (HOP_BY_HOP.has(key.toLowerCase())) continue;
            res.setHeader(key, value);
          }
          upstreamRes.pipe(res);
        }
      );
      upstream.on('error', () => {
        if (!res.headersSent) {
          writeJson(res, 502, '{"message":"Bad gateway"}');
        }
      });
      if (body.length > 0) {
        upstream.end(body);
      } else {
        upstream.end();
      }
    } catch (error) {
      if (error instanceof Error && error.message === 'payload too large') {
        writeJson(res, 413, '{"message":"Payload too large"}');
        return;
      }
      next(error);
    }
  };
}

export function nestApiBaseFromEnv(
  env: Record<string, string | undefined>
): string {
  const explicit = env.EVENT_STACK_NEST_URL?.trim();
  if (explicit) return explicit.replace(/\/$/, '');
  const vite = env.VITE_API_BASE_URL?.trim() ?? '';
  if (/^https?:\/\//i.test(vite) && !/\/cms-api\/?$/i.test(vite)) {
    return vite.replace(/\/$/, '');
  }
  return 'http://localhost:3001/api';
}

export function cmsAuthUrlFromEnv(
  env: Record<string, string | undefined>
): string {
  return (
    env.BETTER_AUTH_URL?.trim() ||
    env.VITE_AUTH_URL?.trim() ||
    'http://localhost:3000'
  );
}

export function cmsBffOriginsFromEnv(
  env: Record<string, string | undefined>
): string[] {
  const raw = env.CMS_BFF_ORIGIN?.trim();
  if (raw) {
    return raw
      .split(',')
      .map(origin => origin.trim())
      .filter(Boolean);
  }
  return ['http://localhost:3002', 'http://127.0.0.1:3002'];
}
