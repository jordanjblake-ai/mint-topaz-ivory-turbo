import { createFileRoute } from "@tanstack/react-router";
import { CAMP_META, PREPARE } from "@/data/camp";

export const Route = createFileRoute("/camp/prepare")({
  component: PreparePage,
});

function PreparePage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Before you fly</p>
      <h1 className="mt-2 font-display text-5xl text-fg sm:text-6xl">What to prepare</h1>
      <p className="mt-4 text-sm leading-relaxed text-muted">
        {CAMP_META.venue}. {CAMP_META.stay} if you took the stay. {CAMP_META.dates}.
      </p>
      <div className="mt-10 space-y-8">
        {PREPARE.map((item) => (
          <section key={item.title} className="border-t border-border pt-6">
            <h2 className="font-display text-3xl text-fg">{item.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">{item.body}</p>
            {"links" in item && item.links ? (
              <div className="mt-4 flex flex-wrap gap-3">
                {item.links.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-11 items-center rounded-sm bg-surface px-4 text-xs font-semibold uppercase tracking-wide text-fg shadow-border hover:text-accent"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            ) : null}
          </section>
        ))}
      </div>
    </main>
  );
}
