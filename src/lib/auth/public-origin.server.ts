/**
 * Better Auth's dynamic baseURL (and therefore OAuth redirect_uri) is derived
 * from Host / X-Forwarded-*. The live preview proxy talks to loopback, so the
 * raw Host is often the internal socket. Rewrite to the public preview origin
 * so the broker receives https://<preview>/api/auth/oauth2/callback/<provider>.
 */
export function withPublicOrigin(request: Request): Request {
  const url = new URL(request.url);
  const xfHost = request.headers.get("x-forwarded-host")?.split(",")[0]?.trim();
  const host = xfHost || url.host;
  const proto = host.endsWith(".grok-sandbox.com")
    ? "https"
    : request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim() || url.protocol.replace(":", "");
  const headers = new Headers(request.headers);
  headers.set("host", host);
  headers.set("x-forwarded-host", host);
  headers.set("x-forwarded-proto", proto);
  const nextUrl = `${proto}://${host}${url.pathname}${url.search}`;
  const method = request.method.toUpperCase();
  if (method === "GET" || method === "HEAD") {
    return new Request(nextUrl, { method, headers });
  }
  return new Request(nextUrl, {
    method: request.method,
    headers,
    body: request.body,
    duplex: "half",
  });
}
