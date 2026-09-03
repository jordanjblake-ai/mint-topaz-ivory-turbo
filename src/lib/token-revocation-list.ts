export type RevocationKind = "access_token" | "refresh_token";

export type RevocationEntry = {
  jti: string;
  kind: RevocationKind;
  exp: number;
  revoked_at: number;
};

async function purgeExpired() {
  try {
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    await sql.query(`delete from token_revocation_list where expires_at < now()`);
  } catch {
    /* ignore */
  }
}

export async function publishRevokedJti(opts: {
  jti: string;
  kind: RevocationKind;
  userId?: string | null;
  reason: string;
  expiresAt: Date | string | number;
}) {
  const jti = opts.jti?.trim();
  if (!jti) return;
  const expires =
    opts.expiresAt instanceof Date
      ? opts.expiresAt
      : typeof opts.expiresAt === "number"
        ? new Date(opts.expiresAt * 1000)
        : new Date(opts.expiresAt);
  if (Number.isNaN(expires.getTime())) return;
  const { getSql } = await import("@/lib/db");
  const sql = await getSql();
  await sql.query(
    `insert into token_revocation_list (jti, kind, user_id, reason, expires_at)
     values ($1, $2, $3, $4, $5)
     on conflict (jti) do update
       set reason = excluded.reason,
           expires_at = greatest(token_revocation_list.expires_at, excluded.expires_at)`,
    [jti, opts.kind, opts.userId ?? null, opts.reason.slice(0, 80), expires],
  );
}

export async function isJtiRevoked(jti: string | null | undefined) {
  const id = jti?.trim();
  if (!id) return false;
  try {
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    const rows = await sql.query<{ n: number }>(
      `select count(*)::int as n from token_revocation_list
        where jti = $1 and expires_at > now()`,
      [id],
    );
    return Number(rows[0]?.n ?? 0) > 0;
  } catch {
    return false;
  }
}

export async function publishSessionRows(
  rows: { id: string; expiresAt?: string | Date | null }[],
  userId: string,
  reason: string,
) {
  for (const row of rows) {
    const exp =
      row.expiresAt instanceof Date
        ? row.expiresAt
        : row.expiresAt
          ? new Date(row.expiresAt)
          : new Date(Date.now() + 15 * 60 * 1000);
    await publishRevokedJti({
      jti: row.id,
      kind: "access_token",
      userId,
      reason,
      expiresAt: exp,
    });
  }
}

export async function publishRefreshRows(
  rows: { id: string; expires_at?: string | Date | null; family_expires_at?: string | Date | null }[],
  userId: string,
  reason: string,
) {
  for (const row of rows) {
    const exp =
      row.expires_at instanceof Date
        ? row.expires_at
        : row.expires_at
          ? new Date(row.expires_at)
          : new Date(Date.now() + 8 * 60 * 60 * 1000);
    await publishRevokedJti({
      jti: row.id,
      kind: "refresh_token",
      userId,
      reason,
      expiresAt: exp,
    });
  }
}

export async function listRevokedJtis(opts: { userId?: string; since?: Date; limit?: number }) {
  await purgeExpired();
  const { getSql } = await import("@/lib/db");
  const sql = await getSql();
  const limit = Math.min(Math.max(opts.limit ?? 200, 1), 500);
  const since = opts.since ?? new Date(0);
  const rows = opts.userId
    ? await sql.query<{ jti: string; kind: RevocationKind; expires_at: string | Date; revoked_at: string | Date }>(
        `select jti, kind, expires_at, revoked_at
           from token_revocation_list
          where user_id = $1 and expires_at > now() and revoked_at >= $2
          order by revoked_at desc
          limit $3`,
        [opts.userId, since, limit],
      )
    : await sql.query<{ jti: string; kind: RevocationKind; expires_at: string | Date; revoked_at: string | Date }>(
        `select jti, kind, expires_at, revoked_at
           from token_revocation_list
          where expires_at > now() and revoked_at >= $1
          order by revoked_at desc
          limit $2`,
        [since, limit],
      );
  return rows.map((row) => ({
    jti: row.jti,
    kind: row.kind,
    exp: Math.floor((row.expires_at instanceof Date ? row.expires_at : new Date(row.expires_at)).getTime() / 1000),
    revoked_at: Math.floor((row.revoked_at instanceof Date ? row.revoked_at : new Date(row.revoked_at)).getTime() / 1000),
  })) satisfies RevocationEntry[];
}
