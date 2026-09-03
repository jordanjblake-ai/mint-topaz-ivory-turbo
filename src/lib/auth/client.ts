import { genericOAuthClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { runPreSignInSignOut, runSignOut } from "../../../scripts/sign-out-plan.mjs";
import { GROK_PROVIDERS } from "./providers";

/**
 * Better Auth client for this React SPA (browser-side).
 *
 * Talks to this app's OWN Better Auth at same-origin `/api/auth/*`. In the live
 * preview the app is an embedded iframe with PARTITIONED cookies, so after a
 * popup sign-in it can't read the session cookie — it authenticates with a
 * bearer token instead (captured from the popup, see `signIn`). The `onRequest`
 * hook attaches that token when present; when deployed (cookie auth) no token
 * is stored, so nothing changes.
 *
 * To sign out call `signOut()` below, NOT `authClient.signOut()`: the raw call
 * leaves the bearer token in place, and `onRequest` keeps re-attaching it, so
 * the visitor stays signed in.
 */
export const authClient = createAuthClient({
  plugins: [genericOAuthClient()],
  fetchOptions: {
    onRequest(ctx) {
      if (isLocalSignedOut()) return ctx;
      const token = getBearerToken();
      if (token) ctx.headers.set("Authorization", `Bearer ${token}`);
      return ctx;
    },
  },
});

/**
 * True when sign-in UI should be shown — i.e. whenever `VITE_AUTH_ENABLED` is
 * not `"false"`. The shipped template sets it to `"false"`
 * (`.grok/app-env.json`), which selects the dev user (see `use-current-user`);
 * with the key removed, sign-in is real in preview (baked preview client) and
 * when deployed (injected per-app client).
 */
export const authEnabled = import.meta.env.VITE_AUTH_ENABLED !== "false";

/** The upstream providers to render sign-in buttons for. */
export { GROK_PROVIDERS };

// ── Live-preview bearer token ────────────────────────────────────────────────
// The embedded preview iframe has partitioned cookies, so we keep the session's
// bearer token in sessionStorage and attach it to every Better Auth request (and
// to server functions, via `@/lib/auth/middleware`). Empty everywhere except the
// preview after a popup sign-in, so the cookie path is untouched elsewhere.
const BEARER_KEY = "grok-auth.bearer-token";
const SIGNED_OUT_KEY = "hybrid-signed-out";
const CAMP_SESSION_KEY = "hybrid-camp-email";
const POPUP_RESULT_KEY = "grok-auth.popup-result";
const POPUP_CHANNEL = "grok-auth-popup";

/** The stored preview bearer token, or null. */
export function getBearerToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.sessionStorage.getItem(BEARER_KEY);
  } catch {
    return null;
  }
}

function setBearerToken(token: string | null): void {
  if (typeof window === "undefined") return;
  try {
    if (token) {
      window.sessionStorage.setItem(BEARER_KEY, token);
      window.sessionStorage.removeItem(SIGNED_OUT_KEY);
    } else window.sessionStorage.removeItem(BEARER_KEY);
  } catch {
    /* storage unavailable — ignore */
  }
}

export function markLocalSignedOut() {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(SIGNED_OUT_KEY, "1");
    window.sessionStorage.removeItem(BEARER_KEY);
    window.sessionStorage.removeItem(CAMP_SESSION_KEY);
  } catch {
    /* ignore */
  }
}

export function clearLocalSignedOut() {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(SIGNED_OUT_KEY);
  } catch {
    /* ignore */
  }
}

export function isLocalSignedOut() {
  if (typeof window === "undefined") return false;
  try {
    return window.sessionStorage.getItem(SIGNED_OUT_KEY) === "1";
  } catch {
    return false;
  }
}

/**
 * The sandbox live preview runs this app inside an iframe on a `*.grok-sandbox.com`
 * host, where a full-page redirect to the broker can't work — so sign-in uses a
 * popup there and a normal redirect everywhere else.
 */
export function inLivePreview(): boolean {
  return (
    typeof window !== "undefined" &&
    window.location.hostname.endsWith(".grok-sandbox.com")
  );
}

export function authPopupHref(providerId: string) {
  return `/auth/popup?providerId=${encodeURIComponent(providerId)}`;
}

export function authPopupTarget(providerId: string) {
  return `grok-signin-${providerId}`;
}

/** Message the popup posts back to the opener once sign-in completes. */
type PopupMessage = { source: "grok-auth-popup"; token: string | null; error?: string };

type PopupResult = { token: string | null; error?: string };

/**
 * Start sign-in with one upstream provider (`providerId` from `GROK_PROVIDERS`),
 * federating through the Grok auth broker.
 *
 * - **Live preview** (`*.grok-sandbox.com` iframe): opens a POPUP to
 *   `/auth/popup`, served by the template Vite plugin (see `vite.config.ts` +
 *   `popup.server.ts`) — 302s to the broker/upstream login (no app chrome) and,
 *   on return, posts the session bearer token back. We store it and refresh the
 *   session; no top-level navigation of the iframe to the broker.
 * - **Deployed** (and local non-iframe): a normal full-page redirect into the broker.
 *
 * Either way it clears any existing local session FIRST so switching providers
 * actually switches identity.
 */
export async function signIn(
  providerId: string,
  opts: { callbackURL?: string; errorCallbackURL?: string; openedByLink?: boolean } = {},
): Promise<void> {
  const callbackURL = opts.callbackURL ?? "/";
  const errorCallbackURL = opts.errorCallbackURL ?? "/";
  const providerLabel = GROK_PROVIDERS.find((item) => item.providerId === providerId)?.label ?? "Google";

  try {
  // Open the window SYNCHRONOUSLY on the user gesture — before any await
  // (including signOut). Awaiting first drops user-gesture privilege in some
  // browsers when the opener is a cross-origin live-preview iframe.
  const popup = inLivePreview() ? openSignInPopup(providerId) : null;
  const incoming = inLivePreview() ? waitForPopupToken(popup) : null;

  clearLocalSignedOut();

  // Clear any prior session so switching providers actually switches identity.
  // Bounded because the popup is already open — a request that never settles
  // would leave it hanging — but bounded PER ENVIRONMENT: only the server can
  // end a deployed session, so cutting it short at the preview's 1.5s would
  // start OAuth with the old session still live.
  await runPreSignInSignOut({
    livePreview: inLivePreview(),
    hasBearer: Boolean(getBearerToken()),
    requestSignOut: () => authClient.signOut(),
    clearToken: () => setBearerToken(null),
  });

  if (inLivePreview()) {
    if (!popup) {
      throw new Error(signInErrorMessage("blocked", providerLabel));
    }
    const result = await incoming!;
    if (!result.token) {
      throw new Error(signInErrorMessage(result.error, providerLabel));
    }
    setBearerToken(result.token);
    try {
      const session = await authClient.getSession();
      if (session.error) {
        throw new Error(signInErrorMessage("missing_session", providerLabel));
      }
    } catch (err) {
      if (err instanceof Error && err.message.includes("did not receive")) throw err;
      /* session store will recover on next useSession fetch */
    }
    if (typeof window !== "undefined") {
      const dest = new URL(callbackURL, window.location.origin);
      const here = window.location;
      if (dest.origin !== here.origin || dest.pathname !== here.pathname || dest.search !== here.search) {
        window.location.href = callbackURL;
      }
    }
    return;
  }

  const { data, error } = await authClient.signIn.oauth2({
    providerId,
    callbackURL,
    errorCallbackURL,
  });
  if (error) throw new Error(signInErrorMessage(error.message ?? "sign_in_failed", providerLabel));
  if (!data?.url) throw new Error(signInErrorMessage("oauth_init_missing_url", providerLabel));
  window.location.href = data.url;
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(signInErrorMessage(err.message, providerLabel));
    }
    throw new Error(signInErrorMessage("sign_in_failed", providerLabel));
  }
}

function signInErrorMessage(error: string | undefined, providerLabel: string) {
  const name = providerLabel || "Google";
  const raw = (error ?? "").trim();
  if (!raw || raw === "cancelled") {
    return `${name} did not finish. Keep the sign-in window open, then try again.`;
  }
  if (raw === "timeout") {
    return `${name} is taking too long. Close that window and try again.`;
  }
  if (raw === "missing_session" || raw.includes("did not receive")) {
    return `${name} signed in, but this page did not receive the session. Try again.`;
  }
  if (raw === "blocked" || /pop-?up blocked/i.test(raw)) {
    return `Pop-up blocked. Allow pop-ups for this site, then try ${name} again.`;
  }
  if (raw.includes("oauth_init") || raw.includes("oauth_redirect") || raw.includes("could not start")) {
    return `${name} could not start. Try again, or open with email.`;
  }
  if (raw === "sign_in_failed") {
    return `${name} was cancelled or failed. Try again, or open with email.`;
  }
  if (/keep the sign-in window|taking too long|open with email|Allow pop-ups/i.test(raw)) {
    return raw;
  }
  return `${name} did not finish. Try again, or open with email.`;
}

/**
 * Open `/auth/popup` in a new window. Must run synchronously inside the click
 * handler (no await before this). The path is served by the template Vite
 * plugin (`authPopupPlugin` in vite.config.ts) — NOT by a React route.
 *
 * Opens the real URL directly (not about:blank → assign). From a cross-origin
 * iframe the about:blank dance often fails on the first click and the window
 * ends up showing the app shell.
 */
function openSignInPopup(providerId: string): Window | null {
  const origin = window.location.origin;
  const url = `${origin}${authPopupHref(providerId)}`;
  const name = `${authPopupTarget(providerId)}-${Date.now()}`;
  const opened = window.open(url, name, "width=520,height=720");
  if (!opened || opened.closed) return null;
  try {
    opened.focus();
  } catch {
    /* ignore */
  }
  return opened;
}

function readStoredPopupResult(): PopupResult | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(POPUP_RESULT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PopupMessage & { t?: number };
    if (!parsed || parsed.source !== "grok-auth-popup") return null;
    if (parsed.t && Date.now() - parsed.t > 60_000) return null;
    return { token: parsed.token ?? null, error: parsed.error };
  } catch {
    return null;
  }
}

function clearStoredPopupResult() {
  try {
    window.localStorage.removeItem(POPUP_RESULT_KEY);
  } catch {
    /* ignore */
  }
}

/**
 * Wait for the Google tab to hand back a session token. Google often severs
 * window.opener, so we listen on postMessage, BroadcastChannel, and localStorage.
 */
function waitForPopupToken(popup: Window | null): Promise<PopupResult> {
  return new Promise((resolve) => {
    const origin = window.location.origin;
    let settled = false;
    let closeTimer: number | undefined;
    let channel: BroadcastChannel | undefined;
    const settle = (result: PopupResult) => {
      if (settled) return;
      settled = true;
      cleanup();
      clearStoredPopupResult();
      resolve(result);
    };
    const take = (data: PopupMessage | undefined) => {
      if (!data || data.source !== "grok-auth-popup") return;
      settle({ token: data.token ?? null, error: data.error });
    };
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== origin) return;
      take(event.data as PopupMessage | undefined);
    };
    const onStorage = (event: StorageEvent) => {
      if (event.key !== POPUP_RESULT_KEY || !event.newValue) return;
      try {
        take(JSON.parse(event.newValue) as PopupMessage);
      } catch {
        /* ignore */
      }
    };
    const existing = readStoredPopupResult();
    if (existing?.token) {
      settle(existing);
      return;
    }
    try {
      channel = new BroadcastChannel(POPUP_CHANNEL);
      channel.onmessage = (event) => take(event.data as PopupMessage | undefined);
    } catch {
      channel = undefined;
    }
    const pollTimer =
      popup &&
      window.setInterval(() => {
        if (!popup.closed) return;
        window.clearInterval(pollTimer);
        closeTimer = window.setTimeout(() => {
          const stored = readStoredPopupResult();
          if (stored?.token) settle(stored);
          else settle({ token: null, error: "cancelled" });
        }, 800);
      }, 200);
    const timeoutTimer = window.setTimeout(() => settle({ token: null, error: "timeout" }), 120_000);
    function cleanup() {
      if (pollTimer) window.clearInterval(pollTimer);
      if (closeTimer !== undefined) window.clearTimeout(closeTimer);
      window.clearTimeout(timeoutTimer);
      window.removeEventListener("message", onMessage);
      window.removeEventListener("storage", onStorage);
      try {
        channel?.close();
      } catch {
        /* ignore */
      }
    }
    window.addEventListener("message", onMessage);
    window.addEventListener("storage", onStorage);
  });
}

/**
 * Sign out of THIS app's local session, clear the preview token, then redirect.
 *
 * Use this, never `authClient.signOut()` — see the note on `authClient`.
 * Sequencing lives in `scripts/sign-out-plan.mjs` so it can be unit-tested.
 *
 * **Rejects when deployed if the server never confirms.** There the session is
 * an HttpOnly cookie only the server can clear, so redirecting anyway would
 * report a sign-out that did not happen. `<UserButton />` handles that for you;
 * a hand-rolled control must catch it and let the visitor retry. In the live
 * preview the local clear is sufficient, so it always resolves.
 */
export async function signOut(redirectTo = "/"): Promise<void> {
  markLocalSignedOut();
  await runSignOut({
    livePreview: true,
    hasBearer: true,
    requestSignOut: async () => {
      const { error } = await authClient.signOut();
      if (error) throw new Error(error.message ?? "Sign-out failed");
    },
    clearToken: () => setBearerToken(null),
    redirect: () => {
      const dest = new URL(redirectTo, window.location.origin);
      dest.searchParams.set("signedout", "1");
      window.location.replace(dest.pathname + dest.search + dest.hash);
    },
  });
}
