import { createFileRoute } from "@tanstack/react-router";
import { WeekBoard } from "@/components/camp/week-board";
import { CAMP_WEEKS, groupById, groupOf, weeksPhrase } from "@/data/camp";
import { useCamp } from "@/lib/camp-store";

export const Route = createFileRoute("/camp/schedule")({
  component: SchedulePage,
});

function SchedulePage() {
  const me = useCamp((s) => s.me);
  const groups = useCamp((s) => s.groups);
  const weekGroups = useCamp((s) => s.weekGroups);
  if (!me) return null;
  const placements = me.weeks.map((week) => {
    const group = groupById(groupOf(me, week, groups, weekGroups));
    const meta = CAMP_WEEKS.find((item) => item.id === week);
    return { week, group, meta };
  });

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">{weeksPhrase(me.weeks)}</p>
      <h1 className="mt-2 font-display text-5xl text-fg sm:text-6xl">The week</h1>
      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">
        Same shape each week. Nine sessions, a scramble, a rest Wednesday, a camp tournament, then a
        free Saturday.
        {me.role === "player" && placements.length
          ? ` ${placements
              .map((item) => `${item.meta?.label ?? `Week ${item.week}`}: ${item.group?.name ?? "group TBC"}`)
              .join(". ")}.`
          : ""}
        {me.id === "dave" ? " You are off Week 1. Mark has Group C until you arrive." : ""}
      </p>

      {placements.map((item) => (
        <section key={item.week} className="mt-12">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">{item.meta?.range}</p>
          <h2 className="mt-1 font-display text-4xl text-fg">{item.meta?.label}</h2>
          <div className="mt-6">
            <WeekBoard weekId={item.week} groupName={item.group?.name} />
          </div>
        </section>
      ))}
    </main>
  );
}
