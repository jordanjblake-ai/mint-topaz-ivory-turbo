/** CDN / browser cache policy for Hybrid. Safe to import from server middleware. */

export type CacheClass = "never" | "html" | "asset" | "image" | "derived" | "meta" | "ics" | "redirect" | "error";

const NEVER_PREFIXES = [
  "/api",
  "/health",
  "/healthz",
  "/livez",
  "/readyz",
  "/login",
  "/ops",
  "/camp",
  "/portal",
  "/account",
  "/coaches-corner",
  "/book",
  "/privacy/request",
  "/auth",
  "/__grok",
  "/__app-env",
];

const IMAGE_EXT = /\.(?:avif|gif|ico|jpe?g|png|svg|webp)$/i;
const HASHED_ASSET = /\/assets\/[^/]+$/i;
const FONT_EXT = /\.(?:woff2?|ttf|otf)$/i;

export function normalizePath(pathname: string) {
  if (!pathname || pathname === "/") return "/";
  const clean = pathname.split("?")[0].split("#")[0];
  return clean.length > 1 ? clean.replace(/\/+$/, "") : "/";
}

function startsWithPrefix(path: string, prefix: string) {
  return path === prefix || path.startsWith(`${prefix}/`);
}

export function cacheClassFor(pathname: string, method = "GET", status = 200): CacheClass {
  const verb = method.toUpperCase();
  if (verb !== "GET" && verb !== "HEAD") return "never";

  if (status >= 500) return "never";
  if (status === 404 || status === 410) return "error";
  if (status === 301 || status === 308) return "redirect";
  if (status >= 300 && status < 400) return "never";

  const path = normalizePath(pathname);
  if (NEVER_PREFIXES.some((prefix) => startsWithPrefix(path, prefix))) return "never";

  if (HASHED_ASSET.test(path) || FONT_EXT.test(path)) return "asset";
  if (path.startsWith("/images/opt/") || /^\/images\/logo-\d+\.webp$/.test(path)) return "derived";
  if (path.startsWith("/images/") || path === "/og.jpg" || path === "/x-banner.jpg" || path === "/favicon.svg" || path === "/favicon.ico" || path.startsWith("/favicon-") || path === "/apple-touch-icon.png" || IMAGE_EXT.test(path)) {
    return "image";
  }
  if (path.startsWith("/calendar/") || path.endsWith(".ics")) return "ics";
  if (path === "/sitemap.xml" || path === "/robots.txt" || /^\/[0-9a-f]{32}\.txt$/.test(path)) return "meta";

  if (status >= 400) return "error";
  return "html";
}

export const SECURITY_HEADERS = {
  "strict-transport-security": "max-age=31536000; includeSubDomains; preload",
  "content-security-policy":
    "default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'self' https://grok.com https://*.grok.com https://*.grok-sandbox.com; img-src 'self' data: blob: https:; font-src 'self' data: https://fonts.gstatic.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://www.googletagmanager.com https://www.google-analytics.com https://connect.facebook.net https://grok.com https://*.grok.com; connect-src 'self' https: wss: ws:; frame-src 'self' https://js.stripe.com https://hooks.stripe.com https://checkout.stripe.com https://grok.com https://*.grok.com; form-action 'self' https://checkout.stripe.com https://js.stripe.com; ",
  "cross-origin-opener-policy": "same-origin-allow-popups",
  "x-content-type-options": "nosniff",
  "referrer-policy": "strict-origin-when-cross-origin",
  "permissions-policy": "camera=(), microphone=(), geolocation=(), payment=(self \"https://js.stripe.com\" \"https://checkout.stripe.com\"), usb=()",
  "x-dns-prefetch-control": "off",
  "x-permitted-cross-domain-policies": "none",
} as const;

type HeaderMap = Record<string, string>;

const CORS = {
  "access-control-allow-origin": "*",
  "cross-origin-resource-policy": "cross-origin",
  "timing-allow-origin": "*",
} as const;

const POLICIES: Record<CacheClass, HeaderMap> = {
  never: {
    "cache-control": "private, no-store, no-cache, must-revalidate, max-age=0",
    pragma: "no-cache",
    "cdn-cache-control": "no-store",
    "vercel-cdn-cache-control": "no-store",
    "cloudflare-cdn-cache-control": "no-store",
    "surrogate-control": "no-store",
  },
  html: {
    "cache-control": "public, max-age=0, must-revalidate",
    "cdn-cache-control": "public, s-maxage=300, stale-while-revalidate=86400, stale-if-error=86400",
    "vercel-cdn-cache-control": "public, s-maxage=300, stale-while-revalidate=86400, stale-if-error=86400",
    "cloudflare-cdn-cache-control": "public, s-maxage=300, stale-while-revalidate=86400, stale-if-error=86400",
    "surrogate-control": "max-age=300, stale-while-revalidate=86400, stale-if-error=86400",
    "edge-control": "!no-store, max-age=300",
  },
  asset: {
    "cache-control": "public, max-age=31536000, immutable",
    "cdn-cache-control": "public, max-age=31536000, immutable",
    "vercel-cdn-cache-control": "public, max-age=31536000, immutable",
    "cloudflare-cdn-cache-control": "public, max-age=31536000, immutable",
    "surrogate-control": "max-age=31536000",
    ...CORS,
  },
  image: {
    "cache-control": "public, max-age=86400, stale-while-revalidate=604800",
    "cdn-cache-control": "public, s-maxage=604800, stale-while-revalidate=2592000, stale-if-error=2592000",
    "vercel-cdn-cache-control": "public, s-maxage=604800, stale-while-revalidate=2592000, stale-if-error=2592000",
    "cloudflare-cdn-cache-control": "public, s-maxage=604800, stale-while-revalidate=2592000, stale-if-error=2592000",
    "surrogate-control": "max-age=604800, stale-while-revalidate=2592000, stale-if-error=2592000",
    "edge-control": "!no-store, max-age=604800",
    ...CORS,
  },
  derived: {
    "cache-control": "public, max-age=604800, stale-while-revalidate=2592000",
    "cdn-cache-control": "public, s-maxage=2592000, stale-while-revalidate=7776000, stale-if-error=7776000",
    "vercel-cdn-cache-control": "public, s-maxage=2592000, stale-while-revalidate=7776000, stale-if-error=7776000",
    "cloudflare-cdn-cache-control": "public, s-maxage=2592000, stale-while-revalidate=7776000, stale-if-error=7776000",
    "surrogate-control": "max-age=2592000, stale-while-revalidate=7776000, stale-if-error=7776000",
    "edge-control": "!no-store, max-age=2592000",
    ...CORS,
  },
  meta: {
    "cache-control": "public, max-age=300, must-revalidate",
    "cdn-cache-control": "public, s-maxage=3600, stale-while-revalidate=86400",
    "vercel-cdn-cache-control": "public, s-maxage=3600, stale-while-revalidate=86400",
    "surrogate-control": "max-age=3600, stale-while-revalidate=86400",
  },
  ics: {
    "cache-control": "public, max-age=300, must-revalidate",
    "cdn-cache-control": "public, s-maxage=3600, stale-while-revalidate=86400",
    "vercel-cdn-cache-control": "public, s-maxage=3600, stale-while-revalidate=86400",
    "surrogate-control": "max-age=3600, stale-while-revalidate=86400",
  },
  redirect: {
    "cache-control": "public, max-age=3600",
    "cdn-cache-control": "public, s-maxage=86400",
    "vercel-cdn-cache-control": "public, s-maxage=86400",
    "surrogate-control": "max-age=86400",
  },
  error: {
    "cache-control": "public, max-age=0, must-revalidate",
    "cdn-cache-control": "public, s-maxage=60, stale-if-error=30",
    "vercel-cdn-cache-control": "public, s-maxage=60, stale-if-error=30",
    "surrogate-control": "max-age=60",
  },
};

function deployStamp() {
  if (typeof process === "undefined") return "";
  return (process.env.VITE_DEPLOY_ID || process.env.VERCEL_GIT_COMMIT_SHA || "").trim();
}

export function pageCacheTag(path: string) {
  const n = normalizePath(path);
  if (n === "/") return "page:home";
  return `page:${n.replace(/^\//, "").replace(/\//g, ":")}`;
}

export function cacheTagsFor(kind: CacheClass, path = "/"): string[] {
  if (kind === "never") return [];
  const tags = new Set<string>();
  if (kind === "html") {
    tags.add("html");
    tags.add("marketing");
    tags.add(pageCacheTag(path));
  } else if (kind === "derived") {
    tags.add("image");
    tags.add("derived");
  } else if (kind === "ics") {
    tags.add("calendar");
  } else {
    tags.add(kind);
  }
  const deploy = deployStamp();
  if (deploy) tags.add(`deploy:${deploy.slice(0, 12)}`);
  return [...tags];
}

export function cacheHeadersFor(kind: CacheClass, path?: string): HeaderMap {
  const headers: HeaderMap = { ...SECURITY_HEADERS, ...POLICIES[kind], "x-hybrid-cache": kind };
  const tags = cacheTagsFor(kind, path);
  if (tags.length) {
    headers["cache-tag"] = tags.join(",");
    headers["surrogate-key"] = tags.join(" ");
  }
  return headers;
}

function existingIsNoStore(value: string | null) {
  if (!value) return false;
  return /\bno-store\b/i.test(value);
}

function hasSetCookie(headers: Headers) {
  if (typeof headers.getSetCookie === "function" && headers.getSetCookie().length) return true;
  return headers.has("set-cookie");
}

export function applyCacheHeaders(response: Response, pathname: string, method = "GET"): Response {
  const headers = new Headers(response.headers);
  const kind = hasSetCookie(headers)
    ? "never"
    : cacheClassFor(pathname, method, response.status);

  if (existingIsNoStore(headers.get("cache-control"))) {
    const locked = cacheHeadersFor("never");
    for (const [key, value] of Object.entries(locked)) {
      if (key === "cache-control" || key === "pragma") continue;
      if (!headers.has(key)) headers.set(key, value);
    }
    headers.set("x-hybrid-cache", "never");
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  }

  for (const [key, value] of Object.entries(cacheHeadersFor(kind, pathname))) {
    headers.set(key, value);
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export function applyCacheToNodeResponse(
  res: {
    hasHeader(name: string): boolean;
    getHeader?(name: string): unknown;
    setHeader(name: string, value: string): unknown;
  },
  pathname: string,
  method = "GET",
  status = 200,
) {
  const existing = String(res.getHeader?.("cache-control") ?? "");
  const kind = existingIsNoStore(existing) ? "never" : cacheClassFor(pathname, method, status);
  if (existingIsNoStore(existing)) {
    const locked = cacheHeadersFor("never");
    for (const [key, value] of Object.entries(locked)) {
      if (key === "cache-control" || key === "pragma") continue;
      if (!res.hasHeader(key)) res.setHeader(key, value);
    }
    res.setHeader("x-hybrid-cache", "never");
    return kind;
  }
  for (const [key, value] of Object.entries(cacheHeadersFor(kind, pathname))) {
    res.setHeader(key, value);
  }
  return kind;
}

export const STATIC_ROUTE_RULES = {
  "/assets/**": cacheHeadersFor("asset"),
  "/images/opt/**": cacheHeadersFor("derived"),
  "/images/logo-*.webp": cacheHeadersFor("derived"),
  "/images/**": cacheHeadersFor("image"),
  "/calendar/**": cacheHeadersFor("ics"),
  "/og.jpg": cacheHeadersFor("image"),
  "/x-banner.jpg": cacheHeadersFor("image"),
  "/favicon.svg": cacheHeadersFor("image"),
  "/favicon.ico": cacheHeadersFor("image"),
  "/favicon-16.png": cacheHeadersFor("image"),
  "/favicon-32.png": cacheHeadersFor("image"),
  "/apple-touch-icon.png": cacheHeadersFor("image"),
  "/sitemap.xml": cacheHeadersFor("meta"),
  "/robots.txt": cacheHeadersFor("meta"),
  "/8f2c4e91b6a04d7f9c1e5b83a0d2467e.txt": cacheHeadersFor("meta"),
} as const;
