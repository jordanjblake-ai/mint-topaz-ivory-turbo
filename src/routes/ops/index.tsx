import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  DRAFT_GRID_LABEL,
  DRAFT_GROUP_GRID,
  DRAFT_WEEKS,
  GROUP_SIZE_COPY,
  type DraftGroup,
} from "@/data/coaches-corner";
import {
  ASSIGN_COACH_COMING,
  BOOKING_EMPTY,
  BOOKING_PULSE_LABELS,
  COMMS_EMPTY,
  DAY_OF_EMPTY,
  DESK_SUB,
  DESK_TITLE,
  FOOTER_SOURCE_NOTE,
  MONEY_EMPTY,
  MONEY_LOCKS,
  OPS_CHECKLIST,
  ROSTER_GUEST_EMPTY,
  WEEK_FILTERS,
  WELFARE_EMPTY,
  type WeekFilter,
} from "@/data/ops-desk";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/ops/")({
  head: () => ({
    meta: [
      { title: "Hybrid desk" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: DeskPage,
});

const GROUPS: DraftGroup[] = ["A", "B", "C"];

function DeskPage() {
  const [week, setWeek] = useState<WeekFilter>("all");

  const visibleWeeks = useMemo(
    () => (week === "all" ? DRAFT_WEEKS : DRAFT_WEEKS.filter((item) => item.id === week)),
    [week],
  );

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Staff only</p>
        <h1 className="mt-2 font-display text-5xl text-fg sm:text-6xl">{DESK_TITLE}</h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">{DESK_SUB}</p>
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        {WEEK_FILTERS.map((item) => (
          <button
            key={String(item.id)}
            type="button"
            onClick={() => setWeek(item.id)}
            className={cn(
              "inline-flex h-11 items-center rounded-sm px-3 text-sm",
              week === item.id ? "bg-accent text-accent-fg" : "bg-surface text-muted shadow-border hover:text-fg",
            )}
          >
            {item.chip}
          </button>
        ))}
      </div>
      <p className="mt-3 text-xs text-muted">Week filter only. No booking counts until the feed is wired.</p>

      <div className="mt-10 grid gap-6">
        <Card title="Bookings pulse">
          <ul className="flex flex-wrap gap-2">
            {BOOKING_PULSE_LABELS.map((label) => (
              <li
                key={label}
                className="rounded-sm bg-bg px-3 py-2 text-sm text-fg shadow-border"
              >
                {label}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm leading-relaxed text-muted">{BOOKING_EMPTY}</p>
        </Card>

        <Card title="Money follow-ups">
          <ul className="grid gap-2 text-sm text-fg">
            {MONEY_LOCKS.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="mt-4 text-sm leading-relaxed text-muted">{MONEY_EMPTY}</p>
        </Card>

        <Card title="Roster board">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
            {DRAFT_GRID_LABEL}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Groups A / B / C. {GROUP_SIZE_COPY} — not a fixed six. Dave is Group C, weeks 2–3 only.
            Mark assigns closer to camp.
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
                {visibleWeeks.map((row) => (
                  <tr key={row.id} className="border-t border-border">
                    <td className="py-3 pr-3 align-top">
                      <span className="block text-fg">{row.label}</span>
                      <span className="text-xs text-muted">{row.range}</span>
                    </td>
                    {GROUPS.map((group) => {
                      const cell = DRAFT_GROUP_GRID.find(
                        (item) => item.week === row.id && item.group === group,
                      );
                      return (
                        <td key={group} className="py-3 pr-3 align-top">
                          <span className="inline-block rounded-sm bg-bg px-2 py-1 text-fg shadow-border">
                            {cell?.label ?? "TBC"}
                            {cell?.note ? (
                              <span className="ml-1 text-xs text-muted">({cell.note})</span>
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

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
              Assign coach
            </p>
            <button
              type="button"
              disabled
              className="inline-flex h-9 items-center rounded-sm border border-border px-3 text-xs font-semibold uppercase tracking-wide text-muted opacity-40"
            >
              {ASSIGN_COACH_COMING}
            </button>
          </div>

          <p className="mt-4 text-sm leading-relaxed text-muted">{ROSTER_GUEST_EMPTY}</p>
        </Card>

        <Card title="Welfare & escalations">
          <p className="text-sm leading-relaxed text-muted">{WELFARE_EMPTY}</p>
        </Card>

        <Card title="Comms">
          <p className="text-sm leading-relaxed text-muted">{COMMS_EMPTY}</p>
        </Card>

        <Card title="Ops checklist">
          <ul className="grid gap-3">
            {OPS_CHECKLIST.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm text-fg">
                <input
                  type="checkbox"
                  disabled
                  checked={false}
                  readOnly
                  className="mt-1 h-4 w-4 shrink-0 accent-accent"
                  aria-label={`${item} — unchecked`}
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card title="Day-of">
          <p className="text-sm leading-relaxed text-muted">{DAY_OF_EMPTY}</p>
        </Card>
      </div>

      <footer className="mt-12 border-t border-border pt-6">
        <p className="text-sm leading-relaxed text-muted">{FOOTER_SOURCE_NOTE}</p>
        <p className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm">
          <Link to="/coaches-corner" className="text-muted underline-offset-4 hover:text-fg hover:underline">
            Coaches see their own group
          </Link>
          <Link to="/camp" className="text-muted underline-offset-4 hover:text-fg hover:underline">
            On-ground view — thin
          </Link>
        </p>
      </footer>
    </main>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-md bg-surface p-5 shadow-border sm:p-6">
      <h2 className="font-display text-3xl text-fg">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}
