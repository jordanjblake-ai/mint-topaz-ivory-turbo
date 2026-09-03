import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "@/lib/auth/middleware";

export const REFRESH_COOKIE = "__Host-hybrid-refresh";
export const REFRESH_STORAGE_KEY = "hybrid-refresh-token";
export const ACCESS_TTL_SECONDS = 15 * 60;
export const REFRESH_TTL_SECONDS = 8 * 60 * 60;
export const ROTATE_EVERY_MS = 10 * 60 * 1000;

type RefreshRow = {
  id: string;
  family_id: string;
  user_id: string;
  token_hash: string;
  expires_at: string | Date;
  family_expires_at: string | Date;
  consumed_at: string | Date | null;
  revoked_at: string | Date | null;
};

function asDate(value: string | Date | null | undefined) {
  if (!value) return null;
  return value instanceof Date ? value : new Date(value);
}

async function cryptoApi() {
  return import("node:crypto");
}

async function hashToken(token: string) {
  const { createHash } = await cryptoApi();
  return createHash("sha256").update(token).digest("hex");
}

async function newToken() {
  const { randomBytes } = await cryptoApi();
  return randomBytes(32).toString("base64url");
}

async function newId(prefix: string) {
  const { randomBytes } = await cryptoApi();
  return `${prefix}_${Date.now().toString(36)}_${randomBytes(6).toString("hex")}`;
}

async function cookies() {
  return import("@tanstack/react-start/server");
}

async function setRefreshCookie(token: string) {
  const { setCookie } = await cookies();
  setCookie(REFRESH_COOKIE, token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: REFRESH_TTL_SECONDS,
  });
}

async function clearRefreshCookie() {
  const { deleteCookie } = await cookies();
  deleteCookie(REFRESH_COOKIE, { path: "/" });
}

async function presentedToken(fallback?: string) {
  const { getCookie } = await cookies();
  return (fallback?.trim() || getCookie(REFRESH_COOKIE) || "").trim();
}

async function extendAccessSession(userId: string) {
  const { getSql } = await import("@/lib/db");
  const sql = await getSql();
  await sql.query(
    `update "session"
        set "expiresAt" = now() + interval '15 minutes',
            "updatedAt" = now()
      where "userId" = $1`,
    [userId],
  );
}

async function revokeFamily(familyId: string, userId?: string) {
  const { getSql } = await import("@/lib/db");
  const sql = await getSql();
  if (userId) {
    const { blacklistFamilyHashes, blacklistPresentedAccess } = await import("@/lib/token-blacklist");
    await blacklistFamilyHashes(familyId, userId, "refresh-revoked");
    await blacklistPresentedAccess(userId, "refresh-revoked");
  }
  await sql.query(
    `update session_refresh
        set revoked_at = now()
      where family_id = $1 and revoked_at is null`,
    [familyId],
  );
  if (userId) {
    await sql.query(`delete from "session" where "userId" = $1`, [userId]);
  }
}

async function insertRefresh(userId: string, familyId: string, familyExpiresAt: Date) {
  const { getSql } = await import("@/lib/db");
  const sql = await getSql();
  const token = await newToken();
  const id = await newId("srf");
  const expires = new Date(Date.now() + REFRESH_TTL_SECONDS * 1000);
  await sql.query(
    `insert into session_refresh
      (id, family_id, user_id, token_hash, expires_at, family_expires_at)
     values ($1, $2, $3, $4, $5, $6)`,
    [id, familyId, userId, await hashToken(token), expires, familyExpiresAt],
  );
  await setRefreshCookie(token);
  await extendAccessSession(userId);
  return { token, expiresAt: expires.toISOString() };
}

async function audit(action: string, userId: string | null, outcome: "allow" | "deny", detail?: string) {
  try {
    const { auditEvent } = await import("@/lib/zero-trust.server");
    await auditEvent({ action, outcome, detail, actor: userId ? { id: userId } as never : null });
  } catch {
    /* never block */
  }
}

export const mintRefreshSession = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<{ token: string; expiresAt: string } | { token: null }> => {
    const { assertZeroTrustRequest } = await import("@/lib/zero-trust.server");
    await assertZeroTrustRequest();
    const familyId = await newId("srf");
    const familyExpiresAt = new Date(Date.now() + REFRESH_TTL_SECONDS * 1000);
    const issued = await insertRefresh(context.userId, familyId, familyExpiresAt);
    await audit("refresh.mint", context.userId, "allow");
    return issued;
  });

const RotateInput = z.object({
  token: z.string().min(20).max(200).optional(),
});

export async function rotatePresentedRefresh(
  presented?: string,
): Promise<{ token: string; expiresAt: string } | { token: null; reused?: boolean }> {
  const raw = await presentedToken(presented);
  if (!raw) return { token: null };

  const { getSql } = await import("@/lib/db");
  const sql = await getSql();
  const hash = await hashToken(raw);
  const { isTokenBlacklisted } = await import("@/lib/token-blacklist");
  if (await isTokenBlacklisted(raw)) {
    await clearRefreshCookie();
    await audit("refresh.blacklisted", null, "deny");
    return { token: null, reused: true };
  }
  const rows = await sql.query<RefreshRow>(
    `select id, family_id, user_id, token_hash, expires_at, family_expires_at, consumed_at, revoked_at
       from session_refresh
      where token_hash = $1
      limit 1`,
    [hash],
  );
  const row = rows[0];
  if (!row) return { token: null };

  if (row.revoked_at) {
    await audit("refresh.revoked", row.user_id, "deny");
    await clearRefreshCookie();
    return { token: null };
  }

  if (row.consumed_at) {
    await revokeFamily(row.family_id, row.user_id);
    await clearRefreshCookie();
    await audit("refresh.reuse", row.user_id, "deny", "refresh token reuse");
    return { token: null, reused: true };
  }

  const expires = asDate(row.expires_at);
  const familyExpires = asDate(row.family_expires_at);
  const now = Date.now();
  if ((expires && expires.getTime() < now) || (familyExpires && familyExpires.getTime() < now)) {
    await sql.query(`update session_refresh set revoked_at = now() where id = $1`, [row.id]);
    await clearRefreshCookie();
    return { token: null };
  }

  await sql.query(`update session_refresh set consumed_at = now() where id = $1`, [row.id]);
  const { blacklistHash, REFRESH_BLACKLIST_TTL_SECONDS } = await import("@/lib/token-blacklist");
  await blacklistHash(hash, {
    kind: "refresh",
    userId: row.user_id,
    reason: "rotated",
    ttlSeconds: REFRESH_BLACKLIST_TTL_SECONDS,
  });
  const { publishRevokedJti } = await import("@/lib/token-revocation-list");
  await publishRevokedJti({
    jti: row.id,
    kind: "refresh_token",
    userId: row.user_id,
    reason: "rotated",
    expiresAt: expires ?? new Date(),
  });
  const issued = await insertRefresh(
    row.user_id,
    row.family_id,
    familyExpires ?? new Date(now + REFRESH_TTL_SECONDS * 1000),
  );
  await audit("refresh.rotate", row.user_id, "allow");
  return issued;
}

export const rotateRefreshSession = createServerFn({ method: "POST" })
  .validator(RotateInput)
  .handler(async ({ data }): Promise<{ token: string; expiresAt: string } | { token: null; reused?: boolean }> => {
    const { assertZeroTrustRequest } = await import("@/lib/zero-trust.server");
    await assertZeroTrustRequest();
    return rotatePresentedRefresh(data.token);
  });

export const revokeRefreshSession = createServerFn({ method: "POST" })
  .validator(RotateInput)
  .handler(async ({ data }): Promise<{ ok: true }> => {
    const raw = await presentedToken(data.token);
    await clearRefreshCookie();
    if (!raw) return { ok: true };
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    const hash = await hashToken(raw);
    const rows = await sql.query<{ family_id: string; user_id: string }>(
      `select family_id, user_id from session_refresh where token_hash = $1 limit 1`,
      [hash],
    );
    if (rows[0]) {
      await revokeFamily(rows[0].family_id, rows[0].user_id);
      await audit("refresh.revoke", rows[0].user_id, "allow");
    } else {
      const { blacklistPresentedAccess, blacklistRawToken, REFRESH_BLACKLIST_TTL_SECONDS } =
        await import("@/lib/token-blacklist");
      await blacklistRawToken(raw, {
        kind: "refresh",
        reason: "sign-out",
        ttlSeconds: REFRESH_BLACKLIST_TTL_SECONDS,
      });
      await blacklistPresentedAccess(null, "sign-out");
    }
    return { ok: true };
  });
