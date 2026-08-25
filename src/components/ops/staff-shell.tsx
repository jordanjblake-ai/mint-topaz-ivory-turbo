import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/site/logo";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useOps } from "@/lib/ops-store";
import { allowAttempt } from "@/lib/guard";
import { cn } from "@/lib/utils";

export function StaffShell({ children }: { children: React.ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const ready = useOps((s) => s.ready);
  const unlocked = useOps((s) => s.unlocked);
  const hydrate = useOps((s) => s.hydrate);
  const unlock = useOps((s) => s.unlock);
  const lock = useOps((s) => s.lock);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  if (!ready) {
    return <div className="min-h-dvh bg-bg" />;
  }

  if (!unlocked) {
    return (
      <main className="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Staff only</p>
        <h1 className="mt-3 font-display text-6xl text-fg">The desk</h1>
        <p className="mt-4 text-sm leading-relaxed text-muted">
          Booking requests, site traffic, and everyone who has written in. Not part of the public
          site.
        </p>
        <form
          className="mt-8 grid gap-4"
          onSubmit={(event) => {
            event.preventDefault();
            if (!allowAttempt("desk", 5, 60_000)) {
              setError("Too many tries. Wait a minute.");
              return;
            }
            if (!unlock(code)) setError("That code is not right.");
          }}
        >
          <div>
            <Label htmlFor="desk-code">Desk code</Label>
            <Input
              id="desk-code"
              type="password"
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                setError("");
              }}
              autoComplete="current-password"
              maxLength={40}
              autoFocus
            />
          </div>
          {error ? <p className="text-sm text-accent">{error}</p> : null}
          <Button type="submit">Open the desk</Button>
        </form>
        <Link to="/" className="mt-8 text-sm text-muted hover:text-fg">
          Back to the site
        </Link>
      </main>
    );
  }

  const onPeople = pathname.startsWith("/ops/people");

  return (
    <div className="min-h-dvh bg-bg text-fg">
      <header className="sticky top-0 z-40 border-b border-border/70 bg-bg/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Logo className="h-9 w-9" alt="" />
            <div>
              <p className="font-display text-lg leading-none tracking-wide">HYBRID DESK</p>
              <p className="text-[0.65rem] uppercase tracking-[0.18em] text-muted">Staff</p>
            </div>
          </div>
          <nav className="flex items-center gap-1">
            <Link
              to="/ops"
              className={cn(
                "inline-flex h-11 items-center rounded-sm px-3 text-sm",
                !onPeople ? "bg-surface text-fg" : "text-muted hover:text-fg",
              )}
            >
              Overview
            </Link>
            <Link
              to="/ops/people"
              className={cn(
                "inline-flex h-11 items-center rounded-sm px-3 text-sm",
                onPeople ? "bg-surface text-fg" : "text-muted hover:text-fg",
              )}
            >
              People
            </Link>
            <button
              type="button"
              onClick={lock}
              className="ml-2 inline-flex h-11 items-center px-3 text-sm text-muted hover:text-fg"
            >
              Lock
            </button>
          </nav>
        </div>
      </header>
      {children}
    </div>
  );
}
