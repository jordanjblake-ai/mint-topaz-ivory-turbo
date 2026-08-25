import type { ExperienceStatus } from "@/data/site";
import { cn } from "@/lib/utils";

const labels: Record<ExperienceStatus, string> = {
  bookable: "Open",
  preregister: "Pre-register",
  coming: "Coming 2028",
};

export function StatusBadge({
  status,
  className,
}: {
  status: ExperienceStatus;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex h-7 items-center rounded-full px-3 text-xs font-semibold uppercase tracking-wider",
        status === "bookable" && "bg-accent text-accent-fg",
        status === "preregister" && "border border-fg/40 bg-bg/50 text-fg",
        status === "coming" && "border border-border bg-surface text-muted",
        className,
      )}
    >
      {labels[status]}
    </span>
  );
}
