import { createFileRoute } from "@tanstack/react-router";
import { IcalButton } from "@/components/camp/ical-button";
import { TournamentRsvpButtons } from "@/components/camp/tournament-rsvp";
import {
  CAMP_WEEKS,
  DAYS,
  EVENTS,
  PEOPLE,
  groupById,
  groupOf,
  type CampEvent,
  type CampPerson,
  type GroupMap,
  type WeekGroupMap,
} from "@/data/camp";
import { googleUrl } from "@/lib/camp-ics";
import { useCamp, type TournamentRsvp, type TournamentRsvpBook } from "@/lib/camp-store";

export const Route = createFileRoute("/camp/tournaments")({
  head: () => ({
    meta: [
      { title: "Tournaments · Lanzarote camp" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: TournamentsPage,
});

const TOURNAMENT_COPY: Record<string, string[]> = {
  "Scramble tournament": [
    "Monday, after session 2. Fun and connection, first night on the sand.",
    "Everyone is randomly paired so you meet campers outside your group. One game might be mixed. The next might be single gender.",
    "You might play on a women's or mixed-height net, or a men's height net. Our coaches run it. Come even if you are tired. Say yes if you want a name on a team, maybe if you will see how the body feels after the afternoon.",
  ],
  "Camp tournament": [
    "Friday, after session 9. The Hybrid week tournament.",
    "This is the one the week is built towards. Draws are set from who said yes, so our coaches can keep levels honest and not guess on the day.",
    "Then the awards and party that evening. Play it if you can. Maybe is fine if you want the week to end a little quieter.",
  ],
  "Optional local tournament": [
    "Saturday free day. Organised by Playa Grande Volley. Optional. Not a Hybrid event.",
    "A local day on the same courts if you still want matches after the week. Hybrid is the contact if you play. Our coaches will point you the right way.",
    "The window is the whole day. Say yes if you want a place held, maybe if it depends on travel or how Friday felt.",
  ],
};

const HYBRID_RULES: { title: string; body: string }[] = [
  {
    title: "Random pairs",
    body: "The scramble is about meeting the rest of camp. You are randomly paired. You do not shop for a partner on the day.",
  },
  {
    title: "Mixed, then maybe not",
    body: "One scramble game might be mixed. The next might be women's or men's. Nets can be women's or mixed height, or men's height. Fun and connection first.",
  },
  {
    title: "Our coaches set the teams",
    body: "Friday draws come from who said yes, so levels stay honest and new people are not left standing. Our coaches run both Hybrid events.",
  },
  {
    title: "Monday is scramble. Friday is the week.",
    body: "Monday is social, random, and about the people. Friday is the Hybrid camp tournament. Saturday is Playa Grande Volley. Their event, their rules.",
  },
  {
    title: "Format is called on the sand",
    body: "Pools, time caps, first-to. It depends who is standing there. Our coaches will say the shape once numbers are in. Do not turn up expecting a full FIVB draw in 90 minutes.",
  },
  {
    title: "If you are hurt, sit",
    body: "Tell your coach. A maybe or a no is better than a second ankle. We would rather a smaller draw than someone playing through something that needs a note.",
  },
];

const RSVP_ORDER: Record<string, number> = { yes: 0, maybe: 1, no: 2 };

function tournamentsFor(weeks: number[]) {
  const allow = new Set(weeks);
  return EVENTS.filter((event) => event.kind === "tournament" && allow.has(event.week)).sort((a, b) =>
    a.start.localeCompare(b.start),
  );
}

function rsvpOf(book: TournamentRsvpBook, personId: string, eventId: string): TournamentRsvp | "" {
  return book[personId]?.[eventId] ?? "";
}

function rsvpLabel(value: TournamentRsvp | "") {
  if (value === "yes") return "Yes";
  if (value === "no") return "No";
  if (value === "maybe") return "Maybe";
  return "No reply";
}

function playersOnWeek(week: number) {
  return PEOPLE.filter((person) => person.role === "player" && person.weeks.includes(week));
}

function visiblePlayers(
  me: CampPerson,
  week: number,
  eventId: string,
  groups: GroupMap,
  weekGroups: WeekGroupMap,
  rsvps: TournamentRsvpBook,
) {
  const all = playersOnWeek(week);
  if (me.role === "head") return all;
  const myGroup = me.leadsGroup ?? me.groupId;
  return all.filter((player) => {
    const groupId = groupOf(player, week, groups, weekGroups);
    if (groupId === myGroup) return true;
    const status = rsvpOf(rsvps, player.id, eventId);
    return status === "yes" || status === "maybe";
  });
}

function CoachList({ event, me }: { event: CampEvent; me: CampPerson }) {
  const groups = useCamp((s) => s.groups);
  const weekGroups = useCamp((s) => s.weekGroups);
  const rsvps = useCamp((s) => s.rsvps);
  const rows = visiblePlayers(me, event.week, event.id, groups, weekGroups, rsvps)
    .map((player) => {
      const group = groupById(groupOf(player, event.week, groups, weekGroups));
      const status = rsvpOf(rsvps, player.id, event.id);
      return { player, group, status };
    })
    .sort((a, b) => {
      const rank = (RSVP_ORDER[a.status] ?? 3) - (RSVP_ORDER[b.status] ?? 3);
      if (rank !== 0) return rank;
      return a.player.name.localeCompare(b.player.name);
    });
  const counts = {
    yes: rows.filter((row) => row.status === "yes").length,
    no: rows.filter((row) => row.status === "no").length,
    maybe: rows.filter((row) => row.status === "maybe").length,
    none: rows.filter((row) => !row.status).length,
  };

  return (
    <div className="mt-5 border-t border-border pt-4">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
        Yes {counts.yes} · No {counts.no} · Maybe {counts.maybe} · No reply {counts.none}
      </p>
      <ul className="mt-3 divide-y divide-border">
        {rows.map((row) => (
          <li key={row.player.id} className="flex flex-wrap items-baseline justify-between gap-2 py-2">
            <span>
              <span className="text-sm font-semibold text-fg">{row.player.name}</span>
              <span className="mt-0.5 block text-xs text-muted">
                {row.group?.name ?? "Group TBC"} · {row.player.level ?? "Level TBC"}
              </span>
            </span>
            <span className="text-xs font-semibold uppercase tracking-wide text-accent">{rsvpLabel(row.status)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function TournamentsPage() {
  const me = useCamp((s) => s.me);
  if (!me) return null;
  const isCoach = me.role === "coach" || me.role === "head";
  const events = tournamentsFor(me.weeks);
  const byWeek = CAMP_WEEKS.filter((week) => me.weeks.includes(week.id)).map((week) => ({
    week,
    events: events.filter((event) => event.week === week.id),
  }));

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Tournaments</p>
      <h1 className="mt-2 font-display text-5xl text-fg sm:text-6xl">Sign in for the week</h1>
      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">
        Three moments in the week. Read what each one is, then yes, no, or maybe.
        Coaches use this to set the draws.
      </p>

      <section className="mt-10 border-t border-border pt-8">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">How we play</p>
        <h2 className="mt-2 font-display text-4xl text-fg">Hybrid tournament rules</h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
          These are the house rules for Monday scramble and Friday camp tournament.
          Saturday follows Playa Grande Volley.
        </p>
        <ul className="mt-6 grid gap-5">
          {HYBRID_RULES.map((rule) => (
            <li key={rule.title}>
              <p className="text-sm font-semibold text-fg">{rule.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-muted">{rule.body}</p>
            </li>
          ))}
        </ul>
      </section>

      {byWeek.map(({ week, events: weekEvents }) => (
        <section key={week.id} className="mt-12">
          {byWeek.length > 1 ? (
            <>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">{week.range}</p>
              <h2 className="mt-1 font-display text-4xl text-fg">{week.label}</h2>
            </>
          ) : null}
          <div className={byWeek.length > 1 ? "mt-6 grid gap-4" : "mt-8 grid gap-4"}>
            {weekEvents.map((event) => {
              const day = DAYS.find((item) => item.date === event.start.slice(0, 10));
              const copy = TOURNAMENT_COPY[event.title] ?? [event.detail];
              return (
                <article key={event.id} className="rounded-md bg-surface p-5 shadow-border">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
                    {day?.label ?? "Tournament"}
                  </p>
                  <h3 className="mt-2 font-display text-3xl text-fg">{event.title}</h3>
                  <p className="mt-2 text-sm tabular-nums text-muted">
                    {event.start.slice(11, 16)} – {event.end.slice(11, 16)} · {event.place}
                  </p>
                  <div className="mt-3 grid gap-3">
                    {copy.map((para) => (
                      <p key={para} className="text-sm leading-relaxed text-muted">
                        {para}
                      </p>
                    ))}
                  </div>
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap gap-2">
                      <IcalButton event={event} coachView={isCoach} />
                      <a
                        href={googleUrl(event, isCoach)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex h-11 items-center rounded-sm px-4 text-xs font-semibold uppercase tracking-wide text-muted hover:text-fg"
                      >
                        Google Calendar
                      </a>
                    </div>
                    {!isCoach ? <TournamentRsvpButtons eventId={event.id} /> : null}
                  </div>
                  {isCoach ? <CoachList event={event} me={me} /> : null}
                </article>
              );
            })}
          </div>
        </section>
      ))}
    </main>
  );
}
