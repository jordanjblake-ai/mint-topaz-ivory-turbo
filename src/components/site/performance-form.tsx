import { useEffect, useRef, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { UserButton } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import {
  getPerformanceApplication,
  savePerformanceApplication,
} from "@/lib/performance-application";
import {
  CAMP_WEEKS,
  COACHING_FORMATS,
  FORM_SPORTS,
  PERFORMANCE_GENDERS,
  PERFORMANCE_SIZES,
  defaultLevelForSport,
  defaultTopForSport,
  forcedSportFromInterest,
  isIntlPhone,
  isLevelForSport,
  labelOf,
  levelsForSport,
  maleTopForSport,
  partnerFirstNameLabel,
  partnerFullName,
  partnerLastNameLabel,
  partnerLegend,
  splitDisplayName,
  sportFromInterest,
  topsForSport,
  type FormSport,
  type PerformanceApplication,
  type PerformanceGender,
  type PerformanceLevel,
  type PerformanceSize,
  type PerformanceTop,
} from "@/data/performance";
import { enquireInterests, site } from "@/data/site";
import { kindFromInterest } from "@/data/ops";
import { GoogleSignInButton } from "@/components/site/google-sign-in";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { allowAttempt, isEmail } from "@/lib/guard";
import { submitEnquiry } from "@/lib/enquiry";
import { useOps } from "@/lib/ops-store";
import { cn } from "@/lib/utils";

const selectClass =
  "h-11 w-full rounded-sm border border-border bg-surface px-3 text-sm text-fg outline-none focus-visible:ring-2 focus-visible:ring-accent";

function Choice({
  active,
  children,
  onClick,
  disabled,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "inline-flex min-h-11 items-center justify-center rounded-sm px-4 text-sm shadow-border",
        active ? "bg-accent text-accent-fg" : "bg-surface text-fg hover:shadow-border-hover",
        disabled && "cursor-not-allowed opacity-50",
      )}
    >
      {children}
    </button>
  );
}

function emptyForm(seed?: Partial<PerformanceApplication>, interest = "performance"): PerformanceApplication {
  const forced = forcedSportFromInterest(interest);
  const sport = forced ?? seed?.sport ?? sportFromInterest(interest);
  const gender = seed?.gender ?? "male";
  const level =
    seed?.level && isLevelForSport(sport, seed.level) ? seed.level : defaultLevelForSport(sport);
  const allowedTops = topsForSport(sport).map((item) => item.value);
  const topStyle =
    seed?.topStyle && allowedTops.includes(seed.topStyle)
      ? seed.topStyle
      : defaultTopForSport(sport, gender);
  return {
    firstName: seed?.firstName ?? "",
    lastName: seed?.lastName ?? "",
    email: seed?.email ?? "",
    contactPhone: seed?.contactPhone ?? "",
    sport,
    gender,
    level,
    topStyle: gender === "male" ? maleTopForSport(sport) : topStyle,
    topSize: seed?.topSize ?? "M",
    hasPartner: seed?.hasPartner ?? false,
    partnerFirstName: seed?.partnerFirstName ?? "",
    partnerLastName: seed?.partnerLastName ?? "",
    emergencyFirstName: seed?.emergencyFirstName ?? "",
    emergencyLastName: seed?.emergencyLastName ?? "",
    emergencyPhone: seed?.emergencyPhone ?? "",
    message: seed?.message ?? "",
  };
}

export function PlayerDetailsForm({
  interest,
  submitLabel,
}: {
  interest: string;
  submitLabel: string;
}) {
  const addEnquiry = useOps((s) => s.addEnquiry);
  const hydrate = useOps((s) => s.hydrate);
  const { user, isPending } = useCurrentUserState();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [form, setForm] = useState<PerformanceApplication>(() => emptyForm(undefined, interest));
  const [week, setWeek] = useState("");
  const [format, setFormat] = useState("private");
  const [accepted, setAccepted] = useState(false);
  const [company, setCompany] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const loadedAt = useRef(Date.now());
  const minimal = interest === "other" || interest === "travel";
  const showSport = !minimal && interest !== "performance";
  const impliedSport = forcedSportFromInterest(interest);
  const showSessionType = interest === "coaching";
  const groupKit = form.gender === "group";
  const showPlayerKit = !minimal && !groupKit;
  const showProfile = !minimal;

  useEffect(() => {
    setForm((current) => emptyForm(current, interest));
    setWeek("");
    setFormat("private");
  }, [interest]);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (isPending) return;
    if (!user) {
      setLoaded(true);
      return;
    }
    const fromGoogle = splitDisplayName(user.displayName, user.primaryEmail);
    void getPerformanceApplication()
      .then((saved) => {
        if (saved) {
          setForm(
            emptyForm(
              {
                ...saved,
                firstName: saved.firstName || fromGoogle.firstName,
                lastName: saved.lastName || fromGoogle.lastName,
                email: user.primaryEmail ?? saved.email,
              },
              interest,
            ),
          );
        } else {
          setForm((current) =>
            emptyForm(
              {
                ...current,
                firstName: current.firstName || fromGoogle.firstName,
                lastName: current.lastName || fromGoogle.lastName,
                email: user.primaryEmail ?? current.email,
              },
              interest,
            ),
          );
        }
      })
      .catch(() => {
        setForm((current) =>
          emptyForm(
            {
              ...current,
              firstName: current.firstName || fromGoogle.firstName,
              lastName: current.lastName || fromGoogle.lastName,
              email: user.primaryEmail ?? current.email,
            },
            interest,
          ),
        );
      })
      .finally(() => setLoaded(true));
  }, [user, isPending, interest]);

  function patch<K extends keyof PerformanceApplication>(key: K, value: PerformanceApplication[K]) {
    setForm((current) => {
      const next = { ...current, [key]: value };
      if (key === "hasPartner" && value === false) {
        next.partnerFirstName = "";
        next.partnerLastName = "";
      }
      const sport = (key === "sport" ? value : next.sport) as FormSport;
      const gender = (key === "gender" ? value : next.gender) as PerformanceGender;
      if (key === "sport" && !isLevelForSport(sport, next.level)) {
        next.level = defaultLevelForSport(sport);
      }
      if (key === "sport" || key === "gender") {
        const allowed = topsForSport(sport).map((item) => item.value);
        if (gender === "male" || !allowed.includes(next.topStyle)) {
          next.topStyle = defaultTopForSport(sport, gender);
        }
      }
      return next;
    });
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    if (!form.firstName.trim() || !form.lastName.trim()) {
      setError("First Name and Last Name are required.");
      return;
    }
    if (!isEmail(form.email)) {
      setError("That email does not look right.");
      return;
    }
    if (form.contactPhone.trim() && !isIntlPhone(form.contactPhone)) {
      setError("Use an international contact number, e.g. UK +44 or SUI +41.");
      return;
    }
    if (!minimal && !groupKit) {
      if (form.hasPartner && (!form.partnerFirstName.trim() || !form.partnerLastName.trim())) {
        setError(`Add ${partnerFirstNameLabel(form.sport)} and Last Name, or choose No.`);
        return;
      }
      if (!form.emergencyFirstName.trim() || !form.emergencyLastName.trim()) {
        setError("Emergency contact First Name and Last Name are required.");
        return;
      }
      if (!isIntlPhone(form.emergencyPhone)) {
        setError("Use an international phone number, e.g. UK +44 or SUI +41.");
        return;
      }
    }
    if (!accepted) {
      setError("Please confirm you have read the Terms and Privacy Policy.");
      return;
    }
    if (company.trim() || Date.now() - loadedAt.current < 900) {
      setSent(true);
      return;
    }
    if (!allowAttempt("player-form", 6, 60_000)) {
      setError("Too many submissions just now. Wait a minute and try again.");
      return;
    }

    setBusy(true);
    const details = (minimal ? "minimal" : groupKit ? "group" : "full") as
      | "minimal"
      | "group"
      | "full";
    const payload = {
      ...form,
      details,
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim(),
      contactPhone: form.contactPhone.trim(),
      sport: impliedSport ?? form.sport,
      topStyle: form.gender === "male" ? maleTopForSport(form.sport) : form.topStyle,
      partnerFirstName: form.hasPartner ? form.partnerFirstName.trim() : "",
      partnerLastName: form.hasPartner ? form.partnerLastName.trim() : "",
      emergencyFirstName: form.emergencyFirstName.trim(),
      emergencyLastName: form.emergencyLastName.trim(),
      emergencyPhone: form.emergencyPhone.trim(),
      message: form.message.trim(),
    };

    try {
      if (user) {
        try {
          await savePerformanceApplication({ data: payload });
        } catch {
          /* still send the enquiry email */
        }
      }

      const interestLabel =
        enquireInterests.find((item) => item.value === interest)?.label ?? interest;
      const sportLabel = labelOf(FORM_SPORTS, payload.sport);
      const weekLabel = CAMP_WEEKS.find((item) => item.value === week)?.label ?? "";
      const formatLabel = COACHING_FORMATS.find((item) => item.value === format)?.label ?? "";
      const kind = kindFromInterest(interest, interest === "coaching" ? format : undefined, payload.gender);
      const extraLines = minimal
        ? [
            interestLabel,
            payload.contactPhone ? `Contact Number: ${payload.contactPhone}` : "",
            payload.message,
          ]
        : [
            interestLabel,
            `Sport: ${sportLabel}`,
            `Gender: ${labelOf(PERFORMANCE_GENDERS, payload.gender)}`,
            `Level: ${labelOf(levelsForSport(payload.sport), payload.level)}`,
            payload.contactPhone ? `Contact Number: ${payload.contactPhone}` : "",
            showPlayerKit
              ? `Playing Top: ${labelOf(topsForSport(payload.sport), payload.topStyle)} / ${labelOf(PERFORMANCE_SIZES, payload.topSize)}`
              : "",
            showPlayerKit
              ? `${partnerLegend(payload.sport)}: ${payload.hasPartner ? partnerFullName(payload.partnerFirstName, payload.partnerLastName) : "No"}`
              : "",
            showPlayerKit
              ? `Emergency: ${payload.emergencyFirstName} ${payload.emergencyLastName} ${payload.emergencyPhone}`
              : "",
            showSessionType && formatLabel ? `Session Type: ${formatLabel}` : "",
            weekLabel ? `Week: ${weekLabel}` : "",
            payload.message,
          ];

      addEnquiry({
        name: `${payload.firstName} ${payload.lastName}`,
        email: payload.email,
        kind,
        week: (week || "") as "" | "week-1" | "week-2" | "week-3",
        partySize: payload.hasPartner && showPlayerKit ? 2 : 1,
        solo: !(payload.hasPartner && showPlayerKit),
        stay: "",
        message: extraLines.filter(Boolean).join("\n"),
        source: "site",
      });

      const subject = `Hybrid Enquiry: ${interestLabel}`;
      const body = [
        `Name: ${payload.firstName} ${payload.lastName}`,
        `Email: ${payload.email}`,
        ...extraLines.filter((line) => line && line !== payload.message),
        "",
        payload.message || "(no extra message)",
      ].join("\n");

      const mailed = await submitEnquiry({
        data: {
          name: `${payload.firstName} ${payload.lastName}`,
          email: payload.email,
          subject,
          body,
          company,
        },
      });

      if (mailed.status !== "sent") {
        window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      }
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "That form did not send.");
    } finally {
      setBusy(false);
    }
  }

  if (sent) {
    return (
      <div className="rounded-md bg-surface p-6 shadow-border">
        <p className="font-display text-3xl text-fg">We have the details</p>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          {user
            ? "Saved to your account, so you will not have to fill this in again. We will come back with a clear next step."
            : `Sent to ${site.email}. We will come back with a clear next step.`}
        </p>
      </div>
    );
  }

  const callbackURL = `${pathname}?interest=${encodeURIComponent(interest)}`;
  const topLocked = form.gender === "male";
  const levelOptions = levelsForSport(form.sport);
  const partnerTitle = partnerLegend(form.sport);
  const topOptions = topsForSport(form.sport);

  return (
    <form onSubmit={onSubmit} className="grid gap-5">
      <div className="rounded-md bg-surface p-4 shadow-border">
        {isPending ? (
          <div className="h-11 w-full animate-pulse rounded-sm bg-bg" />
        ) : user ? (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm leading-relaxed text-muted">
              Signed in. We will keep this on your account for next time.
            </p>
            <UserButton />
          </div>
        ) : (
          <div className="grid gap-3">
            <p className="text-sm leading-relaxed text-muted">
              Sign in with Google to save your details.
            </p>
            <GoogleSignInButton
              callbackURL={callbackURL}
              label="Sign In With Google"
              variant="secondary"
            />
          </div>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="pc-first">First Name *</Label>
          <Input
            id="pc-first"
            value={form.firstName}
            onChange={(e) => patch("firstName", e.target.value)}
            autoComplete="given-name"
            required
          />
        </div>
        <div>
          <Label htmlFor="pc-last">Last Name *</Label>
          <Input
            id="pc-last"
            value={form.lastName}
            onChange={(e) => patch("lastName", e.target.value)}
            autoComplete="family-name"
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="pc-email">Email *</Label>
        <Input
          id="pc-email"
          type="email"
          value={form.email}
          onChange={(e) => patch("email", e.target.value)}
          autoComplete="email"
          readOnly={Boolean(user?.primaryEmail)}
          required
        />
      </div>

      <div>
        <Label htmlFor="pc-phone">Contact Number</Label>
        <Input
          id="pc-phone"
          type="tel"
          inputMode="tel"
          value={form.contactPhone}
          onChange={(e) => patch("contactPhone", e.target.value)}
          placeholder="+44..."
          autoComplete="tel"
        />
        <p className="mt-2 text-xs leading-relaxed text-muted">
          Optional. Include the international code, e.g. UK +44, SUI +41.
        </p>
      </div>

      {showSport ? (
        <fieldset>
          <legend className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted">
            Sport *
          </legend>
          <div className="flex flex-wrap gap-2">
            {FORM_SPORTS.map((item) => (
              <Choice
                key={item.value}
                active={form.sport === item.value}
                onClick={() => patch("sport", item.value)}
              >
                {item.label}
              </Choice>
            ))}
          </div>
        </fieldset>
      ) : null}

      {showProfile ? (
        <fieldset>
          <legend className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted">
            Male, Female Or Group *
          </legend>
          <div className="flex flex-wrap gap-2">
            {PERFORMANCE_GENDERS.map((item) => (
              <Choice
                key={item.value}
                active={form.gender === item.value}
                onClick={() => patch("gender", item.value as PerformanceGender)}
              >
                {item.label}
              </Choice>
            ))}
          </div>
        </fieldset>
      ) : null}

      {showProfile ? (
        <div>
          <Label htmlFor="pc-level">Level *</Label>
          <select
            id="pc-level"
            value={form.level}
            onChange={(e) => patch("level", e.target.value as PerformanceLevel)}
            className={selectClass}
            required
          >
            {levelOptions.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
      ) : null}

      {showSessionType ? (
        <div>
          <Label htmlFor="pc-format">Session Type *</Label>
          <select
            id="pc-format"
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            className={selectClass}
          >
            {COACHING_FORMATS.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
      ) : null}

      {interest === "lanzarote" ? (
        <div>
          <Label htmlFor="pc-week">Preferred Week</Label>
          <select
            id="pc-week"
            value={week}
            onChange={(e) => setWeek(e.target.value)}
            className={selectClass}
          >
            {CAMP_WEEKS.map((item) => (
              <option key={item.value || "unsure"} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
      ) : null}

      {showPlayerKit ? (
        <>
          <fieldset>
            <legend className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted">
              Playing Top Preference *
            </legend>
            <div className="flex flex-wrap gap-2">
              {topOptions.map((item) => (
                <Choice
                  key={item.value}
                  active={form.topStyle === item.value}
                  disabled={topLocked && item.value !== maleTopForSport(form.sport)}
                  onClick={() => patch("topStyle", item.value as PerformanceTop)}
                >
                  {item.label}
                </Choice>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted">
              Size *
            </legend>
            <div className="flex flex-wrap gap-2">
              {PERFORMANCE_SIZES.map((item) => (
                <Choice
                  key={item.value}
                  active={form.topSize === item.value}
                  onClick={() => patch("topSize", item.value as PerformanceSize)}
                >
                  {item.label}
                </Choice>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted">
              {partnerTitle} *
            </legend>
            <div className="flex flex-wrap gap-2">
              <Choice active={form.hasPartner} onClick={() => patch("hasPartner", true)}>
                Yes
              </Choice>
              <Choice active={!form.hasPartner} onClick={() => patch("hasPartner", false)}>
                No
              </Choice>
            </div>
          </fieldset>

          {form.hasPartner ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="pc-partner-first">{partnerFirstNameLabel(form.sport)} *</Label>
                <Input
                  id="pc-partner-first"
                  value={form.partnerFirstName}
                  onChange={(e) => patch("partnerFirstName", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="pc-partner-last">{partnerLastNameLabel(form.sport)} *</Label>
                <Input
                  id="pc-partner-last"
                  value={form.partnerLastName}
                  onChange={(e) => patch("partnerLastName", e.target.value)}
                  required
                />
              </div>
            </div>
          ) : null}

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="pc-em-first">Emergency Contact's First Name *</Label>
              <Input
                id="pc-em-first"
                value={form.emergencyFirstName}
                onChange={(e) => patch("emergencyFirstName", e.target.value)}
                autoComplete="off"
                required
              />
            </div>
            <div>
              <Label htmlFor="pc-em-last">Emergency Contact's Last Name *</Label>
              <Input
                id="pc-em-last"
                value={form.emergencyLastName}
                onChange={(e) => patch("emergencyLastName", e.target.value)}
                autoComplete="off"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="pc-em-phone">Emergency Contact's Phone Number *</Label>
            <Input
              id="pc-em-phone"
              type="tel"
              inputMode="tel"
              value={form.emergencyPhone}
              onChange={(e) => patch("emergencyPhone", e.target.value)}
              placeholder="+44..."
              autoComplete="off"
              required
            />
            <p className="mt-2 text-xs leading-relaxed text-muted">
              Include the international code, e.g. UK +44, SUI +41.
            </p>
          </div>
        </>
      ) : null}

      <div>
        <Label htmlFor="pc-message">Anything We Should Know</Label>
        <Textarea
          id="pc-message"
          value={form.message}
          onChange={(e) => patch("message", e.target.value)}
          placeholder="Club, recent results, or anything else we should know..."
          maxLength={1500}
        />
      </div>

      <div aria-hidden className="hidden">
        <Label htmlFor="pc-company">Company</Label>
        <Input
          id="pc-company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {error ? <p className="text-sm text-accent">{error}</p> : null}

      <label className="flex items-start gap-3 text-sm leading-relaxed text-muted">
        <input
          type="checkbox"
          checked={accepted}
          onChange={(e) => setAccepted(e.target.checked)}
          className="mt-1 size-4 shrink-0 accent-accent"
        />
        <span>
          I have read the{" "}
          <Link to="/terms" className="text-fg hover:text-accent">
            Terms & Conditions
          </Link>{" "}
          and{" "}
          <Link to="/privacy" className="text-fg hover:text-accent">
            Privacy Policy
          </Link>
          .
        </span>
      </label>

      <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={busy || !loaded}>
        {busy ? "Sending…" : submitLabel}
      </Button>
    </form>
  );
}

export function PerformanceClubForm() {
  return <PlayerDetailsForm interest="performance" submitLabel="Ask To Be Considered" />;
}
