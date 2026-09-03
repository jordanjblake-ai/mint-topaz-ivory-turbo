import { cn } from "@/lib/utils";
import { useCamp, type TournamentRsvp } from "@/lib/camp-store";

const OPTIONS: { value: TournamentRsvp; label: string }[] = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
  { value: "maybe", label: "Maybe" },
];

export function TournamentRsvpButtons({ eventId }: { eventId: string }) {
  const me = useCamp((s) => s.me);
  const rsvps = useCamp((s) => s.rsvps);
  const setRsvp = useCamp((s) => s.setRsvp);
  if (!me || me.role !== "player") return null;
  const current = rsvps[me.id]?.[eventId];

  return (
    <div className="flex flex-wrap gap-1" role="group" aria-label="Tournament RSVP">
      {OPTIONS.map((option) => {
        const active = current === option.value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => setRsvp(eventId, option.value)}
            className={cn(
              "inline-flex h-11 min-w-11 items-center justify-center rounded-sm px-4 text-xs font-semibold uppercase tracking-wide",
              active ? "bg-accent text-accent-fg" : "text-muted shadow-border hover:text-fg",
            )}
            aria-pressed={active}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
