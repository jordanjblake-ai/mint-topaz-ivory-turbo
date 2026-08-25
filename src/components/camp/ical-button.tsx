import type { CampEvent } from "@/data/camp";
import { eventIcs, googleWeekUrl, icsFile, isLunchBreak, weekIcs } from "@/lib/camp-ics";
import { cn } from "@/lib/utils";

export function IcalButton({
  event,
  label = "Add iCal event",
  className,
  coachView = false,
}: {
  event: CampEvent;
  label?: string;
  className?: string;
  coachView?: boolean;
}) {
  function download(click: React.MouseEvent<HTMLAnchorElement>) {
    click.preventDefault();
    const blob = new Blob([eventIcs(event, coachView)], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${event.id}.ics`;
    a.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return (
    <a
      href={`/calendar/${event.id}.ics`}
      download={`${event.id}.ics`}
      onClick={download}
      className={cn(
        "inline-flex h-11 items-center rounded-sm px-4 text-xs font-semibold uppercase tracking-wide",
        className ?? "bg-bg text-fg hover:text-accent",
      )}
    >
      {label}
    </a>
  );
}

function downloadIcs(events: CampEvent[], name: string, coachView = false) {
  const blob = new Blob([weekIcs(events, coachView)], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${name}.ics`;
  a.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function WeekCalendarButtons({
  events,
  name,
  label,
  coachView = false,
}: {
  events: CampEvent[];
  name: string;
  label: string;
  coachView?: boolean;
}) {
  const invite = events.filter((event) => !isLunchBreak(event));
  const google = googleWeekUrl(invite, name, coachView);

  async function addGoogle(event: React.MouseEvent<HTMLAnchorElement>) {
    const file = icsFile(invite, name, coachView);
    if (navigator.share && navigator.canShare?.({ files: [file] })) {
      event.preventDefault();
      try {
        await navigator.share({ files: [file], title: name, text: name });
      } catch {
        window.open(google, "_blank", "noopener,noreferrer");
      }
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => downloadIcs(invite, name, coachView)}
        className="inline-flex h-11 items-center rounded-sm bg-accent px-4 text-xs font-semibold uppercase tracking-wide text-accent-fg"
      >
        {label} · iCal
      </button>
      <a
        href={google}
        target="_blank"
        rel="noopener noreferrer"
        onClick={addGoogle}
        className="inline-flex h-11 items-center rounded-sm bg-surface px-4 text-xs font-semibold uppercase tracking-wide text-fg shadow-border hover:text-accent"
      >
        {label} · Google
      </a>
    </div>
  );
}
