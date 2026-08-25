import { DAYS, isCalendarToday, weekBoard, type BoardSlot, type CampEventKind } from "@/data/camp";
import { cn } from "@/lib/utils";

function slotClass(kind: CampEventKind, allDay?: boolean) {
  if (kind === "session") return "bg-accent text-accent-fg";
  if (kind === "tournament") return "bg-surface text-fg shadow-border-hover";
  if (kind === "arrival" || allDay) return "bg-surface text-fg min-h-40";
  if (kind === "free") return "bg-bg text-muted";
  if (kind === "yoga" || kind === "recovery") return "bg-surface text-fg";
  if (kind === "meal" || kind === "social") return "bg-surface text-fg";
  return "bg-bg text-muted";
}

function slotTitle(slot: BoardSlot, groupName?: string) {
  if (groupName && slot.kind === "session") return `${slot.title} · ${groupName}`;
  return slot.title;
}

export function WeekBoard({ weekId, groupName }: { weekId: number; groupName?: string }) {
  const board = weekBoard(weekId);

  return (
    <div className="[content-visibility:auto] [contain-intrinsic-size:auto_28rem]">
      <div className="-mx-4 overflow-x-auto px-4 sm:-mx-0 sm:px-0">
        <div className="flex gap-2">
          {board.map((day) => {
            const meta = DAYS.find((item) => item.date === day.date);
            const isToday = isCalendarToday(day.date);
            return (
              <div
                key={day.date}
                className={cn(
                  "flex w-40 shrink-0 flex-col gap-2 rounded-md p-2",
                  isToday ? "bg-surface shadow-border-hover" : "bg-bg",
                )}
              >
                <div className="px-1 py-2">
                  <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-accent">
                    {meta?.dow}
                  </p>
                  <p className="font-display text-2xl leading-none text-fg">{meta?.label.replace(/^\w+ /, "")}</p>
                  <p className="mt-1 text-[0.65rem] uppercase tracking-wide text-muted">{meta?.tag}</p>
                </div>
                {day.slots.map((slot) => (
                  <div
                    key={`${slot.start}-${slot.title}`}
                    className={cn("rounded-sm px-2 py-2", slotClass(slot.kind, slot.allDay))}
                  >
                    {slot.allDay ? (
                      <p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] opacity-80">All day</p>
                    ) : (
                      <p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] opacity-80">
                        {slot.start} – {slot.end}
                      </p>
                    )}
                    <p className="mt-1 font-display text-xl leading-tight">{slotTitle(slot, groupName)}</p>
                    {slot.note ? <p className="mt-1 text-[0.7rem] leading-snug opacity-80">{slot.note}</p> : null}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
