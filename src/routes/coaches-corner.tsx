import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { portalCamps } from "@/data/portals";
import { personByEmail } from "@/data/camp";
import { useCamp } from "@/lib/camp-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GoogleSignInButton } from "@/components/site/google-sign-in";
import { Container, Display, Kicker, Section } from "@/components/site/section";
import { allowAttempt, isEmail } from "@/lib/guard";
import { authEnabled, signOut } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";

export const Route = createFileRoute("/coaches-corner")({
  head: () => ({
    meta: [
      { title: "Coaches Corner · Hybrid Vacations" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: CoachesCornerPage,
});

const COACH_DEMOS = [
  { email: "mark@hybridvacations.com", label: "Mark Garcia-Kidd · Head coach, all three weeks" },
  { email: "martha@hybridvacations.com", label: "Martha Bullen · Group A" },
  { email: "issa@hybridvacations.com", label: "Issa Batrane · Group B" },
  { email: "dave@hybridvacations.com", label: "Dave Panah · Group C, weeks 2–3" },
  { email: "katya@hybridvacations.com", label: "Katya Kate · Camp coach" },
];

function CoachesCornerPage() {
  const navigate = useNavigate();
  const ready = useCamp((s) => s.ready);
  const me = useCamp((s) => s.me);
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
    const person = personByEmail(user.primaryEmail);
    if (person && person.role !== "player") login(person.email);
  }, [user, isPending, login]);

  function enter(address: string) {
    if (!allowAttempt("coaches-corner", 8, 60_000)) {
      setError("Too many tries. Wait a minute and try again.");
      return;
    }
    if (!isEmail(address)) {
      setError("That email does not look right.");
      return;
    }
    const person = personByEmail(address);
    if (!person) {
      setError("That email is not on staff for a live camp.");
      return;
    }
    if (person.role === "player") {
      setError("That email is a player booking. Use the Player Portal.");
      return;
    }
    login(person.email);
    navigate({ to: "/camp" });
  }

  const googlePerson = user?.primaryEmail ? personByEmail(user.primaryEmail) : null;
  const googlePlayer = googlePerson?.role === "player";
  const signedInStaff = me && me.role !== "player";

  return (
    <main className="min-h-dvh bg-bg text-fg">
      <Section>
        <Container className="grid items-start gap-12 lg:grid-cols-2">
          <div>
            <Kicker>Coaches Corner</Kicker>
            <Display as="h1" className="mt-2 text-5xl sm:text-6xl">
              Your weeks on staff
            </Display>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-muted">
              Groups, duties, and the players in front of you. Sign in with the Google account we
              have you on. Lanzarote is live. Other camps will use this same corner when they run.
            </p>
            <div className="mt-8 rounded-md bg-surface p-6 shadow-border sm:p-8">
              {!ready || isPending ? (
                <p className="text-sm text-muted">Loading Coaches Corner.</p>
              ) : signedInStaff ? (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">On staff</p>
                  <h2 className="mt-2 font-display text-4xl text-fg">{me.name.split(" ")[0]}</h2>
                  <ul className="mt-6 grid gap-3">
                    {portalCamps
                      .filter((camp) => camp.status === "open")
                      .map((camp) => (
                        <li key={camp.id}>
                          <Button asChild size="lg" className="w-full">
                            <Link to="/camp">Open {camp.name}</Link>
                          </Button>
                        </li>
                      ))}
                  </ul>
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      if (authEnabled) void signOut().catch(() => undefined);
                    }}
                    className="mt-6 text-sm text-muted hover:text-fg"
                  >
                    Sign out
                  </button>
                </div>
              ) : (
                <div className="grid gap-6">
                  <GoogleSignInButton callbackURL="/coaches-corner" label="Sign in with Google" />
                  {user && !googlePerson ? (
                    <p className="text-sm text-accent">That Google account is not on staff for a live camp.</p>
                  ) : null}
                  {googlePlayer ? (
                    <p className="text-sm text-accent">
                      That account is a player booking.{" "}
                      <Link to="/portal" className="text-fg underline-offset-2 hover:underline">
                        Open the Player Portal
                      </Link>
                      .
                    </p>
                  ) : null}
                  <form
                    className="grid gap-4 border-t border-border pt-6"
                    onSubmit={(event) => {
                      event.preventDefault();
                      setError("");
                      if (!email.trim()) {
                        setError("Enter the staff email we have you on.");
                        return;
                      }
                      enter(email);
                    }}
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
                      Or use your staff email
                    </p>
                    <div>
                      <Label htmlFor="coach-email">Staff email</Label>
                      <Input
                        id="coach-email"
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setError("");
                        }}
                        autoComplete="email"
                        required
                      />
                    </div>
                    {error ? (
                      <p className="text-sm text-accent">
                        {error}{" "}
                        {error.includes("Player Portal") ? (
                          <Link to="/portal" className="text-fg underline-offset-2 hover:underline">
                            Open Player Portal
                          </Link>
                        ) : null}
                      </p>
                    ) : null}
                    <Button type="submit" variant="secondary" size="lg">
                      Open with email
                    </Button>
                  </form>
                  <div className="border-t border-border pt-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Preview</p>
                    <div className="mt-3 grid gap-2">
                      {COACH_DEMOS.map((item) => (
                        <button
                          key={item.email}
                          type="button"
                          onClick={() => enter(item.email)}
                          className="rounded-sm bg-bg px-3 py-3 text-left text-sm shadow-border hover:shadow-border-hover"
                        >
                          <span className="block text-fg">{item.label}</span>
                          <span className="text-xs text-muted">{item.email}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div>
            <ul className="grid gap-3">
              {portalCamps.map((camp) => (
                <li key={camp.id} className="rounded-md bg-surface p-5 shadow-border">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
                    {camp.status === "open" ? "Open" : "Opens with the booking"}
                  </p>
                  <p className="mt-2 font-display text-3xl text-fg">{camp.name}</p>
                  <p className="mt-1 text-sm text-muted">
                    {camp.place} · {camp.dates}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </Section>
    </main>
  );
}
