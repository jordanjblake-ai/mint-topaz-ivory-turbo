import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { KitPreview } from "@/components/camp/kit-preview";
import { SizeGuideButton } from "@/components/site/size-guide";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GROUPS, PEOPLE, currentWeekId, groupOf, personNow } from "@/data/camp";
import {
  KIT_COUNTRIES,
  KIT_SIZES,
  SHORTS_NONE,
  SHORTS_EXTRA_PENCE,
  countryOf,
  defaultPrintName,
  flagUrl,
  isKitSize,
  poundsKit,
  printNameOf,
  type KitChoice,
  type KitShortsSize,
  type KitSize,
} from "@/data/kit";
import { useCamp } from "@/lib/camp-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/camp/kit")({
  component: KitPage,
});

function KitPage() {
  const me = useCamp((s) => s.me);
  const kits = useCamp((s) => s.kits);
  const saveKit = useCamp((s) => s.saveKit);
  const groups = useCamp((s) => s.groups);
  const weekGroups = useCamp((s) => s.weekGroups);
  const existing = me ? kits[me.id] : undefined;
  const [top, setTop] = useState<KitSize>(existing?.top ?? "M");
  const [shorts, setShorts] = useState<KitShortsSize>(existing?.shorts ?? SHORTS_NONE);
  const [wantShorts, setWantShorts] = useState(isKitSize(existing?.shorts ?? SHORTS_NONE));
  const [printName, setPrintName] = useState(existing?.printName ?? (me ? defaultPrintName(me.name) : ""));
  const [country, setCountry] = useState(existing?.country ?? "gb");
  const [query, setQuery] = useState("");
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const preview: KitChoice = {
    personId: me?.id ?? "you",
    top,
    shorts: wantShorts && isKitSize(shorts) ? shorts : SHORTS_NONE,
    printName: printNameOf(printName) || "NAME",
    country,
    updatedAt: existing?.updatedAt ?? "",
  };

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return KIT_COUNTRIES;
    return KIT_COUNTRIES.filter(
      (item) => item.name.toLowerCase().includes(needle) || item.code.includes(needle),
    );
  }, [query]);

  if (!me) return null;

  const weekNow = currentWeekId(personNow(me), me);
  const myGroup = me.leadsGroup ?? me.groupId;
  const squad =
    me.role === "player"
      ? []
      : PEOPLE.filter((person) => {
          if (person.role !== "player" || !person.weeks.includes(weekNow)) return false;
          if (me.role === "head") return true;
          return groupOf(person, weekNow, groups, weekGroups) === myGroup;
        });

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Camp kit</p>
      <h1 className="mt-2 font-display text-5xl text-fg sm:text-6xl">Your vest and shorts</h1>
      <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted">
        Sizes, the name on the back, and a flag on the chest. The vest is in the camp. Playing shorts
        are extra: {poundsKit(SHORTS_EXTRA_PENCE)}. You cannot pick a shorts size until you confirm
        that extra.
      </p>

      <div className="mt-8 rounded-md bg-surface p-5 shadow-border sm:p-6">
        <KitPreview kit={preview} name={me.name} />
      </div>

      <form
        className="mt-8 grid gap-8"
        onSubmit={async (event) => {
          event.preventDefault();
          setBusy(true);
          setError("");
          setSaved(false);
          try {
            if (wantShorts && !isKitSize(shorts)) {
              throw new Error("Pick a shorts size, or leave shorts as — if you do not want the extra.");
            }
            await saveKit({ top, shorts: wantShorts ? shorts : SHORTS_NONE, printName, country });
            setSaved(true);
          } catch (err) {
            setError(err instanceof Error ? err.message : "That kit did not save.");
          } finally {
            setBusy(false);
          }
        }}
      >
        <fieldset>
          <legend className="flex w-full flex-wrap items-center justify-between gap-x-4 text-sm font-medium text-fg">
            <span>Vest</span>
            <SizeGuideButton className="min-h-0 py-1" />
          </legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {KIT_SIZES.map((size) => (
              <SizeChip key={size} label={size} active={top === size} onClick={() => setTop(size)} />
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend className="flex w-full flex-wrap items-center justify-between gap-x-4 text-sm font-medium text-fg">
            <span>Shorts</span>
            <SizeGuideButton className="min-h-0 py-1" />
          </legend>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Playing shorts are not in the camp kit. {poundsKit(SHORTS_EXTRA_PENCE)} extra if you want
            a pair with the vest.
          </p>
          <label className="mt-4 flex min-h-11 cursor-pointer items-start gap-3 text-sm text-fg">
            <input
              type="checkbox"
              className="mt-1 size-4 accent-current"
              checked={wantShorts}
              onChange={(event) => {
                const next = event.target.checked;
                setWantShorts(next);
                setShorts(next ? (isKitSize(shorts) ? shorts : SHORTS_NONE) : SHORTS_NONE);
              }}
            />
            <span>I want playing shorts and will pay the extra {poundsKit(SHORTS_EXTRA_PENCE)}.</span>
          </label>
          <div className="mt-3 flex flex-wrap gap-2">
            <SizeChip
              label={SHORTS_NONE}
              active={!wantShorts || shorts === SHORTS_NONE}
              disabled={wantShorts}
              onClick={() => {
                setWantShorts(false);
                setShorts(SHORTS_NONE);
              }}
            />
            {KIT_SIZES.map((size) => (
              <SizeChip
                key={size}
                label={size}
                active={wantShorts && shorts === size}
                disabled={!wantShorts}
                onClick={() => setShorts(size)}
              />
            ))}
          </div>
          {wantShorts && shorts === SHORTS_NONE ? (
            <p className="mt-2 text-xs text-muted">Pick a size now you have confirmed the extra.</p>
          ) : null}
        </fieldset>
        <div>
          <Label htmlFor="print-name">Name on the back</Label>
          <Input
            id="print-name"
            value={printName}
            maxLength={14}
            autoCapitalize="characters"
            onChange={(e) => setPrintName(printNameOf(e.target.value))}
          />
          <p className="mt-2 text-xs text-muted">Letters only. Fourteen characters. Usually the surname.</p>
        </div>
        <div>
          <Label htmlFor="flag-search">Flag</Label>
          <Input
            id="flag-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search a country"
          />
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {filtered.map((item) => (
              <button
                key={item.code}
                type="button"
                onClick={() => setCountry(item.code)}
                className={cn(
                  "flex min-h-11 items-center gap-3 rounded-sm px-3 text-left text-sm shadow-border",
                  country === item.code ? "bg-accent text-accent-fg" : "bg-surface text-fg hover:shadow-border-hover",
                )}
              >
                <img src={flagUrl(item.code, 40)} alt="" className="h-4 w-6 object-cover" />
                {item.name}
              </button>
            ))}
          </div>
        </div>
        {error ? <p className="text-sm text-accent">{error}</p> : null}
        {saved ? <p className="text-sm text-muted">Saved. We will kit you from this.</p> : null}
        <Button type="submit" size="lg" disabled={busy}>
          {busy ? "Saving…" : "Save my kit"}
        </Button>
      </form>

      {squad.length ? (
        <section className="mt-14 border-t border-border pt-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Your group</p>
          <h2 className="mt-2 font-display text-4xl text-fg">Player kit</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            {me.role === "head" ? "Everyone who has saved a kit so far." : "The players in your group this week."}
          </p>
          <ul className="mt-6 divide-y divide-border rounded-md bg-surface px-5 shadow-border">
            {squad.map((person) => {
              const kit = kits[person.id];
              const group = GROUPS.find((g) => g.id === groupOf(person, weekNow, groups, weekGroups));
              const flag = kit ? countryOf(kit.country) : null;
              return (
                <li key={person.id} className="flex flex-wrap items-center justify-between gap-3 py-4">
                  <div>
                    <p className="text-sm font-semibold text-fg">{person.name}</p>
                    <p className="text-xs text-muted">{group?.name}</p>
                  </div>
                  {kit ? (
                    <p className="flex items-center gap-2 text-sm text-muted">
                      <img src={flagUrl(kit.country, 40)} alt={flag?.name ?? ""} className="h-4 w-6 object-cover" />
                      {kit.printName} · {kit.top} / {kit.shorts}
                    </p>
                  ) : (
                    <p className="text-xs text-muted">Not set</p>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}
    </main>
  );
}

function SizeChip({
  label,
  active,
  onClick,
  disabled,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex h-11 min-w-11 items-center justify-center rounded-sm px-3 text-sm font-semibold",
        active ? "bg-accent text-accent-fg" : "bg-surface text-muted shadow-border hover:text-fg",
        disabled && "opacity-40",
      )}
    >
      {label}
    </button>
  );
}
