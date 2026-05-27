// Vercel Function entry — adapts Node IncomingMessage/ServerResponse to
// the Web Fetch API that TanStack Start's SSR handler expects.
// All non-static requests get rewritten to /api (see vercel.json).
import server from '../dist/server/server.js';

export const config = { runtime: 'nodejs' };

export default async function handler(req, res) {
  const host = req.headers['x-forwarded-host'] || req.headers.host || 'localhost';
  const proto = req.headers['x-forwarded-proto'] || 'https';
  const url = new URL(req.url || '/', `${proto}://${host}`);

  const headers = new Headers();
  for (const [key, value] of Object.entries(req.headers)) {
    if (value === undefined) continue;
    if (Array.isArray(value)) value.forEach((v) => headers.append(key, v));
    else headers.set(key, value);
  }

  const method = req.method ?? 'GET';
  let body;
  if (method !== 'GET' && method !== 'HEAD') {
    const chunks = [];
    for await (const chunk of req) {
      chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
    }
    body = Buffer.concat(chunks);
  }

  const request = new Request(url, {
    method,
    headers,
    body,
    ...(body ? { duplex: 'half' } : {}),
  });

  let response;
  try {
    response = await server.fetch(request);
  } catch (err) {
    console.error('SSR handler threw:', err);
    res.statusCode = 500;
    res.setHeader('content-type', 'text/plain; charset=utf-8');
    res.end(`Internal Server Error\n\n${err?.stack ?? err}`);
    return;
  }

  res.statusCode = response.status;
  response.headers.forEach((value, key) => {
    if (key.toLowerCase() === 'content-encoding') return; // Vercel handles
    res.setHeader(key, value);
  });

  if (!response.body) {
    res.end();
    return;
  }

  const reader = response.body.getReader();
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      res.write(value);
    }
  } finally {
    res.end();
  }
}
