import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Logo } from "@/components/site/logo";
import { GoogleSignInButton } from "@/components/site/google-sign-in";
import { DESK_SUB, DESK_TITLE, UNKNOWN_OPS_COPY, isOpsEmail } from "@/data/ops-desk";
import { authEnabled, signOut } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import {
  clearOpsSession,
  isOpsPreview,
  readOpsSession,
  setOpsSession,
} from "@/lib/ops-session";

const MARK_OPS_EMAIL = "mark@hybridvacations.com";

export function StaffShell({ children }: { children: React.ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { user, isPending } = useCurrentUserState();
  const [opsEmail, setOpsEmail] = useState<string | null>(null);
  const [previewing, setPreviewing] = useState(false);
  const onDesk = pathname === "/ops" || pathname === "/ops/";

  useEffect(() => {
    setOpsEmail(readOpsSession());
    setPreviewing(isOpsPreview());
  }, []);

  function enterMarkPreview() {
    setOpsSession(MARK_OPS_EMAIL, true);
    setOpsEmail(MARK_OPS_EMAIL);
    setPreviewing(true);
  }

  function exitSession() {
    clearOpsSession();
    setOpsEmail(null);
    setPreviewing(false);
    if (authEnabled && user) void signOut("/ops").catch(() => undefined);
  }

  if (isPending) {
    return (
      <main className="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-4">
        <p className="text-sm text-muted">Loading Hybrid desk.</p>
      </main>
    );
  }

  const previewAllowed = previewing && isOpsEmail(opsEmail);
  const signedInAllowed = Boolean(user && !user.isDevFallback && isOpsEmail(user.primaryEmail));
  const allowed = previewAllowed || signedInAllowed;

  if (!user && !previewAllowed) {
    return (
      <main className="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Staff only</p>
        <h1 className="mt-3 font-display text-5xl text-fg sm:text-6xl">Hybrid desk</h1>
        <p className="mt-4 text-sm leading-relaxed text-muted">{DESK_SUB}</p>
        <div className="mt-8 grid gap-3">
          {authEnabled ? (
            <GoogleSignInButton callbackURL="/ops" label="Sign in with Google" />
          ) : (
            <p className="text-sm text-muted">Google sign-in is disabled. Use preview below.</p>
          )}
          <div className="mt-3 border-t border-border pt-6">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Preview</p>
            <button
              type="button"
              onClick={enterMarkPreview}
              className="mt-3 w-full rounded-sm bg-surface px-3 py-3 text-left text-sm shadow-border hover:shadow-border-hover"
            >
              <span className="block text-fg">Mark Garcia-Kidd</span>
              <span className="text-xs text-muted">Head coach · ops privileges</span>
            </button>
          </div>
        </div>
        <Link to="/" className="mt-8 text-sm text-muted hover:text-fg">
          Back to the site
        </Link>
      </main>
    );
  }

  if (!allowed) {
    return (
      <main className="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Staff only</p>
        <h1 className="mt-3 font-display text-5xl text-fg sm:text-6xl">Hybrid desk</h1>
        <p className="mt-4 text-sm text-accent" role="status">
          {UNKNOWN_OPS_COPY}
        </p>
        {user?.primaryEmail ? <p className="mt-2 text-xs text-muted">{user.primaryEmail}</p> : null}
        <SignOutControl onExit={exitSession} previewing={false} />
        <Link to="/" className="mt-6 text-sm text-muted hover:text-fg">
          Back to the site
        </Link>
      </main>
    );
  }

  return (
    <div className="min-h-dvh bg-bg text-fg">
      <header className="sticky top-0 z-40 border-b border-border/70 bg-bg/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <Logo className="h-9 w-9" alt="" />
            <div className="min-w-0">
              <p className="truncate font-display text-lg leading-none tracking-wide">{DESK_TITLE}</p>
              <p className="text-[0.65rem] uppercase tracking-[0.18em] text-muted">
                {previewing ? "Preview · Mark / ops" : "Mark / ops"}
              </p>
            </div>
          </div>
          <nav className="flex shrink-0 items-center gap-1">
            <Link
              to="/ops"
              className={`inline-flex h-11 items-center rounded-sm px-3 text-sm ${
                onDesk ? "bg-surface text-fg" : "text-muted hover:text-fg"
              }`}
            >
              Desk
            </Link>
            <SignOutControl onExit={exitSession} previewing={previewing} />
          </nav>
        </div>
      </header>
      {children}
    </div>
  );
}

function SignOutControl({
  onExit,
  previewing,
}: {
  onExit: () => void;
  previewing: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onExit}
      className="inline-flex h-11 items-center px-3 text-sm text-muted hover:text-fg"
    >
      {previewing ? "Exit preview" : "Sign out"}
    </button>
  );
}
