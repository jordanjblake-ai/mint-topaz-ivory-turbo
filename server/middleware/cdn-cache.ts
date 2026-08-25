/**
 * Apply CDN cache policy after the app has rendered. Static files on Vercel
 * are also covered by Nitro routeRules in vite.config.ts — this catches HTML,
 * JSON, redirects, and anything that still hits the function.
 */
import { applyCacheHeaders } from "../../src/lib/cache-headers";
import { edgeCacheKey } from "../../src/lib/edge-cache";

interface CacheEvent {
  url: URL;
  req: { method: string };
}

export default async function cdnCacheMiddleware(
  event: CacheEvent,
  next: () => unknown | Promise<unknown>,
): Promise<unknown> {
  const result = await next();
  if (!(result instanceof Response)) return result;
  const cached = applyCacheHeaders(result, event.url.pathname, event.req.method ?? "GET");
  const headers = new Headers(cached.headers);
  headers.set("x-hybrid-edge-key", edgeCacheKey(event.url.pathname, event.url.search));
  return new Response(cached.body, {
    status: cached.status,
    statusText: cached.statusText,
    headers,
  });
}
