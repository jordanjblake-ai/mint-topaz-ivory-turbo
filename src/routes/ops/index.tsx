import { createFileRoute, Link } from "@tanstack/react-router";
import { format, formatDistanceToNow } from "date-fns";
import { useEffect, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  KIND_LABEL,
  KIND_ORDER,
  STATUS_LABEL,
  TOP_PAGES,
  TOP_SOURCES,
  WEEK_CAP,
  WEEK_LABEL,
  type EnquiryKind,
  type EnquiryStatus,
} from "@/data/ops";
import { filterRange, moneySnapshot, useOps, weekPlaces } from "@/lib/ops-store";
import { listCampMail } from "@/lib/camp-mail";
import { listCampKits } from "@/lib/camp-kit";
import { personById } from "@/data/camp";
import { countryOf, flagUrl } from "@/data/kit";
import { CachePurgePanel } from "@/components/ops/cache-purge";
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

function DeskPage() {
  return <DeskBody />;
}

function DeskBody() {
  const ready = useOps((s) => s.ready);
  const unlocked = useOps((s) => s.unlocked);
  const enquiries = useOps((s) => s.enquiries);
  const traffic = useOps((s) => s.traffic);
  const range = useOps((s) => s.range);
  const setRange = useOps((s) => s.setRange);
  const [kind, setKind] = useState<EnquiryKind | "all">("all");
  const [mail, setMail] = useState<
    { id: number; kind: string; recipients: string; subject: string; status: string; created_at: string }[]
  >([]);

  const [kitOrders, setKitOrders] = useState<
    { personId: string; top: string; shorts: string; printName: string; country: string }[]
  >([]);

  useEffect(() => {
    void listCampMail()
      .then(setMail)
      .catch(() => setMail([]));
    void listCampKits()
      .then((rows) =>
        setKitOrders(
          rows.map((row) => ({
            personId: row.personId,
            top: row.top,
            shorts: row.shorts,
            printName: row.printName,
            country: row.country,
          })),
        ),
      )
      .catch(() => setKitOrders([]));
  }, []);

  const series = useMemo(() => filterRange(traffic, range), [traffic, range]);
  const visits = series.reduce((sum, row) => sum + row.views, 0);
  const uniques = series.reduce((sum, row) => sum + row.uniques, 0);
  const rangeStart = series[0]?.date;
  const inRange = useMemo(() => {
    if (!rangeStart) return enquiries;
    return enquiries.filter((item) => item.createdAt.slice(0, 10) >= rangeStart);
  }, [enquiries, rangeStart]);

  const newCount = enquiries.filter((item) => item.status === "new").length;
  const coachingAll = enquiries.filter((item) =>
    ["coaching", "clinic", "mini-camp"].includes(item.kind),
  ).length;
  const money = moneySnapshot(enquiries);
  const weeks = (["week-1", "week-2", "week-3"] as const).map((week) => ({
    week,
    places: weekPlaces(enquiries, week),
    interest: enquiries.filter((item) => item.kind === "lanzarote" && item.week === week).length,
  }));

  const mix = KIND_ORDER.map((k) => ({
    kind: k,
    label:
      k === "tennis" ? "Tennis" : k === "padel" ? "Padel" : k === "travel" ? "Trip" : KIND_LABEL[k],
    count: inRange.filter((item) => item.kind === k).length,
  })).filter((row) => row.count > 0);

  const pipeline: EnquiryStatus[] = ["new", "contacted", "held", "booked", "closed"];
  const recent = [...enquiries]
    .filter((item) => (kind === "all" ? true : item.kind === kind))
    .slice(0, 8);

  const attention = enquiries.filter((item) => item.status === "new").slice(0, 6);

  if (!ready || !unlocked) return null;

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Overview</p>
          <h1 className="mt-2 font-display text-5xl text-fg sm:text-6xl">What needs a look</h1>
        </div>
        <div className="flex rounded-sm bg-surface p-1 shadow-border">
          {([7, 30, 90] as const).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setRange(value)}
              className={cn(
                "h-10 min-w-16 rounded-sm px-3 text-xs font-semibold uppercase tracking-wide",
                range === value ? "bg-accent text-accent-fg" : "text-muted hover:text-fg",
              )}
            >
              {value}d
            </button>
          ))}
        </div>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Kpi label="Site visits" value={visits.toLocaleString()} hint={`${uniques.toLocaleString()} unique`} />
        <Kpi label="Enquiries in range" value={String(inRange.length)} hint={`${newCount} still new`} />
        <Kpi label="Lanzarote holds" value={String(money.heldPlaces)} hint="Places with a deposit or booked" />
        <Kpi label="UK coaching" value={String(coachingAll)} hint="Private, clinic, and mini-camp" />
        <Kpi
          label="Deposits in"
          value={`£${money.deposits.toLocaleString()}`}
          hint="£100 per held or booked place"
        />
        <Kpi
          label="Balances still due"
          value={`£${(money.campDue + money.stayDue).toLocaleString()}`}
          hint="Camp 15 Jan · stay 1 Jan"
        />
      </div>

      <CachePurgePanel />

      <section className="mt-8 rounded-md bg-surface p-5 shadow-border">
        <h2 className="font-display text-3xl text-fg">Camp mail</h2>
        <p className="mt-1 text-sm text-muted">
          Player notes and coach replies emailed to the group coach, the player, and Mark.
        </p>
        {mail.length ? (
          <ul className="mt-4 divide-y divide-border">
            {mail.map((item) => (
              <li key={item.id} className="py-3">
                <p className="text-sm text-fg">{item.subject}</p>
                <p className="mt-1 text-xs text-muted">
                  {item.kind === "reply" ? "Reply" : "Note"} · {item.recipients} ·{" "}
                  {item.status === "sent" ? "Sent" : "Queued"} ·{" "}
                  {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-muted">Nothing emailed from camp yet.</p>
        )}
      </section>

      <section className="mt-8 rounded-md bg-surface p-5 shadow-border">
        <h2 className="font-display text-3xl text-fg">Camp kit</h2>
        <p className="mt-1 text-sm text-muted">
          {kitOrders.length} saved. Top / shorts, print name, and flag.
        </p>
        {kitOrders.length ? (
          <ul className="mt-4 divide-y divide-border">
            {kitOrders.map((item) => {
              const person = personById(item.personId);
              const flag = countryOf(item.country);
              return (
                <li key={item.personId} className="flex flex-wrap items-center justify-between gap-3 py-3">
                  <div className="flex items-center gap-3">
                    <img src={flagUrl(item.country, 40)} alt={flag?.name ?? ""} className="h-4 w-6 object-cover" />
                    <div>
                      <p className="text-sm text-fg">{person?.name ?? item.personId}</p>
                      <p className="text-xs text-muted">{item.printName}</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted">
                    {item.top} / {item.shorts}
                    {flag ? ` · ${flag.name}` : ""}
                  </p>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-muted">Nobody has saved a kit yet.</p>
        )}
      </section>

      <div className="mt-8 grid gap-6 lg:grid-cols-5">
        <section className="rounded-md bg-surface p-5 shadow-border lg:col-span-3">
          <h2 className="font-display text-3xl text-fg">Traffic</h2>
          <p className="mt-1 text-sm text-muted">Views on the public site, last {range} days.</p>
          <div className="mt-4 h-64">
            <ChartFrame>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={series} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid stroke="var(--color-border)" vertical={false} />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(value) => value.slice(5)}
                    tick={{ fill: "var(--color-muted)", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "var(--color-muted)", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    width={32}
                  />
                  <Tooltip content={<ChartTip />} />
                  <Area
                    type="monotone"
                    dataKey="views"
                    stroke="var(--color-accent)"
                    fill="var(--color-accent)"
                    fillOpacity={0.18}
                    strokeWidth={2}
                    name="Views"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartFrame>
          </div>
        </section>
        <section className="rounded-md bg-surface p-5 shadow-border lg:col-span-2">
          <h2 className="font-display text-3xl text-fg">By type</h2>
          <p className="mt-1 text-sm text-muted">Click a bar to filter the list.</p>
          <div className="mt-4 h-64">
            <ChartFrame>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mix} margin={{ top: 8, right: 8, left: 0, bottom: 24 }}>
                  <CartesianGrid stroke="var(--color-border)" vertical={false} />
                  <XAxis
                    dataKey="label"
                    tick={{ fill: "var(--color-muted)", fontSize: 10 }}
                    interval={0}
                    angle={-28}
                    textAnchor="end"
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fill: "var(--color-muted)", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    width={24}
                  />
                  <Tooltip content={<ChartTip />} />
                  <Bar
                    dataKey="count"
                    fill="var(--color-accent)"
                    radius={[4, 4, 0, 0]}
                    name="Enquiries"
                    cursor="pointer"
                    onClick={(data) => {
                      const next = (data as { kind?: EnquiryKind }).kind;
                      if (next) setKind((current) => (current === next ? "all" : next));
                    }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartFrame>
          </div>
        </section>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <section className="rounded-md bg-surface p-5 shadow-border">
          <h2 className="font-display text-3xl text-fg">Pages</h2>
          <p className="mt-1 text-sm text-muted">Where people land and stay, last 90 days.</p>
          <ul className="mt-4 divide-y divide-border">
            {TOP_PAGES.map((page) => (
              <li key={page.path} className="flex items-baseline justify-between gap-3 py-2">
                <span className="text-sm text-fg">{page.label}</span>
                <span className="tabular-nums text-sm text-muted">{page.views.toLocaleString()}</span>
              </li>
            ))}
          </ul>
        </section>
        <section className="rounded-md bg-surface p-5 shadow-border">
          <h2 className="font-display text-3xl text-fg">How they found you</h2>
          <p className="mt-1 text-sm text-muted">Instagram should stay the main door.</p>
          <ul className="mt-4 space-y-4">
            {TOP_SOURCES.map((row) => (
              <li key={row.source}>
                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-sm text-fg">{row.source}</span>
                  <span className="tabular-nums text-sm text-muted">{row.share}%</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-sm bg-bg">
                  <div className="h-full rounded-sm bg-accent" style={{ width: `${row.share}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="mt-8 rounded-md bg-surface p-5 shadow-border">
        <h2 className="font-display text-3xl text-fg">Lanzarote weeks</h2>
        <p className="mt-1 text-sm text-muted">
          Places held or booked against a planning cap of {WEEK_CAP} per week.
        </p>
        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {weeks.map((row) => {
            const pct = Math.min(100, Math.round((row.places / WEEK_CAP) * 100));
            return (
              <div key={row.week}>
                <div className="flex items-baseline justify-between gap-3">
                  <p className="text-sm font-semibold text-fg">{WEEK_LABEL[row.week]}</p>
                  <p className="tabular-nums text-sm text-muted">
                    {row.places}/{WEEK_CAP}
                  </p>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-sm bg-bg">
                  <div className="h-full rounded-sm bg-accent" style={{ width: `${pct}%` }} />
                </div>
                <p className="mt-2 text-xs text-muted">{row.interest} enquiries on this week</p>
              </div>
            );
          })}
        </div>
      </section>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="rounded-md bg-surface p-5 shadow-border">
          <div className="flex items-baseline justify-between gap-3">
            <h2 className="font-display text-3xl text-fg">Needs a reply</h2>
            <Link to="/ops/people" className="text-xs font-semibold uppercase tracking-wide text-accent">
              All people
            </Link>
          </div>
          <ul className="mt-4 divide-y divide-border">
            {attention.length === 0 ? (
              <li className="py-6 text-sm text-muted">Nothing sitting in new.</li>
            ) : (
              attention.map((item) => (
                <li key={item.id} className="flex items-start justify-between gap-3 py-3">
                  <div>
                    <p className="text-sm font-semibold text-fg">{item.name}</p>
                    <p className="text-xs text-muted">
                      {KIND_LABEL[item.kind]}
                      {item.week ? ` · ${WEEK_LABEL[item.week]}` : ""} · {item.partySize}
                      {item.partySize === 1 ? " person" : " people"}
                    </p>
                  </div>
                  <p className="shrink-0 text-xs tabular-nums text-muted">
                    {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                  </p>
                </li>
              ))
            )}
          </ul>
        </section>
        <section className="rounded-md bg-surface p-5 shadow-border">
          <h2 className="font-display text-3xl text-fg">Pipeline</h2>
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-5">
            {pipeline.map((status) => (
              <div key={status} className="rounded-sm bg-bg px-3 py-4">
                <p className="font-display text-3xl tabular-nums text-fg">
                  {enquiries.filter((item) => item.status === status).length}
                </p>
                <p className="mt-1 text-xs uppercase tracking-wide text-muted">{STATUS_LABEL[status]}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm text-muted">
            Pre-register sits in contacted or closed until a week is priced. Deposits move a Lanzarote
            place to held.
          </p>
        </section>
      </div>

      <section className="mt-8 rounded-md bg-surface p-5 shadow-border">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-3xl text-fg">Latest requests</h2>
            <p className="mt-1 text-sm text-muted">
              {kind === "all" ? "All types." : KIND_LABEL[kind] + "."} Open People to change status.
            </p>
          </div>
          {kind !== "all" ? (
            <button type="button" className="text-xs uppercase tracking-wide text-accent" onClick={() => setKind("all")}>
              Clear filter
            </button>
          ) : null}
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-lg text-left text-sm">
            <thead className="text-xs uppercase tracking-wide text-muted">
              <tr className="border-b border-border">
                <th className="py-3 pr-4 font-semibold">Name</th>
                <th className="py-3 pr-4 font-semibold">Type</th>
                <th className="py-3 pr-4 font-semibold">Status</th>
                <th className="py-3 font-semibold">When</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((item) => (
                <tr key={item.id} className="border-b border-border/70">
                  <td className="py-3 pr-4 font-semibold text-fg">{item.name}</td>
                  <td className="py-3 pr-4 text-muted">{KIND_LABEL[item.kind]}</td>
                  <td className="py-3 pr-4 text-muted">{STATUS_LABEL[item.status]}</td>
                  <td className="py-3 tabular-nums text-muted">
                    {format(new Date(item.createdAt), "d MMM")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

function Kpi({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="rounded-md bg-surface p-5 shadow-border">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">{label}</p>
      <p className="mt-3 font-display text-5xl tabular-nums leading-none text-fg">{value}</p>
      <p className="mt-3 text-sm text-muted">{hint}</p>
    </div>
  );
}

function ChartFrame({ children }: { children: React.ReactNode }) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    setOn(true);
  }, []);
  if (!on) return <div className="h-full rounded-sm bg-bg" />;
  return <>{children}</>;
}

function ChartTip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { name: string; value: number }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-sm bg-bg px-3 py-2 text-xs shadow-border">
      <p className="text-muted">{label}</p>
      {payload.map((row) => (
        <p key={row.name} className="mt-1 tabular-nums text-fg">
          {row.name}: {row.value}
        </p>
      ))}
    </div>
  );
}
