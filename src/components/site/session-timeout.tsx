import { useEffect, useRef, useState } from "react";
import { authEnabled, signOut } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { useCamp } from "@/lib/camp-store";
import {
  beginSessionClock,
  broadcastSessionEnd,
  isSessionKillEvent,
  sessionStatus,
  touchSession,
} from "@/lib/session-timeout";
import { REFRESH_STORAGE_KEY, revokeRefreshSession } from "@/lib/session-refresh";
import { revokeTokens } from "@/lib/token-revocation";
import { Button } from "@/components/ui/button";

const ACTIVITY = ["pointerdown", "keydown", "touchstart"] as const;

export function SessionTimeoutGuard() {
  const { user, isPending } = useCurrentUserState();
  const me = useCamp((s) => s.me);
  const logout = useCamp((s) => s.logout);
  const signedIn = Boolean(user) || Boolean(me);
  const [warn, setWarn] = useState(false);
  const ending = useRef(false);

  useEffect(() => {
    if (isPending) return;
    if (!signedIn) {
      setWarn(false);
      ending.current = false;
      return;
    }
    beginSessionClock();
    ending.current = false;

    const endNow = (fromOtherTab = false) => {
      if (ending.current) return;
      ending.current = true;
      setWarn(false);
      if (!fromOtherTab) broadcastSessionEnd();
      logout();
      const refresh = (() => {
        try {
          return window.sessionStorage.getItem(REFRESH_STORAGE_KEY) ?? "";
        } catch {
          return "";
        }
      })();
      void revokeTokens({ data: { scope: "this" } }).catch(() => undefined);
      void revokeRefreshSession({ data: { token: refresh || undefined } }).catch(() => undefined);
      if (!fromOtherTab && authEnabled && user) {
        void signOut("/account").catch(() => {
          window.location.replace("/account?signedout=1");
        });
        return;
      }
      if (fromOtherTab) window.location.replace("/account?signedout=1");
    };

    const inspect = () => {
      if (ending.current) return;
      const status = sessionStatus();
      if (status.expired) {
        endNow();
        return;
      }
      setWarn(status.warn);
    };

    const onActivity = () => {
      if (ending.current) return;
      const status = sessionStatus();
      if (status.expired) {
        endNow();
        return;
      }
      if (status.warn) return;
      touchSession();
      setWarn(false);
    };

    const onVisibility = () => {
      if (document.visibilityState === "visible") inspect();
    };

    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) inspect();
    };

    const onStorage = (event: StorageEvent) => {
      if (isSessionKillEvent(event)) endNow(true);
    };

    for (const event of ACTIVITY) window.addEventListener(event, onActivity, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pageshow", onPageShow);
    window.addEventListener("storage", onStorage);
    inspect();
    const tick = window.setInterval(inspect, 5_000);

    return () => {
      for (const event of ACTIVITY) window.removeEventListener(event, onActivity);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pageshow", onPageShow);
      window.removeEventListener("storage", onStorage);
      window.clearInterval(tick);
    };
  }, [signedIn, isPending, user?.id, logout]);

  if (!warn || !signedIn) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-end justify-center sm:items-center sm:p-6">
      <div className="absolute inset-0 bg-charcoal/80" />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="session-timeout-title"
        className="relative z-10 w-full rounded-t-lg bg-surface p-6 shadow-border sm:max-w-md sm:rounded-md"
      >
        <p id="session-timeout-title" className="font-display text-3xl text-fg">
          Still there?
        </p>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          You have been still for a while. Stay signed in, or we will sign you out to protect your
          account.
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Button
            type="button"
            onClick={() => {
              touchSession();
              setWarn(false);
            }}
          >
            Stay signed in
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              ending.current = true;
              setWarn(false);
              broadcastSessionEnd();
              logout();
              if (authEnabled && user) void signOut("/account").catch(() => undefined);
            }}
          >
            Sign out
          </Button>
        </div>
      </div>
    </div>
  );
}
