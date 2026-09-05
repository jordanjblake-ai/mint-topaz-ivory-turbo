import { Link, useRouterState } from "@tanstack/react-router";
import { Logo } from "@/components/site/logo";
import { GoogleSignInButton, MicrosoftSignInButton } from "@/components/site/google-sign-in";
import { DESK_SUB, DESK_TITLE, UNKNOWN_OPS_COPY, isOpsEmail } from "@/data/ops-desk";
import { authEnabled, signOut } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";

export function StaffShell({ children }: { children: React.ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { user, isPending } = useCurrentUserState();
  const onDesk = pathname === "/ops" || pathname === "/ops/";

  if (isPending) {
    return (
      <main className="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-4">
        <p className="text-sm text-muted">Loading Hybrid desk.</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Staff only</p>
        <h1 className="mt-3 font-display text-5xl text-fg sm:text-6xl">Hybrid desk</h1>
        <p className="mt-4 text-sm leading-relaxed text-muted">{DESK_SUB}</p>
        <div className="mt-8 grid gap-3">
          {authEnabled ? (
            <>
              <GoogleSignInButton callbackURL="/ops" label="Sign in with Google" />
              <MicrosoftSignInButton callbackURL="/ops" label="Sign in with Microsoft" />
            </>
          ) : (
            <p className="text-sm text-muted">Sign-in is disabled.</p>
          )}
        </div>
        <Link to="/" className="mt-8 text-sm text-muted hover:text-fg">
          Back to the site
        </Link>
      </main>
    );
  }

  const allowed = !user.isDevFallback && isOpsEmail(user.primaryEmail);

  if (!allowed) {
    return (
      <main className="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Staff only</p>
        <h1 className="mt-3 font-display text-5xl text-fg sm:text-6xl">Hybrid desk</h1>
        <p className="mt-4 text-sm text-accent" role="status">
          {UNKNOWN_OPS_COPY}
        </p>
        {user.primaryEmail ? <p className="mt-2 text-xs text-muted">{user.primaryEmail}</p> : null}
        <SignOutControl />
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
              <p className="text-[0.65rem] uppercase tracking-[0.18em] text-muted">Mark / ops</p>
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
            <SignOutControl />
          </nav>
        </div>
      </header>
      {children}
    </div>
  );
}

function SignOutControl() {
  return (
    <button
      type="button"
      onClick={() => {
        if (authEnabled) void signOut("/ops").catch(() => undefined);
      }}
      className="inline-flex h-11 items-center px-3 text-sm text-muted hover:text-fg"
    >
      Sign out
    </button>
  );
}
