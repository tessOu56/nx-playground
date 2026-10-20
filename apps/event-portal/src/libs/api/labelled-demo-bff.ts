import { EventStackStore } from '@nx-playground/api-fixtures';

let store: EventStackStore | undefined;

export function getLabelledDemoStore(): EventStackStore {
  store ??= new EventStackStore();
  return store;
}

export function resetLabelledDemoStore(): EventStackStore {
  store = new EventStackStore();
  return store;
}

function json(status: number, body: unknown): Response {
  return new Response(body === undefined ? null : JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
    },
  });
}

function match(
  method: string,
  pathname: string
): { name: string; params: Record<string, string> } | null {
  const eventsId = pathname.match(/^\/api\/events\/([^/]+)$/);

  if (method === 'GET' && pathname === '/api/events') {
    return { name: 'listEvents', params: {} };
  }
  if (eventsId && method === 'GET') {
    return { name: 'getEvent', params: { id: eventsId[1] } };
  }
  return null;
}

/**
 * Memory fixture BFF for the public labelled demo catalog.
 * Events only — checkout and payments are retired.
 */
export async function handleLabelledDemoRequest(
  request: Request
): Promise<Response> {
  const url = new URL(request.url);
  const method = request.method.toUpperCase();
  if (method === 'OPTIONS') {
    return new Response(null, { status: 204 });
  }

  const route = match(method, url.pathname);
  if (!route) {
    return json(404, {
      message: `labelled-demo has no ${method} ${url.pathname}`,
    });
  }

  const demoStore = getLabelledDemoStore();

  switch (route.name) {
    case 'listEvents':
      return json(
        200,
        demoStore.listEvents({
          status: url.searchParams.get('status') ?? undefined,
          region: url.searchParams.get('region') ?? undefined,
          page: url.searchParams.get('page')
            ? Number(url.searchParams.get('page'))
            : undefined,
          limit: url.searchParams.get('limit')
            ? Number(url.searchParams.get('limit'))
            : 50,
        })
      );
    case 'getEvent': {
      const event = demoStore.getEvent(route.params.id);
      if (!event) {
        return json(404, { message: `Event ${route.params.id} not found` });
      }
      return json(200, event);
    }
    default:
      return json(501, { message: `No labelled-demo handler for ${route.name}` });
  }
}
