import { useEffect, useRef } from "react";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { isLocalSignedOut } from "@/lib/auth/client";
import {
  mintRefreshSession,
  REFRESH_STORAGE_KEY,
  rotateRefreshSession,
  ROTATE_EVERY_MS,
  revokeRefreshSession,
} from "@/lib/session-refresh";

function readStored() {
  if (typeof window === "undefined") return "";
  try {
    return window.sessionStorage.getItem(REFRESH_STORAGE_KEY) ?? "";
  } catch {
    return "";
  }
}

function writeStored(token: string | null) {
  if (typeof window === "undefined") return;
  try {
    if (token) window.sessionStorage.setItem(REFRESH_STORAGE_KEY, token);
    else window.sessionStorage.removeItem(REFRESH_STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

export function SessionRefreshGuard() {
  const { user, isPending } = useCurrentUserState();
  const started = useRef(false);

  useEffect(() => {
    if (isPending) return;
    if (!user || isLocalSignedOut()) {
      const token = readStored();
      writeStored(null);
      if (token || started.current) {
        started.current = false;
        void revokeRefreshSession({ data: { token: token || undefined } }).catch(() => undefined);
      }
      return;
    }

    let cancelled = false;
    started.current = true;

    const apply = (result: { token: string | null; reused?: boolean }) => {
      if (cancelled) return;
      if (result.token) writeStored(result.token);
      else writeStored(null);
      if (result.reused) window.location.replace("/account?signedout=1");
    };

    const mint = () => {
      void mintRefreshSession()
        .then((result) => apply(result))
        .catch(() => undefined);
    };

    const rotate = () => {
      const token = readStored();
      void rotateRefreshSession({ data: { token: token || undefined } })
        .then((result) => apply(result))
        .catch(() => undefined);
    };

    const boot = () => {
      const token = readStored();
      void rotateRefreshSession({ data: { token: token || undefined } })
        .then((result) => {
          if (result.token || result.reused) {
            apply(result);
            return;
          }
          mint();
        })
        .catch(() => mint());
    };

    boot();

    const tick = window.setInterval(rotate, ROTATE_EVERY_MS);
    const onVisible = () => {
      if (document.visibilityState === "visible") rotate();
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      cancelled = true;
      window.clearInterval(tick);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [user?.id, isPending]);

  return null;
}
