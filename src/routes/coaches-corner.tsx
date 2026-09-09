import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { portalCamps } from "@/data/portals";
import {
  COACH_ALLOWLIST,
  COACH_EMAIL_MAP,
  COACH_OWNS,
  DRAFT_GRID_LABEL,
  DRAFT_GROUP_GRID,
  DRAFT_WEEKS,
  GROUP_SIZE_COPY,
  MAP_EDIT_NOTE,
  MAP_EMPTY_LABEL,
  MARK_OWNS,
  NOT_COACH,
  ROSTER_PLACEHOLDER,
  SESSION_HOURS_COPY,
  UNKNOWN_COACH_COPY,
  coachByEmail,
  dutiesFor,
  type CoachAllowlistEntry,
  type DraftGroup,
} from "@/data/coaches-corner";
import { GoogleSignInButton } from "@/components/site/google-sign-in";
import { Container, Display, Kicker, Section } from "@/components/site/section";
import { authEnabled, signOut } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import {
  clearCoachSession,
  isCoachPreview,
  readCoachSession,
  setCoachSession,
} from "@/lib/coach-session";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/coaches-corner")({
  head: () => ({
    meta: [
      { title: "Coaches Corner · Hybrid Vacations" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: CoachesCornerPage,
});

const GROUPS: DraftGroup[] = ["A", "B", "C"];

const COACH_PREVIEWS = [
  {
    email: "mark@hybridvacations.com",
    label: "Mark Garcia-Kidd",
    note: "Head coach · special privileges",
  },
  {
    email: "dave@hybridvacations.com",
    label: "Dave Panah",
    note: "Regular coach · Group C, weeks 2–3",
  },
] as const;

function CoachesCornerPage() {
  const { user, isPending } = useCurrentUserState();
  const [staffEmail, setStaffEmail] = useState<string | null>(null);
  const [previewing, setPreviewing] = useState(false);

  useEffect(() => {
    setStaffEmail(readCoachSession());
    setPreviewing(isCoachPreview());
  }, []);

  const email = staffEmail || user?.primaryEmail || null;
  const coach = coachByEmail(email);

  function enterPreview(address: string) {
    setCoachSession(address, true);
    setStaffEmail(address);
    setPreviewing(true);
  }

  function exitPreview() {
    clearCoachSession();
    setStaffEmail(null);
    setPreviewing(false);
    if (authEnabled && user) void signOut().catch(() => undefined);
  }

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
              Groups, duties, and the players in front of you. Sign in with Google, or preview as
              Mark or Dave. Lanzarote is live. Other camps will use this same corner when they run.
            </p>
            <div className="mt-8 rounded-md bg-surface p-6 shadow-border sm:p-8">
              {isPending ? (
                <p className="text-sm text-muted">Loading Coaches Corner.</p>
              ) : coach ? (
                <CoachHome
                  coach={coach}
                  email={email}
                  previewing={previewing}
                  onExitPreview={exitPreview}
                />
              ) : !user ? (
                <SignInPanel onPreview={enterPreview} />
              ) : (
                <UnknownEmail email={user.primaryEmail} onExit={exitPreview} />
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

function SignInPanel({ onPreview }: { onPreview: (email: string) => void }) {
  return (
    <div className="grid gap-6">
      {authEnabled ? (
        <GoogleSignInButton callbackURL="/coaches-corner" label="Sign in with Google" />
      ) : (
        <p className="text-sm text-muted">Google sign-in is disabled. Use preview below.</p>
      )}
      <div className="border-t border-border pt-6">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Preview</p>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Opens the staff desk as that coach. Not a real sign-in.
        </p>
        <div className="mt-3 grid gap-2">
          {COACH_PREVIEWS.map((item) => (
            <button
              key={item.email}
              type="button"
              onClick={() => onPreview(item.email)}
              className="rounded-sm bg-bg px-3 py-3 text-left text-sm shadow-border hover:shadow-border-hover"
            >
              <span className="block text-fg">{item.label}</span>
              <span className="text-xs text-muted">{item.note}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function UnknownEmail({
  email,
  onExit,
}: {
  email: string | null;
  onExit: () => void;
}) {
  return (
    <div>
      <p className="text-sm text-accent" role="status">
        {UNKNOWN_COACH_COPY}
      </p>
      {email ? <p className="mt-2 text-xs text-muted">{email}</p> : null}
      <button
        type="button"
        onClick={onExit}
        className="mt-6 text-sm text-muted hover:text-fg"
      >
        Sign out
      </button>
    </div>
  );
}

function CoachHome({
  coach,
  email,
  previewing,
  onExitPreview,
}: {
  coach: CoachAllowlistEntry;
  email: string | null;
  previewing: boolean;
  onExitPreview: () => void;
}) {
  const duties = dutiesFor(coach);

  return (
    <div className="grid gap-8">
      {previewing ? (
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
          Preview · {coach.shortName}
          {coach.id === "mark" ? " · head coach" : " · regular coach"}
        </p>
      ) : (
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">On staff</p>
      )}
      <div>
        <h2 className="font-display text-4xl text-fg">{coach.shortName}</h2>
        <p className="mt-1 text-sm text-muted">{coach.title}</p>
        {email ? <p className="mt-1 text-xs text-muted">{email}</p> : null}
        <p className="mt-4 text-sm text-muted">
          {GROUP_SIZE_COPY}. {SESSION_HOURS_COPY} on court.
        </p>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">You own</p>
        <ul className="mt-3 grid gap-2 text-sm leading-relaxed text-fg">
          {duties.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Coach owns</p>
          <ul className="mt-3 grid gap-2 text-sm leading-relaxed text-muted">
            {COACH_OWNS.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
            Not coach — route to Mark / ops
          </p>
          <ul className="mt-3 grid gap-2 text-sm leading-relaxed text-muted">
            {NOT_COACH.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          {coach.id !== "mark" ? (
            <ul className="mt-4 grid gap-2 text-sm leading-relaxed text-muted">
              {MARK_OWNS.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>

      <DraftGrid coach={coach} />

      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Roster</p>
        <p className="mt-3 text-sm leading-relaxed text-muted">{ROSTER_PLACEHOLDER}</p>
      </div>

      {coach.id === "mark" ? <StaffEmailMap /> : null}

      <button
        type="button"
        onClick={onExitPreview}
        className="justify-self-start text-sm text-muted hover:text-fg"
      >
        {previewing ? "Exit preview" : "Sign out"}
      </button>
    </div>
  );
}

function StaffEmailMap() {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Staff email map</p>
      <p className="mt-3 text-sm leading-relaxed text-muted">{MAP_EDIT_NOTE}</p>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[20rem] border-collapse text-left text-sm">
          <thead>
            <tr className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
              <th className="py-2 pr-3 font-semibold">Coach</th>
              <th className="py-2 pr-3 font-semibold">Kind</th>
              <th className="py-2 pr-3 font-semibold">Email</th>
            </tr>
          </thead>
          <tbody>
            {COACH_EMAIL_MAP.map((row, index) => {
              const coach = COACH_ALLOWLIST.find((item) => item.id === row.coachId);
              const filled = Boolean(row.email.trim());
              return (
                <tr key={`${row.coachId}-${row.kind}-${index}`} className="border-t border-border">
                  <td className="py-2 pr-3">{coach?.shortName ?? row.coachId}</td>
                  <td className="py-2 pr-3 text-muted">{row.kind}</td>
                  <td className="py-2 pr-3">{filled ? row.email : MAP_EMPTY_LABEL}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function DraftGrid({ coach }: { coach: CoachAllowlistEntry }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
        {DRAFT_GRID_LABEL}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        Dedicated coach stays with the group for all 9 sessions. Dave is Group C weeks 2–3 only.
      </p>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[20rem] border-collapse text-left text-sm">
          <thead>
            <tr className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
              <th className="py-2 pr-3 font-semibold">Week</th>
              {GROUPS.map((group) => (
                <th key={group} className="py-2 pr-3 font-semibold">
                  Group {group}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {DRAFT_WEEKS.map((week) => (
              <tr key={week.id} className="border-t border-border">
                <td className="py-3 pr-3 align-top">
                  <span className="block text-fg">{week.label}</span>
                  <span className="text-xs text-muted">{week.range}</span>
                </td>
                {GROUPS.map((group) => {
                  const cell = DRAFT_GROUP_GRID.find(
                    (item) => item.week === week.id && item.group === group,
                  );
                  const mine = Boolean(cell && cell.coachId === coach.id);
                  return (
                    <td key={group} className="py-3 pr-3 align-top">
                      <span
                        className={cn(
                          "inline-block rounded-sm px-2 py-1",
                          mine ? "bg-accent text-bg" : "bg-bg text-fg shadow-border",
                        )}
                      >
                        {cell?.label ?? "TBC"}
                        {cell?.note ? (
                          <span className={cn("ml-1 text-xs", mine ? "text-bg/80" : "text-muted")}>
                            ({cell.note})
                          </span>
                        ) : null}
                      </span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
