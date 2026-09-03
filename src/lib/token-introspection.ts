import { isStaff } from "@/lib/zero-trust.server";

export const ISSUER = "https://hybridvacations.com";
const hits = new Map<string, number[]>();

export type Introspection = {
  active: boolean;
  scope?: string;
  client_id?: string;
  username?: string;
  token_type?: string;
  exp?: number;
  iat?: number;
  nbf?: number;
  sub?: string;
  aud?: string;
  iss?: string;
  jti?: string;
};

function unix(value: string | Date | null | undefined) {
  if (!value) return undefined;
  const time = value instanceof Date ? value.getTime() : new Date(value).getTime();
  if (Number.isNaN(time)) return undefined;
  return Math.floor(time / 1000);
}

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

function unauthorized() {
  return json(
    { error: "invalid_client" },
    401,
    { "www-authenticate": 'Bearer realm="hybrid-introspection"' },
  );
}

function rateLimited(key: string) {
  const now = Date.now();
  const list = (hits.get(key) ?? []).filter((at) => now - at < 60_000);
  list.push(now);
  hits.set(key, list);
  return list.length > 30;
}

async function hashToken(token: string) {
  const { createHash } = await import("node:crypto");
  return createHash("sha256").update(token).digest("hex");
}

async function readToken(request: Request) {
  const type = request.headers.get("content-type") ?? "";
  if (type.includes("application/json")) {
    const body = (await request.json().catch(() => null)) as
      | { token?: string; token_type_hint?: string }
      | null;
    return {
      token: String(body?.token ?? "").trim(),
      hint:
        body?.token_type_hint === "refresh_token"
          ? "refresh_token"
          : body?.token_type_hint === "access_token"
            ? "access_token"
            : "",
    };
  }
  const params = new URLSearchParams(await request.text());
  const hint = params.get("token_type_hint") ?? "";
  return {
    token: (params.get("token") ?? "").trim(),
    hint: hint === "refresh_token" || hint === "access_token" ? hint : "",
  };
}

function inactive(): Introspection {
  return { active: false };
}

function claims(base: {
  token_type: string;
  scope: string;
  sub: string;
  jti: string;
  exp?: number;
  iat?: number;
  username?: string | null;
}): Introspection {
  return {
    active: true,
    token_type: base.token_type,
    client_id: "hybrid-web",
    scope: base.scope,
    sub: base.sub,
    aud: "hybrid-vacations",
    iss: ISSUER,
    jti: base.jti,
    exp: base.exp,
    iat: base.iat,
    nbf: base.iat,
    ...(base.username ? { username: base.username } : {}),
  };
}

export async function handleIntrospectRequest(request: Request) {
  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405, headers: { allow: "POST" } });
  }

  const { assertSameSiteRequest } = await import("@/lib/auth/isolation.server");
  try {
    assertSameSiteRequest();
  } catch {
    return unauthorized();
  }

  const { auth } = await import("@/lib/auth/server");
  const session = await auth.api.getSession({ headers: request.headers });
  const callerId = session?.user?.id;
  if (!callerId) return unauthorized();

  const presented =
    request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ||
    (await import("@/lib/auth/server").then((mod) => mod.readSessionToken())) ||
    "";
  if (presented) {
    const { isTokenBlacklisted } = await import("@/lib/token-blacklist");
    if (await isTokenBlacklisted(presented)) return unauthorized();
  }
  const callerJti = session.session?.id as string | undefined;
  if (callerJti) {
    const { isJtiRevoked } = await import("@/lib/token-revocation-list");
    if (await isJtiRevoked(callerJti)) return unauthorized();
  }

  if (rateLimited(callerId)) {
    return json({ error: "slow_down" }, 429, { "retry-after": "60" });
  }

  const { token, hint } = await readToken(request);
  if (!token) return json({ error: "invalid_request", error_description: "token is required" }, 400);
  if (token.length > 400) return json(inactive());

  const { isTokenBlacklisted } = await import("@/lib/token-blacklist");
  if (await isTokenBlacklisted(token)) return json(inactive());

  const { personByEmail } = await import("@/data/camp");
  const staff = isStaff(session.user.email ? personByEmail(session.user.email) : null);
  const result = await inspectToken(token, hint);
  if (!result.active) return json(inactive());
  if (result.jti) {
    const { isJtiRevoked } = await import("@/lib/token-revocation-list");
    if (await isJtiRevoked(result.jti)) return json(inactive());
  }
  if (!staff && result.sub && result.sub !== callerId) return json(inactive());
  const { claimsForUser } = await import("@/lib/oidc-claims");
  const oidc = result.sub ? await claimsForUser(result.sub) : null;
  if (!staff && result.sub !== callerId) {
    delete result.username;
    return json(result);
  }
  return json(oidc ? { ...result, ...oidc, active: true } : result);
}

async function inspectToken(token: string, hint: string): Promise<Introspection> {
  const { getSql } = await import("@/lib/db");
  const sql = await getSql();
  const preferRefresh = hint === "refresh_token";

  const access = async (): Promise<Introspection | null> => {
    const rows = await sql.query<{
      id: string;
      userId: string;
      expiresAt: string | Date;
      createdAt: string | Date;
      email: string | null;
    }>(
      `select s.id, s."userId", s."expiresAt", s."createdAt", u.email
         from "session" s
         left join "user" u on u.id = s."userId"
        where s.token = $1
        limit 1`,
      [token],
    );
    const row = rows[0];
    if (!row) return null;
    const exp = unix(row.expiresAt);
    if (exp && exp * 1000 <= Date.now()) return inactive();
    return claims({
      token_type: "Bearer",
      scope: "openid profile email",
      sub: row.userId,
      jti: row.id,
      exp,
      iat: unix(row.createdAt),
      username: row.email,
    });
  };

  const refresh = async (): Promise<Introspection | null> => {
    const hash = await hashToken(token);
    const rows = await sql.query<{
      id: string;
      user_id: string;
      expires_at: string | Date;
      family_expires_at: string | Date;
      consumed_at: string | Date | null;
      revoked_at: string | Date | null;
      created_at: string | Date;
      email: string | null;
    }>(
      `select r.id, r.user_id, r.expires_at, r.family_expires_at, r.consumed_at, r.revoked_at, r.created_at, u.email
         from session_refresh r
         left join "user" u on u.id = r.user_id
        where r.token_hash = $1
        limit 1`,
      [hash],
    );
    const row = rows[0];
    if (!row) return null;
    if (row.consumed_at || row.revoked_at) return inactive();
    const exp = unix(row.expires_at);
    const familyExp = unix(row.family_expires_at);
    const end = Math.min(exp ?? Infinity, familyExp ?? Infinity);
    if (Number.isFinite(end) && end * 1000 <= Date.now()) return inactive();
    return claims({
      token_type: "refresh_token",
      scope: "offline_access",
      sub: row.user_id,
      jti: row.id,
      exp: Number.isFinite(end) ? end : exp,
      iat: unix(row.created_at),
      username: row.email,
    });
  };

  if (preferRefresh) {
    return (await refresh()) ?? (await access()) ?? inactive();
  }
  return (await access()) ?? (await refresh()) ?? inactive();
}

export function authorizationServerMetadata(origin: string) {
  const base = origin.replace(/\/$/, "") || ISSUER;
  return {
    issuer: ISSUER,
    introspection_endpoint: `${base}/api/oauth/introspect`,
    introspection_endpoint_auth_methods_supported: ["none"],
    revocation_endpoint: `${base}/api/oauth/revoke`,
    revocation_endpoint_auth_methods_supported: ["none"],
    revocation_endpoint_auth_signing_alg_values_supported: [] as string[],
    token_endpoint_auth_methods_supported: ["none"],
    grant_types_supported: ["authorization_code", "refresh_token"],
    response_types_supported: ["code"],
    code_challenge_methods_supported: ["S256"],
    token_endpoint: `${base}/api/oauth/token`,
    userinfo_endpoint: `${base}/api/oauth/userinfo`,
    claims_supported: [
      "sub",
      "name",
      "given_name",
      "family_name",
      "preferred_username",
      "email",
      "email_verified",
      "picture",
      "locale",
      "zoneinfo",
      "updated_at",
    ],
  };
}
