import { useState } from "react";
import { Button } from "@/components/ui/button";
import { purgeHybridCache, type PurgeScope } from "@/lib/cache-purge";

const ACTIONS: { scope: PurgeScope; label: string; hint: string }[] = [
  { scope: "html", label: "Purge pages", hint: "Home, camps, coaches, legal." },
  { scope: "images", label: "Purge photos", hint: "Heroes, coaches, kit." },
  { scope: "all", label: "Purge everything", hint: "Pages, photos, calendar, sitemap." },
];

export function CachePurgePanel() {
  const [busy, setBusy] = useState<PurgeScope | "">("");
  const [note, setNote] = useState("");

  function run(scope: PurgeScope) {
    setBusy(scope);
    setNote("");
    void purgeHybridCache({ data: { scope } })
      .then((result) => {
        const providers = result.providers
          .map((item) => `${item.provider}: ${item.mode}`)
          .join(" · ");
        setNote(`${result.soft} ${providers}`);
      })
      .catch((err: unknown) => {
        setNote(err instanceof Error ? err.message : "Purge did not finish.");
      })
      .finally(() => setBusy(""));
  }

  return (
    <section className="mt-8 rounded-md bg-surface p-5 shadow-border">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">Cache</p>
      <h2 className="mt-1 font-display text-3xl text-fg">Drop the CDN copy</h2>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
        Pages go stale on their own within five minutes. Use this when copy or a photo must change
        now. Hashed JS and CSS never need a purge. If Cloudflare is not connected, this reports the
        soft window instead of failing.
      </p>
      <div className="mt-5 flex flex-wrap gap-2">
        {ACTIONS.map((item) => (
          <Button
            key={item.scope}
            type="button"
            variant={item.scope === "all" ? "secondary" : "primary"}
            disabled={Boolean(busy)}
            onClick={() => run(item.scope)}
          >
            {busy === item.scope ? "Purging…" : item.label}
          </Button>
        ))}
      </div>
      <p className="mt-3 text-xs text-muted">
        {ACTIONS.find((item) => item.scope === (busy || "html"))?.hint}
      </p>
      {note ? <p className="mt-3 text-sm text-fg">{note}</p> : null}
    </section>
  );
}
