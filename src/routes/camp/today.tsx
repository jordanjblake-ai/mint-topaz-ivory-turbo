import { createFileRoute, Link } from "@tanstack/react-router";
import { EventCard } from "@/components/camp/event-card";
import { WeekCalendarButtons } from "@/components/camp/ical-button";
import {
  CAMP_META,
  DAYS,
  GROUPS,
  PEOPLE,
  collapseSessions,
  coachForGroup,
  currentWeekId,
  dayTitle,
  groupById,
  groupOf,
  isCalendarToday,
  onDay,
  personNow,
  visibleEvents,
  weeksPhrase,
} from "@/data/camp";
import { useCamp } from "@/lib/camp-store";

export const Route = createFileRoute("/camp/today")({
  component: TodayPage,
});

function TodayPage() {
  const me = useCamp((s) => s.me);
  const groups = useCamp((s) => s.groups);
  const weekGroups = useCamp((s) => s.weekGroups);
  const groupChangedAt = useCamp((s) => s.groupChangedAt);

  if (!me) return null;

  const now = personNow(me);
  const mine = collapseSessions(visibleEvents(me, groups, weekGroups), me.role === "head");
  const todayKey = now.toISOString().slice(0, 10);
  const todayMeta = DAYS.find((day) => day.date === todayKey);
  const laterDays = DAYS.filter((day) => day.date > todayKey);
  const weekNow = currentWeekId(now, me);
  const groupId = groupOf(me, weekNow, groups, weekGroups);
  const group = groupById(groupId);
  const coach = group ? coachForGroup(group.id, weekNow) : null;
  const changed = me.role === "player" && groupChangedAt[me.id];
  const isCoach = me.role === "coach" || me.role === "head";
  const todayEvents = onDay(mine, todayKey);
  const remainingToday = todayEvents.filter((event) => new Date(event.end) >= now);
  const onThisWeek = me.weeks.includes(weekNow);
  const todayWord = isCalendarToday(todayKey);
  const heading = dayTitle(todayKey);
  const squad =
    isCoach && group
      ? PEOPLE.filter(
          (p) =>
            p.role === "player" &&
            p.weeks.includes(weekNow) &&
            groupOf(p, weekNow, groups, weekGroups) === group.id,
        )
      : [];

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
        {todayMeta?.tag ?? "Camp"} · {CAMP_META.venue}
      </p>
      <h1 className="mt-2 font-display text-5xl text-fg sm:text-7xl">{heading}</h1>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">
        {me.role === "player"
          ? !onThisWeek
            ? `${me.name.split(" ")[0]}, you have ${weeksPhrase(me.weeks)}. Nothing on the sand ${todayWord ? "today" : "this day"}.`
            : group
              ? `${me.name.split(" ")[0]}, you are in ${group.name} with ${coach?.name ?? "your coach"} this week. You have ${weeksPhrase(me.weeks)}.`
              : `${me.name.split(" ")[0]}, your group is still being set. Mark will lock it at welcome if it is not done before.`
          : me.role === "head"
            ? "Head coach view. All groups, all duties, and anyone still unassigned."
            : !onThisWeek
              ? `You are off this week. You are on staff for ${weeksPhrase(me.weeks)}.`
              : group
                ? `You have ${group.name} · ${group.level}. ${squad.length} players this week.`
                : "Support coach. Your duties sit on the schedule. No fixed group."}
      </p>

      {changed ? (
        <p className="mt-5 rounded-md bg-surface px-4 py-3 text-sm text-fg shadow-border">
          Your group was updated
          {group && coach ? `: ${group.name} with ${coach.name}.` : "."} The schedule below already
          uses it.
        </p>
      ) : null}

      <div className="mt-8 flex flex-wrap gap-3">
        <WeekCalendarButtons
          events={mine.filter((event) => event.week === weekNow)}
          name={`Hybrid Lanzarote Week ${weekNow}`}
          label="Add this week"
          coachView={isCoach}
        />
      </div>

      <section className="mt-12">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Next up</p>
        <h2 className="mt-2 font-display text-4xl text-fg">
          {todayWord ? "Still today" : heading}
        </h2>
        <div className="mt-6 grid gap-4">
          {remainingToday.length ? (
            remainingToday.map((event, index) => (
              <EventCard key={event.id} event={event} highlight={index === 0} coachView={isCoach} />
            ))
          ) : (
            <p className="text-sm text-muted">
              Nothing left on {todayWord ? "today" : heading}. Later in the week is below.
            </p>
          )}
        </div>
      </section>

      {isCoach && group ? (
        <section className="mt-12 rounded-md bg-surface p-5 shadow-border">
          <div className="flex items-baseline justify-between gap-3">
            <h2 className="font-display text-3xl text-fg">Your players</h2>
            <Link to="/camp/squad" className="text-xs font-semibold uppercase tracking-wide text-accent">
              Full squad
            </Link>
          </div>
          <ul className="mt-4 divide-y divide-border">
            {squad.map((player) => (
              <li key={player.id} className="flex justify-between gap-3 py-3 text-sm">
                <span className="text-fg">{player.name}</span>
                <span className="text-muted">{player.level}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {me.role === "head" ? (
        <section className="mt-12 rounded-md bg-surface p-5 shadow-border">
          <h2 className="font-display text-3xl text-fg">Groups</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {GROUPS.map((item) => {
              const lead = coachForGroup(item.id, weekNow);
              const n = PEOPLE.filter(
                (p) =>
                  p.role === "player" &&
                  p.weeks.includes(weekNow) &&
                  groupOf(p, weekNow, groups, weekGroups) === item.id,
              ).length;
              return (
                <div key={item.id}>
                  <p className="text-sm font-semibold text-fg">{item.name}</p>
                  <p className="text-sm text-muted">
                    {lead?.name} · {n} players
                  </p>
                </div>
              );
            })}
          </div>
          <Link to="/camp/groups" className="mt-4 inline-block text-xs font-semibold uppercase tracking-wide text-accent">
            Assign groups
          </Link>
        </section>
      ) : null}

      <section className="mt-12">
        <h2 className="font-display text-4xl text-fg">Later in the week</h2>
        <div className="mt-6 space-y-8">
          {laterDays.map((day) => {
            const rows = onDay(mine, day.date);
            if (!rows.length) return null;
            return (
              <div key={day.date}>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
                  {day.tag} · {day.label}
                </p>
                <div className="mt-3 grid gap-3">
                  {rows.map((event) => (
                    <EventCard key={event.id} event={event} coachView={isCoach} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
