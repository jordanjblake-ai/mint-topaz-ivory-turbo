import { createFileRoute } from "@tanstack/react-router";
import { FUEL } from "@/data/camp";

export const Route = createFileRoute("/camp/fuel")({
  component: FuelPage,
});

function FuelPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">On the sand</p>
      <h1 className="mt-2 font-display text-5xl text-fg sm:text-6xl">How to fuel the week</h1>
      <p className="mt-4 text-sm leading-relaxed text-muted">
        Not a meal plan. How to not fall over in the second session. This is not medical advice.
      </p>

      <div className="mt-10 grid gap-3 sm:grid-cols-3">
        <div className="rounded-md bg-surface p-5 shadow-border">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">Water</p>
          <p className="mt-2 font-display text-4xl text-fg">4–5 L</p>
          <p className="mt-2 text-sm text-muted">Two-session day. 1L bottle, four or five fills. Six if you are a heavy sweater.</p>
        </div>
        <div className="rounded-md bg-surface p-5 shadow-border">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">Sodium</p>
          <p className="mt-2 font-display text-4xl text-fg">2 tabs</p>
          <p className="mt-2 text-sm text-muted">In the bottles. Plus a salty lunch. The tablets alone do not cover the day.</p>
        </div>
        <div className="rounded-md bg-surface p-5 shadow-border">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">Extra food</p>
          <p className="mt-2 font-display text-4xl text-fg">+800 cals</p>
          <p className="mt-2 text-sm text-muted">Calories on top of a normal day. Not three bananas. A real extra plate.</p>
        </div>
      </div>

      <div className="mt-12 space-y-8">
        {FUEL.map((item) => (
          <section key={item.title} className="border-t border-border pt-6">
            <h2 className="font-display text-3xl text-fg">{item.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">{item.body}</p>
            {"looksLike" in item && item.looksLike ? (
              <ul className="mt-4 space-y-2">
                {item.looksLike.map((line) => (
                  <li key={line} className="text-sm leading-relaxed text-fg">
                    {line}
                  </li>
                ))}
              </ul>
            ) : null}
          </section>
        ))}
      </div>
    </main>
  );
}
