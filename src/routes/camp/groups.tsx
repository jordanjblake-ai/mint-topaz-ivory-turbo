import { createFileRoute, Link } from "@tanstack/react-router";
import { CAMP_WEEKS, GROUPS, PEOPLE, coachForGroup, groupOf } from "@/data/camp";
import { useCamp } from "@/lib/camp-store";

export const Route = createFileRoute("/camp/groups")({
  component: GroupsPage,
});

function GroupsPage() {
  const me = useCamp((s) => s.me);
  const groups = useCamp((s) => s.groups);
  const weekGroups = useCamp((s) => s.weekGroups);
  const setGroup = useCamp((s) => s.setGroup);

  if (!me || me.role !== "head") {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16">
        <p className="text-sm text-muted">Only Mark can move people between groups.</p>
        <Link to="/camp" className="mt-4 inline-block text-sm text-accent">
          Back to today
        </Link>
      </main>
    );
  }

  const players = PEOPLE.filter((p) => p.role === "player");
  const open = players.filter((p) => p.weeks.some((week) => !groupOf(p, week, groups, weekGroups)));

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Head coach</p>
      <h1 className="mt-2 font-display text-5xl text-fg sm:text-6xl">Set the groups</h1>
      <p className="mt-4 text-sm leading-relaxed text-muted">
        Players on more than one week get a group and coach for each week they bought. Set one week,
        or apply the same group to all of theirs. Their schedule updates as soon as you save it.
      </p>
      {open.length ? (
        <p className="mt-5 rounded-md bg-surface px-4 py-3 text-sm shadow-border">
          {open.length} still missing a group on at least one week.
        </p>
      ) : null}
      <ul className="mt-8 divide-y divide-border rounded-md bg-surface shadow-border">
        {players.map((player) => {
          const multi = player.weeks.length > 1;
          return (
            <li key={player.id} className="px-4 py-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-fg">{player.name}</p>
                  <p className="text-xs text-muted">
                    {player.level}
                    {player.solo ? " · solo" : ""}
                    {` · W${player.weeks.join("/")}`}
                  </p>
                </div>
                {multi ? (
                  <select
                    defaultValue=""
                    onChange={(e) => {
                      if (!e.target.value) return;
                      setGroup(player.id, e.target.value === "none" ? null : e.target.value);
                      e.target.value = "";
                    }}
                    className="h-11 min-w-44 rounded-sm border border-border bg-bg px-3 text-sm text-fg outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  >
                    <option value="">Apply to all weeks</option>
                    <option value="none">Unassigned, all weeks</option>
                    {GROUPS.map((group) => (
                      <option key={group.id} value={group.id}>
                        {group.name} · all their weeks
                      </option>
                    ))}
                  </select>
                ) : null}
              </div>
              <div
                className={`mt-3 grid min-w-0 gap-2 ${
                  player.weeks.length >= 3
                    ? "grid-cols-3"
                    : player.weeks.length === 2
                      ? "grid-cols-2"
                      : "grid-cols-1"
                }`}
              >
                {player.weeks.map((week) => {
                  const current = groupOf(player, week, groups, weekGroups) ?? "";
                  const weekMeta = CAMP_WEEKS.find((item) => item.id === week);
                  return (
                    <label key={week} className="grid min-w-0 gap-1">
                      <span className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-muted">
                        {weekMeta?.label} · {weekMeta?.range}
                      </span>
                      <select
                        value={current}
                        onChange={(e) => setGroup(player.id, e.target.value || null, week)}
                        className="h-11 w-full rounded-sm border border-border bg-bg px-3 text-sm text-fg outline-none focus-visible:ring-2 focus-visible:ring-accent"
                      >
                        <option value="">Unassigned</option>
                        {GROUPS.map((group) => {
                          const lead = coachForGroup(group.id, week);
                          return (
                            <option key={group.id} value={group.id}>
                              {group.name} · {lead?.name ?? "coach TBC"}
                            </option>
                          );
                        })}
                      </select>
                    </label>
                  );
                })}
              </div>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
