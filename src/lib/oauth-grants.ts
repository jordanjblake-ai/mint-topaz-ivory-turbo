import { ACCESS_TTL_SECONDS, rotatePresentedRefresh } from "@/lib/session-refresh";

export const SUPPORTED_GRANTS = ["authorization_code", "refresh_token"] as const;
export const REJECTED_GRANTS = [
  "password",
  "implicit",
  "client_credentials",
  "urn:ietf:params:oauth:grant-type:device_code",
  "urn:ietf:params:oauth:grant-type:token-exchange",
] as const;

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json",
      "cache-control": "no-store",
      pragma: "no-cache",
    },
  });
}

function oauthError(error: string, description: string, status = 400) {
  return json({ error, error_description: description }, status);
}

async function readGrant(request: Request) {
  const type = request.headers.get("content-type") ?? "";
  if (type.includes("application/json")) {
    const body = (await request.json().catch(() => null)) as Record<string, string> | null;
    return {
      grant: String(body?.grant_type ?? "").trim(),
      refresh: String(body?.refresh_token ?? "").trim(),
      code: String(body?.code ?? "").trim(),
    };
  }
  const params = new URLSearchParams(await request.text());
  return {
    grant: (params.get("grant_type") ?? "").trim(),
    refresh: (params.get("refresh_token") ?? "").trim(),
    code: (params.get("code") ?? "").trim(),
  };
}

export async function handleTokenRequest(request: Request) {
  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405, headers: { allow: "POST" } });
  }

  const { assertSameSiteRequest } = await import("@/lib/auth/isolation.server");
  try {
    assertSameSiteRequest();
  } catch {
    return oauthError("invalid_client", "Client is not allowed to use this token endpoint.", 401);
  }

  const { grant, refresh, code } = await readGrant(request);

  if (!grant) {
    return oauthError("invalid_request", "grant_type is required.");
  }

  if (grant === "password" || grant === "implicit") {
    return oauthError(
      "unsupported_grant_type",
      "Resource-owner password and implicit grants are not used. Sign in with Google or Microsoft, then refresh.",
    );
  }

  if (grant === "client_credentials") {
    return oauthError(
      "unsupported_grant_type",
      "Machine credentials are not issued. Staff tools use a signed-in session.",
    );
  }

  if (grant === "authorization_code") {
    if (code) {
      return oauthError(
        "invalid_grant",
        "Authorization codes are completed at /api/auth, not here. Use grant_type=refresh_token after sign-in.",
      );
    }
    return oauthError(
      "invalid_request",
      "Authorization code sign-in runs through /api/auth (PKCE). Do not post codes to this endpoint.",
    );
  }

  if (grant !== "refresh_token") {
    return oauthError(
      "unsupported_grant_type",
      `Supported grant_type values: ${SUPPORTED_GRANTS.join(", ")}.`,
    );
  }

  const rotated = await rotatePresentedRefresh(refresh || undefined);
  if (!rotated.token) {
    return oauthError("invalid_grant", "Refresh token is expired, revoked, or already used.", 400);
  }

  const { readSessionToken } = await import("@/lib/auth/server");
  const access = readSessionToken() || rotated.token;

  return json({
    access_token: access,
    token_type: "Bearer",
    expires_in: ACCESS_TTL_SECONDS,
    refresh_token: rotated.token,
    scope: "openid profile email offline_access",
  });
}
