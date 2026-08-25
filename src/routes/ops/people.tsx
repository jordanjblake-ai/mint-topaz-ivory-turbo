import { createFileRoute } from "@tanstack/react-router";
import { format, formatDistanceToNow } from "date-fns";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  KIND_LABEL,
  KIND_ORDER,
  SOURCE_LABEL,
  STATUS_LABEL,
  WEEK_LABEL,
  type Enquiry,
  type EnquiryKind,
  type EnquiryStatus,
} from "@/data/ops";
import { useOps } from "@/lib/ops-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/ops/people")({
  head: () => ({
    meta: [
      { title: "People · Hybrid desk" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: PeoplePage,
});

const STATUSES: EnquiryStatus[] = ["new", "contacted", "held", "booked", "closed"];

function PeoplePage() {
  return <PeopleBody />;
}

function PeopleBody() {
  const ready = useOps((s) => s.ready);
  const unlocked = useOps((s) => s.unlocked);
  const enquiries = useOps((s) => s.enquiries);
  const setStatus = useOps((s) => s.setStatus);
  const addNote = useOps((s) => s.addNote);
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState<EnquiryKind | "all">("all");
  const [status, setStatusFilter] = useState<EnquiryStatus | "all">("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [note, setNote] = useState("");

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return enquiries.filter((item) => {
      if (kind !== "all" && item.kind !== kind) return false;
      if (status !== "all" && item.status !== status) return false;
      if (!q) return true;
      return (
        item.name.toLowerCase().includes(q) ||
        item.email.toLowerCase().includes(q) ||
        item.message.toLowerCase().includes(q)
      );
    });
  }, [enquiries, kind, status, query]);

  const selected = enquiries.find((item) => item.id === selectedId) ?? null;

  if (!ready || !unlocked) return null;

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">People</p>
      <h1 className="mt-2 font-display text-5xl text-fg sm:text-6xl">Everyone who has written in</h1>
      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">
        Names, emails, and messages from the public forms, plus the seed of live-looking requests so
        the desk is usable before the site is wired to a database. Filter, update status, add a note.
      </p>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search name, email, message"
          className="max-w-sm"
        />
        <select
          value={kind}
          onChange={(e) => setKind(e.target.value as EnquiryKind | "all")}
          className="h-11 rounded-sm border border-border bg-surface px-3 text-sm text-fg outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <option value="all">All types</option>
          {KIND_ORDER.map((value) => (
            <option key={value} value={value}>
              {KIND_LABEL[value]}
            </option>
          ))}
        </select>
        <select
          value={status}
          onChange={(e) => setStatusFilter(e.target.value as EnquiryStatus | "all")}
          className="h-11 rounded-sm border border-border bg-surface px-3 text-sm text-fg outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <option value="all">All statuses</option>
          {STATUSES.map((value) => (
            <option key={value} value={value}>
              {STATUS_LABEL[value]}
            </option>
          ))}
        </select>
        <Button variant="secondary" type="button" onClick={() => exportCsv(rows)}>
          Export CSV
        </Button>
        <p className="text-sm tabular-nums text-muted">{rows.length} people</p>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(22rem,28rem)]">
        <div className="overflow-x-auto rounded-md bg-surface shadow-border">
          <table className="w-full min-w-2xl text-left text-sm">
            <thead className="text-xs uppercase tracking-wide text-muted">
              <tr className="border-b border-border">
                <th className="px-4 py-3 font-semibold">Name</th>
                <th className="px-4 py-3 font-semibold">Type</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Party</th>
                <th className="px-4 py-3 font-semibold">When</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => setSelectedId(item.id)}
                  className={cn(
                    "cursor-pointer border-b border-border/70 hover:bg-bg/60",
                    selectedId === item.id && "bg-bg",
                  )}
                >
                  <td className="px-4 py-3">
                    <p className="font-semibold text-fg">{item.name}</p>
                    <p className="text-xs text-muted">{item.email}</p>
                  </td>
                  <td className="px-4 py-3 text-muted">{KIND_LABEL[item.kind]}</td>
                  <td className="px-4 py-3 text-muted">{STATUS_LABEL[item.status]}</td>
                  <td className="px-4 py-3 tabular-nums text-muted">{item.partySize}</td>
                  <td className="px-4 py-3 tabular-nums text-muted">
                    {format(new Date(item.createdAt), "d MMM")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {rows.length === 0 ? (
            <p className="px-4 py-10 text-sm text-muted">Nothing matches that filter.</p>
          ) : null}
        </div>

        <aside className="rounded-md bg-surface p-5 shadow-border">
          {selected ? (
            <PersonDetail
              person={selected}
              note={note}
              setNote={setNote}
              onStatus={(next) => setStatus(selected.id, next)}
              onNote={() => {
                if (!note.trim()) return;
                addNote(selected.id, note.trim());
                setNote("");
              }}
            />
          ) : (
            <p className="text-sm leading-relaxed text-muted">
              Select a person to read the message, change status, and leave a note.
            </p>
          )}
        </aside>
      </div>
    </main>
  );
}

function PersonDetail({
  person,
  note,
  setNote,
  onStatus,
  onNote,
}: {
  person: Enquiry;
  note: string;
  setNote: (value: string) => void;
  onStatus: (status: EnquiryStatus) => void;
  onNote: () => void;
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
        {KIND_LABEL[person.kind]}
      </p>
      <h2 className="mt-2 font-display text-4xl text-fg">{person.name}</h2>
      <a href={`mailto:${person.email}`} className="mt-1 block text-sm text-muted hover:text-accent">
        {person.email}
      </a>
      <dl className="mt-5 space-y-2 text-sm">
        <Row label="Status" value={STATUS_LABEL[person.status]} />
        <Row label="Source" value={SOURCE_LABEL[person.source]} />
        <Row
          label="When"
          value={`${format(new Date(person.createdAt), "d MMM yyyy")} · ${formatDistanceToNow(new Date(person.createdAt), { addSuffix: true })}`}
        />
        <Row label="Party" value={person.solo && person.partySize === 1 ? "Solo" : `${person.partySize} people`} />
        {person.week ? <Row label="Week" value={WEEK_LABEL[person.week]} /> : null}
        {person.stay ? (
          <Row label="Stay" value={person.stay === "camp-stay" ? "Camp + stay" : "Camp only"} />
        ) : null}
      </dl>
      <p className="mt-5 text-sm leading-relaxed text-fg">{person.message || "No message."}</p>
      <div className="mt-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">Move to</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {STATUSES.map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => onStatus(status)}
              className={cn(
                "h-9 rounded-sm px-3 text-xs font-semibold uppercase tracking-wide",
                person.status === status
                  ? "bg-accent text-accent-fg"
                  : "bg-bg text-muted hover:text-fg",
              )}
            >
              {STATUS_LABEL[status]}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">Notes</p>
        <ul className="mt-2 space-y-2">
          {(person.notes ?? []).length === 0 ? (
            <li className="text-sm text-muted">No notes yet.</li>
          ) : (
            (person.notes ?? []).map((entry) => (
              <li key={entry.at} className="text-sm text-fg">
                <span className="text-xs text-muted">{format(new Date(entry.at), "d MMM")}: </span>
                {entry.text}
              </li>
            ))
          )}
        </ul>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          className="mt-3 w-full rounded-sm border border-border bg-bg px-3 py-2 text-sm text-fg outline-none focus-visible:ring-2 focus-visible:ring-accent"
          placeholder="Add a note"
        />
        <Button type="button" size="sm" className="mt-2" onClick={onNote}>
          Save note
        </Button>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-muted">{label}</dt>
      <dd className="text-right text-fg">{value}</dd>
    </div>
  );
}

function exportCsv(rows: Enquiry[]) {
  const header = ["name", "email", "kind", "status", "week", "party", "source", "date", "message"];
  const lines = rows.map((item) =>
    [
      item.name,
      item.email,
      KIND_LABEL[item.kind],
      STATUS_LABEL[item.status],
      item.week ? WEEK_LABEL[item.week] : "",
      item.partySize,
      SOURCE_LABEL[item.source],
      item.createdAt,
      item.message.replaceAll('"', '""'),
    ]
      .map((value) => `"${String(value)}"`)
      .join(","),
  );
  const blob = new Blob([[header.join(","), ...lines].join("\n")], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "hybrid-people.csv";
  a.click();
  URL.revokeObjectURL(url);
}
