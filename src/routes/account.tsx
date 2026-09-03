import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { formatDistanceToNow } from "date-fns";
import { ArrowUpRight, CalendarDays, Tent, UserRound } from "lucide-react";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { authEnabled, signOut } from "@/lib/auth/client";
import { revokeTokens } from "@/lib/token-revocation";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Container, Display, Kicker, Section } from "@/components/site/section";
import {
  emptyMemberProfile,
  formatMemberDate,
  MEMBER_COUNTRIES,
  MEMBER_SIZES,
  MEMBER_SPORTS,
  memberCalendar,
  type MemberBooking,
  type MemberProfile,
  type MemberSport,
} from "@/data/member";
import { getMemberBookings, getMemberProfile, saveMemberProfile } from "@/lib/member-profile";
import { NoCampYet, PortalSignIn } from "@/components/site/portal-sign-in";
import { SizeGuideButton } from "@/components/site/size-guide";
import { useCamp } from "@/lib/camp-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title: "Member Dashboard · Hybrid Vacations" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: MemberDashboardPage,
});

function firstNameOf(profile: MemberProfile, displayName: string | null) {
  if (profile.firstName.trim()) return profile.firstName.trim();
  const fromSession = displayName?.trim().split(/\s+/)[0];
  return fromSession || "there";
}

function lastUpdatedLabel(iso: string | null) {
  if (!iso) return "Not saved yet.";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "Not saved yet.";
  return `Last updated ${formatDistanceToNow(date, { addSuffix: true })}.`;
}

function AccountSignIn() {
  const navigate = useNavigate();
  const login = useCamp((s) => s.login);
  const [noCamp, setNoCamp] = useState(false);

  return (
    <div className="grid gap-4">
      <PortalSignIn
        callbackURL="/account"
        onVerified={(address, hasBooking) => {
          if (!hasBooking) {
            setNoCamp(true);
            return;
          }
          login(address);
          navigate({ to: "/camp" });
        }}
      />
      {noCamp ? <NoCampYet /> : null}
    </div>
  );
}

function MemberDashboardPage() {
  const { user, isPending } = useCurrentUserState();
  const userId = user?.id ?? null;
  const userEmail = user?.primaryEmail ?? "";
  const userName = user?.displayName ?? "";
  const logoutCamp = useCamp((s) => s.logout);
  const loginCamp = useCamp((s) => s.login);
  const [profile, setProfile] = useState<MemberProfile | null>(null);
  const [bookings, setBookings] = useState<MemberBooking[]>([]);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    if (isPending || !userId) return;
    if (userEmail) loginCamp(userEmail);
    let active = true;
    void Promise.all([getMemberProfile(), getMemberBookings().catch(() => [] as MemberBooking[])])
      .then(([row, rows]) => {
        if (!active) return;
        const next = { ...row };
        if (!next.email && userEmail) next.email = userEmail;
        if (!next.firstName && userName) {
          const [first, ...rest] = userName.trim().split(/\s+/);
          next.firstName = first ?? "";
          next.lastName = next.lastName || rest.join(" ");
        }
        setProfile(next);
        setBookings(rows);
      })
      .catch(() => {
        if (active) setProfile(emptyMemberProfile(userEmail));
      });
    return () => {
      active = false;
    };
  }, [isPending, userId, userEmail, userName, loginCamp]);

  if (signingOut) {
    return (
      <main>
        <Section>
          <Container>
            <p className="text-sm text-muted">Signing out.</p>
          </Container>
        </Section>
      </main>
    );
  }

  if (isPending && !user) {
    return (
      <main>
        <Section>
          <Container>
            <Kicker>Member Dashboard</Kicker>
            <Display as="h1" className="mt-2 text-5xl sm:text-6xl">
              Hello. Sign in to come back.
            </Display>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted">Checking your session.</p>
            <div className="mt-8 max-w-3xl">
              <AccountSignIn />
            </div>
          </Container>
        </Section>
      </main>
    );
  }

  if (isPending) {
    return (
      <main>
        <Section>
          <Container>
            <p className="text-sm text-muted">Loading your dashboard.</p>
          </Container>
        </Section>
      </main>
    );
  }

  if (!user) {
    return (
      <main>
        <Section>
          <Container>
            <Kicker>Member Dashboard</Kicker>
            <Display as="h1" className="mt-2 text-5xl sm:text-6xl">
              Hello. Sign in to come back.
            </Display>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted">
              Manage your membership, book camps, and stay on top of upcoming Hybrid dates from one
              place.
            </p>
            <div className="mt-8 max-w-3xl">
              <AccountSignIn />
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              <DashCard
                icon={<Tent className="size-5" />}
                title="Camp booking"
                body="Hold a Lanzarote week, or pre-register for Tennis, Padel, and Golf. Deposit when you are ready."
                to="/book"
                label="Book a camp"
              />
              <DashCard
                icon={<UserRound className="size-5" />}
                title="Private coaching"
                body="1-to-1 through to a group of 8. Technical work, match prep, or a reset with a Hybrid coach."
                to="/community/coaching"
                label="Enquire"
              />
              <DashCard
                icon={<CalendarDays className="size-5" />}
                title="Calendar"
                body="Track upcoming camps, clinics, and squad dates in one timeline so you do not miss the week."
                to="#calendar"
                label="View dates"
              />
            </div>
          </Container>
        </Section>
        <CalendarBlock />
      </main>
    );
  }

  const form = profile ?? emptyMemberProfile(user.primaryEmail ?? "");
  const greeting = firstNameOf(form, user.displayName);
  const missingSports = form.sports.length === 0;
  const missingKit = !form.vestSize || !form.shortsSize;
  const actionNeeded = missingSports || missingKit;

  function setField<K extends keyof MemberProfile>(key: K, value: MemberProfile[K]) {
    setProfile((current) => ({ ...(current ?? emptyMemberProfile()), [key]: value }));
    setSaved(false);
  }

  function toggleSport(value: MemberSport) {
    setProfile((current) => {
      const next = current ?? emptyMemberProfile();
      const sports = next.sports.includes(value)
        ? next.sports.filter((item) => item !== value)
        : [...next.sports, value];
      return { ...next, sports };
    });
    setSaved(false);
  }

  async function onSave(event: FormEvent) {
    event.preventDefault();
    setError("");
    setSaving(true);
    try {
      const savedProfile = await saveMemberProfile({
        data: {
          firstName: form.firstName,
          lastName: form.lastName,
          phone: form.phone,
          addressLine: form.addressLine,
          city: form.city,
          postcode: form.postcode,
          country: form.country,
          emergencyFirstName: form.emergencyFirstName,
          emergencyLastName: form.emergencyLastName,
          emergencyPhone: form.emergencyPhone,
          emergencyEmail: form.emergencyEmail,
          medical: form.medical,
          dietary: form.dietary,
          ukbt: form.ukbt,
          vestSize: form.vestSize,
          shortsSize: form.shortsSize,
          sports: form.sports,
        },
      });
      setProfile(savedProfile);
      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save just now.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main>
      <Section>
        <Container>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <Kicker>Member Dashboard</Kicker>
              <Display as="h1" className="mt-2 text-5xl sm:text-6xl">
                Hello {greeting}, welcome back.
              </Display>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted">
                Book camps, keep your details current, and open the Player Portal when a week is yours.
              </p>
            </div>
            {authEnabled ? (
              <div className="grid gap-2 sm:justify-items-end">
                <Button
                  type="button"
                  variant="secondary"
                  disabled={signingOut}
                  onClick={() => {
                    setSigningOut(true);
                    setError("");
                    logoutCamp();
                    void revokeTokens({ data: { scope: "this" } })
                      .catch(() => undefined)
                      .then(() => signOut("/account"))
                      .catch((err: unknown) => {
                        setSigningOut(false);
                        setError(
                          err instanceof Error
                            ? err.message
                            : "Sign-out did not finish. Try again.",
                        );
                      });
                  }}
                >
                  {signingOut ? "Signing out…" : "Sign out"}
                </Button>
                <button
                  type="button"
                  disabled={signingOut}
                  className="text-sm text-muted hover:text-fg"
                  onClick={() => {
                    setSigningOut(true);
                    setError("");
                    logoutCamp();
                    void revokeTokens({ data: { scope: "all" } })
                      .catch(() => undefined)
                      .then(() => signOut("/account"))
                      .catch((err: unknown) => {
                        setSigningOut(false);
                        setError(
                          err instanceof Error
                            ? err.message
                            : "Could not sign out everywhere. Try again.",
                        );
                      });
                  }}
                >
                  Sign out everywhere
                </button>
                {error && !saving ? <p className="text-sm text-accent">{error}</p> : null}
              </div>
            ) : null}
          </div>

          {actionNeeded ? (
            <div className="mt-8 rounded-md border border-accent/40 bg-surface px-5 py-4">
              <p className="text-xs font-semibold tracking-widest text-accent uppercase">Action required</p>
              <p className="mt-2 text-sm text-fg">
                {missingSports
                  ? "Please update your preferred sport(s) from your account details."
                  : "Add your vest and shorts sizes so camp kit is ready."}
              </p>
              <a href="#details" className="mt-3 inline-flex min-h-11 items-center text-sm font-semibold text-accent hover:text-accent-hover">
                Update your details
              </a>
            </div>
          ) : null}

          <div className="mt-10">
            <p className="text-xs font-semibold tracking-widest text-muted uppercase">Your packages</p>
            {bookings.length ? (
              <ul className="mt-4 divide-y divide-border border-y border-border">
                {bookings.map((booking) => (
                  <li key={booking.id}>
                    <Link
                      to={booking.href}
                      className="flex flex-col gap-2 py-5 sm:flex-row sm:items-center sm:justify-between sm:gap-8"
                    >
                      <span>
                        <span className="block font-display text-3xl text-fg">{booking.title}</span>
                        <span className="mt-1 block text-sm text-muted">{booking.detail}</span>
                      </span>
                      <span className="inline-flex min-h-11 items-center text-sm font-semibold uppercase tracking-wide text-accent">
                        {booking.kind === "camp" ? "Open player portal" : "Open"}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="mt-3">
                <NoCampYet />
              </div>
            )}
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <DashCard
              icon={<Tent className="size-5" />}
              title="Camp booking"
              body="Hold a Lanzarote week, or pre-register for Tennis, Padel, and Golf. Deposit when you are ready."
              to="/book"
              label="Book a camp"
            />
            <DashCard
              icon={<UserRound className="size-5" />}
              title="Private coaching"
              body="1-to-1 through to a group of 8. Technical work, match prep, or a reset with a Hybrid coach."
              to="/community/coaching"
              label="Enquire"
            />
            <DashCard
              icon={<CalendarDays className="size-5" />}
              title="Calendar"
              body="Track upcoming camps, clinics, and squad dates in one timeline so you do not miss the week."
              to="#calendar"
              label="View dates"
            />
          </div>
        </Container>
      </Section>

      <Section id="details" className="scroll-mt-24 bg-surface">
        <Container>
          <Kicker>Your details</Kicker>
          <Display className="mt-2 text-5xl">Keep the record accurate</Display>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted">
            Event communication, emergency contact, kit sizes, and membership records sit here.
          </p>
          <p className="mt-2 text-xs text-muted">{lastUpdatedLabel(form.updatedAt)}</p>

          <form className="mt-10 max-w-4xl space-y-10" onSubmit={(event) => void onSave(event)}>
            <fieldset>
              <legend className="font-display text-3xl text-fg">Contact and address</legend>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <Field label="First name" htmlFor="firstName">
                  <Input id="firstName" value={form.firstName} onChange={(e) => setField("firstName", e.target.value)} required />
                </Field>
                <Field label="Last name" htmlFor="lastName">
                  <Input id="lastName" value={form.lastName} onChange={(e) => setField("lastName", e.target.value)} required />
                </Field>
                <Field label="Contact number" htmlFor="phone">
                  <Input id="phone" value={form.phone} onChange={(e) => setField("phone", e.target.value)} inputMode="tel" />
                </Field>
                <Field label="Email" htmlFor="email">
                  <Input id="email" value={form.email || user.primaryEmail || ""} readOnly />
                </Field>
                <Field label="Address" htmlFor="addressLine" className="sm:col-span-2">
                  <Input id="addressLine" value={form.addressLine} onChange={(e) => setField("addressLine", e.target.value)} />
                </Field>
                <Field label="City" htmlFor="city">
                  <Input id="city" value={form.city} onChange={(e) => setField("city", e.target.value)} />
                </Field>
                <Field label="Postcode" htmlFor="postcode">
                  <Input id="postcode" value={form.postcode} onChange={(e) => setField("postcode", e.target.value)} />
                </Field>
                <Field label="Country" htmlFor="country" className="sm:col-span-2">
                  <select
                    id="country"
                    value={form.country}
                    onChange={(e) => setField("country", e.target.value)}
                    className="h-11 w-full rounded-sm border border-border bg-surface px-3 text-sm text-fg outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  >
                    {MEMBER_COUNTRIES.map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>
            </fieldset>

            <fieldset>
              <legend className="font-display text-3xl text-fg">Emergency contact</legend>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <Field label="First name" htmlFor="emergencyFirstName">
                  <Input id="emergencyFirstName" value={form.emergencyFirstName} onChange={(e) => setField("emergencyFirstName", e.target.value)} />
                </Field>
                <Field label="Last name" htmlFor="emergencyLastName">
                  <Input id="emergencyLastName" value={form.emergencyLastName} onChange={(e) => setField("emergencyLastName", e.target.value)} />
                </Field>
                <Field label="Phone number" htmlFor="emergencyPhone">
                  <Input id="emergencyPhone" value={form.emergencyPhone} onChange={(e) => setField("emergencyPhone", e.target.value)} inputMode="tel" />
                </Field>
                <Field label="Email" htmlFor="emergencyEmail">
                  <Input id="emergencyEmail" type="email" value={form.emergencyEmail} onChange={(e) => setField("emergencyEmail", e.target.value)} />
                </Field>
              </div>
            </fieldset>

            <fieldset>
              <legend className="font-display text-3xl text-fg">Medical and dietary</legend>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <Field label="Medical conditions" htmlFor="medical">
                  <Textarea id="medical" rows={4} value={form.medical} onChange={(e) => setField("medical", e.target.value)} />
                </Field>
                <Field label="Dietary requirements" htmlFor="dietary">
                  <Textarea id="dietary" rows={4} value={form.dietary} onChange={(e) => setField("dietary", e.target.value)} />
                </Field>
              </div>
            </fieldset>

            <fieldset>
              <legend className="font-display text-3xl text-fg">Sport and kit</legend>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <Field label="UKBT number" htmlFor="ukbt">
                  <Input id="ukbt" value={form.ukbt} onChange={(e) => setField("ukbt", e.target.value)} />
                </Field>
                <div className="sm:col-span-2">
                  <p className="mb-1.5 text-xs font-medium tracking-wider text-muted uppercase">Preferred sports</p>
                  <div className="flex flex-wrap gap-2">
                    {MEMBER_SPORTS.map((sport) => {
                      const on = form.sports.includes(sport.value);
                      return (
                        <button
                          key={sport.value}
                          type="button"
                          onClick={() => toggleSport(sport.value)}
                          className={cn(
                            "min-h-11 rounded-sm border px-4 text-sm",
                            on
                              ? "border-accent bg-accent text-accent-fg"
                              : "border-border bg-bg text-fg hover:border-accent",
                          )}
                        >
                          {sport.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <Field label="Vest size" htmlFor="vestSize" guide>
                  <select
                    id="vestSize"
                    value={form.vestSize}
                    onChange={(e) => setField("vestSize", e.target.value)}
                    className="h-11 w-full rounded-sm border border-border bg-surface px-3 text-sm text-fg outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  >
                    <option value="">Select</option>
                    {MEMBER_SIZES.map((size) => (
                      <option key={size.value} value={size.value}>
                        {size.label}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Shorts size" htmlFor="shortsSize" guide>
                  <select
                    id="shortsSize"
                    value={form.shortsSize}
                    onChange={(e) => setField("shortsSize", e.target.value)}
                    className="h-11 w-full rounded-sm border border-border bg-surface px-3 text-sm text-fg outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  >
                    <option value="">Select</option>
                    {MEMBER_SIZES.map((size) => (
                      <option key={size.value} value={size.value}>
                        {size.label}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>
            </fieldset>

            {error ? <p className="text-sm text-accent">{error}</p> : null}
            {saved ? <p className="text-sm text-fg">Saved.</p> : null}
            <Button type="submit" disabled={saving}>
              {saving ? "Saving…" : "Save details"}
            </Button>
          </form>
        </Container>
      </Section>

      <CalendarBlock />
    </main>
  );
}

function CalendarBlock() {
  const today = new Date().toISOString().slice(0, 10);
  const items = memberCalendar().filter((item) => item.date >= today);
  return (
    <Section id="calendar" className="scroll-mt-24">
      <Container>
        <Kicker>Calendar</Kicker>
        <Display className="mt-2 text-5xl">Upcoming Hybrid dates</Display>
        <ul className="mt-10 divide-y divide-border border-y border-border">
          {items.map((item) => (
            <li key={`${item.date}-${item.title}`}>
              <Link
                to={item.href}
                className="flex flex-col gap-1 py-5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8"
              >
                <span className="text-xs font-semibold tracking-widest text-muted uppercase">
                  {formatMemberDate(item.date)}
                </span>
                <span className="flex-1">
                  <span className="block text-sm font-semibold text-fg">{item.title}</span>
                  <span className="mt-1 block text-sm text-muted">{item.place}</span>
                </span>
                <ArrowUpRight className="hidden size-4 text-muted sm:block" />
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}

function Field({
  label,
  htmlFor,
  className,
  guide,
  children,
}: {
  label: string;
  htmlFor: string;
  className?: string;
  guide?: boolean;
  children: ReactNode;
}) {
  return (
    <div className={className}>
      <div className="mb-1.5 flex flex-wrap items-center justify-between gap-x-4">
        <Label htmlFor={htmlFor} className="mb-0">
          {label}
        </Label>
        {guide ? <SizeGuideButton className="min-h-0 py-1" /> : null}
      </div>
      {children}
    </div>
  );
}

function DashCard({
  icon,
  title,
  body,
  to,
  label,
}: {
  icon: ReactNode;
  title: string;
  body: string;
  to: "/book" | "/community/coaching" | "#calendar";
  label: string;
}) {
  const className = "flex h-full flex-col rounded-md bg-surface p-6 shadow-border";
  const inner = (
    <>
      <span className="text-accent">{icon}</span>
      <h2 className="mt-4 font-display text-3xl text-fg">{title}</h2>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{body}</p>
      <span className="mt-6 inline-flex min-h-11 items-center text-sm font-semibold uppercase tracking-wide text-accent">
        {label}
      </span>
    </>
  );
  if (to === "#calendar") {
    return (
      <a href={to} className={className}>
        {inner}
      </a>
    );
  }
  return (
    <Link to={to} className={className}>
      {inner}
    </Link>
  );
}
