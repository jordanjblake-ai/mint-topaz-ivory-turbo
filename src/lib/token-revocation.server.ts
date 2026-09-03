import {
  ACCESS_BLACKLIST_TTL_SECONDS,
  REFRESH_BLACKLIST_TTL_SECONDS,
  blacklistFamilyHashes,
  blacklistHash,
  blacklistPresentedAccess,
  blacklistRawToken,
} from "@/lib/token-blacklist";

const REFRESH_COOKIE = "__Host-hybrid-refresh";
const SESSION_TOKEN_COOKIE = "__Host-grok-auth.session_token";

async function hashToken(token: string) {
  const { createHash } = await import("node:crypto");
  return createHash("sha256").update(token).digest("hex");
}

async function audit(action: string, userId: string, detail?: string) {
  try {
    const { auditEvent } = await import("@/lib/zero-trust.server");
    await auditEvent({ action, outcome: "allow", detail, actor: { id: userId } as never });
  } catch {
    /* never block */
  }
}

async function currentSessionToken() {
  const { getCookie } = await import("@tanstack/react-start/server");
  return getCookie(SESSION_TOKEN_COOKIE) ?? "";
}

async function blacklistStoredSessions(userId: string, reason: string, onlyToken?: string) {
  const { getSql } = await import("@/lib/db");
  const sql = await getSql();
  const rows = onlyToken
    ? await sql.query<{ token: string; id: string; expiresAt: string | Date }>(
        `select token, id, "expiresAt" from "session" where "userId" = $1 and token = $2`,
        [userId, onlyToken],
      )
    : await sql.query<{ token: string; id: string; expiresAt: string | Date }>(
        `select token, id, "expiresAt" from "session" where "userId" = $1`,
        [userId],
      );
  const { publishSessionRows } = await import("@/lib/token-revocation-list");
  await publishSessionRows(rows, userId, reason);
  for (const row of rows) {
    await blacklistRawToken(row.token, {
      kind: "session",
      userId,
      reason,
      ttlSeconds: ACCESS_BLACKLIST_TTL_SECONDS,
    });
  }
}

async function revokeRefreshForUser(userId: string, familyId?: string) {
  const { getSql } = await import("@/lib/db");
  const sql = await getSql();
  if (familyId) {
    const listed = await sql.query<{ id: string; expires_at: string | Date }>(
      `select id, expires_at from session_refresh where family_id = $1`,
      [familyId],
    );
    const { publishRefreshRows } = await import("@/lib/token-revocation-list");
    await publishRefreshRows(listed, userId, "revoked");
    await blacklistFamilyHashes(familyId, userId, "revoked");
    await sql.query(
      `update session_refresh set revoked_at = now() where family_id = $1 and revoked_at is null`,
      [familyId],
    );
    return;
  }
  const families = await sql.query<{
    family_id: string;
    token_hash: string;
    id: string;
    expires_at: string | Date;
  }>(`select family_id, token_hash, id, expires_at from session_refresh where user_id = $1`, [userId]);
  const { publishRefreshRows } = await import("@/lib/token-revocation-list");
  await publishRefreshRows(families, userId, "revoked-all");
  for (const row of families) {
    await blacklistHash(row.token_hash, {
      kind: "refresh",
      userId,
      reason: "revoked-all",
      ttlSeconds: REFRESH_BLACKLIST_TTL_SECONDS,
    });
  }
  await sql.query(
    `update session_refresh set revoked_at = now() where user_id = $1 and revoked_at is null`,
    [userId],
  );
}

export async function revokeThisSession(userId: string) {
  const token = await currentSessionToken();
  await blacklistPresentedAccess(userId, "revoke-this");
  await blacklistStoredSessions(userId, "revoke-this", token || undefined);
  const { getSql } = await import("@/lib/db");
  const sql = await getSql();
  if (token) {
    await sql.query(`delete from "session" where "userId" = $1 and token = $2`, [userId, token]);
  } else {
    await sql.query(
      `delete from "session" where "userId" = $1 and "updatedAt" = (
         select max("updatedAt") from "session" where "userId" = $1
       )`,
      [userId],
    );
  }
  const { getCookie } = await import("@tanstack/react-start/server");
  const refresh = getCookie(REFRESH_COOKIE);
  if (refresh) {
    const hash = await hashToken(refresh);
    const rows = await sql.query<{ family_id: string }>(
      `select family_id from session_refresh where token_hash = $1 limit 1`,
      [hash],
    );
    if (rows[0]) await revokeRefreshForUser(userId, rows[0].family_id);
  }
  const { deleteCookie } = await import("@tanstack/react-start/server");
  deleteCookie(REFRESH_COOKIE, { path: "/" });
  await audit("token.revoke.this", userId);
}

export async function revokeAllSessions(userId: string) {
  await blacklistPresentedAccess(userId, "revoke-all");
  await blacklistStoredSessions(userId, "revoke-all");
  await revokeRefreshForUser(userId);
  const { getSql } = await import("@/lib/db");
  const sql = await getSql();
  await sql.query(`delete from "session" where "userId" = $1`, [userId]);
  const { deleteCookie } = await import("@tanstack/react-start/server");
  deleteCookie(REFRESH_COOKIE, { path: "/" });
  await audit("token.revoke.all", userId);
}

export async function revokeTokenValue(raw: string, ownerId: string) {
  const { getSql } = await import("@/lib/db");
  const sql = await getSql();
  const sessions = await sql.query<{ id: string; token: string; expiresAt: string | Date }>(
    `select id, token, "expiresAt" from "session" where token = $1 and "userId" = $2`,
    [raw, ownerId],
  );
  if (sessions[0]) {
    const { publishSessionRows } = await import("@/lib/token-revocation-list");
    await publishSessionRows(sessions, ownerId, "rfc7009");
    await blacklistRawToken(raw, {
      kind: "session",
      userId: ownerId,
      reason: "rfc7009",
      ttlSeconds: ACCESS_BLACKLIST_TTL_SECONDS,
    });
    await sql.query(`delete from "session" where token = $1 and "userId" = $2`, [raw, ownerId]);
    await audit("token.revoke.value", ownerId, "access");
    return;
  }
  const hash = await hashToken(raw);
  const refresh = await sql.query<{ family_id: string }>(
    `select family_id from session_refresh where token_hash = $1 and user_id = $2 limit 1`,
    [hash, ownerId],
  );
  if (refresh[0]) {
    await revokeRefreshForUser(ownerId, refresh[0].family_id);
    await audit("token.revoke.value", ownerId, "refresh");
  }
}
