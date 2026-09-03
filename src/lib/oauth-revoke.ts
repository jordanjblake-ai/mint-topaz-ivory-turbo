import { isStaff } from "@/lib/zero-trust.server";
import { revokeTokenValue } from "@/lib/token-revocation.server";
import { listRevokedJtis } from "@/lib/token-revocation-list";

const ISSUER = "https://hybridvacations.com";

function emptyOk() {
  return new Response(null, { status: 200, headers: { "cache-control": "no-store" } });
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });
}

async function callerFrom(request: Request) {
  const { auth } = await import("@/lib/auth/server");
  const session = await auth.api.getSession({ headers: request.headers });
  return session?.user ?? null;
}

async function readToken(request: Request) {
  const type = request.headers.get("content-type") ?? "";
  if (type.includes("application/json")) {
    const body = (await request.json().catch(() => null)) as { token?: string; token_type_hint?: string } | null;
    return {
      token: String(body?.token ?? "").trim(),
      hint: body?.token_type_hint ?? "",
    };
  }
  const params = new URLSearchParams(await request.text());
  return {
    token: (params.get("token") ?? "").trim(),
    hint: params.get("token_type_hint") ?? "",
  };
}

export async function handleRevokeRequest(request: Request) {
  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405, headers: { allow: "POST" } });
  }
  const { assertSameSiteRequest } = await import("@/lib/auth/isolation.server");
  try {
    assertSameSiteRequest();
  } catch {
    return json({ error: "invalid_client" }, 401);
  }
  const user = await callerFrom(request);
  if (!user?.id) return json({ error: "invalid_client" }, 401);

  const { token, hint } = await readToken(request);
  if (!token) return emptyOk();

  const { getSql } = await import("@/lib/db");
  const sql = await getSql();
  const { personByEmail } = await import("@/data/camp");
  const staff = isStaff(user.email ? personByEmail(user.email) : null);

  if (hint !== "refresh_token") {
    const sessions = await sql.query<{ userId: string }>(
      `select "userId" from "session" where token = $1 limit 1`,
      [token],
    );
    if (sessions[0] && (staff || sessions[0].userId === user.id)) {
      await revokeTokenValue(token, sessions[0].userId);
      return emptyOk();
    }
  }

  const { createHash } = await import("node:crypto");
  const hash = createHash("sha256").update(token).digest("hex");
  const refresh = await sql.query<{ user_id: string }>(
    `select user_id from session_refresh where token_hash = $1 limit 1`,
    [hash],
  );
  if (refresh[0] && (staff || refresh[0].user_id === user.id)) {
    await revokeTokenValue(token, refresh[0].user_id);
  }
  return emptyOk();
}

export async function handleRevocationListRequest(request: Request) {
  if (request.method !== "GET") {
    return new Response("Method Not Allowed", { status: 405, headers: { allow: "GET" } });
  }
  const { assertSameSiteRequest } = await import("@/lib/auth/isolation.server");
  try {
    assertSameSiteRequest();
  } catch {
    return json({ error: "invalid_client" }, 401);
  }
  const user = await callerFrom(request);
  if (!user?.id) return json({ error: "invalid_client" }, 401);
  const { personByEmail } = await import("@/data/camp");
  const staff = isStaff(user.email ? personByEmail(user.email) : null);
  const sinceParam = new URL(request.url).searchParams.get("since");
  const since = sinceParam && /^\d+$/.test(sinceParam) ? new Date(Number(sinceParam) * 1000) : undefined;
  const revoked = await listRevokedJtis({
    userId: staff ? undefined : user.id,
    since,
  });
  return json({
    iss: ISSUER,
    generated_at: Math.floor(Date.now() / 1000),
    revoked,
  });
}
