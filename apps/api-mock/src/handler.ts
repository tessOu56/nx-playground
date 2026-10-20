import type { IncomingMessage, ServerResponse } from 'node:http';

import { getEventStackRepo } from './data/get-store.js';

const DEFAULT_CORS_ORIGINS = [
  'https://nx-event-portal.vercel.app',
  'http://localhost:3000',
  'http://localhost:3002',
  'http://localhost:3004',
];

export function allowedCorsOrigins(): string[] {
  return (process.env.CORS_ORIGIN || DEFAULT_CORS_ORIGINS.join(','))
    .split(',')
    .map(origin => origin.trim())
    .filter(Boolean);
}

export function corsHeaders(req: IncomingMessage): Record<string, string> {
  const allowed = allowedCorsOrigins();
  const requestOrigin = req.headers.origin;
  const allow =
    requestOrigin && allowed.includes(requestOrigin)
      ? requestOrigin
      : allowed[0] ?? 'https://nx-event-portal.vercel.app';
  return {
    'Access-Control-Allow-Origin': allow,
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
    Vary: 'Origin',
  };
}

export function send(
  req: IncomingMessage,
  res: ServerResponse,
  status: number,
  body?: unknown
) {
  res.writeHead(status, {
    ...corsHeaders(req),
    'Content-Type': 'application/json',
  });
  res.end(body === undefined ? '' : JSON.stringify(body));
}

export async function readJson(req: IncomingMessage): Promise<Record<string, unknown>> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  if (chunks.length === 0) return {};
  const raw = Buffer.concat(chunks).toString('utf8');
  if (!raw) return {};
  return JSON.parse(raw) as Record<string, unknown>;
}

export function match(
  method: string,
  pathname: string
): { name: string; params: Record<string, string> } | null {
  const eventsId = pathname.match(/^\/api\/events\/([^/]+)$/);

  if (method === 'GET' && pathname === '/api/events') return { name: 'listEvents', params: {} };
  if (method === 'POST' && pathname === '/api/events') return { name: 'createEvent', params: {} };
  if (eventsId && method === 'GET') return { name: 'getEvent', params: { id: eventsId[1] } };
  if (eventsId && method === 'PUT') return { name: 'updateEvent', params: { id: eventsId[1] } };
  if (eventsId && method === 'DELETE') return { name: 'deleteEvent', params: { id: eventsId[1] } };
  if (method === 'GET' && (pathname === '/' || pathname === '/api/health')) {
    return { name: 'health', params: {} };
  }
  return null;
}

export async function handleEventStackHttp(
  req: IncomingMessage,
  res: ServerResponse,
  url: URL
): Promise<void> {
  const method = (req.method ?? 'GET').toUpperCase();

  if (method === 'OPTIONS') {
    res.writeHead(204, corsHeaders(req));
    res.end();
    return;
  }

  const route = match(method, url.pathname);
  if (!route) {
    send(req, res, 501, {
      message: `No event-stack handler for ${method} ${url.pathname}`,
    });
    return;
  }

  const store = getEventStackRepo();

  try {
    switch (route.name) {
      case 'health': {
        const listed = await store.listEvents({ limit: 1 });
        send(req, res, 200, {
          status: 'ok',
          storage: store.storage,
          catalogEvents: listed.total,
        });
        return;
      }
      case 'listEvents':
        send(
          req,
          res,
          200,
          await store.listEvents({
            status: url.searchParams.get('status') ?? undefined,
            region: url.searchParams.get('region') ?? undefined,
            page: url.searchParams.get('page')
              ? Number(url.searchParams.get('page'))
              : undefined,
            limit: url.searchParams.get('limit')
              ? Number(url.searchParams.get('limit'))
              : undefined,
          })
        );
        return;
      case 'getEvent': {
        const event = await store.getEvent(route.params.id);
        if (!event) {
          send(req, res, 404, { message: `Event ${route.params.id} not found` });
          return;
        }
        send(req, res, 200, event);
        return;
      }
      case 'createEvent': {
        const body = await readJson(req);
        const created = await store.createEvent({
          title: String(body.title ?? ''),
          description: body.description as string | undefined,
          location: body.location as string | undefined,
          startDate: String(body.startDate ?? ''),
          endDate: String(body.endDate ?? ''),
          maxAttendees:
            typeof body.maxAttendees === 'number' ? body.maxAttendees : undefined,
          status: body.status as string | undefined,
          formId: body.formId as string | undefined,
        });
        send(req, res, 201, created);
        return;
      }
      case 'updateEvent': {
        const body = await readJson(req);
        const updated = await store.updateEvent(route.params.id, body);
        if (!updated) {
          send(req, res, 404, { message: `Event ${route.params.id} not found` });
          return;
        }
        send(req, res, 200, updated);
        return;
      }
      case 'deleteEvent': {
        const ok = await store.deleteEvent(route.params.id);
        if (!ok) {
          send(req, res, 404, { message: `Event ${route.params.id} not found` });
          return;
        }
        send(req, res, 200, { message: 'Event deleted successfully', id: route.params.id });
        return;
      }
      default:
        send(req, res, 501, {
          message: `No event-stack handler for ${method} ${url.pathname}`,
        });
    }
  } catch (error) {
    send(req, res, 500, {
      message: error instanceof Error ? error.message : 'event-stack server error',
    });
  }
}
