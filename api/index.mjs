// Vercel Function entry — wraps the TanStack Start SSR handler.
// All non-static requests get rewritten to /api (see vercel.json),
// and this function defers to the built server's Web Fetch handler.
import server from '../apps/web/dist/server/server.js';

export default server.fetch;
