import { useEffect, useState } from "react";
import { enquireInterests } from "@/data/site";
import { Label } from "@/components/ui/label";
import { PlayerDetailsForm } from "@/components/site/performance-form";

const selectClass =
  "h-11 w-full rounded-sm border border-border bg-surface px-3 text-sm text-fg outline-none focus-visible:ring-2 focus-visible:ring-accent";

export function EnquireForm({
  defaultInterest = "lanzarote",
}: {
  defaultInterest?: string;
  compact?: boolean;
}) {
  const [interest, setInterest] = useState(defaultInterest);

  useEffect(() => {
    setInterest(defaultInterest);
  }, [defaultInterest]);

  const submitLabel = interest === "performance" ? "Ask To Be Considered" : "Send Message";

  return (
    <div className="grid gap-6">
      <div>
        <Label htmlFor="interest">I Am Interested In</Label>
        <select
          id="interest"
          value={interest}
          onChange={(e) => setInterest(e.target.value)}
          className={selectClass}
        >
          {enquireInterests.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </div>
      <PlayerDetailsForm key={interest} interest={interest} submitLabel={submitLabel} />
    </div>
  );
}
