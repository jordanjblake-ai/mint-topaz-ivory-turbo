import { useEffect, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { enquireInterests } from "@/data/site";
import { Label } from "@/components/ui/label";
import { PlayerDetailsForm, variantFromPath, type EnquireVariant } from "@/components/site/performance-form";

const selectClass =
  "h-11 w-full rounded-sm border border-border bg-surface px-3 text-sm text-fg outline-none focus-visible:ring-2 focus-visible:ring-accent";

export function EnquireForm({
  defaultInterest = "lanzarote",
  variant,
}: {
  defaultInterest?: string;
  variant?: EnquireVariant;
  compact?: boolean;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [interest, setInterest] = useState(defaultInterest);
  const scope = variantFromPath(pathname, variant);

  useEffect(() => {
    setInterest(defaultInterest);
  }, [defaultInterest]);

  const submitLabel = interest === "performance" ? "Ask To Be Considered" : "Send Message";
  const showInterest = scope === "contact" || !scope;

  return (
    <div className="grid gap-6">
      {showInterest ? (
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
      ) : null}
      <PlayerDetailsForm key={interest} interest={interest} variant={scope} submitLabel={submitLabel} />
    </div>
  );
}
