import { useEffect, useId, useState } from "react";
import {
  BRA_FIT_NOTE,
  MEN_SIZE_ROWS,
  SIZE_GUIDE_NOTE,
  SIZE_GUIDE_TABS,
  SPORTS_BRA_ROWS,
  WOMEN_SHORTS_ROWS,
  type SizeGuideTab,
} from "@/data/kit-sizes";
import { cn } from "@/lib/utils";

function Table({
  caption,
  columns,
  rows,
}: {
  caption: string;
  columns: string[];
  rows: string[][];
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[18rem] border-collapse text-left text-sm">
        <caption className="mb-3 text-left font-display text-3xl text-fg">{caption}</caption>
        <thead>
          <tr className="border-b border-border text-xs font-semibold uppercase tracking-wider text-muted">
            {columns.map((col) => (
              <th key={col} scope="col" className="py-2 pr-4 font-medium">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row[0]} className="border-b border-border/70">
              {row.map((cell, i) => (
                <td key={`${row[0]}-${i}`} className={cn("py-3 pr-4", i === 0 ? "font-semibold text-fg" : "text-muted")}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function SizeGuidePanel({ tab }: { tab: SizeGuideTab }) {
  if (tab === "men") {
    return (
      <Table
        caption="Men — shorts / vest"
        columns={["Size", "Waist", "Chest"]}
        rows={MEN_SIZE_ROWS.map((row) => [row.size, row.waist, row.chest])}
      />
    );
  }
  if (tab === "women") {
    return (
      <Table
        caption="Women — shorts"
        columns={["Size", "UK", "Waist"]}
        rows={WOMEN_SHORTS_ROWS.map((row) => [row.size, row.uk, row.waist])}
      />
    );
  }
  return (
    <div className="grid gap-3">
      <Table
        caption="Sports bra"
        columns={["Size", "Bust", "UK cup"]}
        rows={SPORTS_BRA_ROWS.map((row) => [row.size, row.bust, row.cup])}
      />
      <p className="text-sm text-muted">{BRA_FIT_NOTE}</p>
    </div>
  );
}

export function SizeGuideSections() {
  return (
    <div className="grid gap-12">
      <SizeGuidePanel tab="men" />
      <SizeGuidePanel tab="women" />
      <SizeGuidePanel tab="bra" />
      <p className="text-sm text-muted">{SIZE_GUIDE_NOTE}</p>
    </div>
  );
}

function SizeGuideTabs({
  tab,
  onChange,
  labelledBy,
}: {
  tab: SizeGuideTab;
  onChange: (id: SizeGuideTab) => void;
  labelledBy?: string;
}) {
  return (
    <div role="tablist" aria-labelledby={labelledBy} className="flex flex-wrap gap-2">
      {SIZE_GUIDE_TABS.map((item) => (
        <button
          key={item.id}
          type="button"
          role="tab"
          aria-selected={tab === item.id}
          className={cn(
            "min-h-11 rounded-sm px-4 text-sm",
            tab === item.id
              ? "bg-accent text-accent-fg"
              : "border border-border bg-transparent text-fg hover:border-accent",
          )}
          onClick={() => onChange(item.id)}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

export function SizeGuideModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [tab, setTab] = useState<SizeGuideTab>("men");
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center sm:p-6">
      <button
        type="button"
        className="absolute inset-0 bg-charcoal/80"
        aria-label="Close size guide"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-lg bg-surface shadow-border sm:max-w-2xl sm:rounded-md"
      >
        <div className="flex items-start justify-between gap-4 border-b border-border px-5 py-4 sm:px-6">
          <div>
            <p id={titleId} className="font-display text-3xl text-fg">
              Size guide
            </p>
            <p className="mt-1 text-xs text-muted">XS, S, M, L, XL. Centimetres first.</p>
          </div>
          <button
            type="button"
            className="inline-flex min-h-11 items-center text-sm font-semibold uppercase tracking-wide text-muted hover:text-fg"
            onClick={onClose}
          >
            Close
          </button>
        </div>
        <div className="overflow-y-auto px-5 py-5 sm:px-6">
          <SizeGuideTabs tab={tab} onChange={setTab} labelledBy={titleId} />
          <div className="mt-6">
            <SizeGuidePanel tab={tab} />
          </div>
          <p className="mt-6 text-sm text-muted">{SIZE_GUIDE_NOTE}</p>
        </div>
      </div>
    </div>
  );
}

export function SizeGuideButton({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        className={cn(
          "inline-flex min-h-11 items-center text-xs font-semibold uppercase tracking-wide text-accent hover:text-accent-hover",
          className,
        )}
        onClick={() => setOpen(true)}
      >
        Size guide
      </button>
      <SizeGuideModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}

