import { claimsForUser } from "@/lib/oidc-claims";

function json(body: unknown, status = 200, extra?: HeadersInit) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json",
      "cache-control": "no-store",
      ...extra,
    },
  });
}

function invalidToken() {
  return json(
    { error: "invalid_token", error_description: "The access token is missing, expired, or revoked" },
    401,
    { "www-authenticate": 'Bearer realm="hybrid-userinfo", error="invalid_token"' },
  );
}

export async function handleUserInfoRequest(request: Request) {
  if (request.method !== "GET" && request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405, headers: { allow: "GET, POST" } });
  }

  const { assertSameSiteRequest } = await import("@/lib/auth/isolation.server");
  try {
    assertSameSiteRequest();
  } catch {
    return invalidToken();
  }

  const bearer = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "")?.trim() || "";
  const { auth, readSessionToken } = await import("@/lib/auth/server");
  const headers = new Headers(request.headers);
  if (bearer) headers.set("Authorization", `Bearer ${bearer}`);
  const session = await auth.api.getSession({ headers });
  const token = bearer || readSessionToken() || "";

  if (!session?.user?.id) return invalidToken();
  if (token) {
    const { isTokenBlacklisted } = await import("@/lib/token-blacklist");
    if (await isTokenBlacklisted(token)) return invalidToken();
  }
  const jti = session.session?.id as string | undefined;
  if (jti) {
    const { isJtiRevoked } = await import("@/lib/token-revocation-list");
    if (await isJtiRevoked(jti)) return invalidToken();
  }

  const claims = await claimsForUser(session.user.id);
  if (!claims) return invalidToken();
  return json(claims);
}
