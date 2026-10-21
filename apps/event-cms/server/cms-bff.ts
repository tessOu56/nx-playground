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

export type CmsBffConfig = {
  nestApiBaseUrl: string;
  adminApiToken?: string;
  kratosPublicUrl?: string;
  allowedOrganizerEmails?: string;
  eventStackCmsDevAuth?: string;
  nodeEnv?: string;
  allowedOrigins: string[];
  verifySession?: (args: {
    kratosPublicUrl?: string;
    cookie?: string;
    sessionToken?: string;
  }) => Promise<{ id: string; email: string } | null>;
  fetchImpl?: typeof fetch;
};

export type CmsBffAuthorization =
  | { ok: true; authorization: string }
  | { ok: false; status: number; body: string };

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

function isDevOrganizerAuthEnabled(
  nodeEnv: string | undefined,
  eventStackCmsDevAuth: string | undefined
): boolean {
  return nodeEnv !== 'production' && eventStackCmsDevAuth === 'true';
}

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

function kratosWhoamiUrl(kratosPublicUrl: string | undefined): string | null {
  const trimmed = kratosPublicUrl?.trim() ?? '';
  if (!trimmed) return null;
  try {
    const url = new URL(trimmed);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      return null;
    }
    return `${url.origin}${url.pathname.replace(/\/$/, '')}/sessions/whoami`;
  } catch {
    return null;
  }
}

async function defaultVerifySession(input: {
  kratosPublicUrl?: string;
  cookie?: string;
  sessionToken?: string;
  fetchImpl?: typeof fetch;
}): Promise<{ id: string; email: string } | null> {
  const whoami = kratosWhoamiUrl(input.kratosPublicUrl);
  const cookie = input.cookie?.trim() ?? '';
  const sessionToken = input.sessionToken?.trim() ?? '';
  if (!whoami || (!cookie && !sessionToken)) {
    return null;
  }

  const headers: Record<string, string> = { Accept: 'application/json' };
  if (cookie) headers.cookie = cookie;
  if (sessionToken) headers['x-session-token'] = sessionToken;

  const fetchImpl = input.fetchImpl ?? fetch;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 3000);
  try {
    const response = await fetchImpl(whoami, {
      method: 'GET',
      headers,
      signal: controller.signal,
    });
    if (!response.ok) return null;
    const body = (await response.json()) as {
      identity?: { id?: string; traits?: { email?: string } };
    };
    const id = body.identity?.id?.trim();
    const email = body.identity?.traits?.email?.trim().toLowerCase();
    if (!id || !email) return null;
    return { id, email };
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Gate for CMS → Nest proxy. Never forwards a client secret; attaches
 * ADMIN_API_TOKEN only after a verified session (or the local-only flag).
 */
export async function authorizeCmsBffRequest(input: {
  method: string;
  origin?: string;
  cookie?: string;
  sessionToken?: string;
  config: CmsBffConfig;
}): Promise<CmsBffAuthorization> {
  const token = input.config.adminApiToken?.trim() ?? '';
  if (!token) {
    return { ok: false, status: 401, body: '{"message":"Unauthorized"}' };
  }

  const method = input.method.toUpperCase();
  if (
    input.config.nodeEnv === 'production' &&
    isMutatingMethod(method) &&
    !isAllowedCmsOrigin(input.origin, input.config.allowedOrigins)
  ) {
    return { ok: false, status: 403, body: '{"message":"Forbidden"}' };
  }

  if (
    isDevOrganizerAuthEnabled(
      input.config.nodeEnv,
      input.config.eventStackCmsDevAuth
    )
  ) {
    return { ok: true, authorization: `Bearer ${token}` };
  }

  const verify =
    input.config.verifySession ??
    ((args: {
      kratosPublicUrl?: string;
      cookie?: string;
      sessionToken?: string;
    }) => defaultVerifySession({ ...args, fetchImpl: input.config.fetchImpl }));

  const session = await verify({
    kratosPublicUrl: input.config.kratosPublicUrl,
    cookie: input.cookie,
    sessionToken: input.sessionToken,
  });
  const allowed = parseAllowedEmails(input.config.allowedOrganizerEmails);
  if (!session || !allowed.has(session.email)) {
    return { ok: false, status: 401, body: '{"message":"Unauthorized"}' };
  }

  return { ok: true, authorization: `Bearer ${token}` };
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
        sessionToken: headerValue(req.headers, 'x-session-token'),
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
