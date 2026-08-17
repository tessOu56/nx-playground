import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';

import { EventStackStore } from '../../../libs/api-fixtures/src/index';

const PORT = Number(process.env.API_MOCK_PORT) || 3011;
const store = new EventStackStore();

const CORS = {
  'Access-Control-Allow-Origin': process.env.CORS_ORIGIN || '*',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization',
};

function send(res: ServerResponse, status: number, body?: unknown) {
  res.writeHead(status, {
    ...CORS,
    'Content-Type': 'application/json',
  });
  res.end(body === undefined ? '' : JSON.stringify(body));
}

function notImplemented(res: ServerResponse, method: string, url: string) {
  send(res, 501, {
    message: `No event-stack mock handler for ${method} ${url}`,
  });
}

async function readJson(req: IncomingMessage): Promise<Record<string, unknown>> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  if (chunks.length === 0) return {};
  const raw = Buffer.concat(chunks).toString('utf8');
  if (!raw) return {};
  return JSON.parse(raw) as Record<string, unknown>;
}

function match(
  method: string,
  pathname: string
): { name: string; params: Record<string, string> } | null {
  const eventsId = pathname.match(/^\/api\/events\/([^/]+)$/);
  const ordersConfirm = pathname.match(/^\/api\/orders\/([^/]+)\/confirm$/);
  const ordersId = pathname.match(/^\/api\/orders\/([^/]+)$/);

  if (method === 'GET' && pathname === '/api/events') return { name: 'listEvents', params: {} };
  if (method === 'POST' && pathname === '/api/events') return { name: 'createEvent', params: {} };
  if (eventsId && method === 'GET') return { name: 'getEvent', params: { id: eventsId[1] } };
  if (eventsId && method === 'PUT') return { name: 'updateEvent', params: { id: eventsId[1] } };
  if (eventsId && method === 'DELETE') return { name: 'deleteEvent', params: { id: eventsId[1] } };
  if (method === 'POST' && pathname === '/api/orders') return { name: 'createOrder', params: {} };
  if (ordersConfirm && method === 'POST') {
    return { name: 'confirmOrder', params: { id: ordersConfirm[1] } };
  }
  if (ordersId && method === 'GET') return { name: 'getOrder', params: { id: ordersId[1] } };
  if (method === 'GET' && pathname === '/api/health') return { name: 'health', params: {} };
  return null;
}

const server = createServer(async (req, res) => {
  const method = (req.method ?? 'GET').toUpperCase();
  const url = new URL(req.url ?? '/', `http://localhost:${PORT}`);

  if (method === 'OPTIONS') {
    res.writeHead(204, CORS);
    res.end();
    return;
  }

  const route = match(method, url.pathname);
  if (!route) {
    notImplemented(res, method, url.pathname);
    return;
  }

  try {
    switch (route.name) {
      case 'health':
        send(res, 200, { status: 'ok', mode: 'mock' });
        return;
      case 'listEvents':
        send(
          res,
          200,
          store.listEvents({
            status: url.searchParams.get('status') ?? undefined,
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
        const event = store.getEvent(route.params.id);
        if (!event) {
          send(res, 404, { message: `Event ${route.params.id} not found` });
          return;
        }
        send(res, 200, event);
        return;
      }
      case 'createEvent': {
        const body = await readJson(req);
        const created = store.createEvent({
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
        send(res, 201, created);
        return;
      }
      case 'updateEvent': {
        const body = await readJson(req);
        const updated = store.updateEvent(route.params.id, body);
        if (!updated) {
          send(res, 404, { message: `Event ${route.params.id} not found` });
          return;
        }
        send(res, 200, updated);
        return;
      }
      case 'deleteEvent': {
        const ok = store.deleteEvent(route.params.id);
        if (!ok) {
          send(res, 404, { message: `Event ${route.params.id} not found` });
          return;
        }
        send(res, 200, { message: 'Event deleted successfully', id: route.params.id });
        return;
      }
      case 'createOrder': {
        const body = await readJson(req);
        const created = store.createOrder({
          eventId: String(body.eventId ?? ''),
          userId: body.userId as string | undefined,
          status: body.status as string | undefined,
          data: (body.data as Record<string, unknown>) ?? {},
        });
        if ('error' in created) {
          send(res, 400, { message: created.error });
          return;
        }
        send(res, 201, created);
        return;
      }
      case 'getOrder': {
        const order = store.getOrder(route.params.id);
        if (!order) {
          send(res, 404, { message: `Order ${route.params.id} not found` });
          return;
        }
        send(res, 200, order);
        return;
      }
      case 'confirmOrder': {
        const order = store.confirmOrder(route.params.id);
        if (!order) {
          send(res, 404, { message: `Order ${route.params.id} not found` });
          return;
        }
        send(res, 200, order);
        return;
      }
      default:
        notImplemented(res, method, url.pathname);
    }
  } catch (error) {
    send(res, 500, {
      message: error instanceof Error ? error.message : 'mock server error',
    });
  }
});

server.listen(PORT, () => {
  console.log(`event-stack api-mock listening on http://localhost:${PORT}/api`);
});
