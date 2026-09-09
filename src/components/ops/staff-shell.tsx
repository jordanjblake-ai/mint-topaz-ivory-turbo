import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Logo } from "@/components/site/logo";
import { GoogleSignInButton } from "@/components/site/google-sign-in";
import { DESK_SUB, DESK_TITLE, UNKNOWN_OPS_COPY, isOpsEmail } from "@/data/ops-desk";
import { authEnabled, signOut } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { clearOpsSession, isOpsPreview, readOpsSession, setOpsSession } from "@/lib/ops-session";

const MARK_OPS_EMAIL = "mark@hybridvacations.com";

export function StaffShell({ children }: { children: React.ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { user, isPending } = useCurrentUserState();
  const [staffEmail, setStaffEmail] = useState<string | null>(null);
  const [preview, setPreview] = useState(false);
  const onDesk = pathname === "/ops" || pathname === "/ops/";

  useEffect(() => {
    setStaffEmail(readOpsSession());
    setPreview(isOpsPreview());
  }, []);

  if (isPending) {
    return (
      <main className="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-4">
        <p className="text-sm text-muted">Loading Hybrid desk.</p>
      </main>
    );
  }

  function enterPreview() {
    setOpsSession(MARK_OPS_EMAIL, true);
    setStaffEmail(MARK_OPS_EMAIL);
    setPreview(true);
  }

  function leaveDesk() {
    clearOpsSession();
    setStaffEmail(null);
    setPreview(false);
    if (!preview && authEnabled) void signOut("/ops").catch(() => undefined);
  }

  const email = staffEmail || (!preview ? user?.primaryEmail : null) || null;
  const signedIn = Boolean(email);
  const allowed = Boolean(email && isOpsEmail(email));

  if (!signedIn) {
    return (
      <main className="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Staff only</p>
        <h1 className="mt-3 font-display text-5xl text-fg sm:text-6xl">Hybrid desk</h1>
        <p className="mt-4 text-sm leading-relaxed text-muted">{DESK_SUB}</p>
        <div className="mt-8 grid gap-3">
          {authEnabled ? (
            <GoogleSignInButton callbackURL="/ops" label="Sign in with Google" />
          ) : (
            <p className="text-sm text-muted">Sign-in is disabled.</p>
          )}
        </div>
        <div className="mt-8 grid gap-3 border-t border-border pt-6">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Preview</p>
          <p className="text-sm leading-relaxed text-muted">
            Walk the desk as Mark without a live sign-in. This is a preview, not his account.
          </p>
          <button
            type="button"
            onClick={enterPreview}
            className="rounded-sm bg-surface px-3 py-3 text-left shadow-border hover:bg-bg"
          >
            <span className="block text-sm text-fg">Preview as Mark Garcia-Kidd</span>
            <span className="mt-1 block text-xs text-muted">Head coach / ops — Hybrid desk</span>
          </button>
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
        {email ? <p className="mt-2 text-xs text-muted">{email}</p> : null}
        <SignOutControl preview={preview} onLeave={leaveDesk} />
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
                {preview ? "Preview · Mark / ops" : "Mark / ops"}
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
            <SignOutControl preview={preview} onLeave={leaveDesk} />
          </nav>
        </div>
      </header>
      {preview ? (
        <p className="mx-auto max-w-6xl px-4 pt-4 text-sm text-muted sm:px-6" role="status">
          Preview · Mark Garcia-Kidd · Hybrid desk. Not a live sign-in.
        </p>
      ) : null}
      {children}
    </div>
  );
}

function SignOutControl({ preview, onLeave }: { preview: boolean; onLeave: () => void }) {
  return (
    <button
      type="button"
      onClick={onLeave}
      className="inline-flex h-11 items-center px-3 text-sm text-muted hover:text-fg"
    >
      {preview ? "Leave preview" : "Sign out"}
    </button>
  );
}
