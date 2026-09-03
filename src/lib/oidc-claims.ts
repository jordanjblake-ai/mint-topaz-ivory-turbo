import { ISSUER } from "@/lib/token-introspection";

export const OIDC_SCOPES = ["openid", "profile", "email"] as const;

export const OIDC_CLAIMS = [
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
] as const;

export type OidcClaims = {
  sub: string;
  name?: string;
  given_name?: string;
  family_name?: string;
  preferred_username?: string;
  email?: string;
  email_verified?: boolean;
  picture?: string | null;
  locale?: string;
  zoneinfo?: string;
  updated_at?: number;
};

function unix(value: string | Date | null | undefined) {
  if (!value) return undefined;
  const time = value instanceof Date ? value.getTime() : new Date(value).getTime();
  if (Number.isNaN(time)) return undefined;
  return Math.floor(time / 1000);
}

export async function claimsForUser(userId: string): Promise<OidcClaims | null> {
  const { getSql } = await import("@/lib/db");
  const sql = await getSql();
  const rows = await sql.query<{
    id: string;
    name: string;
    email: string | null;
    emailVerified: boolean | null;
    image: string | null;
    updatedAt: string | Date;
    first_name: string | null;
    last_name: string | null;
    profile_updated: string | Date | null;
  }>(
    `select u.id, u.name, u.email, u."emailVerified", u.image, u."updatedAt",
            p.first_name, p.last_name, p.updated_at as profile_updated
       from "user" u
       left join member_profiles p on p.user_id = u.id
      where u.id = $1
      limit 1`,
    [userId],
  );
  const row = rows[0];
  if (!row) return null;
  const given = (row.first_name || "").trim() || row.name.trim().split(/\s+/)[0] || undefined;
  const family =
    (row.last_name || "").trim() ||
    row.name.trim().split(/\s+/).slice(1).join(" ") ||
    undefined;
  const name = [given, family].filter(Boolean).join(" ") || row.name || undefined;
  const email = row.email?.trim() || undefined;
  return {
    sub: row.id,
    name,
    given_name: given,
    family_name: family,
    preferred_username: email,
    email,
    email_verified: Boolean(row.emailVerified),
    picture: row.image || undefined,
    locale: "en-GB",
    zoneinfo: "Europe/London",
    updated_at: unix(row.profile_updated || row.updatedAt),
  };
}

export function openidConfiguration(origin: string) {
  const base = origin.replace(/\/$/, "") || ISSUER;
  return {
    issuer: ISSUER,
    authorization_endpoint: `${base}/api/oauth/authorize`,
    token_endpoint: `${base}/api/oauth/token`,
    userinfo_endpoint: `${base}/api/oauth/userinfo`,
    introspection_endpoint: `${base}/api/oauth/introspect`,
    revocation_endpoint: `${base}/api/oauth/revoke`,
    jwks_uri: `${base}/api/auth/jwks`,
    scopes_supported: [...OIDC_SCOPES],
    claims_supported: [...OIDC_CLAIMS],
    response_types_supported: ["code"],
    response_modes_supported: ["query"],
    grant_types_supported: ["authorization_code", "refresh_token"],
    code_challenge_methods_supported: ["S256"],
    prompt_values_supported: ["none", "login"],
    display_values_supported: ["page"],
    id_token_signing_alg_values_supported: ["none"],
    token_endpoint_auth_methods_supported: ["none"],
    introspection_endpoint_auth_methods_supported: ["none"],
    revocation_endpoint_auth_methods_supported: ["none"],
    claim_types_supported: ["normal"],
    claims_parameter_supported: false,
    request_parameter_supported: false,
    request_uri_parameter_supported: false,
  };
}
