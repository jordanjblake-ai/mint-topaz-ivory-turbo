import { GROK_PROVIDERS } from "@/lib/auth/providers";

export const OIDC_RESPONSE_TYPES = ["code"] as const;

const IMPLICIT = new Set(["token", "id_token", "id_token token", "token id_token"]);
const HYBRID = new Set([
  "code token",
  "code id_token",
  "code id_token token",
  "code token id_token",
  "id_token code",
  "token code",
]);

function json(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });
}

function normalizeResponseType(value: string) {
  return value.trim().split(/[\s+]+/).filter(Boolean).sort().join(" ");
}

function errorRedirect(redirectUri: string | null, params: Record<string, string>) {
  if (!redirectUri) {
    return json(
      { error: params.error, error_description: params.error_description, state: params.state },
      400,
    );
  }
  const url = new URL(redirectUri);
  for (const [key, value] of Object.entries(params)) {
    if (value) url.searchParams.set(key, value);
  }
  return Response.redirect(url.toString(), 302);
}

function sameOriginRedirect(origin: string, redirectUri: string) {
  try {
    const url = new URL(redirectUri, origin);
    return url.origin === origin;
  } catch {
    return false;
  }
}

function providerFrom(idp: string) {
  const hint = idp.trim().toLowerCase();
  return (
    GROK_PROVIDERS.find((item) => item.idp === hint || item.providerId === hint || item.label.toLowerCase() === hint) ||
    GROK_PROVIDERS.find((item) => item.idp === "google") ||
    GROK_PROVIDERS[0]
  );
}

export async function handleAuthorizeRequest(request: Request) {
  if (request.method !== "GET" && request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405, headers: { allow: "GET, POST" } });
  }

  const { assertSameSiteRequest } = await import("@/lib/auth/isolation.server");
  try {
    assertSameSiteRequest();
  } catch {
    return json({ error: "invalid_request", error_description: "Cross-site authorize is not allowed." }, 401);
  }

  const src = request.method === "POST" && (request.headers.get("content-type") ?? "").includes("application/x-www-form-urlencoded")
    ? new URLSearchParams(await request.text())
    : new URL(request.url).searchParams;

  const origin = new URL(request.url).origin;
  const responseType = normalizeResponseType(src.get("response_type") ?? "");
  const redirectUri = (src.get("redirect_uri") ?? "").trim();
  const state = (src.get("state") ?? "").trim();
  const scope = (src.get("scope") ?? "").trim();
  const prompt = (src.get("prompt") ?? "").trim();
  const challenge = (src.get("code_challenge") ?? "").trim();
  const method = (src.get("code_challenge_method") ?? "").trim();
  const idp = src.get("idp") || src.get("kc_idp_hint") || src.get("provider") || "google";

  const fail = (error: string, description: string) =>
    errorRedirect(sameOriginRedirect(origin, redirectUri) ? redirectUri : null, {
      error,
      error_description: description,
      state,
    });

  if (!responseType) {
    return fail("invalid_request", "response_type is required.");
  }

  if (IMPLICIT.has(responseType) || responseType.split(" ").includes("token") || responseType.split(" ").includes("id_token")) {
    if (responseType !== "code") {
      return fail(
        "unsupported_response_type",
        "Implicit and hybrid OpenID Connect flows are not used. Use response_type=code with PKCE S256.",
      );
    }
  }

  if (HYBRID.has(responseType) || responseType !== "code") {
    return fail(
      "unsupported_response_type",
      "Only the Authorization Code flow is supported (response_type=code).",
    );
  }

  if (!redirectUri || !sameOriginRedirect(origin, redirectUri)) {
    return json(
      { error: "invalid_request", error_description: "redirect_uri must be a same-origin HTTPS URL." },
      400,
    );
  }

  const scopes = scope.split(/\s+/).filter(Boolean);
  if (scopes.length && !scopes.includes("openid")) {
    return fail("invalid_scope", "OpenID Connect requests must include the openid scope.");
  }

  if (!challenge || method !== "S256") {
    return fail("invalid_request", "PKCE is required. Send code_challenge and code_challenge_method=S256.");
  }

  if (prompt === "none") {
    const { auth } = await import("@/lib/auth/server");
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user) {
      return fail("login_required", "No session. Silent OpenID Connect login is not possible.");
    }
    return fail("interaction_required", "This site does not re-issue an authorization code for prompt=none.");
  }

  const provider = providerFrom(String(idp));
  const dest = new URL(redirectUri, origin);
  const next = new URL("/login", origin);
  const path = dest.pathname;
  next.searchParams.set("next", path === "/portal" || path.startsWith("/camp") ? path : "/account");
  next.searchParams.set("provider", provider.providerId);
  return Response.redirect(next.toString(), 302);
}

export const oidcFlowNotes = {
  authorization_code: "Supported. Google or Microsoft via the broker, PKCE S256, cookies on this origin.",
  implicit: "Rejected. Tokens must not appear in the URL.",
  hybrid: "Rejected. code id_token and code token are not used.",
  refresh: "Supported at /api/oauth/token after a code sign-in.",
};
