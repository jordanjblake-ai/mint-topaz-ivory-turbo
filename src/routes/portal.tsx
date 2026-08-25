import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { portalCamps } from "@/data/portals";
import { personByEmail } from "@/data/camp";
import { useCamp } from "@/lib/camp-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Photo } from "@/components/site/photo";
import { GoogleSignInButton } from "@/components/site/google-sign-in";
import { Container, Display, Kicker, Section } from "@/components/site/section";
import { allowAttempt, isEmail } from "@/lib/guard";
import { authEnabled, signOut } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";

export const Route = createFileRoute("/portal")({
  head: () => ({
    meta: [
      { title: "Player Portal · Hybrid Vacations" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: PlayerPortalPage,
});

const PLAYER_DEMOS = [
  { email: "tom.ridley@icloud.com", label: "Tom Ridley · Lanzarote W2–3" },
  { email: "clara.meier@bluewin.ch", label: "Clara Meier · Lanzarote, all three weeks" },
];

function PlayerPortalPage() {
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
    if (person?.role === "player") login(person.email);
  }, [user, isPending, login]);

  function enter(address: string) {
    if (!allowAttempt("portal", 8, 60_000)) {
      setError("Too many tries. Wait a minute and try again.");
      return;
    }
    if (!isEmail(address)) {
      setError("That email does not look right.");
      return;
    }
    const person = personByEmail(address);
    if (!person) {
      setError("We do not have that email on a booking. Check the address you used, or contact us if you have not booked yet.");
      return;
    }
    if (person.role !== "player") {
      setError("That email is staff. Use Coaches Corner.");
      return;
    }
    login(person.email);
    navigate({ to: "/camp" });
  }

  const googlePerson = user?.primaryEmail ? personByEmail(user.primaryEmail) : null;
  const googleStaff = Boolean(googlePerson && googlePerson.role !== "player");
  const signedInPlayer = me && me.role === "player";

  return (
    <main>
      <section className="relative isolate min-h-[70vh] overflow-hidden">
        <Photo
          src="/images/hero-lanzarote.jpg"
          alt="Players on Playa Grande"
          className="absolute inset-0 size-full"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-overlay" />
        <Container className="relative flex min-h-[70vh] flex-col justify-end py-12 sm:py-16">
          <Kicker>Player Portal</Kicker>
          <Display as="h1" className="mt-3 max-w-3xl text-5xl sm:text-7xl">
            Have you booked with us?
          </Display>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-fg/90">
            Sign in with Google using the email you booked with. Your schedule, group, prepare
            notes, and messages sit behind this door. Lanzarote is live. Other camps will appear
            here when they open.
          </p>
        </Container>
      </section>

      <Section>
        <Container className="grid items-start gap-12 lg:grid-cols-2">
          <div className="rounded-md bg-surface p-6 shadow-border sm:p-8">
            {!ready || isPending ? (
              <p className="text-sm text-muted">Loading the portal.</p>
            ) : signedInPlayer ? (
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">Signed in</p>
                <h2 className="mt-2 font-display text-4xl text-fg">{me.name.split(" ")[0]}, you are in</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  Open the camp you are on. More camps will list here as you book them.
                </p>
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
                <div>
                  <h2 className="font-display text-4xl text-fg">Get in</h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    Use the Google account that matches the email on your booking.
                  </p>
                </div>
                <GoogleSignInButton callbackURL="/portal" label="Sign in with Google" />
                {user && !googlePerson ? (
                  <p className="text-sm text-accent">
                    That Google account is not on a booking. Use the email from your confirmation,
                    or{" "}
                    <Link to="/contact" className="text-fg underline-offset-2 hover:underline">
                      contact us
                    </Link>
                    .
                  </p>
                ) : null}
                {googleStaff ? (
                  <p className="text-sm text-accent">
                    That account is staff.{" "}
                    <Link to="/coaches-corner" className="text-fg underline-offset-2 hover:underline">
                      Open Coaches Corner
                    </Link>
                    .
                  </p>
                ) : null}
                <div className="border-t border-border pt-6">
                  <form
                    className="grid gap-4"
                    onSubmit={(event) => {
                      event.preventDefault();
                      setError("");
                      if (!email.trim()) {
                        setError("Enter the email you booked with.");
                        return;
                      }
                      enter(email);
                    }}
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
                      Or use your booking email
                    </p>
                    <div>
                      <Label htmlFor="portal-email">Booking email</Label>
                      <Input
                        id="portal-email"
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setError("");
                        }}
                        autoComplete="email"
                        autoCapitalize="none"
                        spellCheck={false}
                        required
                        aria-describedby={error ? "portal-error" : "portal-hint"}
                      />
                      <p id="portal-hint" className="mt-2 text-xs text-muted">
                        If you booked with an address that is not Google.
                      </p>
                    </div>
                    {error ? (
                      <p id="portal-error" role="alert" className="text-sm text-accent">
                        {error}{" "}
                        {error.includes("staff") ? (
                          <Link to="/coaches-corner" className="text-fg underline-offset-2 hover:underline">
                            Open Coaches Corner
                          </Link>
                        ) : null}
                        {error.includes("contact us") ? (
                          <Link to="/contact" className="text-fg underline-offset-2 hover:underline">
                            Contact us
                          </Link>
                        ) : null}
                      </p>
                    ) : null}
                    <Button type="submit" variant="secondary" size="lg">
                      Open with email
                    </Button>
                  </form>
                </div>
                <p className="text-sm text-muted">
                  Not booked yet?{" "}
                  <Link to="/book" className="text-fg hover:text-accent">
                    Hold a place
                  </Link>
                  .
                </p>
              </div>
            )}
          </div>

          <div>
            <Kicker>Your camps</Kicker>
            <h2 className="mt-2 font-display text-4xl text-fg">What sits in here</h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">
              One login for every Hybrid week. Schedule, fuel, messages to your coach. Individual
              bookings and new destinations will use this same portal.
            </p>
            <ul className="mt-8 grid gap-3">
              {portalCamps.map((camp) => (
                <li key={camp.id} className="rounded-md bg-surface p-5 shadow-border">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
                    {camp.status === "open" ? "Live now" : "Opens with the booking"}
                  </p>
                  <p className="mt-2 font-display text-3xl text-fg">{camp.name}</p>
                  <p className="mt-1 text-sm text-muted">
                    {camp.place} · {camp.dates}
                  </p>
                </li>
              ))}
            </ul>
            {ready && !signedInPlayer ? (
              <div className="mt-8">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted">Preview</p>
                <div className="mt-3 grid gap-2">
                  {PLAYER_DEMOS.map((item) => (
                    <button
                      key={item.email}
                      type="button"
                      onClick={() => enter(item.email)}
                      className="rounded-sm bg-surface px-3 py-3 text-left text-sm shadow-border hover:shadow-border-hover"
                    >
                      <span className="block text-fg">{item.label}</span>
                      <span className="text-xs text-muted">{item.email}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </Container>
      </Section>
    </main>
  );
}
