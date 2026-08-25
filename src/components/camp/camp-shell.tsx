import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CAMP_META, PEOPLE, groupOf, personByEmail } from "@/data/camp";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/site/logo";
import { GoogleSignInButton } from "@/components/site/google-sign-in";
import { useCamp } from "@/lib/camp-store";
import { allowAttempt, isEmail } from "@/lib/guard";
import { cn } from "@/lib/utils";
import { authEnabled, signOut } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";

export function CampShell({ children }: { children: React.ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const searchStr = useRouterState({ select: (s) => s.location.searchStr ?? "" });
  const navigate = useNavigate();
  const ready = useCamp((s) => s.ready);
  const me = useCamp((s) => s.me);
  const messages = useCamp((s) => s.messages);
  const groups = useCamp((s) => s.groups);
  const weekGroups = useCamp((s) => s.weekGroups);
  const hydrate = useCamp((s) => s.hydrate);
  const login = useCamp((s) => s.login);
  const logout = useCamp((s) => s.logout);
  const { user, isPending } = useCurrentUserState();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (isPending || !user?.primaryEmail) return;
    login(user.primaryEmail);
  }, [user, isPending, login]);

  if (!ready || isPending) return <div className="min-h-dvh bg-bg" />;

  if (!me) {
    const params = new URLSearchParams(searchStr.startsWith("?") ? searchStr : `?${searchStr}`);
    const gate = params.get("gate") === "coach" ? "coach" : params.get("gate") === "player" ? "player" : null;
    const callback = gate === "coach" ? "/coaches-corner" : gate === "player" ? "/portal" : "/camp";
    const googlePerson = user?.primaryEmail ? personByEmail(user.primaryEmail) : null;

    return (
      <main className="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-4 py-16">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
          {gate === "coach" ? "Coaches Corner" : gate === "player" ? "Player Portal" : "Lanzarote 2027"}
        </p>
        <h1 className="mt-3 font-display text-6xl text-fg">
          {gate === "coach" ? "On staff" : gate === "player" ? "Your week" : "Your camp"}
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-muted">
          Sign in with Google using the email we have you on. Booking emails that are not Google
          still work below.
        </p>
        <div className="mt-8">
          <GoogleSignInButton callbackURL={callback} label="Sign in with Google" />
        </div>
        {user && !googlePerson ? (
          <p className="mt-4 text-sm text-accent">That Google account is not on this camp.</p>
        ) : null}
        <form
          className="mt-8 grid gap-4 border-t border-border pt-8"
          onSubmit={(event) => {
            event.preventDefault();
            if (!allowAttempt("camp-login", 8, 60_000)) {
              setError("Too many tries. Wait a minute.");
              return;
            }
            if (!isEmail(email) || !login(email)) setError("That email is not on this camp.");
            else navigate({ to: "/camp" });
          }}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
            Or use your booking email
          </p>
          <div>
            <Label htmlFor="camp-email">Email</Label>
            <Input
              id="camp-email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              autoComplete="email"
            />
          </div>
          {error ? <p className="text-sm text-accent">{error}</p> : null}
          <Button type="submit" variant="secondary">
            {gate === "coach" ? "Open Coaches Corner" : "Open my camp"}
          </Button>
        </form>
        <Link
          to={gate === "coach" ? "/coaches-corner" : gate === "player" ? "/portal" : "/"}
          className="mt-8 text-sm text-muted hover:text-fg"
        >
          {gate ? "Back to camps" : "Back to the public site"}
        </Link>
      </main>
    );
  }

  const isCoach = me.role === "coach" || me.role === "head";
  const unread = messages.filter((item) => {
    if (me.role === "player") return Boolean(item.reply) && item.fromId === me.id && !item.seenBy.includes(me.id);
    const from = PEOPLE.find((p) => p.id === item.fromId);
    if (!from || from.role !== "player") return false;
    const myGroup = me.leadsGroup ?? me.groupId;
    const allowed =
      me.role === "head" ||
      Boolean(
        myGroup &&
          from.weeks.some(
            (week) => me.weeks.includes(week) && groupOf(from, week, groups, weekGroups) === myGroup,
          ),
      );
    return Boolean(allowed) && !item.seenBy.includes(me.id);
  }).length;

  const links = [
    { href: "/camp", label: "Welcome", match: (p: string) => p === "/camp" || p === "/camp/" },
    { href: "/camp/today", label: "Day by day", match: (p: string) => p.startsWith("/camp/today") },
    { href: "/camp/schedule", label: "Schedule", match: (p: string) => p.startsWith("/camp/schedule") },
    { href: "/camp/prepare", label: "Prepare", match: (p: string) => p.startsWith("/camp/prepare") },
    { href: "/camp/kit", label: "Kit", match: (p: string) => p.startsWith("/camp/kit") },
    { href: "/camp/fuel", label: "Fuel", match: (p: string) => p.startsWith("/camp/fuel") },
    { href: "/camp/messages", label: unread ? `Messages (${unread})` : "Messages", match: (p: string) => p.startsWith("/camp/messages") },
    ...(isCoach
      ? [{ href: "/camp/squad", label: "Squad", match: (p: string) => p.startsWith("/camp/squad") }]
      : []),
    ...(me.role === "head"
      ? [{ href: "/camp/groups", label: "Groups", match: (p: string) => p.startsWith("/camp/groups") }]
      : []),
  ];

  return (
    <div className="min-h-dvh bg-bg text-fg">
      <header className="sticky top-0 z-40 border-b border-border/70 bg-bg/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:px-6">
          <div className="flex items-center justify-between gap-3">
            <Link to="/camp" className="flex items-center gap-3">
              <Logo className="h-9 w-9" alt="" />
              <div>
                <p className="font-display text-lg leading-none tracking-wide">LANZAROTE CAMP</p>
                <p className="text-[0.65rem] uppercase tracking-[0.16em] text-muted">{CAMP_META.dates}</p>
              </div>
            </Link>
            <div className="flex items-center gap-3">
              {user?.profileImageUrl ? (
                <img src={user.profileImageUrl} alt="" className="h-8 w-8 rounded-full object-cover" />
              ) : null}
              <p className="hidden text-sm text-muted sm:block">{me.name}</p>
              <button
                type="button"
                onClick={() => {
                  logout();
                  if (authEnabled) void signOut().catch(() => undefined);
                }}
                className="h-11 px-2 text-sm text-muted hover:text-fg"
              >
                Sign out
              </button>
            </div>
          </div>
          <nav className="-mx-1 flex gap-1 overflow-x-auto pb-1">
            {links.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "inline-flex h-10 shrink-0 items-center rounded-sm px-3 text-sm",
                  item.match(pathname) ? "bg-surface text-fg" : "text-muted hover:text-fg",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      {children}
    </div>
  );
}
