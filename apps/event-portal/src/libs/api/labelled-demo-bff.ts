import {
  EventStackStore,
  mockCompleteHtml,
  mockCheckoutUrl,
  portalOrderReturnUrl,
} from '@nx-playground/api-fixtures';

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
  const ordersConfirm = pathname.match(/^\/api\/orders\/([^/]+)\/confirm$/);
  const ordersTickets = pathname.match(/^\/api\/orders\/([^/]+)\/tickets$/);
  const ticketsCheckIn = pathname.match(/^\/api\/tickets\/([^/]+)\/check-in$/);
  const ticketsVerify = pathname.match(/^\/api\/tickets\/([^/]+)\/verify$/);
  const ticketsId = pathname.match(/^\/api\/tickets\/([^/]+)$/);
  const ordersId = pathname.match(/^\/api\/orders\/([^/]+)$/);
  const paymentIntentId = pathname.match(/^\/api\/payments\/intents\/([^/]+)$/);
  const mockComplete = pathname.match(
    /^\/api\/payments\/mock-complete\/([^/]+)$/
  );

  if (method === 'GET' && pathname === '/api/events') {
    return { name: 'listEvents', params: {} };
  }
  if (eventsId && method === 'GET') {
    return { name: 'getEvent', params: { id: eventsId[1] } };
  }
  if (method === 'GET' && pathname === '/api/orders') {
    return { name: 'listOrders', params: {} };
  }
  if (method === 'POST' && pathname === '/api/orders') {
    return { name: 'createOrder', params: {} };
  }
  if (ordersConfirm && method === 'POST') {
    return { name: 'confirmOrder', params: { id: ordersConfirm[1] } };
  }
  if (ordersTickets && method === 'GET') {
    return { name: 'listOrderTickets', params: { id: ordersTickets[1] } };
  }
  if (ticketsCheckIn && method === 'POST') {
    return { name: 'checkInTicket', params: { id: ticketsCheckIn[1] } };
  }
  if (ticketsVerify && method === 'GET') {
    return { name: 'verifyTicket', params: { id: ticketsVerify[1] } };
  }
  if (ticketsId && method === 'GET') {
    return { name: 'getTicket', params: { id: ticketsId[1] } };
  }
  if (ordersId && method === 'GET') {
    return { name: 'getOrder', params: { id: ordersId[1] } };
  }
  if (method === 'POST' && pathname === '/api/payments/intents') {
    return { name: 'createPaymentIntent', params: {} };
  }
  if (method === 'GET' && pathname === '/api/payments/intents') {
    return { name: 'listPaymentIntents', params: {} };
  }
  if (paymentIntentId && method === 'GET') {
    return { name: 'getPaymentIntent', params: { id: paymentIntentId[1] } };
  }
  if (method === 'POST' && pathname === '/api/payments/webhook') {
    return { name: 'paymentWebhook', params: {} };
  }
  if (mockComplete && method === 'GET') {
    return { name: 'mockCompletePayment', params: { id: mockComplete[1] } };
  }
  return null;
}

async function readJson(request: Request): Promise<Record<string, unknown>> {
  const raw = await request.text();
  if (!raw) return {};
  return JSON.parse(raw) as Record<string, unknown>;
}

function portalPublicUrl(request: Request): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ||
    new URL(request.url).origin
  );
}

function publicApiBase(request: Request): string {
  return `${new URL(request.url).origin}/api`;
}

/**
 * Memory fixture BFF for the public labelled demo.
 * Not Nest, not Neon, not live ECPay.
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
      fundsPath: false,
    });
  }

  const demoStore = getLabelledDemoStore();

  switch (route.name) {
    case 'listEvents':
      return json(
        200,
        demoStore.listEvents({
          status: url.searchParams.get('status') ?? undefined,
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
    case 'listOrders':
      return json(
        200,
        demoStore.listOrders({
          userId: url.searchParams.get('userId') ?? undefined,
          page: url.searchParams.get('page')
            ? Number(url.searchParams.get('page'))
            : undefined,
          limit: url.searchParams.get('limit')
            ? Number(url.searchParams.get('limit'))
            : undefined,
        })
      );
    case 'createOrder': {
      const body = await readJson(request);
      const created = demoStore.createOrder({
        eventId: String(body.eventId ?? ''),
        userId: body.userId as string | undefined,
        status: body.status as string | undefined,
        data: (body.data as Record<string, unknown>) ?? {},
      });
      if ('error' in created) {
        return json(400, { message: created.error });
      }
      return json(201, created);
    }
    case 'getOrder': {
      const order = demoStore.getOrder(route.params.id);
      if (!order) {
        return json(404, { message: `Order ${route.params.id} not found` });
      }
      return json(200, order);
    }
    case 'confirmOrder': {
      const order = demoStore.confirmOrder(route.params.id);
      if (!order) {
        return json(404, { message: `Order ${route.params.id} not found` });
      }
      return json(200, order);
    }
    case 'listOrderTickets': {
      if (!demoStore.getOrder(route.params.id)) {
        return json(404, { message: `Order ${route.params.id} not found` });
      }
      return json(200, { items: demoStore.listTicketsByOrder(route.params.id) });
    }
    case 'getTicket': {
      const ticket = demoStore.getTicket(route.params.id);
      if (!ticket) {
        return json(404, { message: `Ticket ${route.params.id} not found` });
      }
      return json(200, ticket);
    }
    case 'verifyTicket': {
      const verified = demoStore.verifyTicket(route.params.id);
      if (!verified) {
        return json(404, { message: `Ticket ${route.params.id} not found` });
      }
      return json(200, verified);
    }
    case 'checkInTicket': {
      const checked = demoStore.checkInTicket(route.params.id);
      if (!checked) {
        return json(404, { message: `Ticket ${route.params.id} not found` });
      }
      if ('error' in checked) {
        return json(400, { message: checked.error });
      }
      return json(200, checked);
    }
    case 'createPaymentIntent': {
      const body = await readJson(request);
      const created = demoStore.createPaymentIntent(String(body.orderId ?? ''), {
        publicApiBase: publicApiBase(request),
      });
      if ('error' in created) {
        return json(404, { message: created.error });
      }
      const mockIntent = {
        ...created,
        provider: 'mock' as const,
        checkoutUrl: mockCheckoutUrl(publicApiBase(request), created.id),
      };
      demoStore.paymentIntents.set(mockIntent.id, mockIntent);
      return json(201, mockIntent);
    }
    case 'listPaymentIntents': {
      const orderId = url.searchParams.get('orderId') ?? '';
      if (!demoStore.getOrder(orderId)) {
        return json(404, { message: `Order ${orderId} not found` });
      }
      return json(200, {
        items: demoStore.listPaymentIntentsByOrder(orderId),
      });
    }
    case 'getPaymentIntent': {
      const intent = demoStore.getPaymentIntent(route.params.id);
      if (!intent) {
        return json(404, {
          message: `Payment intent ${route.params.id} not found`,
        });
      }
      return json(200, intent);
    }
    case 'paymentWebhook': {
      const body = await readJson(request);
      const applied = demoStore.applyPaymentWebhook({
        merchantTradeNo: String(
          body.merchantTradeNo ?? body.MerchantTradeNo ?? ''
        ),
        rtnCode: (body.rtnCode ?? body.RtnCode) as string | number | undefined,
      });
      if ('error' in applied) {
        return json(404, { message: applied.error });
      }
      return json(200, applied);
    }
    case 'mockCompletePayment': {
      const intent = demoStore.getPaymentIntent(route.params.id);
      if (!intent) {
        return json(404, {
          message: `Payment intent ${route.params.id} not found`,
        });
      }
      const outcome = url.searchParams.get('outcome');
      if (outcome === 'paid' || outcome === 'failed') {
        demoStore.applyPaymentWebhook({
          merchantTradeNo: intent.merchantTradeNo,
          rtnCode: outcome === 'paid' ? '1' : '0',
        });
        const location = portalOrderReturnUrl(
          portalPublicUrl(request),
          intent.orderId,
          outcome
        );
        return new Response(null, {
          status: 302,
          headers: { Location: location },
        });
      }
      return new Response(mockCompleteHtml(intent), {
        status: 200,
        headers: { 'content-type': 'text/html; charset=utf-8' },
      });
    }
    default:
      return json(501, { message: `No labelled-demo handler for ${route.name}` });
  }
}
