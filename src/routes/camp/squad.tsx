import { createFileRoute, Link } from "@tanstack/react-router";
import {
  DAYS,
  GROUPS,
  PEOPLE,
  coachDutiesOn,
  coachForGroup,
  currentWeekId,
  dayTitle,
  groupOf,
  isCalendarToday,
  personNow,
} from "@/data/camp";
import { countryOf, flagUrl } from "@/data/kit";
import { useCamp } from "@/lib/camp-store";

export const Route = createFileRoute("/camp/squad")({
  component: SquadPage,
});

function DutyList({
  title,
  date,
  items,
}: {
  title: string;
  date: string;
  items: ReturnType<typeof coachDutiesOn>;
}) {
  const meta = DAYS.find((day) => day.date === date);
  return (
    <section className="rounded-md bg-surface p-5 shadow-border">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">{meta?.label}</p>
      <h2 className="mt-1 font-display text-3xl text-fg">{title}</h2>
      <ul className="mt-4 divide-y divide-border">
        {items.length === 0 ? (
          <li className="py-3 text-sm text-muted">Nothing on you this day.</li>
        ) : (
          items.map((item) => (
            <li key={item.event.id + item.label} className="py-3">
              <p className="text-sm font-semibold text-fg">{item.event.kind === "social" && item.event.duty === "Welcome" ? item.event.title : item.label}</p>
              <p className="text-sm tabular-nums text-muted">
                {item.event.start.slice(11, 16)} – {item.event.end.slice(11, 16)} · {item.event.place}
              </p>
            </li>
          ))
        )}
      </ul>
    </section>
  );
}

function SquadPage() {
  const me = useCamp((s) => s.me);
  const groups = useCamp((s) => s.groups);
  const weekGroups = useCamp((s) => s.weekGroups);
  const messages = useCamp((s) => s.messages);
  const kits = useCamp((s) => s.kits);
  if (!me || me.role === "player") {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16">
        <p className="text-sm text-muted">Squad is a coach view.</p>
        <Link to="/camp" className="mt-4 inline-block text-sm text-accent">
          Back to today
        </Link>
      </main>
    );
  }

  const now = personNow(me);
  const todayKey = now.toISOString().slice(0, 10);
  const tomorrow = new Date(now);
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
  const tomorrowKey = tomorrow.toISOString().slice(0, 10);
  const weekNow = currentWeekId(now, me);
  const myGroup = me.leadsGroup ?? me.groupId;
  const groupsToShow = me.role === "head" ? GROUPS : GROUPS.filter((g) => g.id === myGroup);
  const todayDuty = coachDutiesOn(me, todayKey);
  const tomorrowDuty = coachDutiesOn(me, tomorrowKey);

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Coach</p>
      <h1 className="mt-2 font-display text-5xl text-fg sm:text-6xl">Your week on staff</h1>
      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">
        What is on you for the next two days, then the players in your group.
      </p>

      <div className="mt-10 grid gap-6">
        <DutyList
          title={isCalendarToday(todayKey) ? "Today on you" : `On you · ${dayTitle(todayKey)}`}
          date={todayKey}
          items={todayDuty}
        />
        <DutyList
          title={
            isCalendarToday(tomorrowKey) ? "Today on you" : `Next · ${dayTitle(tomorrowKey)}`
          }
          date={tomorrowKey}
          items={tomorrowDuty}
        />

        {groupsToShow.length === 0 ? (
          <p className="text-sm text-muted">You are on support this week, not a fixed group.</p>
        ) : (
          groupsToShow.map((group) => {
            const lead = coachForGroup(group.id, weekNow);
            const players = PEOPLE.filter(
              (p) =>
                p.role === "player" &&
                p.weeks.includes(weekNow) &&
                groupOf(p, weekNow, groups, weekGroups) === group.id,
            );
            return (
              <section key={group.id} className="rounded-md bg-surface p-5 shadow-border">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">{group.name}</p>
                <h2 className="mt-1 font-display text-3xl text-fg">{lead?.name}</h2>
                <p className="text-sm text-muted">
                  {group.level} · {players.length} players this week
                </p>
                <ul className="mt-4 divide-y divide-border">
                  {players.map((player) => {
                    const note = messages.find((m) => m.fromId === player.id);
                    const kit = kits[player.id];
                    const flag = kit ? countryOf(kit.country) : null;
                    return (
                      <li key={player.id} className="py-3">
                        <div className="flex justify-between gap-3">
                          <p className="text-sm font-semibold text-fg">{player.name}</p>
                          <p className="text-xs text-muted">{player.solo ? "Solo" : "With others"}</p>
                        </div>
                        <p className="text-xs text-muted">
                          {player.level}
                          {player.stay === "camp-stay" ? " · Moraña" : " · own stay"}
                          {player.weeks?.length ? ` · W${player.weeks.join("/")}` : ""}
                          {kit
                            ? ` · kit ${kit.top}/${kit.shorts} · ${kit.printName}${flag ? ` · ${flag.name}` : ""}`
                            : " · kit not set"}
                        </p>
                        {kit ? (
                          <img
                            src={flagUrl(kit.country, 40)}
                            alt={flag?.name ?? ""}
                            className="mt-2 h-4 w-6 object-cover"
                          />
                        ) : null}
                        {note ? (
                          <p className="mt-2 text-xs text-accent">
                            Open note: {note.tag} · {note.body.slice(0, 80)}
                            {note.body.length > 80 ? "…" : ""}
                          </p>
                        ) : null}
                      </li>
                    );
                  })}
                </ul>
              </section>
            );
          })
        )}
      </div>
    </main>
  );
}
