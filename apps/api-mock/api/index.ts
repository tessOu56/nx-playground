import type { IncomingMessage, ServerResponse } from 'node:http';

import { corsHeaders, handleEventStackHttp } from '../src/handler.js';

/** Vercel Node / Fluid entry — event-stack API. Memory unless EVENT_STACK_STORE is unset and DATABASE_URL is set. */
export default async function handler(req: IncomingMessage, res: ServerResponse) {
  const host = req.headers.host ?? 'localhost';
  const url = new URL(req.url ?? '/', `https://${host}`);
  if (req.method === 'OPTIONS') {
    res.writeHead(204, corsHeaders(req));
    res.end();
    return;
  }
  await handleEventStackHttp(req, res, url);
}
