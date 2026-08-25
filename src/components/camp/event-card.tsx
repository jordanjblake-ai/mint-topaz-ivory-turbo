import { IcalButton } from "@/components/camp/ical-button";
import { KIND_LABEL, type CampEvent } from "@/data/camp";
import { googleUrl, isLunchBreak } from "@/lib/camp-ics";
import { cn } from "@/lib/utils";

export function EventCard({
  event,
  highlight = false,
  coachView = false,
}: {
  event: CampEvent;
  highlight?: boolean;
  coachView?: boolean;
}) {
  return (
    <article className={cn("rounded-md p-5 shadow-border", highlight ? "bg-surface" : "bg-surface/80")}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
            {KIND_LABEL[event.kind]}
            {coachView && event.duty ? ` · ${event.duty}` : ""}
          </p>
          <h3 className="mt-2 font-display text-3xl text-fg">{event.title}</h3>
          <p className="mt-2 text-sm tabular-nums text-muted">
            {event.start.slice(11, 16)} – {event.end.slice(11, 16)} · {event.place}
          </p>
        </div>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-muted">{event.detail}</p>
      {coachView && event.staffNote ? (
        <p className="mt-2 text-sm text-fg">
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">On you · </span>
          {event.staffNote}
        </p>
      ) : null}
      {isLunchBreak(event) ? null : (
        <div className="mt-4 flex flex-wrap gap-2">
          <IcalButton event={event} coachView={coachView} />
          <a
            href={googleUrl(event, coachView)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 items-center rounded-sm px-4 text-xs font-semibold uppercase tracking-wide text-muted hover:text-fg"
          >
            Google Calendar
          </a>
        </div>
      )}
    </article>
  );
}
