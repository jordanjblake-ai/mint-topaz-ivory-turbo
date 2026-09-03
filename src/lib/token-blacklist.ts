import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "@/lib/auth/middleware";

export const ACCESS_BLACKLIST_TTL_SECONDS = 15 * 60;
export const REFRESH_BLACKLIST_TTL_SECONDS = 8 * 60 * 60;

async function hashToken(token: string) {
  const { createHash } = await import("node:crypto");
  return createHash("sha256").update(token).digest("hex");
}

async function purgeExpired() {
  try {
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    await sql.query(`delete from token_blacklist where expires_at < now()`);
  } catch {
    /* ignore */
  }
}

export async function blacklistHash(
  hash: string,
  opts: {
    kind: "session" | "refresh" | "bearer";
    userId?: string | null;
    reason: string;
    ttlSeconds: number;
  },
) {
  if (!hash) return;
  const { getSql } = await import("@/lib/db");
  const sql = await getSql();
  const expires = new Date(Date.now() + opts.ttlSeconds * 1000);
  await sql.query(
    `insert into token_blacklist (token_hash, kind, user_id, reason, expires_at)
     values ($1, $2, $3, $4, $5)
     on conflict (token_hash) do update
       set reason = excluded.reason,
           expires_at = greatest(token_blacklist.expires_at, excluded.expires_at)`,
    [hash, opts.kind, opts.userId ?? null, opts.reason.slice(0, 80), expires],
  );
}

export async function blacklistRawToken(
  token: string | null | undefined,
  opts: {
    kind: "session" | "refresh" | "bearer";
    userId?: string | null;
    reason: string;
    ttlSeconds: number;
  },
) {
  const raw = token?.trim();
  if (!raw) return;
  await blacklistHash(await hashToken(raw), opts);
}

export async function isTokenBlacklisted(token: string | null | undefined) {
  const raw = token?.trim();
  if (!raw) return false;
  try {
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    const hash = await hashToken(raw);
    const rows = await sql.query<{ n: number }>(
      `select count(*)::int as n from token_blacklist
        where token_hash = $1 and expires_at > now()`,
      [hash],
    );
    return Number(rows[0]?.n ?? 0) > 0;
  } catch {
    return false;
  }
}

export async function blacklistFamilyHashes(familyId: string, userId: string, reason: string) {
  const { getSql } = await import("@/lib/db");
  const sql = await getSql();
  const rows = await sql.query<{ token_hash: string }>(
    `select token_hash from session_refresh where family_id = $1`,
    [familyId],
  );
  for (const row of rows) {
    await blacklistHash(row.token_hash, {
      kind: "refresh",
      userId,
      reason,
      ttlSeconds: REFRESH_BLACKLIST_TTL_SECONDS,
    });
  }
}

export async function blacklistPresentedAccess(userId: string | null, reason: string, bearerToken?: string) {
  const { getCookie, getRequest } = await import("@tanstack/react-start/server");
  const session = getCookie("__Host-grok-auth.session_token");
  const header = getRequest()?.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  await blacklistRawToken(session, {
    kind: "session",
    userId,
    reason,
    ttlSeconds: ACCESS_BLACKLIST_TTL_SECONDS,
  });
  await blacklistRawToken(bearerToken || header, {
    kind: "bearer",
    userId,
    reason,
    ttlSeconds: ACCESS_BLACKLIST_TTL_SECONDS,
  });
}

export const blacklistCurrentSession = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ reason: z.string().max(80).optional() }))
  .handler(async ({ context, data }): Promise<{ ok: true }> => {
    await blacklistPresentedAccess(context.userId, data.reason || "sign-out");
    void purgeExpired();
    return { ok: true };
  });
