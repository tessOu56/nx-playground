import type { IncomingMessage, ServerResponse } from 'node:http';

import { CORS, handleEventStackHttp } from '../src/handler.js';

/** Vercel Node / Fluid entry — event-stack API. Uses DATABASE_URL when set. */
export default async function handler(req: IncomingMessage, res: ServerResponse) {
  const host = req.headers.host ?? 'localhost';
  const url = new URL(req.url ?? '/', `https://${host}`);
  if (req.method === 'OPTIONS') {
    res.writeHead(204, CORS);
    res.end();
    return;
  }
  await handleEventStackHttp(req, res, url);
}
