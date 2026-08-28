import { normalizePath } from "./cache-headers";

/** Ad/click ids that must not create extra CDN objects. */
const TRACKING_PARAM = /^(utm_|hsa_|mc_)/i;
const TRACKING_KEYS = new Set([
  "fbclid",
  "gclid",
  "gclsrc",
  "dclid",
  "msclkid",
  "twclid",
  "ttclid",
  "wbraid",
  "gbraid",
  "li_fat_id",
  "igshid",
  "mc_eid",
  "mc_cid",
  "icid",
  "ref",
  "ref_src",
  "s",
  "srsltid",
]);

const KEEP_QUERY = new Set(["v", "interest"]);

export const EDGE_HTML_PATHS = [
  "/",
  "/vacations",
  "/vacations/**",
  "/coaches",
  "/coaching",
  "/about",
  "/community",
  "/contact",
  "/travel",
  "/terms",
  "/privacy",
  "/cookies",
] as const;

export const EDGE_BYPASS_PATHS = [
  "/api/**",
  "/health",
  "/health/**",
  "/healthz",
  "/livez",
  "/readyz",
  "/login",
  "/login/**",
  "/ops",
  "/ops/**",
  "/camp",
  "/camp/**",
  "/portal",
  "/portal/**",
  "/coaches-corner",
  "/coaches-corner/**",
  "/book",
  "/book/**",
  "/auth",
  "/auth/**",
  "/__grok/**",
  "/__app-env",
] as const;

export function isTrackingParam(name: string) {
  const key = name.toLowerCase();
  return TRACKING_KEYS.has(key) || TRACKING_PARAM.test(key);
}

export function edgeCacheKey(pathname: string, search = ""): string {
  const path = normalizePath(pathname);
  const raw = search.startsWith("?") ? search.slice(1) : search;
  const params = new URLSearchParams(raw);
  const keep = new URLSearchParams();
  for (const [name, value] of params) {
    if (isTrackingParam(name)) continue;
    if (KEEP_QUERY.has(name.toLowerCase())) keep.set(name, value);
  }
  const query = keep.toString();
  return query ? `${path}?${query}` : path;
}

export function nitroRouteRules() {
  const rules: Record<
    string,
    { headers?: Record<string, string>; isr?: number; swr?: number; cache?: false }
  > = {};

  // Private / mutating paths must never be cached. Do not attach `headers` here:
  // Nitro's Vercel preset emits header-only routes without `continue: true`, which
  // can swallow the request before it reaches the serverless function.
  for (const path of EDGE_BYPASS_PATHS) {
    rules[path] = { cache: false };
  }

  // Do NOT set `isr` / `swr` on HTML. Nitro splits those into Vercel prerender
  // functions (`index-isr`, `vacations/[...]-isr`, …). Combined with streaming
  // PWA middleware they crash as FUNCTION_INVOCATION_FAILED. HTML cache headers
  // are applied per-response in server/middleware/cdn-cache.ts instead.
  // Static asset headers live in vercel.json.

  return rules;
}

export const CLOUDFLARE_EDGE_RULES = [
  {
    description: "Bypass private Hybrid surfaces",
    action: "bypass_cache",
    expression:
      'http.request.uri.path matches "^/(api|health|healthz|livez|readyz|login|ops|camp|portal|coaches-corner|book|auth|__grok|__app-env)"',
  },
  {
    description: "HTML at the edge, ignore ad query strings",
    action: "cache",
    edgeTtlSeconds: 300,
    staleWhileRevalidate: 86400,
    staleIfError: 86400,
    cacheKey: { ignoreQueryStringsExcept: ["interest"] },
    expression:
      'not http.request.uri.path matches "^/(images|assets|calendar|api|camp|ops|book|login|portal)/"',
  },
  {
    description: "Resized photos",
    action: "cache",
    edgeTtlSeconds: 2592000,
    staleWhileRevalidate: 7776000,
    staleIfError: 7776000,
    cacheKey: { ignoreQueryStringsExcept: ["v"] },
    expression: 'http.request.uri.path matches "^/images/opt/"',
  },
  {
    description: "Original photos and logo",
    action: "cache",
    edgeTtlSeconds: 604800,
    cacheKey: { ignoreQueryStringsExcept: ["v"] },
    expression: 'http.request.uri.path matches "^/images/"',
  },
  {
    description: "Hashed JS and CSS",
    action: "cache",
    edgeTtlSeconds: 31536000,
    expression: 'http.request.uri.path matches "^/assets/"',
  },
];
