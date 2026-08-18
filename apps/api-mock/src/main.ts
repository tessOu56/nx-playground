import { createServer } from 'node:http';

import { handleEventStackHttp } from './handler.js';

const PORT = Number(process.env.API_MOCK_PORT) || 3011;

const server = createServer(async (req, res) => {
  const url = new URL(req.url ?? '/', `http://localhost:${PORT}`);
  await handleEventStackHttp(req, res, url);
});

server.listen(PORT, () => {
  console.log(`event-stack api-mock listening on http://localhost:${PORT}/api`);
});
